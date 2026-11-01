Catálogo de productos — Puro Relleno Cupcake

Descripción

Este módulo contiene la interfaz del catálogo de productos del sistema Puro Relleno Cupcake.

Fue desarrollado con React, TypeScript y CSS como parte de la tarea G3PRC-15.

Permite visualizar productos, realizar búsquedas por nombre y filtrar por categoría.

Funcionalidades implementadas

La interfaz presenta los productos mediante tarjetas reutilizables que incluyen imagen, nombre, descripción, categoría, precio base y disponibilidad.

La búsqueda permite encontrar productos por nombre sin distinguir entre mayúsculas, minúsculas y tildes.

El filtro por categoría permite mostrar únicamente los productos pertenecientes a la categoría seleccionada.

También se implementaron estados visuales de carga, error y ausencia de resultados.

La interfaz cuenta con un diseño adaptable a computadoras, tabletas y dispositivos móviles.

Estructura del módulo

"ProductCatalogPage.tsx": contiene la pantalla principal del catálogo, la búsqueda y los filtros.

"ProductCatalogPage.css": contiene los estilos de la interfaz.

"components/ProductCard.tsx": componente reutilizable para mostrar información de cada producto.

"components/ProductCard.css": estilos de las tarjetas.

"types/Product.ts": define las propiedades de un producto mediante TypeScript.

"data/products.ts": contiene productos ficticios para demostración.

"examples/CatalogDemo.tsx": permite probar el catálogo y simular sus diferentes estados.

"examples/main.tsx": inicia React para la página de demostración.

El archivo "catalogo-demo.html" se encuentra directamente dentro de "frontend".

Datos de demostración

Actualmente se utilizan seis productos ficticios.

Los nombres, categorías, precios y disponibilidades son ilustrativos y no representan necesariamente la información real de la pastelería.

La imagen utilizada es un recurso gráfico de demostración.

La información podrá reemplazarse posteriormente mediante la integración con la API REST correspondiente.

Componentes reutilizados

El catálogo utiliza componentes desarrollados previamente en G3PRC-11.

Se reutilizan "Card", "Badge", "Input", "Select" y "Alert".

Esto permite mantener una apariencia consistente y evitar la duplicación de código.

Ejecución

Desde la carpeta "frontend", ejecutar:

"npm run dev"

Después abrir en el navegador:

"http://localhost:5173/catalogo-demo.html"

Si Vite utiliza otro puerto, debe utilizarse el indicado en la terminal.

La página de demostración está preparada para el entorno de desarrollo y no está incluida actualmente como entrada independiente en la compilación de producción.

Pruebas

Se verificó la búsqueda de productos por nombre y el filtro por categoría.

También se comprobaron los mensajes de ausencia de resultados y los estados simulados de carga y error.

Se revisó la visualización de los productos en diferentes tamaños de pantalla.

Los comandos utilizados para verificar el código son:

"npm run build"

"npm run lint"

Integración futura

El componente "ProductCatalogPage" recibe los productos mediante propiedades tipadas con TypeScript.

Esto permite integrarlo posteriormente con los servicios del backend.

La conexión real con la API REST corresponde a otra tarea del proyecto.

Este módulo no configura rutas ni modifica React Router. La integración con la navegación principal podrá realizarse cuando se complete G3PRC-9.

Información del desarrollo

Tarea Jira: G3PRC-15

Rama: "feature/G3PRC-15"

Estado: Implementación de interfaz completada, pendiente de integración a develop.