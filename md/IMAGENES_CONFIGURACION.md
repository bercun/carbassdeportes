# Configuración de Imágenes - CarbassDeportes

## 📁 Directorio de Imágenes

### Ubicación Principal
Todas las imágenes de productos deben estar en:
```
sours/img/articulos/
```

### Estructura de Directorios
```
sours/
└── img/
    ├── articulos/      ← Imágenes de productos (suben aquí)
    ├── aside/          ← Imágenes laterales/promocionales
    ├── carrousel/      ← Imágenes del carrusel principal
    ├── coleccionables/ ← Imágenes de coleccionables
    ├── logos/          ← Logos de la marca
    └── videos/         ← Videos promocionales
```

## 🔧 Configuración Actual

### 1. Upload de Imágenes (upload_image.php)
```php
// Directorio de destino
$uploadDir = '../sours/img/articulos/';

// URL relativa que se guarda en la base de datos
$imageUrl = 'sours/img/articulos/' . $filename;
```

### 2. Base de Datos
Campo: `imagen_url` (VARCHAR)
Formato almacenado: `sours/img/articulos/nombre-archivo.jpg`

### 3. Frontend (script.js, admin.js)
Todas las referencias usan el campo `imagen_url` directamente:
```javascript
// En script.js
imagen: product.imagen_url || 'sours/img/articulos/default.jpg'

// En admin.js
src="${product.imagen_url || 'sours/img/articulos/default.jpg'}"

// En carrito.js
src="${item.imagen_url || 'sours/img/articulos/default.jpg'}"
```

## ✅ Flujo de Trabajo

### Subir Nueva Imagen
1. Usuario admin selecciona imagen en el panel de administración
2. Se envía a `api/upload_image.php`
3. El archivo se guarda en `sours/img/articulos/` con nombre único
4. Se retorna la ruta: `sours/img/articulos/producto_xxxxx.jpg`
5. Esta ruta se guarda en el campo `imagen_url` de la base de datos

### Mostrar Imagen
1. Se obtiene el producto de la base de datos
2. Se lee el campo `imagen_url`
3. Se usa directamente en el atributo `src` de la imagen
4. Si `imagen_url` está vacío, se usa `sours/img/articulos/default.jpg`

## 🎨 Imagen por Defecto

### Crear Imagen Default
Si no existe `sours/img/articulos/default.jpg`, crear una imagen placeholder con:
- Dimensiones recomendadas: 600x400px
- Texto: "Sin Imagen"
- Fondo: #e0e0e0

### Alternativa
Usar una de las imágenes existentes como default temporalmente.

## 📝 Validaciones

### En upload_image.php
- ✅ Tipos permitidos: JPEG, JPG, PNG, GIF, WEBP
- ✅ Tamaño máximo: 5MB
- ✅ Nombres únicos con `uniqid()`
- ✅ Directorio se crea automáticamente si no existe

### Recomendaciones
1. Mantener todas las imágenes en `sours/img/articulos/`
2. NO usar URLs externas (placehold.co, etc.)
3. Optimizar imágenes antes de subir (< 500KB recomendado)
4. Usar formatos modernos como WebP cuando sea posible
5. Mantener un respaldo de las imágenes

## 🔄 Migración de Imágenes Antiguas

Si tienes productos con rutas antiguas o URLs externas:

```sql
-- Ver productos con imágenes externas
SELECT id, nombre, imagen_url 
FROM productos 
WHERE imagen_url LIKE 'http%';

-- Ver productos sin imagen
SELECT id, nombre, imagen_url 
FROM productos 
WHERE imagen_url IS NULL OR imagen_url = '';
```

Actualizar manualmente o usar el panel de administración para reasignar imágenes.
