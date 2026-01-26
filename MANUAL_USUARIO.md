    # Manual de Usuario - AuraDent

## Sistema de Gestión Odontológica
---

## Integrantes 
1. Andres Fernandez
2. Freddy Jiménez
3. Mijael Molina
4. Moises Pineda
5. Sebastian Morales
---

---

## Índice

1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Inicio de Sesión](#inicio-de-sesión)
5. [Dashboard Principal](#dashboard-principal)
6. [Gestión de Pacientes](#gestión-de-pacientes)
7. [Fichas Clínicas](#fichas-clínicas)
8. [Odontograma Interactivo](#odontograma-interactivo)
9. [Solución de Problemas](#solución-de-problemas)
10. [Contacto y Soporte](#contacto-y-soporte)

---

## Introducción

AuraDent es un sistema integral de gestión odontológica diseñado para clínicas dentales. Permite administrar pacientes, registrar fichas clínicas, crear odontogramas interactivos y mantener un seguimiento completo de la actividad clínica.

### Características Principales

- **Gestión de Pacientes**: Registro y administración completa de datos personales
- **Fichas Clínicas**: Registro detallado de consultas, diagnósticos y tratamientos
- **Odontograma Interactivo**: Herramienta visual para marcar procedimientos dentales
- **Dashboard Estadístico**: Visualización de métricas clave de la clínica
- **Sistema Seguro**: Autenticación y control de acceso basado en roles

---

## Requisitos del Sistema

### Navegador Web
- Google Chrome (versión 90 o superior)
- Mozilla Firefox (versión 88 o superior)
- Microsoft Edge (versión 90 o superior)
- Safari (versión 14 o superior)

### Conexión a Internet
- Conexión estable a internet para el funcionamiento completo del sistema

### Permisos
- El sistema requiere acceso a almacenamiento local del navegador para mantener la sesión activa

### Software del Servidor

#### Node.js
- Node.js (versión 16 o superior)
- npm (viene incluido con Node.js, versión 7 o superior)

#### Base de Datos
- PostgreSQL (versión 12 o superior)
- pgAdmin o cualquier cliente PostgreSQL para administración de base de datos

### Entorno de Desarrollo (para instalación y configuración)

#### Backend Services
- Node.js y npm para ejecutar los servicios:
  - servicio_pacientes
  - servicio_fichas
  - servicio_odontograma
  - servicio_seguridad

#### Frontend
- Node.js y npm para el desarrollo del frontend React con Vite
- Git para control de versiones

### Dependencias del Sistema

#### Librerías Backend (Node.js)
- Express.js (framework web)
- pg (cliente PostgreSQL para Node.js)
- CORS (Cross-Origin Resource Sharing)
- Swagger (documentación de API)
- dotenv (variables de entorno)

#### Librerías Frontend (React)
- React (librería principal)
- React Router DOM (navegación)
- Axios (cliente HTTP)
- Tailwind CSS (estilos)
- Lucide React (iconos)
- Vite (bundler de desarrollo)

### Requisitos de Hardware

#### Servidor
- Procesador: 2 núcleos o superior
- Memoria RAM: 4 GB mínimo, 8 GB recomendado
- Almacenamiento: 10 GB de espacio disponible

#### Cliente
- Procesador: 1 núcleo o superior
- Memoria RAM: 2 GB mínimo
- Almacenamiento: 500 MB de espacio disponible

---

## Instalación y Configuración

### Acceso al Sistema

1. Abra su navegador web
2. Navegue a la dirección proporcionada por su administrador del sistema
3. El sistema se cargará automáticamente

### Primera Configuración

Si es la primera vez que accede al sistema, contacte al administrador para:
- Obtener sus credenciales de acceso
- Configurar su perfil de usuario
- Asignar permisos según su rol (Odontólogo, Administrador, etc.)

---

## Inicio de Sesión

### Procedimiento de Login

1. **Acceso a la Página de Login**
   - Abra la aplicación en su navegador
   - Será dirigido automáticamente a la página de inicio de sesión

2. **Ingreso de Credenciales**
   - **Usuario**: Ingrese su nombre de usuario o email
   - **Contraseña**: Ingrese su contraseña asignada

3. **Inicio de Sesión**
   - Haga clic en el botón "Iniciar Sesión"
   - Si las credenciales son correctas, será redirigido al Dashboard

### Recuperación de Contraseña

Si olvida su contraseña:
1. Contacte al administrador del sistema
2. Proporcione su identificación
3. El administrador restablecerá su contraseña

### Seguridad de Sesión

- La sesión permanece activa durante su uso
- Si permanece inactivo por mucho tiempo, será desconectado automáticamente
- Siempre cierre sesión al finalizar su trabajo

---

## Dashboard Principal

### Resumen de Actividad

El Dashboard muestra un resumen completo de la actividad clínica:

#### Estadísticas Principales

1. **Pacientes Totales**
   - Muestra el número total de pacientes registrados
   - Incluye indicador de nuevos pacientes en la semana actual

2. **Tratamientos Pendientes**
   - Número de fichas clínicas que requieren atención
   - Incluye casos sin diagnóstico o tratamiento definido

3. **Ingresos del Mes**
   - Monto total de ingresos del mes actual
   - Calculado a partir de presupuestos y pagos registrados

#### Funcionalidades del Dashboard

- **Actualización Automática**: Los datos se actualizan cada 60 segundos
- **Actualización Manual**: Botón de "Actualizar" para refrescar datos inmediatamente
- **Indicador de Última Actualización**: Muestra la hora de la última actualización

#### Navegación Rápida

Desde el Dashboard puede acceder directamente a:
- Gestión de Pacientes
- Fichas Clínicas
- Odontograma

---

## Gestión de Pacientes

### Acceso al Módulo

1. Desde el Dashboard, haga clic en el menú lateral
2. Seleccione "Pacientes" o navegue directamente a `/pacientes`

### Registro de Nuevo Paciente

1. **Abrir Formulario**
   - Haga clic en el botón "+ Nuevo Paciente"

2. **Completar Información**
   - **N° Historia Clínica**: Número único de identificación
   - **Cédula**: Documento de identidad
   - **Nombres**: Nombres del paciente
   - **Apellidos**: Apellidos del paciente
   - **Edad**: Edad en años
   - **Teléfono**: Número de contacto
   - **Domicilio**: Dirección completa

3. **Guardar Paciente**
   - Haga clic en "Guardar Paciente"
   - Recibirá confirmación de registro exitoso

### Edición de Pacientes

1. **Seleccionar Paciente**
   - En la tabla de pacientes, localice al paciente deseado
   - Haga clic en el botón "✏️ Editar"

2. **Modificar Información**
   - Actualice los campos necesarios
   - Haga clic en "Actualizar Datos"

### Eliminación de Pacientes

1. **Seleccionar Paciente**
   - Localice al paciente en la tabla
   - Haga clic en el botón "🗑️ Eliminar"

2. **Confirmar Eliminación**
   - Aparecerá un mensaje de confirmación
   - Si confirma, el paciente será eliminado permanentemente

**Nota**: No se pueden eliminar pacientes que tengan fichas clínicas asociadas.

### Búsqueda y Filtrado

- Utilice la barra de búsqueda para encontrar pacientes por nombre
- La tabla muestra: N° Historia Clínica, Nombre Completo, Cédula y Teléfono

---

## Fichas Clínicas

### Acceso al Módulo

1. Desde el menú lateral, seleccione "Fichas"
2. O navegue directamente a `/fichas`

### Creación de Nueva Ficha

1. **Abrir Formulario**
   - Haga clic en "+ Nueva Ficha"

2. **Seleccionar Paciente**
   - Elija el paciente de la lista desplegable

3. **Completar Información Clínica**
   - **Fecha de Consulta**: Fecha de la atención
   - **Motivo de Consulta**: Razón de la visita
   - **Diagnóstico**: Hallazgos clínicos
   - **Tratamiento**: Procedimientos realizados
   - **Monto Estimado**: Costo aproximado en CLP

4. **Guardar Ficha**
   - Haga clic en "Guardar Ficha"
   - Recibirá confirmación de registro

### Visualización de Fichas

- **Vista General**: Lista todas las fichas con información resumida
- **Vista Detallada**: Haga clic en "Ver Detalles" para información completa
- **Fichas por Paciente**: Filtre fichas por paciente específico

### Edición de Fichas

1. **Seleccionar Ficha**
   - En la lista de fichas, haga clic en "✏️ Editar"

2. **Modificar Información**
   - Actualice los campos necesarios
   - Haga clic en "Actualizar Ficha"

### Eliminación de Fichas

1. **Seleccionar Ficha**
   - Haga clic en "🗑️ Eliminar"
   - Confirme la eliminación en el mensaje emergente

---

## Odontograma Interactivo

### Acceso al Módulo

1. Desde el menú lateral, seleccione "Odontograma"
2. O navegue directamente a `/odontograma`

### Configuración Inicial

1. **Seleccionar Paciente**
   - Use el selector desplegable para elegir el paciente
   - El sistema cargará el odontograma existente o creará uno nuevo

2. **Tipo de Odontograma**
   - **Adulto**: Dientes permanentes (numeración FDI estándar)
   - **Infantil**: Dientes temporales (puede cambiar con el botón "Cambiar a Infantil")

### Uso del Odontograma

#### Marcado de Procedimientos

1. **Seleccionar Diente**
   - Haga clic en el diente deseado en el diagrama visual
   - Puede seleccionar el diente completo o una superficie específica

2. **Seleccionar Superficie (Opcional)**
   - **Oclusal**: Superficie superior del diente
   - **Mesial**: Lado interno (hacia el centro)
   - **Distal**: Lado externo
   - **Vestibular**: Superficie frontal

3. **Elegir Procedimiento**
   - Seleccione el estado o procedimiento del diente:
     - **Sano**: Diente sin alteraciones
     - **Caries**: Presencia de caries dental
     - **Profiláctico**: Limpieza preventiva
     - **Restauración Resina**: Empaste de resina
     - **Sellador**: Aplicación de sellador
     - **Extracción**: Diente a extraer
     - **Corona**: Colocación de corona
     - **Endodoncia**: Tratamiento de conducto
     - **Ausente**: Diente faltante
     - **Otros**: Otros procedimientos

4. **Agregar Diagnóstico**
   - Escriba una descripción detallada del hallazgo
   - Ejemplo: "Caries profunda en superficie oclusal"

5. **Aplicar Cambios**
   - Haga clic en "Aplicar a Pieza"
   - Los cambios se mostrarán visualmente en el odontograma

#### Guardado de Cambios

- **Guardar Todo**: Haga clic en el botón verde "Guardar Todo" para guardar permanentemente en la base de datos
- Los cambios no se guardan automáticamente; siempre use "Guardar Todo" al finalizar

### Visualización de Estados

Cada procedimiento tiene un color distintivo:
- **Sano**: Blanco
- **Caries**: Rojo
- **Profiláctico**: Azul
- **Restauración Resina**: Púrpura
- **Sellador**: Amarillo
- **Extracción/Ausente**: Negro/Gris
- **Corona**: Amarillo dorado
- **Endodoncia**: Rosa
- **Otros**: Verde

### Consejos de Uso

- Trabaje diente por diente para mayor precisión
- Use "Marcar como Ausente" para dientes faltantes
- Guarde frecuentemente para evitar pérdida de datos
- El odontograma se actualiza en tiempo real visualmente

---

## Solución de Problemas

### Problemas Comunes

#### Error de Inicio de Sesión
- **Síntoma**: No puede acceder al sistema
- **Solución**:
  - Verifique que usuario y contraseña sean correctos
  - Contacte al administrador si el problema persiste

#### Datos No Se Actualizan
- **Síntoma**: Información no se refresca en Dashboard
- **Solución**:
  - Use el botón "Actualizar" manualmente
  - Verifique su conexión a internet
  - Recargue la página si es necesario

#### Error al Guardar Datos
- **Síntoma**: Mensaje de error al guardar pacientes o fichas
- **Solución**:
  - Verifique que todos los campos obligatorios estén completos
  - Asegúrese de que la información sea válida
  - Contacte soporte si el error persiste

#### Odontograma No Carga
- **Síntoma**: El diagrama dental no se muestra
- **Solución**:
  - Seleccione un paciente primero
  - Verifique que el paciente tenga datos válidos
  - Recargue la página

### Rendimiento

- **Carga Lenta**: Verifique su conexión a internet
- **Interfaz Congelada**: Recargue la página o reinicie el navegador
- **Datos Desactualizados**: Use la función de actualización manual

---

## Contacto y Soporte

### Soporte Técnico

Para asistencia técnica:
- **Email**: sebastian.morales@epn.edu.ec
- **Horario**: Lunes a Viernes, 9:00 - 18:00 hrs

### Reporte de Problemas

Al reportar un problema, incluya:
- Descripción detallada del error
- Pasos para reproducir el problema
- Captura de pantalla si es posible
- Información de su navegador y sistema operativo

### Sugerencias de Mejora

Sus comentarios son valiosos para mejorar AuraDent:
- Envíe sus sugerencias a: auradent.com.ec

---

**Versión del Manual**: 1.0
**Última Actualización**: Enero 2026
**Sistema**: AuraDent v1.0

*Este manual está sujeto a actualizaciones. Consulte regularmente para obtener la información más reciente.*
