# Backend - Puro Relleno Cupcake

Backend inicial del sistema Puro Relleno Cupcake, desarrollado con Node.js, Express y TypeScript.

## Requisitos

- Node.js
- npm

## Instalación

Desde la carpeta `backend`:

```bash
npm install
```


## Configuración de PostgreSQL

Para ejecutar el backend se requiere PostgreSQL y una base de datos local.

1. Instalar PostgreSQL y pgAdmin 4.
2. Crear una base de datos con el siguiente nombre:

```text
puro_relleno_cupcake
```

3. Crear un archivo `.env` dentro de la carpeta `backend`, tomando como referencia `.env.example`.
4. Completar las credenciales locales de PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=puro_relleno_cupcake
DB_USER=postgres
DB_PASSWORD=TU_CONTRASENA_DE_POSTGRESQL
```

El archivo `.env` contiene información privada y no debe subirse al repositorio.

Al iniciar el backend, Sequelize verificará la conexión con PostgreSQL. Si la configuración es correcta, se mostrará el mensaje de conexión exitosa.


## Ejecución en desarrollo

```bash
npm run dev
```

El servidor se iniciará por defecto en:

```text
http://localhost:3000
```

## Compilación

```bash
npm run build
```

Los archivos compilados se generan en la carpeta `dist`.

## Ejecución compilada

```bash
npm start
```

## Ruta de prueba

```text
GET /api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "message": "Backend de Puro Relleno Cupcake operativo"
}
```

## Estructura inicial

```text
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── app.ts
└── server.ts
```