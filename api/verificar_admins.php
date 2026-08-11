<?php
/**
 * Verificador de Administradores
 * Comprueba si existen administradores en la BD
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

try {
    // Contar todos los usuarios
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM usuarios");
    $totalUsuarios = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Contar administradores
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM usuarios WHERE rol = 'admin'");
    $totalAdmins = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Obtener lista de administradores
    $stmt = $pdo->query("SELECT id, nombre, email, rol FROM usuarios WHERE rol = 'admin'");
    $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Verificar estructura de la tabla usuarios
    $stmt = $pdo->query("DESCRIBE usuarios");
    $columnas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'total_usuarios' => $totalUsuarios,
        'total_admins' => $totalAdmins,
        'administradores' => $admins,
        'estructura_tabla' => $columnas,
        'mensaje' => $totalAdmins > 0 
            ? "✅ Hay $totalAdmins administrador(es) en la BD" 
            : "⚠️ NO hay administradores en la BD. Necesitas crear al menos uno."
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
