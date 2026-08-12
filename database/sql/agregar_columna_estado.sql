-- Script para agregar la columna 'estado' a la tabla productos
-- Ejecutar este script en tu base de datos MySQL

-- Agregar la columna estado
ALTER TABLE productos 
ADD COLUMN estado VARCHAR(50) DEFAULT 'normal' AFTER categoria_id;

-- Migrar los datos existentes del campo destacado al campo estado
UPDATE productos 
SET estado = CASE 
    WHEN destacado = 1 THEN 'destacado'
    ELSE 'normal'
END;

-- Opcional: Puedes eliminar la columna destacado si ya no la necesitas
-- ALTER TABLE productos DROP COLUMN destacado;

-- O puedes mantener ambas columnas por compatibilidad
