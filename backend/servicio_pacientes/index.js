require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3002;

// Middlewares (Permiten recibir JSON y conexiones externas)
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Prueba de conexión al iniciar
pool.connect()
    .then(() => console.log('✅ Conectado exitosamente a la Base de Datos AuraDent'))
    .catch(err => console.error('❌ Error de conexión', err.stack));

// RUTA 1: Obtener todos los pacientes
app.get('/api/pacientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pacientes');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// RUTA 2: Crear un nuevo paciente
app.post('/api/pacientes', async (req, res) => {
    try {
        const { num_historia_clinica, nombres, apellidos, cedula, edad, domicilio, telefono } = req.body;
        
        const newPatient = await pool.query(
            "INSERT INTO pacientes (num_historia_clinica, nombres, apellidos, cedula, edad, domicilio, telefono) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [num_historia_clinica, nombres, apellidos, cedula, edad, domicilio, telefono]
        );

        res.json(newPatient.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al guardar paciente');
    }
});

// 3. ACTUALIZAR un paciente (PUT)
app.put('/api/pacientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { num_historia_clinica, nombres, apellidos, cedula, edad, domicilio, telefono } = req.body;

        const query = `
            UPDATE pacientes 
            SET num_historia_clinica = $1, nombres = $2, apellidos = $3, cedula = $4, edad = $5, domicilio = $6, telefono = $7
            WHERE id = $8
            RETURNING *;
        `;
        
        const result = await pool.query(query, [num_historia_clinica, nombres, apellidos, cedula, edad, domicilio, telefono, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Paciente no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al actualizar paciente');
    }
});

// 4. ELIMINAR un paciente (DELETE)
app.delete('/api/pacientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM pacientes WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Paciente no encontrado" });
        }

        res.json({ mensaje: "Paciente eliminado correctamente" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al eliminar paciente. (Puede tener fichas asociadas)');
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`🏥 Servicio de Pacientes corriendo en http://localhost:${port}`);
});