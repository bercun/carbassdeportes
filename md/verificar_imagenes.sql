-- Script para verificar y actualizar imágenes en productos
-- CarbassDeportes - Verificación de Rutas de Imágenes

-- 1. Ver todos los productos y sus rutas de imagen
SELECT 
    id,
    nombre,
    imagen_url,
    CASE 
        WHEN imagen_url IS NULL THEN 'Sin imagen'
        WHEN imagen_url = '' THEN 'Vacío'
        WHEN imagen_url LIKE 'http%' THEN 'URL externa'
        WHEN imagen_url LIKE 'sours/img/articulos/%' THEN 'Ruta correcta'
        ELSE 'Ruta no estándar'
    END as estado_imagen
FROM productos
ORDER BY estado_imagen, id;

-- 2. Contar productos por tipo de imagen
SELECT 
    CASE 
        WHEN imagen_url IS NULL THEN 'Sin imagen (NULL)'
        WHEN imagen_url = '' THEN 'Vacío'
        WHEN imagen_url LIKE 'http%' THEN 'URL externa'
        WHEN imagen_url LIKE 'sours/img/articulos/%' THEN 'Ruta correcta'
        ELSE 'Ruta no estándar'
    END as tipo_imagen,
    COUNT(*) as cantidad
FROM productos
GROUP BY tipo_imagen;

-- 3. Ver productos sin imagen o con imagen externa
SELECT id, nombre, imagen_url, stock, precio
FROM productos
WHERE imagen_url IS NULL 
   OR imagen_url = '' 
   OR imagen_url LIKE 'http%'
ORDER BY id;

-- 4. Actualizar productos vacíos a NULL (opcional)
-- DESCOMENTAR SOLO SI QUIERES EJECUTAR
-- UPDATE productos 
-- SET imagen_url = NULL 
-- WHERE imagen_url = '';

-- 4b. Actualizar URLs no estándar con imagen por defecto
-- DESCOMENTAR SOLO SI QUIERES EJECUTAR
-- Este UPDATE cambiará todas las URLs externas y rutas no estándar
UPDATE productos 
SET imagen_url = 'sours/img/articulos/producto_695afd6b40ba23.40749591.jpg'
WHERE (imagen_url IS NULL 
   OR imagen_url = '' 
   OR imagen_url LIKE 'http%'
   OR (imagen_url NOT LIKE 'sours/img/articulos/%' AND imagen_url != ''));

-- 5. Ver imágenes que apuntan a archivos que podrían no existir
-- (Esto es solo informativo, necesitarías verificar manualmente los archivos)
SELECT 
    imagen_url,
    COUNT(*) as productos_usando_esta_imagen
FROM productos
WHERE imagen_url IS NOT NULL 
  AND imagen_url != ''
  AND imagen_url LIKE 'sours/img/articulos/%'
GROUP BY imagen_url
ORDER BY productos_usando_esta_imagen DESC;

-- 6. Productos más recientes con sus imágenes
SELECT 
    id,
    nombre,
    imagen_url,
    fecha_creacion,
    stock
FROM productos
ORDER BY fecha_creacion DESC
LIMIT 10;
