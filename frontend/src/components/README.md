# Componentes reutilizables - Puro Relleno Cupcake

## Descripción

Esta carpeta contiene los componentes visuales reutilizables del frontend del sistema Puro Relleno Cupcake.

Los componentes están desarrollados con React y TypeScript, utilizan estilos CSS propios y están diseñados para reutilizarse en diferentes módulos de la aplicación.

Corresponden a la tarea G3PRC-11.

## Componentes disponibles

### Button

Botón reutilizable para ejecutar acciones.

Propiedades principales:

- `children`: contenido del botón.
- `variant`: `primary` o `secondary`.
- `disabled`: deshabilita el botón.
- `isLoading`: muestra el estado de carga.
- `onClick`: permite ejecutar una función al hacer clic.

Ejemplo:

```tsx
import Button from './components/Button/Button';

<Button onClick={() => console.log('Guardar')}>
  Guardar
</Button>

<Button variant="secondary">
  Cancelar
</Button>

<Button isLoading>
  Procesando
</Button>
```

### Input

Campo de entrada reutilizable para formularios.

Propiedades principales:

- `label`: etiqueta obligatoria del campo.
- `type`: tipo de entrada HTML.
- `placeholder`: texto de ejemplo.
- `error`: mensaje de error.
- `helperText`: texto de ayuda.
- `value` y `onChange`: permiten controlar su valor.

Ejemplo:

```tsx
import Input from './components/Input/Input';

<Input
  label="Correo electrónico"
  type="email"
  placeholder="correo@ejemplo.com"
  helperText="Ingresa tu correo electrónico"
/>
```

### Select

Lista desplegable reutilizable.

Propiedades principales:

- `label`: etiqueta obligatoria.
- `children`: opciones de la lista.
- `placeholder`: opción inicial.
- `error`: mensaje de error.
- `helperText`: texto de ayuda.
- `value` y `onChange`: permiten controlar la selección.

Ejemplo:

```tsx
import Select from './components/Select/Select';

<Select label="Estado del pedido" defaultValue="">
  <option value="pendiente">Pendiente</option>
  <option value="preparacion">En preparación</option>
  <option value="completado">Completado</option>
</Select>
```

### Card

Tarjeta reutilizable para presentar información.

Propiedades principales:

- `heading`: título opcional.
- `description`: descripción opcional.
- `children`: contenido principal.
- `footer`: contenido opcional al pie.

Ejemplo:

```tsx
import Card from './components/Card/Card';

<Card
  heading="Pedido"
  description="Información del pedido"
>
  <p>Pedido de cupcakes personalizados.</p>
</Card>
```

### Badge

Etiqueta visual para identificar estados o categorías.

Variantes disponibles:

- `default`
- `success`
- `warning`
- `danger`
- `info`

Ejemplo:

```tsx
import Badge from './components/Badge/Badge';

<Badge variant="success">
  Completado
</Badge>

<Badge variant="warning">
  Pendiente
</Badge>
```

### Alert

Componente reutilizable para mostrar mensajes.

Variantes disponibles:

- `success`
- `error`
- `warning`
- `info`

Propiedades principales:

- `title`: título opcional.
- `children`: contenido del mensaje.
- `variant`: tipo de mensaje.

Ejemplo:

```tsx
import Alert from './components/Alert/Alert';

<Alert
  variant="success"
  title="Pedido registrado"
>
  El pedido se guardó correctamente.
</Alert>
```

## Accesibilidad

Los componentes incluyen características básicas de accesibilidad, como etiquetas asociadas a los campos, indicadores de enfoque mediante teclado y atributos ARIA cuando corresponde.

Estas características deben verificarse al integrarlos en los formularios definitivos.

## Diseño adaptable

Los componentes utilizan estilos CSS propios y consideran su utilización en diferentes tamaños de pantalla.

La integración en cada página deberá respetar el diseño general del sistema.

## Demostración visual

Para visualizar los componentes durante el desarrollo:

Desde la carpeta `frontend`, ejecutar:

```bash
npm run dev
```

Después abrir:

http://localhost:5173/componentes-demo.html

Si Vite utiliza otro puerto, se debe utilizar el indicado en la terminal.

La página de demostración permite probar los seis componentes sin modificar la configuración de React Router.

Esta página está preparada para el entorno de desarrollo y no forma parte actualmente de la compilación de producción.

## Verificación

Los comandos para verificar el proyecto son:

```bash
npm run build
npm run lint
```

## Integración

Los componentes se encuentran en:

`frontend/src/components/`

Pueden importarse individualmente desde las páginas y funcionalidades que los necesiten.

No dependen directamente de React Router ni de los servicios del backend.

## Tarea relacionada

Jira: G3PRC-11

Rama de desarrollo: `feature/G3PRC-11`