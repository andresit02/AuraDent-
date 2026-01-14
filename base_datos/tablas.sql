-- 1. TABLA DE USUARIOS (Para iniciar sesión y seguridad)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100),
    rol VARCHAR(20) CHECK (rol IN ('ADMIN', 'ODONTOLOGO', 'ASISTENTE')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE PACIENTES (Datos personales de la Ficha)
-- Basado en "Datos Personales" del PDF [cite: 86, 87, 89, 91]
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    num_historia_clinica VARCHAR(20) UNIQUE NOT NULL, 
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    cedula VARCHAR(15) UNIQUE,
    edad INT,
    domicilio TEXT,
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. FICHAS CLÍNICAS (Cabecera del tratamiento)
-- Basado en "Ficha de Diagnóstico y Tratamiento Endodóntico" [cite: 84, 88, 103]
CREATE TABLE fichas_clinicas (
    id SERIAL PRIMARY KEY,
    paciente_id INT REFERENCES pacientes(id),
    odontologo_id INT REFERENCES usuarios(id),
    fecha_consulta DATE DEFAULT CURRENT_DATE,
    pieza_dental VARCHAR(5), -- Ej: "18", "21"
    motivo_consulta TEXT,
    antecedentes_enfermedad TEXT,
    doctor_referidor VARCHAR(100)
);

-- 4. DETALLES DE DIAGNÓSTICO (Dolor y Exámenes)
-- Basado en tablas de Dolor, Zona Periapical y Examen Periodontal [cite: 106, 108, 110]
CREATE TABLE detalles_diagnostico (
    ficha_id INT PRIMARY KEY REFERENCES fichas_clinicas(id),
    dolor_naturaleza VARCHAR(50),   -- Leve, Moderado, Intenso
    dolor_frecuencia VARCHAR(50),   -- Continuo, Pulsátil
    dolor_estimulo VARCHAR(100),    -- Frío, Calor, Dulces
    zona_periapical VARCHAR(100),   -- Normal, Tumefacción, Fístula
    bolsa_periodontal DECIMAL(4,1), -- Profundidad en mm
    movilidad INT                   -- Grado 0, 1, 2, 3
);

-- 5. PAGOS Y PRESUPUESTOS
-- Basado en la sección "Presupuesto" y "Pagos" del PDF [cite: 127, 130]
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    ficha_id INT REFERENCES fichas_clinicas(id),
    fecha DATE DEFAULT CURRENT_DATE,
    actividad VARCHAR(150), -- Tratamiento realizado
    valor DECIMAL(10,2),    -- Costo
    abono DECIMAL(10,2),    -- Cuánto pagó
    saldo DECIMAL(10,2)     -- Cuánto debe
);

-- 6. ODONTOGRAMA 
-- Basado en la sección gráfica del PDF para guardar estado de dientes [cite: 92]
CREATE TABLE odontogramas (
    paciente_id INT PRIMARY KEY REFERENCES pacientes(id),
    datos_dientes JSONB, -- Guardamos el mapa gráfico aquí
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);