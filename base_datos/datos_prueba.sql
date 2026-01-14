-- 1. Insertar un Usuario Odontólogo (La contraseña es '123456' ficticia)
INSERT INTO usuarios (usuario, contrasena, nombre_completo, rol) 
VALUES ('dra_magda', '123456', 'Magda Zulay Bastidas', 'ODONTOLOGO');

-- 2. Insertar un Paciente de prueba
INSERT INTO pacientes (num_historia_clinica, nombres, apellidos, cedula, edad, domicilio, telefono)
VALUES ('HC-001', 'Juan', 'Pérez', '1712345678', 30, 'Av. Siempre Viva 123', '0999999999');

-- 3. Crear una Ficha Médica para ese paciente
INSERT INTO fichas_clinicas (paciente_id, odontologo_id, motivo_consulta, pieza_dental)
VALUES (1, 1, 'Dolor intenso al comer dulces', '18');