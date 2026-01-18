-- ====================================================
-- SOLUCIÓN: Sistema de Soft Delete para Productos
-- ====================================================

-- 1. Agregar columna 'activo' si no existe
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS activo TINYINT(1) DEFAULT 1 AFTER stock;

-- 2. Ver productos activos e inactivos
SELECT id, nombre, activo, 
       CASE 
           WHEN activo = 1 THEN 'Activo' 
           ELSE 'Inactivo' 
       END as estado
FROM productos
ORDER BY activo DESC, id;

-- 3. "Eliminar" un producto (marcarlo como inactivo)
-- Ejemplo para producto ID 8:
UPDATE productos 
SET activo = 0 
WHERE id = 8;

-- 4. Reactivar un producto
UPDATE productos 
SET activo = 1 
WHERE id = 8;

-- 5. Ver solo productos activos (para mostrar en la tienda)
SELECT * FROM productos WHERE activo = 1;

-- 6. Ver productos inactivos (histórico)
SELECT * FROM productos WHERE activo = 0;

-- ====================================================
-- VENTAJAS DE ESTE ENFOQUE:
-- - No se pierde el historial de ventas
-- - Se mantiene la integridad referencial
-- - Los productos eliminados siguen visibles en ventas antiguas
-- - Puedes reactivar productos si es necesario
-- ====================================================
