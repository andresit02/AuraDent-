const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

// IMPORTAR SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;
const secretKey = process.env.JWT_SECRET || 'secreto_super_seguro';

app.use(cors());
app.use(express.json());

// CONFIGURACIÓN SWAGGER
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio de Seguridad - AuraDent',
      version: '1.0.0',
      description: 'API para autenticación de usuarios (Login) y generación de JWT.',
    },
    servers: [
      { url: `http://localhost:${port}` }
    ],
  },
  apis: [path.join(__dirname, './index.js')],
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

// --- RUTAS ---

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - contrasena
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: dra_magda
 *               contrasena:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error del servidor
 */
app.post('/api/auth/login', async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    // ESTO ESTÁ BIEN - la columna se llama 'usuario'
    const userQuery = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = $1',
      [usuario]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = userQuery.rows[0];

    // ¡CORRECCIÓN IMPORTANTE! La columna se llama 'contrasena' SIN eñe
    const dbPassword = user.contrasena;  // ← CAMBIA AQUÍ

    // Comparar contraseña
    let validPassword = false;
    
    // Verificar si es hash bcrypt o texto plano
    if (dbPassword && (dbPassword.startsWith('$2b$') || dbPassword.startsWith('$2a$'))) {
      // Si está encriptada con bcrypt
      validPassword = await bcrypt.compare(contrasena, dbPassword);
    } else {
      // Si es texto plano
      validPassword = (contrasena === dbPassword);
    }

    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.rol  // ← La columna se llama 'rol'
      },
      secretKey,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Autenticación exitosa',
      token,
      user: {
        id: user.id,
        nombre: user.nombre_completo,
        rol: user.rol
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error del servidor', details: err.message });
  }
});

// Ruta de health check (importante para verificar)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'seguridad',
    timestamp: new Date().toISOString()
  });
});

// Verificar conexión a PostgreSQL antes de iniciar
pool.connect()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');
    app.listen(port, () => {
      console.log(`🔐 Servicio de Seguridad corriendo en http://localhost:${port}`);
      console.log(`📄 Documentación: http://localhost:${port}/api-docs`);
      console.log(`🏥 Health check: http://localhost:${port}/health`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    process.exit(1);
  });