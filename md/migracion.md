# Guía de Migración: De Firebase a PHP/MySQL (cPanel)

Este documento detalla los pasos necesarios para migrar el proyecto actual (HTML/JS + Firebase) a un entorno LAMP (Linux, Apache, MySQL, PHP) típico de un hosting con cPanel.

## Fase 1: Preparación de la Base de Datos (MySQL)

El primer paso es diseñar y crear la base de datos relacional que reemplazará a Firestore/Realtime Database.

1.  **Crear Base de Datos en cPanel:**
    *   Entra a "Bases de datos MySQL".
    *   Crea una nueva base de datos (ej: `carbass_db`).
    *   Crea un usuario y asígnale todos los privilegios sobre esa base de datos.

2.  **Estructura de Tablas (SQL):**
    Ejecuta este script en phpMyAdmin para crear las tablas necesarias:

    ```sql
    -- Tabla de Usuarios
    CREATE TABLE usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL, -- Hash encriptado
        nombre VARCHAR(100),
        rol ENUM('user', 'admin') DEFAULT 'user',
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabla de Categorías
    CREATE TABLE categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL
    );

    -- Tabla de Productos
    CREATE TABLE productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10, 2) NOT NULL,
        imagen_url VARCHAR(255),
        categoria_id INT,
        destacado BOOLEAN DEFAULT 0,
        stock INT DEFAULT 0,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    );
    ```

## Fase 2: Backend (API PHP)

En lugar de conectar directamente a Firebase desde JS, crearemos archivos PHP que actuarán como una API.

1.  **Conexión a Base de Datos (`api/db.php`):**
    ```php
    <?php
    $host = 'localhost';
    $db   = 'carbass_db';
    $user = 'tu_usuario';
    $pass = 'tu_contraseña';
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    try {
        $pdo = new PDO($dsn, $user, $pass);
    } catch (\PDOException $e) {
        throw new \PDOException($e->getMessage(), (int)$e->getCode());
    }
    ?>
    ```

2.  **Endpoints de Productos (`api/productos.php`):**
    Crear scripts para leer productos (GET) y guardar productos (POST - solo admin).
    *   `GET /api/productos.php`: Devuelve JSON con lista de productos.
    *   `GET /api/productos.php?id=1`: Devuelve un producto específico.

## Fase 3: Autenticación (Reemplazo de Firebase Auth)

1.  **Registro (`api/register.php`):**
    *   Recibe email/password.
    *   Verifica si el email existe.
    *   Usa `password_hash($password, PASSWORD_DEFAULT)` para encriptar.
    *   Guarda en tabla `usuarios`.

2.  **Login (`api/login.php`):**
    *   Recibe email/password.
    *   Busca usuario por email.
    *   Usa `password_verify()` para comprobar contraseña.
    *   Inicia sesión con `session_start()` y guarda variables `$_SESSION['user_id']`.

3.  **Logout (`api/logout.php`):**
    *   Ejecuta `session_destroy()`.

4.  **Verificar Sesión (`api/check_auth.php`):**
    *   Devuelve JSON `{ "logged_in": true, "user": ... }` si existe la sesión PHP.

## Fase 4: Frontend (JavaScript)

Modificar los archivos JS para que consuman tu nueva API PHP en lugar de Firebase.

1.  **Eliminar Firebase:**
    *   Quitar referencias a `firebase-app.js`, `firebase-auth.js`, etc. en los HTML.
    *   Eliminar `firebase-config.js`.

2.  **Actualizar `script.js` (Catálogo y Home):**
    *   Reemplazar `db.collection('productos').get()` por `fetch('api/productos.php')`.
    *   Procesar el JSON devuelto por PHP.

3.  **Actualizar `auth.js`:**
    *   Reemplazar `auth.signInWithEmailAndPassword` por `fetch('api/login.php', { method: 'POST', ... })`.
    *   Manejar la respuesta del servidor (éxito/error).

## Fase 5: Panel de Administración

1.  **Proteger Rutas:**
    *   En `api/admin_productos.php` (para crear/editar), verificar al inicio:
        ```php
        session_start();
        if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
            http_response_code(403);
            exit('Acceso denegado');
        }
        ```

2.  **Subida de Imágenes:**
    *   Firebase Storage ya no se usará.
    *   Crear script PHP para recibir archivos (`$_FILES`) y guardarlos en una carpeta `uploads/` en el servidor.
    *   Guardar la ruta relativa en la base de datos MySQL.

## Fase 6: Despliegue en cPanel

1.  **Subir Archivos:**
    *   Usar el "Administrador de Archivos" de cPanel o FTP (FileZilla).
    *   Subir todo el contenido a `public_html` (o subcarpeta).

2.  **Configurar Base de Datos:**
    *   Asegurarse que `api/db.php` tenga las credenciales correctas del servidor de producción (a veces difieren del local).

3.  **Pruebas:**
    *   Verificar registro, login, carga de productos y panel de admin.

---

## Resumen de Archivos Nuevos a Crear

*   `api/db.php` (Conexión)
*   `api/login.php` (Login)
*   `api/register.php` (Registro)
*   `api/logout.php` (Salir)
*   `api/check_auth.php` (Estado sesión)
*   `api/productos.php` (CRUD Productos)
*   `uploads/` (Carpeta para imágenes con permisos de escritura 755 o 777 según config)
