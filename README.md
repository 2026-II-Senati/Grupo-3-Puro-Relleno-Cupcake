# 🧁 Puro Relleno Cupcake

**Sistema web de gestión de pedidos personalizados**  
Proyecto académico de **SENATI – Fullstack Developer Software, 2026-II**  
**Equipo:** Grupo 3 · --show**Repositorio:** `2026-II-Senati/Grupo-3-Puro-Relleno-Cupcake`

## 1. ¿Qué hace el sistema?

Puro Relleno Cupcake permite gestionar productos de repostería, fotografías, clientes, pedidos personalizados, estados de producción, agenda de entregas o recogidas, pagos y adelantos. Incluye autenticación por correo y contraseña con JWT y permisos según el rol del usuario.

El frontend utiliza **React, TypeScript, Vite y React Router**. El backend utiliza **Node.js, Express, TypeScript, Sequelize y PostgreSQL**. Las pruebas del backend se ejecutan con **Vitest y Supertest**.

Las imágenes decorativas de la web (logo, favicon y banners) se encuentran en `frontend/public/`. Las fotografías que se suben desde el administrador de productos se almacenan en **PostgreSQL**, en `product_images`, y se recuperan mediante la API.

> **Importante:** este repositorio comparte código y, cuando se haya generado, un catálogo de demostración. **No es una base de datos compartida en tiempo real**: cada integrante utiliza su propio PostgreSQL local. Los cambios que alguien haga en su base no se replican automáticamente en las demás computadoras.

## 2. Requisitos

Instalar **Git**, **Node.js** (recomendado: versión 22.12 o superior), **npm**, **PostgreSQL** (se utiliza PostgreSQL 18 en los comandos de ejemplo), **pgAdmin 4** y un editor como WebStorm o Visual Studio Code.

Comprobar en PowerShell:

```powershell
node -v
npm -v
git --version
```

PostgreSQL debe estar instalado y con su servicio encendido. Las rutas `C:\Program Files\PostgreSQL\18\bin\...` deben ajustarse si se ha instalado otra versión o ubicación.

## 3. Descargar el proyecto desde GitHub

Abrir PowerShell en la carpeta donde se desea instalar el repositorio y ejecutar:

```powershell
git clone https://github.com/2026-II-Senati/Grupo-3-Puro-Relleno-Cupcake.git
cd Grupo-3-Puro-Relleno-Cupcake
git switch develop
git pull --ff-only origin develop
```

**`main`** contiene versiones estables. **`develop`** integra el trabajo del equipo. Las tareas se desarrollan en ramas `feature/` y llegan a `develop` mediante Pull Requests.

## 4. Instalar las dependencias

Desde la raíz del repositorio:

```powershell
cd backend
npm ci
cd ../frontend
npm ci
cd ..
```

`npm ci` instala las versiones registradas en `package-lock.json`. No se debe copiar ni subir `node_modules/`.

## 5. Crear una base de datos local en pgAdmin 4

Abrir **pgAdmin 4**, conectarse al servidor PostgreSQL, hacer clic derecho en **Databases → Create → Database**, asignar el nombre **`puro_relleno_cupcake`** y seleccionar como propietario el usuario local de PostgreSQL (habitualmente `postgres`). Guardar.

Como alternativa, desde Query Tool conectado a la base `postgres`:

```sql
CREATE DATABASE puro_relleno_cupcake;
```

Utilizar **solo uno de los dos métodos**.

No es necesario crear las tablas a mano. El backend registra los modelos de Sequelize y, al arrancar, ejecuta la sincronización en el entorno de desarrollo. Entre las tablas se encuentran `clients`, `products`, `product_images`, `orders`, `order_details`, `payments`, `roles` y `users`.

> Este mecanismo es para desarrollo. No sustituye a las migraciones controladas que se requieren en producción.

## 6. Configurar `backend/.env`

Desde la carpeta principal:

```powershell
Copy-Item backend/.env.example backend/.env
```

Abrir `backend/.env` en WebStorm y completar los valores:

```dotenv
NODE_ENV=development
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=puro_relleno_cupcake
DB_USER=postgres
DB_PASSWORD=REEMPLAZAR_CON_MI_CONTRASENA_LOCAL

JWT_SECRET=REEMPLAZAR_CON_UNA_CLAVE_ALEATORIA
```

Cada integrante utiliza **su propia contraseña de PostgreSQL**. Si el servidor, usuario o puerto son distintos, ajustar `DB_HOST`, `DB_USER` y `DB_PORT`.

Para generar una clave JWT aleatoria, ejecutar:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Copiar el resultado en `JWT_SECRET`. **No publicar ni subir `backend/.env`, claves JWT ni contraseñas**. El archivo `backend/.env.example` sí debe permanecer en GitHub.

## 7. Iniciar el backend y crear las tablas

En una terminal situada en la carpeta raíz:

```powershell
cd backend
npm run dev
```

Esperar los mensajes de conexión a PostgreSQL y sincronización de modelos. Comprobar la API:

`http://127.0.0.1:3000/api/health`

La respuesta debe contener `"status": "ok"`. Mantener esta terminal encendida mientras se usa la aplicación.

### Si el equipo va a restaurar el catálogo de demostración

Primero ejecutar el backend una vez para que las tablas estén creadas; luego detenerlo con **Ctrl + C**. **Restaurar el catálogo únicamente sobre una base de desarrollo recién creada con las tablas `products` y `product_images` vacías**, siguiendo la sección 8. Al terminar, volver a iniciar el backend.

## 8. Compartir e importar el catálogo con fotografías

### 8.1. Qué contiene el respaldo

Cuando se publique el archivo **`database/catalogo_demo.dump`**, contendrá exclusivamente los registros de `products` y `product_images`: nombres, descripciones, categorías, precios, disponibilidad e imágenes subidas al administrador. **No incluye** cuentas, hashes de contraseñas, clientes, pedidos ni pagos.

Las fotografías no se copian por separado: están almacenadas en la columna `image_data` (`BYTEA`) de PostgreSQL. El código las ofrece mediante `/api/v1/products/:id/image`.

**Si `database/catalogo_demo.dump` todavía no aparece en GitHub**, es porque aún no se ha generado y publicado el respaldo. El responsable del catálogo debe completar la sección 8.3 antes de que los demás puedan restaurarlo.

### 8.2. Restaurar el catálogo en la computadora de un compañero

Antes de comenzar, confirmar que la base local **`puro_relleno_cupcake`** ya existe y que el backend creó sus tablas, pero **no hay productos ni imágenes propios** que se necesite conservar. No usar este procedimiento sobre datos importantes.

Desde la **raíz del repositorio** ejecutar:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_restore.exe" -h 127.0.0.1 -p 5432 -U postgres -W -d puro_relleno_cupcake --data-only --no-owner --no-privileges --exit-on-error --single-transaction "database\catalogo_demo.dump"
```

Escribir la contraseña **local** de PostgreSQL cuando se solicite. Si la restauración devuelve algún error, **no continuar como si se hubiera completado**: comprobar el mensaje, verificar que las tablas estén vacías y corregir el problema antes de intentarlo de nuevo.

**Paso adicional imprescindible: actualizar la secuencia de identificadores** para que los siguientes productos se registren con un ID libre. Ejecutar desde PowerShell:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h 127.0.0.1 -p 5432 -U postgres -d puro_relleno_cupcake -c "SELECT setval(pg_get_serial_sequence('public.products', 'id'), COALESCE((SELECT MAX(id) FROM public.products), 1), EXISTS (SELECT 1 FROM public.products));"
```

Comprobar en pgAdmin 4 → **Query Tool**:

```sql
SELECT COUNT(*) AS total_productos FROM public.products;
SELECT COUNT(*) AS total_imagenes FROM public.product_images;
```

Cuando se inicie React y Express, los productos importados deben aparecer en **Catálogo** con sus fotografías. **Importar el catálogo no crea usuarios**: completar la sección 9 para poder iniciar sesión.

### 8.3. Generar o actualizar el catálogo (responsable del proyecto)

**Solo hacerlo desde la base de desarrollo que contiene los productos y fotografías de demostración que queremos compartir**, sin datos de clientes o archivos que no tengamos derecho a distribuir.

En PowerShell, desde la **raíz del repositorio**:

```powershell
New-Item -ItemType Directory -Force database
& "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -h 127.0.0.1 -p 5432 -U postgres -W -d puro_relleno_cupcake -Fc --data-only -t public.products -t public.product_images -f "database\catalogo_demo.dump"
```

Comprobar que el archivo se creó y contiene datos de las dos tablas:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_restore.exe" -l "database\catalogo_demo.dump"
Get-Item "database\catalogo_demo.dump" | Select-Object Name, Length
```

El comando de exportación anterior **selecciona solo las dos tablas**, no toda la base. Para evitar conflictos con IDs al importar, los compañeros deben ejecutar la actualización de secuencia indicada en la sección 8.2.

Antes de subirlo, revisar que solo contenga contenido de demostración y comprobar su tamaño. GitHub no admite archivos Git ordinarios de **100 MB o más**; si se acerca a ese límite, no incluir el respaldo directamente en Git y acordar un medio alternativo para compartirlo.

> **Atención:** restaurar un nuevo respaldo sobre una base que ya contiene productos puede provocar identificadores duplicados. Los compañeros que tengan información propia deben conservarla y utilizar una **nueva base de demostración** para probar la nueva versión del catálogo. Actualizar el archivo `.dump` en GitHub **no modifica automáticamente** las bases existentes.

## 9. Crear usuarios de prueba y sus roles

**Cada integrante crea sus propias cuentas en su base local.** Ningún usuario viene dentro de `catalogo_demo.dump`. Antes de ejecutar los scripts, iniciar el backend al menos una vez para crear `roles` y `users`.

Los permisos del backend se distribuyen así:

| Rol | Nombre interno | Funciones principales |
| --- | --- | --- |
| Administrador | `admin` | Productos e imágenes, clientes, pedidos, estados y pagos |
| Atención al cliente | `customer_service` | Clientes, nuevos pedidos, consultas y pagos; no cambia estados de producción |
| Producción | `production` | Consulta pedidos y actualiza sus estados; no registra pedidos ni pagos |

### 9.1. Crear el administrador

Abrir una **nueva terminal PowerShell** en `backend/`. Se pueden usar los siguientes correos de ejemplo u otros que cada integrante elija:

```powershell
$env:BOOTSTRAP_ADMIN_NAME = "Administrador de prueba"
$env:BOOTSTRAP_ADMIN_EMAIL = "admin@ejemplo.test"
$secure = Read-Host "Contraseña del administrador (mínimo 12 caracteres)" -AsSecureString
$env:BOOTSTRAP_ADMIN_PASSWORD = [System.Net.NetworkCredential]::new("", $secure).Password
try {
    npx tsx src/scripts/createAdmin.ts
}
finally {
    Remove-Item Env:BOOTSTRAP_ADMIN_PASSWORD,Env:BOOTSTRAP_ADMIN_EMAIL,Env:BOOTSTRAP_ADMIN_NAME -ErrorAction SilentlyContinue
    Remove-Variable secure -ErrorAction SilentlyContinue
}
```

El script utiliza bcrypt para guardar **el hash**, no la contraseña en texto claro. Si indica que ya existe el correo, no lo ejecutes de nuevo con la misma dirección.

### 9.2. Crear la cuenta de Atención al cliente

En la misma terminal, desde `backend/`:

```powershell
$env:BOOTSTRAP_USER_NAME = "Atención al cliente"
$env:BOOTSTRAP_USER_EMAIL = "atencion@ejemplo.test"
$env:BOOTSTRAP_USER_ROLE = "customer_service"
$secure = Read-Host "Contraseña de Atención al cliente (mínimo 12 caracteres)" -AsSecureString
$env:BOOTSTRAP_USER_PASSWORD = [System.Net.NetworkCredential]::new("", $secure).Password
try {
    npx tsx src/scripts/createUser.ts
}
finally {
    Remove-Item Env:BOOTSTRAP_USER_PASSWORD,Env:BOOTSTRAP_USER_EMAIL,Env:BOOTSTRAP_USER_NAME,Env:BOOTSTRAP_USER_ROLE -ErrorAction SilentlyContinue
    Remove-Variable secure -ErrorAction SilentlyContinue
}
```

### 9.3. Crear la cuenta de Producción

```powershell
$env:BOOTSTRAP_USER_NAME = "Personal de producción"
$env:BOOTSTRAP_USER_EMAIL = "produccion@ejemplo.test"
$env:BOOTSTRAP_USER_ROLE = "production"
$secure = Read-Host "Contraseña de Producción (mínimo 12 caracteres)" -AsSecureString
$env:BOOTSTRAP_USER_PASSWORD = [System.Net.NetworkCredential]::new("", $secure).Password
try {
    npx tsx src/scripts/createUser.ts
}
finally {
    Remove-Item Env:BOOTSTRAP_USER_PASSWORD,Env:BOOTSTRAP_USER_EMAIL,Env:BOOTSTRAP_USER_NAME,Env:BOOTSTRAP_USER_ROLE -ErrorAction SilentlyContinue
    Remove-Variable secure -ErrorAction SilentlyContinue
}
```

Las cuentas pueden utilizar cualquier contraseña que cumpla los requisitos, pero **se recomienda que cada cuenta tenga una contraseña distinta**. Usar la misma contraseña no cambia su rol; el rol depende de la relación del usuario con la tabla `roles`.

### 9.4. Comprobar usuarios en PostgreSQL

```sql
SELECT u.id, u.full_name, u.email, r.name AS rol, u.is_active
FROM public.users AS u
JOIN public.roles AS r ON r.id = u.role_id
ORDER BY u.id;
```

La consulta no muestra contraseñas ni hashes.

## 10. Iniciar el frontend y entrar al sistema

Dejar encendido el backend (`npm run dev` desde `backend/`). En **otra terminal**, desde la raíz:

```powershell
cd frontend
npm run dev
```

Abrir `http://127.0.0.1:5173/login` e iniciar sesión con el correo y contraseña de una cuenta creada en la sección 9. Vite envía las solicitudes `/api` al backend local `http://127.0.0.1:3000`.

Rutas principales:

| Pantalla | URL |
| --- | --- |
| Iniciar sesión | `/login` |
| Dashboard | `/dashboard` |
| Catálogo | `/catalogo` |
| Administrar productos e imágenes | `/productos/admin` |
| Gestión de pedidos | `/pedidos` |
| Registrar un pedido | `/pedidos/nuevo` |
| Agenda | `/agenda` |
| Pagos | `/pagos` |

La autorización real se verifica en **Express**. Ocultar un botón en React no sustituye los controles de permisos del backend.

## 11. Registrar productos personalizados y sus fotografías

Iniciar sesión como **Administrador** y abrir `http://127.0.0.1:5173/productos/admin`.

El formulario permite escribir el **nombre**, **descripción**, **categoría**, **precio base**, **disponibilidad** y elegir una **fotografía** JPG/PNG/WebP de hasta 3 MB. La fotografía se procesa como WebP y se guarda en `product_images`.

También existe un recuadro para **pegar una ficha JSON de un producto y rellenar automáticamente el formulario**, por ejemplo:

```json
{
  "name": "Cupcake de cumpleaños personalizado",
  "description": "Cupcake personalizado: elegir sabor, relleno, colores y dedicatoria al registrar el pedido.",
  "category": "Cupcakes personalizados",
  "basePrice": 12.00,
  "isAvailable": true
}
```

El precio mostrado es **ilustrativo**. Revisar siempre los datos antes de guardar. La ficha JSON rellena los campos, pero **no registra el producto automáticamente**: todavía hay que elegir la fotografía y pulsar **Registrar producto**.

Al cargar la imagen, el backend ofrece la dirección `/api/v1/products/{id}/image`. No copiar estas fotos a `frontend/public/`: se encuentran en PostgreSQL y, si se desean compartir, deben incluirse en `catalogo_demo.dump`.

Las **imágenes decorativas de la interfaz** (logo, favicon y fondos) sí se guardan en `frontend/public/` y se comparten directamente por Git. El logotipo principal se encuentra en `frontend/public/logo-header.png` y el favicon en `frontend/public/favicon.png`.

Los detalles de personalización del pedido (p. ej., sabor, relleno, tamaño, colores, decoración y dedicatoria) se indican al **registrar el pedido**; el formulario actual no define opciones independientes para cada producto. El precio base tampoco se recalcula automáticamente por cada variante.

## 12. Verificar que la aplicación funcione

Con backend y frontend activos, comprobar que el login sea correcto, que el catálogo muestre imágenes, que el administrador pueda registrar productos, que Atención al cliente pueda crear pedidos y que Producción pueda consultar pedidos y actualizar sus estados.

**Pruebas y compilación del backend:**

```powershell
cd backend
npm test
npm run build
```

**Comprobación del frontend (en otra terminal o después de volver a la raíz):**

```powershell
cd frontend
npm run lint
npm run build
```

El comando `npm test` ejecuta las pruebas de Vitest. `npm run test:watch` permite repetirlas durante el desarrollo. Las pruebas existentes se diseñaron para no modificar los registros del PostgreSQL local; las futuras pruebas de integración con base de datos deben utilizar una **base de pruebas separada**.

## 13. Actualizar el código con GitHub, GitFlow y Jira

Cada integrante trabaja en una rama propia basada en `develop` y asociada a una tarea de Jira. **Nunca desarrollar cambios directamente en `main`.**

Para iniciar una tarea nueva sin modificaciones locales pendientes:

```powershell
git switch develop
git pull --ff-only origin develop
git switch -c feature/G3PRC-XX
```

Reemplazar `G3PRC-XX` por el identificador real de Jira. Realizar los cambios, ejecutar las pruebas y, antes de guardar:

```powershell
git status
git diff --check
```

Ejemplo de commit de documentación:

```powershell
git add README.md backend/README.md
git diff --cached --name-only
git diff --cached --check
git commit -m "docs: actualizar guia de instalacion y uso del equipo"
git push -u origin HEAD
```

Si se cambia el backend, frontend o el catálogo, conviene realizar **commits separados por tipo de cambio**. Revisar qué archivos se van a subir con `git diff --cached --name-only` antes de cada commit. No agregar nunca `.env`, credenciales o bases completas con información privada.

Después, en GitHub, crear un **Pull Request** con rama base `develop` y rama de comparación `feature/G3PRC-XX`. Esperar la revisión del equipo y fusionarlo cuando cumpla las pruebas y los criterios de aceptación.

Los demás integrantes reciben el código integrado así:

```powershell
git switch develop
git pull --ff-only origin develop
cd backend
npm ci
cd ../frontend
npm ci
```

**`git pull` no importa archivos `.dump` en PostgreSQL.** Si un compañero todavía no tiene catálogo, debe seguir la sección 8.2. Si ya tiene datos propios, no debe restaurar el respaldo encima de ellos.

## 14. Documentación de la API

El contrato de la API REST está en `backend/docs/api/openapi.yaml`. Las rutas principales utilizan el prefijo `/api/v1`; el endpoint de salud es `/api/health`.

Las rutas protegidas reciben `Authorization: Bearer <TOKEN_JWT>`. Los permisos se comprueban en el backend, conforme al rol y a la operación solicitada. El login utiliza correo y contraseña, y las contraseñas se almacenan como hashes bcrypt.

## 15. Solución de problemas frecuentes

| Problema | Comprobación recomendada |
| --- | --- |
| PostgreSQL rechaza la conexión | Verificar servicio, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` en `backend/.env`. |
| La base de datos no existe | Crear `puro_relleno_cupcake` desde pgAdmin 4. |
| Faltan tablas | Iniciar `backend` con `npm run dev` y esperar la sincronización de Sequelize. |
| No existe `JWT_SECRET` | Generarlo como se explica en la sección 6. |
| No puedo iniciar sesión | Comprobar correo, contraseña y usuario activo; crear cuentas desde los scripts de la sección 9. |
| Error HTTP 401 | No hay sesión válida o el token no se ha enviado correctamente. |
| Error HTTP 403 | El usuario inició sesión, pero su rol no autoriza esa operación. |
| Catálogo vacío | Verificar `products`; importar `catalogo_demo.dump` si la base es nueva. |
| Fotografías que no aparecen | Verificar `product_images`, `image_url` y la ruta `/api/v1/products/:id/image`. |
| `pg_restore` indica duplicados | No restaurar sobre una base que ya tenga productos; utilizar una base nueva de demostración. |
| Error de clave duplicada al registrar un producto restaurado | Ejecutar el ajuste de secuencia de la sección 8.2. |
| La ruta del ejecutable PostgreSQL no existe | Sustituir `18` por la versión instalada y comprobar la carpeta `bin`. |
| El puerto está ocupado | Comprobar que no exista otro proceso utilizando `3000` o `5173`. |
| Un compañero hizo `git pull` pero no ve los productos | Git descarga el respaldo, pero no importa datos automáticamente. Restaurarlo siguiendo la sección 8.2. |

## 16. Seguridad y despliegue

Este README describe un **entorno local de desarrollo**. Nunca subir credenciales, archivos `.env`, respaldos reales de clientes, tokens, contraseñas ni información sensible a GitHub. Los archivos `node_modules/` y `dist/` también deben quedar fuera del repositorio; `package.json`, `package-lock.json` y `.env.example` sí deben versionarse.

Antes de desplegar el sistema públicamente habrá que definir migraciones de base de datos, gestión segura de sesiones, configuración de infraestructura, copias de seguridad y pruebas adicionales. Las credenciales y los ejemplos de este documento no deben usarse como cuentas de producción.

---

**Grupo 3 — Puro Relleno Cupcake**  
**SENATI · Fullstack Developer Software · 2026-II**
