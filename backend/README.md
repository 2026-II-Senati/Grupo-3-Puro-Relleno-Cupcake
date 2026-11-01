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