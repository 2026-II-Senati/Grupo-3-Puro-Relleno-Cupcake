Catálogo de productos — Puro Relleno Cupcake

Descripción

Este módulo contiene la interfaz del catálogo de productos del sistema Puro Relleno Cupcake.

Fue desarrollado utilizando React, TypeScript y CSS como parte de G3PRC-15.

Actualmente se encuentra integrado con React Router mediante la ruta "/catalogo".

Funcionalidades

El catálogo permite visualizar productos mediante tarjetas que incluyen imagen, nombre, descripción, categoría, precio base y disponibilidad.

Se implementó una búsqueda por nombre que no distingue entre mayúsculas, minúsculas y tildes.

También se incorporó un filtro por categoría.

La interfaz contempla estados de carga, error y ausencia de resultados.

Cuenta con un diseño adaptable a computadoras, tabletas y dispositivos móviles.

Estructura

"ProductCatalogPage.tsx": pantalla principal del catálogo y lógica de filtrado.

"ProductCatalogPage.css": estilos de la interfaz.

"components/ProductCard.tsx": representación individual de los productos.

"components/ProductCard.css": estilos de las tarjetas.

"types/Product.ts": definición del modelo de producto.

"data/products.ts": datos ficticios utilizados temporalmente.

La ruta "/catalogo" se configura en "src/App.tsx".

Componentes reutilizados

Se utilizan Card, Badge, Input, Select y Alert, desarrollados anteriormente en G3PRC-11.

Datos actuales

El catálogo utiliza seis productos ficticios.

Los precios, nombres, categorías y disponibilidades son ilustrativos.

Las imágenes también son recursos de demostración.

Estos datos serán sustituidos posteriormente mediante la integración con la API REST del backend.

Ejecución

Desde la carpeta "frontend", ejecutar:

npm run dev

Abrir en el navegador:

http://localhost:5173/catalogo

Si Vite utiliza otro puerto, utilizar el indicado en la terminal.

Integración con React Router

El componente "ProductCatalogPage" está integrado mediante la ruta "/catalogo".

Se accede a él desde la barra de navegación principal.

La integración conserva las rutas existentes de Dashboard, Pedidos, Agenda y Pagos.

Integración futura

Actualmente se utilizan datos locales.

La conexión con los servicios reales del backend se realizará en la tarea de integración correspondiente.

El componente acepta una colección de productos tipada mediante TypeScript.

Verificaciones

npm run build
npm run lint

También deben comprobarse manualmente la búsqueda, el filtrado, los mensajes de estado y la visualización en dispositivos móviles.

Información del proyecto

Tarea del catálogo: G3PRC-15.

Tarea de navegación: G3PRC-9.

Rama de integración: develop.