# CarbassDeportes - SQL/PHP Edition

## Descripcion
CarbassDeportes es una tienda online de articulos deportivos y coleccionables.
Esta rama usa backend PHP + MySQL (sin Firebase) con autenticacion por sesiones, API REST JSON, carrito, control de stock y panel admin.

## Stack
- Frontend: HTML, CSS, JavaScript vanilla
- Backend: PHP 7.4+
- Base de datos: MySQL / MariaDB
- Auth: sesiones PHP
- DB access: PDO

## Estructura actual

```text
carbassdeportes/
├── api/                    # API backend (PHP)
│   ├── db.php              # Conexion PDO
│   ├── check_auth.php      # Estado de sesion
│   ├── login.php           # Login
│   ├── register.php        # Registro
│   ├── logout.php          # Logout
│   ├── productos.php       # Catalogo publico
│   ├── categorias.php      # Categorias
│   ├── carrito.php         # Carrito
│   ├── admin_productos.php # CRUD productos (admin)
│   ├── usuarios.php        # Gestion usuarios (admin)
│   └── ventas.php          # Registro/listado de ventas
│
├── includes/               # Fragmentos PHP reutilizables
├── sours/                  # Assets (img, videos)
├── database/sql/           # Scripts SQL (schema y datos)
├── tools/setup/            # Utilidades de inicializacion y diagnostico
├── docs/                   # Documentacion del proyecto
├── deploy/                 # Copia funcional lista para subir al servidor
├── backups/                # Backups zip de deploy
│
├── index.html
├── catalogo.html
├── carrito.html
├── admin.html
├── login.html
│
├── script.js
├── carrito.js
├── admin.js
├── auth.js
├── auth-check-php.js
├── mobile-menu.js
└── styles.css
```

## Flujo de autenticacion
1. `login.html` envia credenciales a `api/login.php`.
2. El backend crea sesion PHP.
3. `auth-check-php.js` consulta `api/check_auth.php` para actualizar UI y permisos.
4. `api/logout.php` destruye sesion.

## Endpoints principales

### Publicos
- `GET api/productos.php`
- `GET api/categorias.php`
- `POST api/login.php`
- `POST api/register.php`

### Requieren sesion
- `GET api/check_auth.php`
- `POST api/logout.php`
- `GET/POST/PUT/DELETE api/carrito.php`
- `GET/POST/PUT/DELETE api/admin_productos.php` (admin)
- `GET/PUT/DELETE api/usuarios.php` (admin)
- `GET/POST api/ventas.php` (admin segun operacion)

## Base de datos
Scripts SQL disponibles en `database/sql/`.
Orden recomendado en entorno nuevo:
1. Crear tablas base (`crear_tabla_*.sql`)
2. Cargar categorias/productos (`datos_iniciales.sql`)
3. Ajustes opcionales de pruebas

Tambien puedes usar utilidades de `tools/setup/` para inicializacion y chequeos.

## Configuracion local
1. Configura credenciales de MySQL en `api/db.php`.
2. Crea la base y ejecuta scripts de `database/sql/`.
3. Levanta servidor local PHP desde la raiz del proyecto:

```bash
php -S localhost:8000
```

4. Abre:
- `http://localhost:8000/index.html`
- `http://localhost:8000/login.html`
- `http://localhost:8000/admin.html`

## Deploy (carpeta deploy)
La carpeta `deploy/` se mantiene como copia funcional de produccion para subir al hosting.
Incluye HTML, JS, CSS, assets, `api/` e `includes/`.

Checklist rapido antes de subir:
1. Revisar credenciales en `deploy/api/db.php`
2. Ver permisos de carpetas y archivos en servidor
3. Probar login, catalogo, carrito y admin en entorno de staging

## Notas de seguridad
- No dejar credenciales reales en repositorio publico.
- Mover secrets a variables de entorno o archivo no versionado.
- Validar permisos de endpoints admin por sesion y rol.

## Estado actual
- Runtime limpio de integraciones legacy en codigo activo.
- Proyecto operando sobre SQL/PHP.
- Estructura ordenada por responsabilidad.
