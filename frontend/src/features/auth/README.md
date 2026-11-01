Interfaz de inicio de sesión - Puro Relleno Cupcake

Descripción

Esta carpeta contiene la interfaz de inicio de sesión del sistema Puro Relleno Cupcake.

La implementación corresponde a la tarea G3PRC-13 y está desarrollada con React, TypeScript y CSS.

La pantalla utiliza los componentes reutilizables creados en G3PRC-11.

Funcionalidades implementadas

El formulario permite ingresar un correo electrónico y una contraseña.

Incluye validaciones para detectar campos vacíos y comprobar el formato básico del correo electrónico.

También permite mostrar y ocultar la contraseña, visualizar mensajes de error y representar un estado de carga.

La interfaz cuenta con un diseño adaptable a diferentes tamaños de pantalla.

Componentes reutilizados

Se utilizan los componentes Button, Input, Card y Alert, disponibles en "frontend/src/components".

Archivos principales

"LoginPage.tsx": contiene la interfaz y el comportamiento del formulario.

"LoginPage.css": contiene los estilos de la pantalla.

"login-demo-main.tsx": permite visualizar el formulario independientemente de React Router.

"login-demo.html": página HTML de demostración, ubicada en la carpeta principal del frontend.

Ejecución

Desde la carpeta "frontend", ejecutar:

npm run dev

Abrir en el navegador:

http://localhost:5173/login-demo.html

Si Vite utiliza otro puerto, reemplazarlo por el indicado en la terminal.

Validaciones

El formulario comprueba que el correo electrónico y la contraseña no estén vacíos.

También realiza una validación básica del formato del correo electrónico.

Los mensajes de error se muestran mediante los componentes visuales correspondientes.

Estado actual

Esta implementación corresponde únicamente a la interfaz de usuario.

El formulario simula brevemente un estado de carga después de superar las validaciones.

Todavía no realiza autenticación real, no envía credenciales al servidor y no genera sesiones de usuario.

La integración con el backend y la gestión de autenticación se realizarán en las tareas correspondientes.

Integración con React Router

El componente LoginPage puede importarse posteriormente en la configuración de React Router para utilizarse en la ruta "/login".

La integración con las rutas corresponde a G3PRC-9.

No se modificaron los archivos principales de navegación.

Verificaciones

Se utilizan los siguientes comandos:

npm run build
npm run lint

También se realizaron pruebas manuales del formulario, las validaciones y su visualización en diferentes tamaños de pantalla.

Información de Jira

Tarea: G3PRC-13

Rama: "feature/G3PRC-13"