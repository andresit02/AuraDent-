require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect()
    .then(() => console.log('🔐 Servicio Seguridad: Conectado a BD'))
    .catch(err => console.error('❌ Error BD', err.stack));

// --- RUTAS ---

// 1. REGISTRO (Crear nuevo usuario con contraseña encriptada)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { usuario, contrasena, nombre_completo, rol } = req.body;
        
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(contrasena, salt);

        const result = await pool.query(
            "INSERT INTO usuarios (usuario, contrasena, nombre_completo, rol) VALUES ($1, $2, $3, $4) RETURNING id, usuario, rol",
            [usuario, hashPassword, nombre_completo, rol]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al registrar usuario');
    }
});

// 2. LOGIN (Verificar credenciales y dar Token)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        // Buscar usuario
        const userResult = await pool.query("SELECT * FROM usuarios WHERE usuario = $1", [usuario]);
        
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const user = userResult.rows[0];

        // Verificar contraseña
        // NOTA: Si la contraseña en BD es texto plano (como la semilla '123456'), bcrypt fallará. 
        // Aquí asumimos que usaremos usuarios creados con /register o que actualizaremos la BD.
        const validPassword = await bcrypt.compare(contrasena, user.contrasena);

        if (!validPassword) {
             // FALLBACK TEMPORAL: Si falla bcrypt, probamos texto plano (solo para compatibilidad con tu semilla inicial)
            if (contrasena === user.contrasena) {
                // Es válido por texto plano (usuario antiguo)
            } else {
                return res.status(401).json({ error: "Contraseña incorrecta" });
            }
        }

        // Crear Token JWT
        const token = jwt.sign(
            { id: user.id, rol: user.rol }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        res.json({ token, user: { id: user.id, nombre: user.nombre_completo, rol: user.rol } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

app.listen(port, () => {
    console.log(`🔐 Servicio Seguridad corriendo en http://localhost:${port}`);
});