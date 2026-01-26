#  DOCUMENTACIÓN TÉCNICA
## Sistema de Gestión Odontológica "AuraDent"

**Fecha:** Enero 2026  
**Materia:** Aplicaciones Web  

---

##  TABLA DE CONTENIDOS

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Diagrama de Base de Datos](#diagrama-de-base-de-datos)
4. [Microservicios](#microservicios)
5. [Documentación de API](#documentación-de-api)
6. [Tecnologías Utilizadas](#tecnologías-utilizadas)
7. [Instalación y Configuración](#instalación-y-configuración)
8. [Seguridad](#seguridad)

---

## 1. INTRODUCCIÓN

### 1.1 Descripción General
AuraDent es un sistema web de gestión odontológica desarrollado con arquitectura de microservicios. Permite gestionar pacientes, fichas clínicas de diagnóstico y tratamiento endodóntico, odontogramas interactivos, presupuestos y pagos.

### 1.2 Objetivos del Sistema
- Centralizar la información de pacientes odontológicos
- Digitalizar fichas de diagnóstico y tratamiento endodóntico
- Proporcionar visualización gráfica del estado dental (odontograma)
- Gestionar presupuestos y pagos de tratamientos
- Asegurar el acceso mediante autenticación JWT

### 1.3 Alcance
El sistema cubre la gestión completa del ciclo de atención odontológica desde el registro del paciente hasta el control de pagos.

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Arquitectura de Microservicios

```
┌─────────────────────────────────────────────────────┐
│                  CAPA DE CLIENTE                    │
│            (React - Puerto 5173/3000)               │
│  ┌──────────┬──────────┬───────────┬─────────────┐ │
│  │  Login   │ Dashboard│ Pacientes │ Odontograma │ │
│  │  Page    │   Page   │   Page    │    Page     │ │
│  └──────────┴──────────┴───────────┴─────────────┘ │
└─────────────────────────────────────────────────────┘
                         │
                    HTTPS/REST
                         │
┌─────────────────────────────────────────────────────┐
│              CAPA DE MICROSERVICIOS                 │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐                │
│  │  Servicio   │  │  Servicio    │                │
│  │  Seguridad  │  │  Pacientes   │                │
│  │ Puerto 3001 │  │ Puerto 3002  │                │
│  │             │  │              │                │
│  │ - Login     │  │ - CRUD       │                │
│  │ - JWT       │  │ - Búsqueda   │                │
│  └─────────────┘  └──────────────┘                │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐                │
│  │  Servicio   │  │  Servicio    │                │
│  │   Fichas    │  │ Odontograma  │                │
│  │ Puerto 3003 │  │ Puerto 3004  │                │
│  │             │  │              │                │
│  │ - Diagnóst. │  │ - Estado     │                │
│  │ - Pagos     │  │   Dental     │                │
│  │ - Presup.   │  │ - JSONB      │                │
│  └─────────────┘  └──────────────┘                │
└─────────────────────────────────────────────────────┘
                         │
                         │
┌─────────────────────────────────────────────────────┐
│              CAPA DE PERSISTENCIA                   │
│                                                     │
│           PostgreSQL (Puerto 5432)                  │
│                                                     │
│  Tablas: usuarios | pacientes | fichas_clinicas    │
│          detalles_diagnostico | pagos              │
│          odontogramas                               │
└─────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Comunicación

**Flujo de Autenticación:**
1. Usuario ingresa credenciales → Frontend
2. POST /api/auth/login → Servicio Seguridad
3. Validación en BD → Retorna JWT
4. Token almacenado en memoria (React State)
5. Token incluido en headers de peticiones subsecuentes

**Flujo de Operación Típica:**
1. Usuario autenticado navega a sección
2. Frontend solicita datos con JWT en header
3. Microservicio valida token
4. Consulta/Modifica base de datos
5. Retorna respuesta JSON
6. Frontend actualiza interfaz

---

## 3. DIAGRAMA DE BASE DE DATOS

### 3.1 Modelo Entidad-Relación

```
┌─────────────────┐
│    USUARIOS     │
├─────────────────┤
│ PK id           │
│    usuario      │◄─────────┐
│    contrasena   │          │
│    nombre_comp. │          │
│    rol          │          │
│    fecha_creac. │          │
└─────────────────┘          │
                             │
                             │ FK odontologo_id
┌─────────────────┐          │
│   PACIENTES     │          │
├─────────────────┤          │
│ PK id           │◄─┐       │
│    num_hist_cl. │  │       │
│    nombres      │  │       │
│    apellidos    │  │       │
│    cedula       │  │       │
│    edad         │  │       │
│    domicilio    │  │       │
│    telefono     │  │       │
└─────────────────┘  │       │
         │           │       │
         │           │       │
         │ FK        │       │
         │           │       │
┌────────▼────────┐  │       │
│ ODONTOGRAMAS    │  │       │
├─────────────────┤  │       │
│ PK paciente_id  │──┘       │
│    datos_dient. │          │
│    fecha_actual │          │
└─────────────────┘          │
                             │
         │ FK paciente_id    │
         │                   │
┌────────▼────────────────┐  │
│  FICHAS_CLINICAS        │  │
├─────────────────────────┤  │
│ PK id                   │  │
│ FK paciente_id          │──┘
│ FK odontologo_id        │────┘
│    fecha_consulta       │
│    pieza_dental         │
│    motivo_consulta      │
│    antec_enfermedad     │
│    doctor_referidor     │
└─────────────────────────┘
         │                │
         │                │
         │ FK ficha_id    │ FK ficha_id
         │                │
┌────────▼─────────┐  ┌───▼──────────┐
│ DETALLES_DIAGNO. │  │    PAGOS     │
├──────────────────┤  ├──────────────┤
│ PK ficha_id      │  │ PK id        │
│    dolor_natural.│  │ FK ficha_id  │
│    dolor_frecuen.│  │    fecha     │
│    dolor_estimul.│  │    actividad │
│    zona_periapic.│  │    valor     │
│    bolsa_period. │  │    abono     │
│    movilidad     │  │    saldo     │
└──────────────────┘  └──────────────┘
```

### 3.2 Diccionario de Datos

**USUARIOS**
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Identificador único |
| usuario | VARCHAR(50) | UNIQUE NOT NULL | Nombre de usuario |
| contrasena | VARCHAR(255) | NOT NULL | Contraseña (hash) |
| nombre_completo | VARCHAR(100) | - | Nombre completo |
| rol | VARCHAR(20) | CHECK | ADMIN/ODONTOLOGO/ASISTENTE |
| fecha_creacion | TIMESTAMP | DEFAULT NOW | Fecha de registro |

**PACIENTES**
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Identificador único |
| num_historia_clinica | VARCHAR(20) | UNIQUE NOT NULL | Número de historia |
| nombres | VARCHAR(100) | NOT NULL | Nombres |
| apellidos | VARCHAR(100) | NOT NULL | Apellidos |
| cedula | VARCHAR(15) | UNIQUE | Documento identidad |
| edad | INT | - | Edad del paciente |
| domicilio | TEXT | - | Dirección |
| telefono | VARCHAR(20) | - | Teléfono contacto |

**FICHAS_CLINICAS**
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Identificador único |
| paciente_id | INT | FK pacientes | Referencia paciente |
| odontologo_id | INT | FK usuarios | Referencia odontólogo |
| fecha_consulta | DATE | DEFAULT TODAY | Fecha consulta |
| pieza_dental | VARCHAR(5) | - | Número de pieza (ej: 18) |
| motivo_consulta | TEXT | - | Razón de consulta |
| antecedentes_enfermedad | TEXT | - | Antecedentes médicos |
| doctor_referidor | VARCHAR(100) | - | Doctor que refiere |

**DETALLES_DIAGNOSTICO**
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| ficha_id | INT | PK, FK fichas | Referencia ficha |
| dolor_naturaleza | VARCHAR(50) | - | Leve/Moderado/Intenso |
| dolor_frecuencia | VARCHAR(50) | - | Continuo/Pulsátil |
| dolor_estimulo | VARCHAR(100) | - | Frío/Calor/Dulces |
| zona_periapical | VARCHAR(100) | - | Normal/Tumefacción |
| bolsa_periodontal | DECIMAL(4,1) | - | Profundidad en mm |
| movilidad | INT | - | Grado 0-3 |

**PAGOS**
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Identificador único |
| ficha_id | INT | FK fichas | Referencia ficha |
| fecha | DATE | DEFAULT TODAY | Fecha de pago |
| actividad | VARCHAR(150) | - | Tratamiento realizado |
| valor | DECIMAL(10,2) | - | Costo total |
| abono | DECIMAL(10,2) | - | Pago realizado |
| saldo | DECIMAL(10,2) | - | Deuda pendiente |

**ODONTOGRAMAS**
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| paciente_id | INT | PK, FK pacientes | Referencia paciente |
| datos_dientes | JSONB | - | Mapa gráfico dientes |
| fecha_actualizacion | TIMESTAMP | DEFAULT NOW | Última modificación |

---

## 4. MICROSERVICIOS

### 4.1 Servicio de Seguridad (Puerto 3001)

**Responsabilidades:**
- Autenticación de usuarios
- Generación de tokens JWT
- Validación de credenciales

**Endpoints:**
- POST /api/auth/login

**Tecnologías:**
- Node.js + Express
- bcryptjs (encriptación)
- jsonwebtoken (JWT)
- pg (PostgreSQL client)

### 4.2 Servicio de Pacientes (Puerto 3002)

**Responsabilidades:**
- CRUD completo de pacientes
- Búsqueda y filtrado
- Gestión de historias clínicas

**Endpoints:**
- GET /api/pacientes
- POST /api/pacientes
- PUT /api/pacientes/:id
- DELETE /api/pacientes/:id

**Tecnologías:**
- Node.js + Express
- pg (PostgreSQL client)
- Swagger UI

### 4.3 Servicio de Fichas Clínicas (Puerto 3003)

**Responsabilidades:**
- Registro de diagnósticos
- Gestión de tratamientos endodónticos
- Control de presupuestos y pagos

**Endpoints:**
- GET /api/fichas
- POST /api/fichas
- PUT /api/fichas/:id
- GET /api/pagos/:fichaId
- POST /api/pagos

**Tecnologías:**
- Node.js + Express
- pg (PostgreSQL client)

### 4.4 Servicio de Odontograma (Puerto 3004)

**Responsabilidades:**
- Almacenamiento del estado dental
- Actualización de condiciones por pieza
- Retorno de datos en formato JSON

**Endpoints:**
- GET /api/odontograma/:pacienteId
- POST /api/odontograma
- PUT /api/odontograma/:pacienteId

**Tecnologías:**
- Node.js + Express
- pg (PostgreSQL client)
- JSONB para estructura flexible

---

## 5. DOCUMENTACIÓN DE API

### 5.1 Autenticación - POST /api/auth/login

**Request:**
```json
{
  "usuario": "dra_magda",
  "contrasena": "123456"
}
```

**Response (200):**
```json
{
  "message": "Autenticación exitosa",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Dra. Magda García",
    "rol": "ODONTOLOGO"
  }
}
```

**Response (401):**
```json
{
  "error": "Credenciales incorrectas"
}
```

### 5.2 Pacientes - GET /api/pacientes

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "num_historia_clinica": "HC-001",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "cedula": "1234567890",
    "edad": 35,
    "domicilio": "Av. Principal 123",
    "telefono": "0987654321"
  }
]
```

### 5.3 Crear Paciente - POST /api/pacientes

**Request:**
```json
{
  "num_historia_clinica": "HC-002",
  "nombres": "María",
  "apellidos": "López",
  "cedula": "0987654321",
  "edad": 28,
  "domicilio": "Calle Secundaria 456",
  "telefono": "0998877665"
}
```

**Response (200):**
```json
{
  "id": 2,
  "num_historia_clinica": "HC-002",
  "nombres": "María",
  "apellidos": "López",
  ...
}
```

### 5.4 Fichas Clínicas - POST /api/fichas

**Request:**
```json
{
  "paciente_id": 1,
  "odontologo_id": 1,
  "pieza_dental": "18",
  "motivo_consulta": "Dolor al masticar",
  "antecedentes_enfermedad": "Ninguno",
  "diagnostico": {
    "dolor_naturaleza": "Moderado",
    "dolor_frecuencia": "Continuo",
    "zona_periapical": "Normal"
  }
}
```

### 5.5 Swagger Documentation

Cada microservicio expone documentación interactiva en:
- http://localhost:3001/api-docs (Seguridad)
- http://localhost:3002/api-docs (Pacientes)
- http://localhost:3003/api-docs (Fichas)
- http://localhost:3004/api-docs (Odontograma)

---

## 6. TECNOLOGÍAS UTILIZADAS

### 6.1 Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js 4.18
- **Base de Datos:** PostgreSQL 14+
- **Autenticación:** JWT (jsonwebtoken 9.0)
- **Encriptación:** bcryptjs 2.4
- **Documentación:** Swagger UI Express

### 6.2 Frontend
- **Framework:** React 18.2
- **Build Tool:** Vite 5.0
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Estilos:** CSS Modules / Tailwind 

### 6.3 Infraestructura
- **Control de Versiones:** Git
- **Gestión de Paquetes:** npm
- **Variables de Entorno:** dotenv
- **CORS:** cors middleware

---

## 7. INSTALACIÓN Y CONFIGURACIÓN

### 7.1 Requisitos Previos

**Software necesario:**
- Node.js v18 o superior
- PostgreSQL 14 o superior
- Git
- Editor de código (VS Code recomendado)

### 7.2 Instalación de la Base de Datos

**Paso 1: Crear la base de datos**
```sql
CREATE DATABASE auradent;
```

**Paso 2: Conectarse a la base de datos**
```sql
\c auradent
```

**Paso 3: Ejecutar el script de creación de tablas**
```sql
-- Ejecutar el script SQL completo con todas las tablas
-- (usuarios, pacientes, fichas_clinicas, detalles_diagnostico, pagos, odontogramas)
```

**Paso 4: Insertar usuario de prueba**
```sql
INSERT INTO usuarios (usuario, contrasena, nombre_completo, rol)
VALUES ('admin', '$2b$10$...', 'Administrador', 'ADMIN');
```

### 7.3 Configuración del Backend

**Paso 1: Clonar el repositorio**
```bash
git clone <url-repositorio>
cd AuraDent/backend
```

**Paso 2: Instalar dependencias de cada microservicio**
```bash
cd servicio_seguridad
npm install

cd ../servicio_pacientes
npm install

cd ../servicio_fichas
npm install

cd ../servicio_odontograma
npm install
```

**Paso 3: Configurar variables de entorno**

Crear archivo `.env` en cada carpeta de servicio:

```env
# servicio_seguridad/.env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=auradent
DB_PASSWORD=tu_contraseña
DB_PORT=5432
JWT_SECRET=secreto_super_seguro_auradent_2024
PORT=3001
```

```env
# servicio_pacientes/.env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=auradent
DB_PASSWORD=tu_contraseña
DB_PORT=5432
PORT=3002
```

```env
# servicio_fichas/.env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=auradent
DB_PASSWORD=tu_contraseña
DB_PORT=5432
PORT=3003
```

```env
# servicio_odontograma/.env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=auradent
DB_PASSWORD=tu_contraseña
DB_PORT=5432
PORT=3004
```

### 7.4 Configuración del Frontend

**Paso 1: Navegar a la carpeta frontend**
```bash
cd ../frontend
```

**Paso 2: Instalar dependencias**
```bash
npm install
```

**Paso 3: Configurar archivo de entorno (si aplica)**
```env
VITE_API_URL=http://localhost:3001
```

### 7.5 Ejecución del Sistema

**Backend (abrir 4 terminales):**

Terminal 1:
```bash
cd backend/servicio_seguridad
npm start
```

Terminal 2:
```bash
cd backend/servicio_pacientes
npm start
```

Terminal 3:
```bash
cd backend/servicio_fichas
npm start
```

Terminal 4:
```bash
cd backend/servicio_odontograma
npm start
```

**Frontend (terminal 5):**
```bash
cd frontend
npm run dev
```

### 7.6 Verificación de la Instalación

**Verificar servicios backend:**
- http://localhost:3001/api-docs (Servicio Seguridad)
- http://localhost:3002/api-docs (Servicio Pacientes)
- http://localhost:3003/api-docs (Servicio Fichas)
- http://localhost:3004/api-docs (Servicio Odontograma)

**Verificar frontend:**
- http://localhost:5173 (Aplicación React)

**Probar login:**
- Usuario: admin
- Contraseña: (la configurada en BD)

---

## 8. SEGURIDAD

### 8.1 Autenticación JWT

El sistema utiliza JSON Web Tokens para autenticación:
- Tokens con expiración de 2 horas
- Secret key configurable vía variable de entorno
- Tokens incluidos en header Authorization

### 8.2 Encriptación de Contraseñas

- Algoritmo: bcrypt
- Salt rounds: 10
- Hash almacenado en base de datos
- Soporte para contraseñas en texto plano (migración)

### 8.3 Validación de Datos

- Validación de tipos en backend
- Sanitización de inputs
- Manejo de errores SQL

### 8.4 CORS

- Configurado para desarrollo local
- Debe restringirse en producción a dominios autorizados

### 8.5 Recomendaciones de Producción

- [ ] Implementar HTTPS con certificado SSL
- [ ] Configurar rate limiting
- [ ] Implementar logs de auditoría
- [ ] Restringir CORS a dominios específicos
- [ ] Implementar backup automático de BD
- [ ] Usar variables de entorno para secrets
- [ ] Implementar middleware de validación JWT en todos los endpoints

---
Para más información sobre el uso del sistema, consultar el Manual de Usuario.