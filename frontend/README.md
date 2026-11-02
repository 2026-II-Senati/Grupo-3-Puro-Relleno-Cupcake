Puro Relleno Cupcake – Frontend

Aplicación web para la gestión de pedidos personalizados de la pastelería Puro Relleno Cupcake.

Este frontend forma parte del proyecto desarrollado por el Grupo 3 del curso Fullstack Developer de SENATI.

Tecnologías utilizadas

El frontend utiliza React, TypeScript y Vite.

ESLint se utiliza para revisar la calidad y consistencia del código.

Requisitos

Tener instalado Node.js y npm.

Instalación

Desde la carpeta principal del repositorio, ingresar al directorio del frontend:

cd frontend

Instalar las dependencias:

npm install

Ejecutar el proyecto

Para iniciar el servidor de desarrollo:

npm run dev

Abrir en el navegador la dirección local que indique Vite.

Comandos disponibles

"npm run dev": inicia el servidor de desarrollo.

"npm run build": verifica TypeScript y genera la compilación de producción.

"npm run lint": ejecuta ESLint para revisar el código.

"npm run preview": permite visualizar localmente la compilación generada.

Estructura inicial

La carpeta "src" contiene la estructura principal de la aplicación.

"assets/": recursos estáticos utilizados por los componentes.

"components/": componentes reutilizables de React.

"pages/": páginas correspondientes a los módulos del sistema.

"services/": servicios para la comunicación con las API REST del backend.

"types/": interfaces y tipos compartidos de TypeScript.

"App.tsx": componente principal de React.

"App.css": estilos del componente principal.

"index.css": estilos generales de la aplicación.

"main.tsx": punto de entrada de React.

Organización del desarrollo

El proyecto utiliza GitFlow para organizar el trabajo colaborativo.

La rama "main" contiene las versiones estables del proyecto.

La rama "develop" se utiliza para integrar los cambios del equipo.

Cada actividad de Jira se desarrolla en una rama independiente con el formato:

"feature/G3PRC-n"

Los cambios se integran a "develop" mediante Pull Requests revisados por otro integrante.

Estado del frontend

La estructura inicial del frontend se encuentra en preparación.

Las funcionalidades de navegación, autenticación, catálogo, pedidos, agenda y pagos se desarrollarán progresivamente mediante las actividades correspondientes de Jira.

Equipo

Grupo 3 – Puro Relleno Cupcake.

SENATI – Fullstack Developer.