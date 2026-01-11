-- Script para verificar y agregar la columna 'estado' a la tabla ventas si no existe
-- Ejecutar este script en tu base de datos MySQL

USE brkoonuy_carbass_db;

-- Verificar si la columna existe y agregarla si no está
SET @dbname = 'brkoonuy_carbass_db';
SET @tablename = 'ventas';
SET @columnname = 'estado';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 'La columna estado ya existe en la tabla ventas' AS mensaje;",
  "ALTER TABLE ventas ADD COLUMN estado VARCHAR(20) DEFAULT 'completada' AFTER observaciones;"
));

PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Actualizar ventas que tengan el campo estado NULL
UPDATE ventas SET estado = 'completada' WHERE estado IS NULL OR estado = '';

-- Crear índice para el campo estado si no existe
CREATE INDEX IF NOT EXISTS idx_estado ON ventas(estado);

-- Verificar el resultado
SELECT 
    'Verificación completada' AS resultado,
    COUNT(*) AS total_ventas,
    COUNT(CASE WHEN estado IS NOT NULL AND estado != '' THEN 1 END) AS ventas_con_estado,
    COUNT(CASE WHEN estado IS NULL OR estado = '' THEN 1 END) AS ventas_sin_estado
FROM ventas;
