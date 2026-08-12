-- Seleccionar la base de datos
USE brkoonuy_carbass_db;

-- Limpiar (vaciar) las tablas de ventas
-- NOTA: Esto eliminará TODOS los registros de ventas y sus detalles

-- Primero eliminar los detalles (por la clave foránea)
DELETE FROM detalle_ventas;

-- Luego eliminar las ventas
DELETE FROM ventas;

-- Reiniciar los contadores AUTO_INCREMENT (opcional)
ALTER TABLE detalle_ventas AUTO_INCREMENT = 1;
ALTER TABLE ventas AUTO_INCREMENT = 1;

-- Verificar que las tablas están vacías
SELECT COUNT(*) as 'Ventas restantes' FROM ventas;
SELECT COUNT(*) as 'Detalles restantes' FROM detalle_ventas;

SELECT 'Tablas de ventas limpiadas correctamente' as Resultado;
