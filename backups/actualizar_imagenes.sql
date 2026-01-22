-- Script para actualizar todas las imágenes no válidas
-- Ejecutar este script en tu base de datos MySQL

-- Primero, veamos qué productos se van a actualizar
SELECT 
    id,
    nombre,
    imagen_url as ruta_antigua,
    'sours/img/articulos/producto_696bff9fcb8dc8.94273456.jpg' as ruta_nueva
FROM productos
WHERE (imagen_url IS NULL 
   OR imagen_url = '' 
   OR imagen_url LIKE 'http%'
   OR (imagen_url NOT LIKE 'sours/img/articulos/%' AND imagen_url != ''));

-- Si estás conforme con los resultados de arriba, ejecuta este UPDATE:
UPDATE productos 
SET imagen_url = 'sours/img/articulos/producto_696bff9fcb8dc8.94273456.jpg'
WHERE (imagen_url IS NULL 
   OR imagen_url = '' 
   OR imagen_url LIKE 'http%'
   OR (imagen_url NOT LIKE 'sours/img/articulos/%' AND imagen_url != ''));

-- Verificar que se actualizó correctamente
SELECT 
    id,
    nombre,
    imagen_url,
    stock,
    precio
FROM productos
ORDER BY id;
