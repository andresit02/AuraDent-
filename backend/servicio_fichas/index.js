const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

// 1. IMPORTAR SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3003; // Puerto de Fichas

app.use(cors());
app.use(express.json());

// 2. CONFIGURACIÓN SWAGGER
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio de Fichas Técnicas - AuraDent',
      version: '1.0.0',
      description: 'API para registrar y consultar los tratamientos y diagnósticos.',
    },
    servers: [
      { url: `http://localhost:${port}` }
    ],
  },
  apis: ['./index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// CONEXIÓN A BASE DE DATOS
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
 *     Ficha:
 *       type: object
 *       required:
 *         - paciente_id
 *         - motivo_consulta
 *       properties:
 *         id:
 *           type: integer
 *         fecha_consulta:
 *           type: string
 *           format: date
 *           description: Fecha automática de creación
 *         motivo_consulta:
 *           type: string
 *           description: Razón de la visita (Ej. Dolor intenso)
 *         pieza_dental:
 *           type: integer
 *           description: Número de diente tratado (opcional)
 *         paciente_id:
 *           type: integer
 *           description: ID del paciente (Llave foránea)
 */

// --- RUTAS ---

/**
 * @swagger
 * /api/fichas:
 *   get:
 *     summary: Obtener historial de fichas
 *     description: Retorna las fichas unidas con los nombres de los pacientes.
 *     tags: [Fichas]
 *     responses:
 *       200:
 *         description: Lista de fichas cargada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ficha'
 */
app.get('/api/fichas', async (req, res) => {
  try {
    const query = `
      SELECT f.*, p.nombres, p.apellidos 
      FROM fichas f
      JOIN pacientes p ON f.paciente_id = p.id
      ORDER BY f.fecha_consulta DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

/**
 * @swagger
 * /api/fichas:
 *   post:
 *     summary: Registrar una nueva ficha/tratamiento
 *     tags: [Fichas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paciente_id:
 *                 type: integer
 *               odontologo_id:
 *                 type: integer
 *               motivo_consulta:
 *                 type: string
 *               pieza_dental:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Ficha creada exitosamente
 */
app.post('/api/fichas', async (req, res) => {
  try {
    const { paciente_id, odontologo_id, motivo_consulta, pieza_dental } = req.body;
    const result = await pool.query(
      'INSERT INTO fichas (paciente_id, odontologo_id, motivo_consulta, pieza_dental) VALUES ($1, $2, $3, $4) RETURNING *',
      [paciente_id, odontologo_id, motivo_consulta, pieza_dental]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al guardar ficha');
  }
});

app.listen(port, () => {
  console.log(`📋 Servicio de Fichas (con Swagger) corriendo en http://localhost:${port}`);
  console.log(`📄 Documentación: http://localhost:${port}/api-docs`);
});