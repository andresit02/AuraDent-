require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3004;

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
    .then(() => console.log('✅ Servicio Odontograma: Conectado a BD'))
    .catch(err => console.error('❌ Error BD', err.stack));

// RUTAS

// 1. Obtener el odontograma de un paciente específico
app.get('/api/odontograma/:pacienteId', async (req, res) => {
    try {
        const { pacienteId } = req.params;
        const result = await pool.query(
            'SELECT * FROM odontogramas WHERE paciente_id = $1',
            [pacienteId]
        );
        
        if (result.rows.length === 0) {
            // Si no tiene odontograma guardado, devolvemos un objeto vacío o mensaje
            return res.json({ mensaje: "Sin datos previos", datos_dientes: {} });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// 2. Guardar o Actualizar el odontograma (Upsert)
app.post('/api/odontograma', async (req, res) => {
    try {
        const { paciente_id, datos_dientes } = req.body;
        
        // Esta consulta mágica hace: "Intenta insertar. Si ya existe el ID, actualiza el JSON"
        const query = `
            INSERT INTO odontogramas (paciente_id, datos_dientes, fecha_actualizacion)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            ON CONFLICT (paciente_id) 
            DO UPDATE SET 
                datos_dientes = EXCLUDED.datos_dientes,
                fecha_actualizacion = CURRENT_TIMESTAMP
            RETURNING *;
        `;

        const result = await pool.query(query, [paciente_id, datos_dientes]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error guardando odontograma');
    }
});

app.listen(port, () => {
    console.log(`🦷 Servicio Odontograma corriendo en http://localhost:${port}`);
});