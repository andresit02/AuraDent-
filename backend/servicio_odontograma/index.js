const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

// 1. IMPORTAR SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3004; // Puerto Odontograma

app.use(cors());
app.use(express.json());

// 2. CONFIGURACIÓN SWAGGER
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio de Odontograma - AuraDent',
      version: '1.0.0',
      description: 'API para gestionar el estado gráfico de los dientes (JSONB).',
    },
    servers: [
      { url: `http://localhost:${port}` }
    ],
  },
  apis: ['./index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Odontograma:
 *       type: object
 *       required:
 *         - paciente_id
 *         - datos_dientes
 *       properties:
 *         id:
 *           type: integer
 *         paciente_id:
 *           type: integer
 *           description: ID del paciente asociado
 *         datos_dientes:
 *           type: object
 *           description: Objeto JSON con el estado de cada diente
 *         fecha_actualizacion:
 *           type: string
 *           format: date
 */

// --- RUTAS ---

/**
 * @swagger
 * /api/odontograma/{pacienteId}:
 *   get:
 *     summary: Obtener el odontograma de un paciente específico
 *     tags: [Odontograma]
 *     parameters:
 *       - in: path
 *         name: pacienteId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Odontograma encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Odontograma'
 */
app.get('/api/odontograma/:pacienteId', async (req, res) => {
  try {
    const { pacienteId } = req.params;
    const result = await pool.query(
      'SELECT * FROM odontogramas WHERE paciente_id = $1',
      [pacienteId]
    );

    if (result.rows.length === 0) {
      return res.json({ datos_dientes: {} });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

/**
 * @swagger
 * /api/odontograma:
 *   post:
 *     summary: Guardar o actualizar el odontograma
 *     tags: [Odontograma]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paciente_id:
 *                 type: integer
 *               datos_dientes:
 *                 type: object
 *                 example:
 *                   "18": "caries"
 *                   "11": "endodoncia"
 *     responses:
 *       200:
 *         description: Odontograma guardado correctamente
 */
app.post('/api/odontograma', async (req, res) => {
  try {
    const { paciente_id, datos_dientes } = req.body;

    const query = `
      INSERT INTO odontogramas (paciente_id, datos_dientes, fecha_actualizacion)
      VALUES ($1, $2, NOW())
      ON CONFLICT (paciente_id)
      DO UPDATE SET datos_dientes = $2, fecha_actualizacion = NOW()
      RETURNING *;
    `;

    const result = await pool.query(query, [paciente_id, datos_dientes]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al guardar odontograma');
  }
});

app.listen(port, () => {
  console.log(`🦷 Servicio de Odontograma (con Swagger) corriendo en http://localhost:${port}`);
  console.log(`📄 Documentación: http://localhost:${port}/api-docs`);
});
