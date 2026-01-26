const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

// 1. IMPORTAR SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3003; // Puerto de Fichas

// CORS configurado para el frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
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
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'auradent',
  password: process.env.DB_PASSWORD || '123456', // ← CAMBIA ESTO
  port: process.env.DB_PORT || 5432,
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
  console.log('GET /api/fichas recibido');
  
  try {
    // CONSULTA CORREGIDA: usar fichas_clinicas en lugar de fichas
    const query = `
      SELECT 
        fc.*, 
        p.nombres, 
        p.apellidos,
        p.nombres || ' ' || p.apellidos as paciente_nombre_completo
      FROM fichas_clinicas fc  -- ← CAMBIADO: fichas_clinicas
      LEFT JOIN pacientes p ON fc.paciente_id = p.id
      ORDER BY fc.fecha_consulta DESC
    `;
    
    console.log('Ejecutando consulta:', query.substring(0, 100) + '...');
    const result = await pool.query(query);
    
    console.log(`Encontradas ${result.rows.length} fichas`);
    res.json(result.rows);
    
  } catch (err) {
    console.error('❌ ERROR en GET /api/fichas:', err.message);
    console.error('Stack:', err.stack);
    
    // Mensaje de error más descriptivo
    if (err.message.includes('fichas')) {
      res.status(500).json({ 
        error: 'Error en la base de datos',
        message: err.message,
        hint: '¿La tabla se llama "fichas_clinicas" en lugar de "fichas"?'
      });
    } else {
      res.status(500).json({ 
        error: 'Error del servidor',
        message: err.message 
      });
    }
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
  console.log('POST /api/fichas recibido:', req.body);
  
  try {
    const { paciente_id, odontologo_id, motivo_consulta, pieza_dental } = req.body;
    
    // Validación básica
    if (!paciente_id || !motivo_consulta) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos',
        required: ['paciente_id', 'motivo_consulta']
      });
    }
    
    // CONSULTA CORREGIDA: usar fichas_clinicas
    const result = await pool.query(
      'INSERT INTO fichas_clinicas (paciente_id, odontologo_id, motivo_consulta, pieza_dental) VALUES ($1, $2, $3, $4) RETURNING *',
      [paciente_id, odontologo_id, motivo_consulta, pieza_dental]
    );
    
    console.log('Ficha creada con ID:', result.rows[0].id);
    res.json(result.rows[0]);
    
  } catch (err) {
    console.error('❌ ERROR en POST /api/fichas:', err.message);
    
    res.status(500).json({ 
      error: 'Error al guardar ficha',
      message: err.message,
      hint: 'Verifica que la tabla se llama fichas_clinicas y las columnas existen'
    });
  }
});

// --- NUEVA RUTA: Obtener pacientes para el dropdown ---
/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Obtener lista de pacientes
 *     description: Retorna todos los pacientes para seleccionar en formularios
 *     tags: [Pacientes]
 *     responses:
 *       200:
 *         description: Lista de pacientes
 */
app.get('/api/pacientes', async (req, res) => {
  console.log('GET /api/pacientes recibido');
  
  try {
    const query = `
      SELECT id, nombres, apellidos, rut 
      FROM pacientes 
      ORDER BY nombres, apellidos
    `;
    
    const result = await pool.query(query);
    console.log(`Encontrados ${result.rows.length} pacientes`);
    res.json(result.rows);
    
  } catch (err) {
    console.error('❌ ERROR en GET /api/pacientes:', err.message);
    res.status(500).json({ 
      error: 'Error al obtener pacientes',
      message: err.message 
    });
  }
});

// --- RUTA DE HEALTH CHECK ---
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'fichas',
    timestamp: new Date().toISOString()
  });
});

// --- RUTA DE DEBUG ---
app.get('/debug', async (req, res) => {
  try {
    // Probar conexión a DB
    const version = await pool.query('SELECT version()');
    
    // Verificar tablas
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    res.json({
      service: 'fichas',
      status: 'running',
      postgres_version: version.rows[0].version,
      tables: tables.rows.map(t => t.table_name),
      hint: 'La tabla correcta es "fichas_clinicas", no "fichas"'
    });
    
  } catch (error) {
    res.json({
      service: 'fichas',
      status: 'ERROR',
      error: error.message
    });
  }
});

// --- PRESUPUESTOS ---

/**
 * @swagger
 * /api/presupuestos:
 *   post:
 *     summary: Crear un presupuesto para una ficha
 *     tags: [Presupuestos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ficha_id
 *               - total
 *             properties:
 *               ficha_id:
 *                 type: integer
 *               total:
 *                 type: number
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [pendiente, aprobado, rechazado]
 *     responses:
 *       200:
 *         description: Presupuesto creado
 */
app.post('/api/presupuestos', async (req, res) => {
  console.log('POST /api/presupuestos:', req.body);
  
  try {
    const { ficha_id, total, descripcion = '', estado = 'pendiente' } = req.body;
    
    if (!ficha_id || !total) {
      return res.status(400).json({ error: 'Faltan ficha_id o total' });
    }
    
    const result = await pool.query(
      `INSERT INTO presupuestos (ficha_id, total, descripcion, estado)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [ficha_id, total, descripcion, estado]
    );
    
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error('Error en POST /api/presupuestos:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/fichas/{id}/presupuesto:
 *   get:
 *     summary: Obtener presupuesto de una ficha
 *     tags: [Presupuestos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Presupuesto encontrado
 */
app.get('/api/fichas/:id/presupuesto', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT p.* FROM presupuestos p
       WHERE p.ficha_id = $1
       ORDER BY p.created_at DESC
       LIMIT 1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No hay presupuesto para esta ficha' });
    }
    
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error('Error en GET /api/fichas/:id/presupuesto:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- PAGOS ---

/**
 * @swagger
 * /api/pagos:
 *   post:
 *     summary: Registrar un pago
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - presupuesto_id
 *               - monto
 *             properties:
 *               presupuesto_id:
 *                 type: integer
 *               monto:
 *                 type: number
 *               metodo_pago:
 *                 type: string
 *                 enum: [efectivo, tarjeta, transferencia]
 *               observaciones:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pago registrado
 */
app.post('/api/pagos', async (req, res) => {
  console.log('POST /api/pagos:', req.body);
  
  try {
    const { presupuesto_id, monto, metodo_pago = 'efectivo', observaciones = '' } = req.body;
    
    if (!presupuesto_id || !monto) {
      return res.status(400).json({ error: 'Faltan presupuesto_id o monto' });
    }
    
    const result = await pool.query(
      `INSERT INTO pagos (presupuesto_id, monto, metodo_pago, observaciones)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [presupuesto_id, monto, metodo_pago, observaciones]
    );
    
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error('Error en POST /api/pagos:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/presupuestos/{id}/pagos:
 *   get:
 *     summary: Obtener pagos de un presupuesto
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pagos
 */
app.get('/api/presupuestos/:id/pagos', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT * FROM pagos 
       WHERE presupuesto_id = $1
       ORDER BY fecha_pago DESC`,
      [id]
    );
    
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error en GET /api/presupuestos/:id/pagos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor con verificación de conexión
pool.connect()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');
    
    app.listen(port, () => {
      console.log(`📋 Servicio de Fichas (con Swagger) corriendo en http://localhost:${port}`);
      console.log(`📄 Documentación: http://localhost:${port}/api-docs`);
      console.log(`🏥 Health check: http://localhost:${port}/health`);
      console.log(`🐛 Debug: http://localhost:${port}/debug`);
      console.log(`👥 Pacientes: http://localhost:${port}/api/pacientes`);
      console.log(`📋 Fichas: http://localhost:${port}/api/fichas`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    console.error('Verifica tu archivo .env y que PostgreSQL esté corriendo');
    process.exit(1);
  });