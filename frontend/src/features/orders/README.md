Formulario de pedidos personalizados — Puro Relleno Cupcake

Descripción

Este módulo contiene la interfaz para registrar pedidos personalizados del sistema Puro Relleno Cupcake.

Fue desarrollado utilizando React, TypeScript y CSS como parte de la tarea G3PRC-17.

La pantalla se encuentra integrada con React Router mediante la ruta "/pedidos/nuevo".

Funcionalidades implementadas

El formulario permite ingresar los datos de contacto del cliente, seleccionar un producto del catálogo y especificar la cantidad solicitada.

Incluye campos de personalización para sabor, relleno, tamaño, decoración, mensaje personalizado y observaciones adicionales.

También permite seleccionar entre recogida en el establecimiento y entrega a domicilio.

Cuando se selecciona entrega a domicilio, aparece un campo adicional para introducir la dirección.

Resumen del pedido

La interfaz muestra un resumen preliminar que se actualiza mientras el usuario completa el formulario.

Incluye el producto seleccionado, la cantidad, el sabor, la modalidad de entrega, la fecha y un subtotal base referencial.

El subtotal se calcula utilizando el precio base del producto y la cantidad solicitada.

No representa un precio definitivo, ya que todavía no contempla los posibles costos de personalización, entrega u otros ajustes comerciales.

Validaciones

Se implementaron validaciones para los nombres y apellidos del cliente, el teléfono, el formato del correo electrónico cuando se proporciona y la selección del producto.

La cantidad debe ser un número entero mayor que cero.

También se comprueban los campos obligatorios de personalización.

La dirección es obligatoria cuando se selecciona entrega a domicilio.

La fecha de entrega no puede ser anterior a la fecha actual.

Estructura del módulo

"CreateOrderPage.tsx": interfaz principal del formulario y administración de su estado.

"CreateOrderPage.css": estilos de la pantalla y adaptación a dispositivos móviles.

"types/OrderForm.ts": tipos TypeScript y valores iniciales del formulario.

"utils/validateOrderForm.ts": funciones de validación.

Componentes reutilizados

El formulario utiliza Button, Input, Select, Card y Alert, desarrollados previamente en G3PRC-11.

También utiliza temporalmente los productos de demostración del catálogo desarrollado en G3PRC-15.

Navegación

La pantalla está disponible en la ruta "/pedidos/nuevo".

Se puede acceder desde la página "/pedidos".

La configuración de navegación utiliza React Router.

Estado actual

Esta implementación corresponde únicamente al frontend.

El formulario permite introducir datos, validar campos y revisar un resumen preliminar.

Todavía no registra pedidos en PostgreSQL ni envía solicitudes a la API REST.

La conexión con el backend se realizará en la tarea de integración correspondiente.

Los productos, sabores, tamaños y precios actuales son ilustrativos y deberán adaptarse a las reglas reales de la pastelería.

Ejecución

Desde la carpeta "frontend", ejecutar:

npm run dev

Abrir en el navegador:

http://localhost:5173/pedidos/nuevo

Si Vite utiliza otro puerto, debe utilizarse el indicado en la terminal.

Verificaciones

Para comprobar el proyecto:

npm run build
npm run lint

También se deben realizar pruebas manuales de los campos obligatorios, cantidades, fechas, modalidad de entrega, resumen y diseño adaptable.

Información del proyecto

Tarea Jira: G3PRC-17

Rama de desarrollo: feature/G3PRC-17

Estado: Interfaz implementada, pendiente de revisión e integración.