<?php
/**
 * Archivo de ejemplo de configuración de base de datos
 * 
 * INSTRUCCIONES PARA PRODUCCIÓN:
 * 1. Copia este archivo y renómbralo como: db.config.php
 * 2. Completa con las credenciales reales de tu servidor de producción
 * 3. Asegúrate de que db.config.php esté en .gitignore
 * 4. NUNCA subas db.config.php al repositorio
 */

// Configuración de la base de datos
$host = 'localhost';  // Servidor de base de datos (ej: localhost, 127.0.0.1, o IP del servidor)
$db   = 'nombre_base_datos';  // Nombre de tu base de datos en producción
$user = 'usuario_db'; // Usuario de la base de datos
$pass = 'contraseña_segura';    // Contraseña del usuario

$charset = 'utf8mb4';
?>
