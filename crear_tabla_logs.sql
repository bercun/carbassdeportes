-- Crear tabla de logs de auditoría
USE brkoonuy_carbass_db;

CREATE TABLE IF NOT EXISTS logs_auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    usuario_email VARCHAR(150) NULL,
    accion VARCHAR(50) NOT NULL,
    modulo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    registro_afectado INT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    datos_anteriores JSON NULL,
    datos_nuevos JSON NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_accion (accion),
    INDEX idx_modulo (modulo),
    INDEX idx_fecha (fecha_hora),
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar algunos datos de ejemplo (opcional)
-- INSERT INTO logs_auditoria (user_id, usuario_email, accion, modulo, descripcion, ip_address)
-- VALUES (1, 'admin@example.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', '127.0.0.1');
