Interfaz de inicio de sesión — Puro Relleno Cupcake

Descripción

Este módulo contiene la interfaz de inicio de sesión del sistema Puro Relleno Cupcake.

Fue desarrollado con React, TypeScript y CSS como parte de G3PRC-13.

La interfaz se encuentra integrada en la navegación principal mediante React Router.

Funcionalidades

El formulario permite ingresar correo electrónico y contraseña.

Incluye validaciones de campos obligatorios y comprobación básica del formato del correo electrónico.

Permite mostrar y ocultar la contraseña, visualizar mensajes de error y representar un estado de carga.

La pantalla cuenta con un diseño adaptable a dispositivos móviles.

Componentes reutilizados

Se utilizan los componentes Button, Input, Card y Alert, desarrollados en G3PRC-11.

Estructura

"LoginPage.tsx": implementación visual y comportamiento del formulario.

"LoginPage.css": estilos de la interfaz.

"src/pages/Login.tsx": componente que conecta la interfaz con React Router.

"src/App.tsx": configuración de la ruta de inicio de sesión.

Ejecución

Desde la carpeta "frontend", ejecutar:

npm run dev

Abrir en el navegador:

http://localhost:5173/login

Si Vite utiliza otro puerto, utilizar el indicado en la terminal.

Estado de la autenticación

Actualmente se implementa únicamente la interfaz de usuario.

El formulario realiza validaciones locales y simula brevemente un estado de carga.

Todavía no realiza autenticación real ni envía credenciales a una API.

La autenticación mediante JWT y la protección de rutas se implementarán en la tarea correspondiente.

Verificaciones

npm run build
npm run lint

También deben comprobarse manualmente las validaciones, la visualización de contraseña y la adaptación a distintos tamaños de pantalla.

Información del proyecto

Tarea de interfaz: G3PRC-13.

Tarea de navegación: G3PRC-9.

Rama de integración: develop.