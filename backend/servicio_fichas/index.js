require('dotenv').config(); // <--- ESTO ES OBLIGATORIO para leer el .env
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Verificamos que la contraseña exista antes de intentar conectar
if (!process.env.DB_PASSWORD) {
    console.error("❌ ERROR FATAL: No se encontró la contraseña en el archivo .env");
    process.exit(1);
}

// Conexión usando las variables del archivo .env
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD, // Ahora sí lee esto como string
    port: process.env.DB_PORT,
});

// Verificar conexión
pool.connect()
    .then(() => console.log('✅ Servicio de Fichas: Conectado a BD AuraDent'))
    .catch(err => console.error('❌ Error de conexión', err.stack));

// --- RUTAS ---

// 1. Obtener todas las fichas
app.get('/api/fichas', async (req, res) => {
    try {
        const query = `
            SELECT f.id, f.fecha_consulta, f.motivo_consulta, p.nombres, p.apellidos 
            FROM fichas_clinicas f
            JOIN pacientes p ON f.paciente_id = p.id
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error obteniendo fichas');
    }
});

// 2. Crear una nueva Ficha
app.post('/api/fichas', async (req, res) => {
    try {
        const { paciente_id, odontologo_id, motivo_consulta, pieza_dental } = req.body;
        const result = await pool.query(
            "INSERT INTO fichas_clinicas (paciente_id, odontologo_id, motivo_consulta, pieza_dental) VALUES ($1, $2, $3, $4) RETURNING *",
            [paciente_id, odontologo_id, motivo_consulta, pieza_dental]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error creando ficha');
    }
});

app.listen(port, () => {
    console.log(`🦷 Servicio de Fichas corriendo en http://localhost:${port}`);
});