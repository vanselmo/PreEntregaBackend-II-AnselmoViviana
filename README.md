# Descripción del proyecto

Este proyecto es una aplicación web desarrollada con Node.js, Express y Socket.IO para la administración de productos y carritos de compras en tiempo real. La aplicación utiliza una interfaz amigable y moderna gracias a Handlebars y Bootstrap. Además, se integra con MongoDB para la gestión de datos, asegurando una experiencia robusta y eficiente. La autenticación de usuarios se maneja utilizando JWT y Passport.js.

## Instalación

1. Clona este repositorio en tu máquina local.
2. Instala las dependencias del proyecto utilizando npm:

   ```bash
   npm install
   ```

## Uso

Para ejecutar la aplicación localmente, simplemente utiliza el siguiente comando:

   ```bash
   npm run dev
   ```
Esto iniciará el servidor en el puerto 8080. Puedes acceder a la API utilizando las rutas definidas en los archivos de rutas.

### Endpoints disponibles

#### Renderización de vistas

- **GET /** : Renderiza la página principal con una lista de productos. Soporta los siguientes query params:
  - `page` (opcional): Número de la página actual. Default es 1.
  - `limit` (opcional): Límite de productos por página. Default es 10.
- **GET /realtimeproducts** : Renderiza una página con los productos en tiempo real. Soporta los mismos query params que GET /api/products.
- **GET /carts/:cid**: Renderiza la vista de un carrito con sus productos.

#### Gestión de productos
- **GET /api/products** : Listar todos los productos. Soporta las siguientes query params:
  - `limit` (opcional): Límite de productos por página. Default es 10.
  - `page` (opcional): Número de la página actual. Default es 1.
  - `sort` (opcional): Ordenar por precio ascendente (asc) o descendente (desc).
  - `query` (opcional): Filtrar productos por categoría.
- **GET /api/products/:pid** : Obtener un producto por su ID.
- **POST /api/products** : Crear un nuevo producto.
- **PUT /api/products/:pid** : Actualizar un producto existente.
- **DELETE /api/products/:pid** : Eliminar un producto.

#### Gestión de carritos
- **POST /api/carts** : Crear un nuevo carrito.
- **GET /api/carts/:cid** : Obtener un carrito por su ID con los productos completos..
- **POST /api/carts/:cid/products/:pid** : Añadir un producto a un carrito.
- **DELETE /api/carts/:cid**: Vaciar un carrito por su ID.
- **DELETE /api/carts/:cid/products/:pid**: Eliminar un producto específico de un carrito.
- **PUT /api/carts/:cid/products/:pid**: Actualizar la cantidad de un producto específico en un carrito.
- **PUT /api/carts/:cid**: Actualizar todos los productos de un carrito.

#### Gestión de usuarios
- **POST /api/sessions/register** : Registrar un nuevo usuario.
- **POST /api/sessions/login** : Autenticar a un usuario y obtener un token JWT.
- **POST /api/sessions/logout**: Borrar cookie y redirigir al usuario al login.
- **GET /api/sessions/current** : Obtener la información del usuario autenticado. Requiere autenticación con JWT.

Recuerda reemplazar `:pid` y `:cid` con los IDs correspondientes.

### Archivo .env

Para que el proyecto funcione correctamente, se requiere configurar un archivo .env con el string de conexión a la base de datos MongoDB.

#### Ejemplo:

```
MONGODB_STRING=mongodb+srv://usuario:contrasena@cluster.dominio.mongodb.net/ecommerce
```