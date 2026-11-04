🧁 Puro Relleno Cupcake

Sistema de gestión de pedidos personalizados

Aplicación web fullstack para administrar los pedidos personalizados de la pastelería Puro Relleno Cupcake.

El sistema permite gestionar clientes, consultar productos, registrar pedidos personalizados, organizar las fechas de entrega, actualizar los estados de producción y llevar el control de pagos y adelantos.

Proyecto académico: SENATI – Fullstack Developer Software, 2026-II.

Equipo: Grupo 3.

Tecnologías utilizadas

El frontend está desarrollado con React, TypeScript, Vite y React Router.

El backend utiliza Node.js, Express, TypeScript y Sequelize.

La base de datos es PostgreSQL y puede administrarse mediante pgAdmin 4.

La autenticación utiliza contraseñas protegidas mediante bcrypt y tokens JWT.

Para las pruebas del backend se utilizan Vitest y Supertest.

Requisitos para ejecutar el proyecto

Se recomienda instalar Node.js 22.12 o superior, npm, PostgreSQL, pgAdmin 4 y Git.

También se recomienda utilizar WebStorm o Visual Studio Code como entorno de desarrollo.

PostgreSQL debe estar instalado y su servicio debe encontrarse en ejecución.

1. Clonar el repositorio

Abre una terminal de PowerShell en la carpeta donde deseas guardar el proyecto.

Ejecuta:

git clone https://github.com/2026-II-Senati/Grupo-3-Puro-Relleno-Cupcake.git

Entra a la carpeta descargada:

cd Grupo-3-Puro-Relleno-Cupcake

Para utilizar la versión más reciente integrada por el equipo:

git switch develop
git pull --ff-only origin develop

La rama "main" contiene las versiones estables y "develop" integra los avances del equipo.

2. Instalar las dependencias

El proyecto tiene dos aplicaciones independientes: "backend" y "frontend".

Primero instala las dependencias del backend:

cd backend
npm ci

Regresa a la carpeta principal:

cd ..

Después instala las dependencias del frontend:

cd frontend
npm ci

Regresa nuevamente a la carpeta principal:

cd ..

"npm ci" instala las versiones registradas en los archivos "package-lock.json".

No es necesario instalar las dependencias de otro compañero ni copiar su carpeta "node_modules".

3. Configurar PostgreSQL

Abre pgAdmin 4.

Conéctate a tu servidor local de PostgreSQL utilizando la contraseña que configuraste cuando instalaste PostgreSQL.

En el panel izquierdo, abre el servidor y busca "Databases".

Haz clic derecho sobre "Databases", selecciona "Create" y después "Database".

En el campo "Database", escribe exactamente:

puro_relleno_cupcake

En "Owner", selecciona el usuario de PostgreSQL que utilizarás para la conexión, normalmente "postgres" en una instalación local.

Presiona "Save".

También puedes crear la base desde Query Tool, conectado a otra base de datos, mediante:

CREATE DATABASE puro_relleno_cupcake;

No es necesario ejecutar ambos procedimientos.

¿Debo crear las tablas manualmente?

No.

El backend utiliza modelos Sequelize que se sincronizan con PostgreSQL durante el inicio del servidor.

Cuando la conexión y la sincronización funcionen correctamente, se crearán las tablas registradas por el proyecto.

Las tablas esperadas incluyen:

clients
products
orders
order_details
payments
roles
users

No ejecutes scripts SQL de terceros ni modifiques manualmente las relaciones si las tablas ya fueron creadas correctamente.

La sincronización automática se utiliza para nuestro entorno de desarrollo. Antes de un despliegue real será necesario adoptar migraciones controladas.

4. Configurar las variables de entorno

Por seguridad, el archivo "backend/.env" no se incluye en GitHub.

Cada integrante del equipo debe crear su propio archivo ".env".

Abre una terminal desde la carpeta principal del proyecto y ejecuta:

Copy-Item backend/.env.example backend/.env

Ahora abre el archivo:

backend/.env

Completa su contenido utilizando esta estructura:

NODE_ENV=development
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=puro_relleno_cupcake
DB_USER=postgres
DB_PASSWORD=TU_CONTRASENA_LOCAL

JWT_SECRET=TU_CLAVE_SECRETA_GENERADA

Reemplaza "TU_CONTRASENA_LOCAL" con la contraseña de tu instalación de PostgreSQL.

Si utilizas un usuario de PostgreSQL diferente de "postgres", modifica "DB_USER".

Si PostgreSQL utiliza otro puerto, modifica "DB_PORT".

Generar JWT_SECRET

Cada integrante debe generar su propia clave secreta.

Desde una terminal ejecuta:

node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"

Copia el resultado y úsalo como valor de "JWT_SECRET".

No utilices la contraseña de PostgreSQL como clave JWT.

No compartas el archivo ".env" ni publiques la clave generada.

5. Iniciar el backend por primera vez

Abre una terminal desde la carpeta principal del proyecto.

Ejecuta:

cd backend
npm run dev

El backend intentará conectarse a PostgreSQL y sincronizar los modelos de Sequelize.

Si todo está configurado correctamente, deberá iniciar el servidor en:

http://127.0.0.1:3000

Puedes comprobar su funcionamiento abriendo:

http://127.0.0.1:3000/api/health

La respuesta esperada incluye:

{
"status": "ok"
}

Si la conexión falla, revisa que PostgreSQL esté encendido y que "DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD" y "DB_NAME" sean correctos.

6. Crear el primer usuario administrador

El sistema utiliza autenticación mediante correo electrónico y contraseña.

Para iniciar sesión por primera vez, es necesario crear un administrador de desarrollo.

Este procedimiento debe ejecutarse después de haber iniciado correctamente el backend, de manera que las tablas "roles" y "users" ya existan.

Abre otra terminal de PowerShell dentro de la carpeta "backend".

Configura el nombre y correo del usuario de prueba:

$env:BOOTSTRAP_ADMIN_NAME = "Administrador de prueba"
$env:BOOTSTRAP_ADMIN_EMAIL = "admin@ejemplo.test"

Después ingresa una contraseña mediante:

$secure = Read-Host "Contraseña del administrador" -AsSecureString

Utiliza una contraseña de al menos 12 caracteres.

Ejecuta:

$env:BOOTSTRAP_ADMIN_PASSWORD = [System.Net.NetworkCredential]::new("", $secure).Password

Finalmente, ejecuta:

try {
npx tsx src/scripts/createAdmin.ts
}
finally {
Remove-Item Env:BOOTSTRAP_ADMIN_PASSWORD -ErrorAction SilentlyContinue
Remove-Item Env:BOOTSTRAP_ADMIN_EMAIL -ErrorAction SilentlyContinue
Remove-Item Env:BOOTSTRAP_ADMIN_NAME -ErrorAction SilentlyContinue
Remove-Variable secure -ErrorAction SilentlyContinue
}

El script crea el usuario administrador con una contraseña protegida mediante hash.

No es necesario ingresar contraseñas directamente en pgAdmin.

No compartas las credenciales utilizadas durante esta configuración.

7. Iniciar el frontend

Mantén encendido el backend.

Abre otra terminal desde la carpeta principal del repositorio.

Ejecuta:

cd frontend
npm run dev

Vite iniciará el servidor de desarrollo.

Abre en tu navegador:

http://127.0.0.1:5173/login

Inicia sesión con el correo y la contraseña del administrador que creaste anteriormente.

Durante el desarrollo, Vite redirige las solicitudes "/api" hacia el backend local.

Por ello, ambos servidores deben estar funcionando.

8. Módulos disponibles

Autenticación: permite iniciar sesión, verificar la sesión y cerrar sesión.

Catálogo: permite consultar los productos registrados en la base de datos.

Clientes: administra la información necesaria para registrar pedidos.

Pedidos: permite crear pedidos personalizados y actualizar sus estados.

Agenda: organiza los pedidos según sus fechas de entrega o recogida.

Pagos: permite registrar adelantos y pagos completos, consultar movimientos y calcular saldos pendientes.

El módulo de pagos registra operaciones declaradas como recibidas. No procesa transacciones bancarias automáticas.

9. ¿Por qué mi instalación aparece sin productos ni pedidos?

Porque cada integrante utiliza su propia base de datos local.

Clonar el repositorio descarga el código, pero no copia los registros de PostgreSQL del desarrollador original.

Al instalar el proyecto por primera vez, las tablas pueden estar vacías.

Será necesario registrar productos, clientes y pedidos de demostración para probar las funcionalidades.

La creación de un catálogo de datos ficticios reutilizable se realizará mediante un procedimiento de inicialización de datos.

No deben compartirse contraseñas, datos personales de clientes ni respaldos de producción dentro del repositorio.

10. Ejecutar las pruebas

Desde la carpeta "backend", ejecuta:

npm test

Para ejecutar las pruebas automáticamente mientras modificas el código:

npm run test:watch

Para comprobar la compilación de TypeScript:

npm run build

Desde la carpeta "frontend", ejecuta:

npm run lint
npm run build

Las pruebas automatizadas básicas del backend están diseñadas para no modificar la base de datos local.

Las pruebas de integración que requieran PostgreSQL deberán utilizar un entorno o una base de pruebas independiente.

11. Documentación de la API REST

El contrato de la API se encuentra en:

backend/docs/api/openapi.yaml

Las rutas del backend utilizan el prefijo:

/api/v1

La autenticación se realiza mediante JWT.

Las rutas protegidas requieren enviar el token en la cabecera HTTP:

Authorization: Bearer TOKEN

Las operaciones de clientes, pedidos y pagos requieren autenticación.

Las operaciones administrativas dependen de los permisos del rol.

12. Archivos que no se deben subir a GitHub

Los archivos ".env" contienen contraseñas y configuraciones privadas.

Las carpetas "node_modules" contienen dependencias que cada integrante puede instalar utilizando npm.

Las carpetas "dist" contienen archivos generados durante la compilación.

Estos elementos deben mantenerse fuera del control de versiones mediante ".gitignore".

En cambio, los archivos "package.json", "package-lock.json" y ".env.example" deben mantenerse actualizados en GitHub.

13. Trabajo colaborativo con Git y Jira

El equipo utiliza una estrategia de trabajo basada en GitFlow.

La rama "main" contiene las versiones estables.

La rama "develop" concentra los cambios integrados.

Cada tarea se desarrolla en una rama independiente cuyo nombre contiene el identificador de Jira.

Ejemplo:

feature/G3PRC-29

Los cambios se incorporan a "develop" mediante Pull Requests.

Antes de fusionar una tarea, deben comprobarse la compilación, las pruebas pertinentes y los criterios de aceptación de Jira.

14. Solución de problemas frecuentes

Error de conexión a PostgreSQL: comprueba que el servicio esté iniciado y que las credenciales de "backend/.env" sean correctas.

La base de datos no existe: créala desde pgAdmin 4 con el nombre "puro_relleno_cupcake".

Falta JWT_SECRET: genera una clave y agrégala al archivo "backend/.env".

El login no funciona: comprueba que existe un usuario administrador y que utilizas sus credenciales, no las de PostgreSQL.

Error 401: la operación requiere una sesión válida.

Error 403: el usuario está autenticado, pero no tiene permiso para esa operación.

Error 404 en una API: comprueba la ruta y que esté registrada en Express.

El frontend no muestra pedidos: comprueba que el backend esté encendido, que PostgreSQL tenga registros y que hayas iniciado sesión.

El catálogo está vacío: comprueba si existen productos registrados en la base de datos local.

El puerto está ocupado: comprueba que no tengas otro servidor utilizando los puertos 3000 o 5173.

15. Consideraciones para el despliegue

La configuración descrita en este documento corresponde al entorno local de desarrollo.

Antes de publicar el sistema deben revisarse la gestión de sesiones, las cookies seguras, los permisos, las migraciones de base de datos, las copias de seguridad y la configuración de producción.

No se deben utilizar contraseñas de desarrollo ni datos ficticios como si fueran información de clientes reales.

Equipo

Grupo 3 – Puro Relleno Cupcake

SENATI – Fullstack Developer Software, 2026-II.