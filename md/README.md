# CarbassDeportes - E-commerce de Artículos Deportivos y Coleccionables

## 📋 Descripción del Proyecto

Plataforma de comercio electrónico para la venta de artículos deportivos y coleccionables. Sistema completo con gestión de productos, categorías, carrito de compras, control de stock y panel de administración.

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **Backend:** PHP 7.4+
- **Base de Datos:** MySQL/MariaDB
- **Autenticación:** Sesiones PHP
- **API:** RESTful JSON

### Patrón de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Cliente)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ index.html│  │catalogo  │  │ carrito  │  │  admin  │ │
│  │  script.js│  │.html     │  │.html     │  │.html    │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/AJAX Requests (JSON)
┌──────────────────────▼──────────────────────────────────┐
│              BACKEND (Servidor PHP)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │              API REST (api/)                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │   │
│  │  │productos │ │categorias│ │ carrito  │         │   │
│  │  │.php      │ │.php      │ │.php      │         │   │
│  │  └──────────┘ └──────────┘ └──────────┘         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │   │
│  │  │auth.php  │ │admin_    │ │check_    │         │   │
│  │  │          │ │productos │ │auth.php  │         │   │
│  │  └──────────┘ └──────────┘ └──────────┘         │   │
│  └──────────────────────────────────────────────────┘   │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐   │
│  │          Capa de Sesiones PHP                    │   │
│  │  - Control de autenticación                      │   │
│  │  - Gestión de roles (admin/user)                 │   │
│  │  - Timeout de sesión                             │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ PDO (PHP Data Objects)
┌──────────────────────▼──────────────────────────────────┐
│              BASE DE DATOS MySQL                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ usuarios │ │productos │ │categorias│ │ carrito  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 🗄️ Estructura de la Base de Datos

### Diagrama ER (Entidad-Relación)

```
┌─────────────────────────┐
│       USUARIOS          │
├─────────────────────────┤
│ PK  id (INT)            │
│     email (VARCHAR)     │
│     password (VARCHAR)  │
│     nombre (VARCHAR)    │
│     rol (ENUM)          │
│     fecha_creacion      │
└──────────┬──────────────┘
           │ 1
           │
           │ N
┌──────────▼──────────────┐         ┌─────────────────────┐
│       CARRITO           │    N    │     PRODUCTOS       │
├─────────────────────────┤────────▶├─────────────────────┤
│ PK  id (INT)            │         │ PK  id (INT)        │
│ FK  user_id (INT)       │         │     nombre          │
│ FK  producto_id (INT)   │         │     descripcion     │
│     cantidad (INT)      │         │     precio (DECIMAL)│
│     fecha_agregado      │         │     imagen_url      │
└─────────────────────────┘         │ FK  categoria_id    │
                                    │     estado (ENUM)   │
                                    │     stock (INT)     │
                                    └──────────┬──────────┘
                                               │ N
                                               │
                                               │ 1
                                    ┌──────────▼──────────┐
                                    │    CATEGORIAS       │
                                    ├─────────────────────┤
                                    │ PK  id (INT)        │
                                    │     nombre          │
                                    │     descripcion     │
                                    │     icono           │
                                    └─────────────────────┘
```

### Tablas Detalladas

#### 📊 Tabla: `usuarios`

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255),
    rol ENUM('admin', 'user') DEFAULT 'user',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
- `id`: Identificador único del usuario
- `email`: Correo electrónico (único)
- `password`: Contraseña hasheada (bcrypt)
- `nombre`: Nombre completo del usuario
- `rol`: Rol del usuario (admin/user)
- `fecha_creacion`: Fecha de registro

---

#### 📦 Tabla: `productos`

```sql
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen_url VARCHAR(500),
    categoria_id INT,
    estado ENUM('destacado', 'oferta', 'recien_agregado', 'normal') DEFAULT 'normal',
    stock INT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);
```

**Campos:**
- `id`: Identificador único del producto
- `nombre`: Nombre del producto
- `descripcion`: Descripción detallada
- `precio`: Precio unitario (IVA incluido)
- `imagen_url`: URL de la imagen del producto
- `categoria_id`: Referencia a la categoría
- `estado`: Estado del producto (destacado/oferta/nuevo/normal)
- `stock`: Cantidad disponible en inventario
- `fecha_creacion`: Fecha de creación del producto

---

#### 🏷️ Tabla: `categorias`

```sql
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50)
);
```

**Campos:**
- `id`: Identificador único de la categoría
- `nombre`: Nombre de la categoría
- `descripcion`: Descripción de la categoría
- `icono`: Emoji o clase de ícono

**Categorías predefinidas:**
- Fútbol (⚽)
- Basket (🏀)
- Gym (💪)
- Coleccionables (🏆)

---

#### 🛒 Tabla: `carrito`

```sql
CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, producto_id)
);
```

**Campos:**
- `id`: Identificador único del item en carrito
- `user_id`: Referencia al usuario
- `producto_id`: Referencia al producto
- `cantidad`: Cantidad de unidades
- `fecha_agregado`: Fecha en que se agregó al carrito

**Índices:**
- `unique_user_product`: Evita duplicados (un usuario no puede tener el mismo producto dos veces)

---

## 📁 Estructura de Archivos

```
pruebaweb_chatgpt/
├── api/                          # Backend API (PHP)
│   ├── admin_productos.php       # CRUD de productos (solo admin)
│   ├── auth.php                  # Login/registro de usuarios
│   ├── carrito.php              # Gestión del carrito (GET/POST/PUT/DELETE)
│   ├── categorias.php           # Obtener categorías
│   ├── check_auth.php           # Verificar autenticación
│   ├── corregir_stock.php       # Script diagnóstico de stock
│   ├── db.php                   # Configuración PDO database
│   ├── logout.php               # Cerrar sesión
│   └── productos.php            # Listar productos públicos
│
├── sours/                        # Recursos estáticos
│   ├── img/
│   │   ├── articulos/           # Imágenes de productos
│   │   ├── aside/               # Imágenes de promociones
│   │   ├── carrousel/           # Imágenes del carrusel
│   │   ├── coleccionables/      # Imágenes de coleccionables
│   │   └── logos/               # Logo del sitio
│   ├── promts/                  # Prompts usados
│   └── videos/                  # Videos promocionales
│
├── index.html                    # Página principal (home)
├── catalogo.html                # Catálogo completo de productos
├── carrito.html                 # Vista del carrito de compras
├── admin.html                   # Panel de administración
├── login.html                   # Página de login
│
├── script.js                    # Lógica principal del frontend
├── carrito.js                   # Lógica del carrito de compras
├── admin.js                     # Lógica del panel admin
├── auth.js                      # Lógica de autenticación
│
├── styles.css                   # Estilos globales
│
├── README.md                    # Este archivo
└── CARRITO_README.md           # Documentación del carrito
```

---

## 🔌 API Endpoints

### Autenticación

#### `POST /api/auth.php`
**Descripción:** Login de usuario

**Request:**
```json
{
  "action": "login",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nombre": "Juan Pérez",
    "rol": "user"
  }
}
```

---

### Productos

#### `GET /api/productos.php`
**Descripción:** Obtener listado de productos públicos

**Query Parameters:**
- `categoria` (opcional): Filtrar por categoría

**Response (200):**
```json
[
  {
    "id": 1,
    "nombre": "Pelota de Fútbol",
    "descripcion": "Pelota profesional",
    "precio": "29.99",
    "imagen_url": "sours/img/articulos/pelota.jpg",
    "categoria_id": 1,
    "categoria_nombre": "Fútbol",
    "estado": "destacado",
    "stock": 15
  }
]
```

---

### Carrito de Compras

#### `GET /api/carrito.php`
**Descripción:** Obtener items del carrito del usuario autenticado

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "producto_id": 5,
      "cantidad": 2,
      "nombre": "Jersey Conmemorativo",
      "precio": "99.99",
      "stock": 8,
      "subtotal": "199.98"
    }
  ],
  "total": "199.98",
  "count": 1
}
```

---

#### `POST /api/carrito.php`
**Descripción:** Agregar producto al carrito

**Request:**
```json
{
  "producto_id": 5,
  "cantidad": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Producto agregado al carrito",
  "cart_count": 3,
  "nuevo_stock": 14
}
```

**Lógica de stock:**
1. Verifica stock disponible
2. Si producto ya existe en carrito, incrementa cantidad
3. Decrementa stock en BD
4. Retorna nuevo stock y conteo de items

---

#### `PUT /api/carrito.php`
**Descripción:** Cambiar cantidad de un item en el carrito

**Request:**
```json
{
  "id": 1,
  "cantidad": 3
}
```

**Lógica:**
- Si aumenta: verifica stock y decrementa
- Si disminuye: devuelve stock
- Si llega a 0: elimina item y devuelve todo el stock

---

#### `DELETE /api/carrito.php`
**Descripción:** Eliminar item del carrito

**Request:**
```json
{
  "id": 1,
  "confirmar_compra": false
}
```

**Lógica:**
- Si `confirmar_compra = false`: devuelve stock
- Si `confirmar_compra = true`: NO devuelve stock (compra confirmada)

---

## 🛒 Flujo del Carrito de Compras

### 1. Agregar Producto al Carrito

```
Usuario hace clic en "Agregar al Carrito"
        ↓
Frontend: POST /api/carrito.php { producto_id: 5, cantidad: 1 }
        ↓
Backend: Verificar stock disponible
        ↓
Stock > 0 → Agregar al carrito
Stock = 0 → Error: Sin stock
        ↓
UPDATE productos SET stock = stock - 1
        ↓
Response: { success: true, cart_count: 3, nuevo_stock: 14 }
        ↓
Frontend actualiza:
  - Badge del carrito (3)
  - Stock en tarjeta (14 disponibles)
  - Si stock = 0, deshabilita botón
```

### 2. Gestión de Stock

**Reglas de Negocio:**

1. **Al agregar al carrito:** Stock se decrementa inmediatamente
2. **Al aumentar cantidad:** Verifica stock disponible antes de decrementar
3. **Al disminuir cantidad:** Devuelve stock automáticamente
4. **Al eliminar del carrito:** Devuelve todo el stock reservado
5. **Al confirmar compra:** NO devuelve stock (venta finalizada)

---

## 💾 Cálculo de Precios con IVA

Todos los precios en la base de datos **incluyen IVA del 22%**.

### Fórmulas

```javascript
const IVA_RATE = 0.22; // 22%

// Precio mostrado (con IVA)
totalConIVA = suma de todos los productos

// Calcular subtotal sin IVA
subtotalSinIVA = totalConIVA / 1.22

// Calcular monto del IVA
iva = totalConIVA - subtotalSinIVA
```

### Ejemplo

```
Producto: $122.00 (precio en BD con IVA incluido)

Desglose:
- Subtotal: $100.00
- IVA (22%): $22.00
- Total: $122.00
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- PHP 7.4 o superior
- MySQL 5.7 o superior
- Servidor web (Apache/Nginx)
- Extensión PDO de PHP

### Pasos de Instalación

1. **Clonar repositorio**
```bash
git clone [url-repositorio]
cd pruebaweb_chatgpt
```

2. **Configurar base de datos**

Crear base de datos:
```sql
CREATE DATABASE carbass_deportes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Configurar conexión**

Editar `api/db.php`:
```php
$host = 'localhost';
$db = 'carbass_deportes';
$user = 'tu_usuario';
$pass = 'tu_contraseña';
```

4. **Crear usuario administrador**

```sql
INSERT INTO usuarios (email, password, nombre, rol) 
VALUES (
  'admin@carbass.com', 
  '$2y$10$...', -- password hasheado
  'Administrador',
  'admin'
);
```

Para generar password hasheado:
```php
echo password_hash('tu_password', PASSWORD_DEFAULT);
```

5. **Insertar categorías iniciales**

```sql
INSERT INTO categorias (nombre, descripcion, icono) VALUES
('Fútbol', 'Artículos de fútbol profesional', '⚽'),
('Basket', 'Equipamiento de baloncesto', '🏀'),
('Gym', 'Equipamiento de gimnasio', '💪'),
('Coleccionables', 'Artículos coleccionables y ediciones limitadas', '🏆');
```

---

## 🔒 Seguridad

### Implementaciones de Seguridad

1. **Passwords:** Hasheados con `password_hash()` (bcrypt)
2. **Sesiones:** Regeneración de ID al login, timeout de 15 minutos
3. **SQL Injection:** PDO con prepared statements
4. **XSS:** Sanitización de inputs
5. **CSRF:** Validación de sesión en todos los endpoints
6. **Autorización:** Verificación de rol en endpoints admin

---

## 📈 Mejoras Futuras

### Funcionalidades Pendientes

- [ ] Sistema de pedidos (guardar historial de compras)
- [ ] Integración de pasarelas de pago (MercadoPago, PayPal)
- [ ] Email de confirmación de compra
- [ ] Sistema de cupones de descuento
- [ ] Wishlist (lista de deseos)
- [ ] Reseñas y calificaciones de productos

---

## 📄 Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados.

---

## 📞 Contacto

**CarbassDeportes**
- Email: info@carbass.com
- Sitio web: https://carbass.brkoon.uy

---

**Desarrollado con ❤️ para CarbassDeportes**
