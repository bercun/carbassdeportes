-- Verificar administradores existentes
SELECT id, nombre, email, rol 
FROM usuarios 
WHERE rol = 'admin';

-- Si no hay administradores, descomentar y ejecutar estas líneas:
-- (Cambia el email y la contraseña según necesites)

/*
-- Opción 1: Actualizar un usuario existente a admin
UPDATE usuarios 
SET rol = 'admin' 
WHERE email = 'tu_email@ejemplo.com';

-- Opción 2: Crear un nuevo usuario administrador
INSERT INTO usuarios (nombre, email, password, rol, fecha_registro)
VALUES (
    'Administrador',
    'admin@carbassdeportes.com',
    '$2y$10$YourHashedPasswordHere',  -- Usa generar-hash.php para generar el hash
    'admin',
    NOW()
);
*/

-- Verificar columnas de la tabla ventas (para confirmar que sea user_id no usuario_id)
DESCRIBE ventas;

-- Ver si hay ventas con user_id NULL (podrían causar problemas en el JOIN)
SELECT COUNT(*) as ventas_sin_usuario
FROM ventas
WHERE user_id IS NULL;
