const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

// 1. IMPORTAR SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// 2. CONFIGURACIÓN DE LA DOCUMENTACIÓN
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio de Pacientes - AuraDent',
      version: '1.0.0',
      description: 'API para gestionar el CRUD completo de pacientes (Crear, Leer, Actualizar, Eliminar).',
      contact: {
        name: 'Soporte Técnico AuraDent'
      }
    },
    servers: [
      { url: `http://localhost:${port}` }
    ],
  },
  apis: [`./index.js`],
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
 *     Paciente:
 *       type: object
 *       required:
 *         - num_historia_clinica
 *         - nombres
 *         - cedula
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado
 *         num_historia_clinica:
 *           type: string
 *           description: Código único de historia clínica
 *         nombres:
 *           type: string
 *           description: Nombres del paciente
 *         apellidos:
 *           type: string
 *           description: Apellidos del paciente
 *         cedula:
 *           type: string
 *           description: Documento de identidad
 *         edad:
 *           type: integer
 *         telefono:
 *           type: string
 *         domicilio:
 *           type: string
 */

// --- RUTAS ---

/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Obtener todos los pacientes
 *     tags: [Pacientes]
 *     responses:
 *       200:
 *         description: Lista de pacientes cargada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Paciente'
 */
app.get('/api/pacientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pacientes ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

/**
 * @swagger
 * /api/pacientes:
 *   post:
 *     summary: Crear un nuevo paciente
 *     tags: [Pacientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       200:
 *         description: Paciente creado exitosamente
 */
app.post('/api/pacientes', async (req, res) => {
  try {
    const { num_historia_clinica, nombres, apellidos, cedula, edad, domicilio, telefono } = req.body;
    const result = await pool.query(
      'INSERT INTO pacientes (num_historia_clinica, nombres, apellidos, cedula, edad, domicilio, telefono) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [num_historia_clinica, nombres, apellidos, cedula, edad, domicilio, telefono]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al guardar paciente');
  }
});

/**
 * @swagger
 * /api/pacientes/{id}:
 *   put:
 *     summary: Actualizar datos de un paciente
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del paciente a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       200:
 *         description: Paciente actualizado
 *       404:
 *         description: Paciente no encontrado
 *
 *   delete:
 *     summary: Eliminar un paciente
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del paciente a eliminar
 *     responses:
 *       200:
 *         description: Paciente eliminado
 *       404:
 *         description: Paciente no encontrado
 */
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

    const result = await pool.query(query, [
      num_historia_clinica,
      nombres,
      apellidos,
      cedula,
      edad,
      domicilio,
      telefono,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al actualizar paciente');
  }
});

app.delete('/api/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM pacientes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.json({ mensaje: 'Paciente eliminado correctamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al eliminar paciente. (Puede tener fichas asociadas)');
  }
});

app.listen(port, () => {
  console.log(`🏥 Servicio de Pacientes (con Swagger) corriendo en http://localhost:${port}`);
  console.log(`📄 Documentación disponible en http://localhost:${port}/api-docs`);
});
