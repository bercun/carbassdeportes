<?php
// logs.php - API para consultar logs de auditoría

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

session_start();

// Verificar que el usuario esté autenticado y sea admin
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    // Verificar si el usuario es admin
    $stmt = $pdo->prepare('SELECT rol FROM usuarios WHERE id = ?');
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();
    
    if (!$user || $user['rol'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Acceso denegado. Solo administradores pueden ver los logs.']);
        exit;
    }
    
    // Obtener parámetros de filtro
    $modulo = $_GET['modulo'] ?? null;
    $accion = $_GET['accion'] ?? null;
    $fecha_inicio = $_GET['fecha_inicio'] ?? null;
    $fecha_fin = $_GET['fecha_fin'] ?? null;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
    
    // Construir query
    $where = [];
    $params = [];
    
    if ($modulo) {
        $where[] = 'modulo = ?';
        $params[] = $modulo;
    }
    
    if ($accion) {
        $where[] = 'accion = ?';
        $params[] = $accion;
    }
    
    if ($fecha_inicio) {
        $where[] = 'DATE(fecha_hora) >= ?';
        $params[] = $fecha_inicio;
    }
    
    if ($fecha_fin) {
        $where[] = 'DATE(fecha_hora) <= ?';
        $params[] = $fecha_fin;
    }
    
    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
    
    // Obtener logs
    $sql = "
        SELECT 
            l.*
        FROM logs_auditoria l
        $whereClause
        ORDER BY l.fecha_hora DESC
        LIMIT ? OFFSET ?
    ";
    
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $logs = $stmt->fetchAll();
    
    // Obtener total de logs (para paginación)
    $countSql = "SELECT COUNT(*) as total FROM logs_auditoria l $whereClause";
    $stmt = $pdo->prepare($countSql);
    $stmt->execute(array_slice($params, 0, -2)); // Remover limit y offset
    $total = $stmt->fetch()['total'];
    
    // Obtener estadísticas
    $statsSql = "
        SELECT 
            COUNT(*) as total_logs,
            COUNT(DISTINCT user_id) as usuarios_activos,
            COUNT(DISTINCT DATE(fecha_hora)) as dias_con_actividad
        FROM logs_auditoria l
        $whereClause
    ";
    $stmt = $pdo->prepare($statsSql);
    $stmt->execute(array_slice($params, 0, -2));
    $estadisticas = $stmt->fetch();
    
    // Obtener conteo por módulo
    $modulosSql = "
        SELECT 
            modulo,
            COUNT(*) as cantidad
        FROM logs_auditoria l
        $whereClause
        GROUP BY modulo
        ORDER BY cantidad DESC
    ";
    $stmt = $pdo->prepare($modulosSql);
    $stmt->execute(array_slice($params, 0, -2));
    $por_modulo = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'logs' => $logs,
        'total' => intval($total),
        'limit' => $limit,
        'offset' => $offset,
        'estadisticas' => [
            'total_logs' => intval($estadisticas['total_logs']),
            'usuarios_activos' => intval($estadisticas['usuarios_activos']),
            'dias_con_actividad' => intval($estadisticas['dias_con_actividad']),
            'por_modulo' => $por_modulo
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Error al obtener logs: ' . $e->getMessage()
    ]);
}
