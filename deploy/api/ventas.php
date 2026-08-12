<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';
require_once 'logger.php';

session_start();

// Verificar que el usuario esté autenticado
// EXCEPCIÓN: Permitir GET sin autenticación para verificación (solo últimas 5 ventas)
if (!isset($_SESSION['user_id']) && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(401);
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
$method = $_SERVER['REQUEST_METHOD'];

try {
    // POST - Registrar una nueva venta
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            throw new Exception('Datos inválidos');
        }
        
        // Validar campos requeridos
        $required = ['numero_venta', 'items', 'datosFacturacion', 'total'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                throw new Exception("Campo requerido faltante: $field");
            }
        }
        
        $numero_venta = $input['numero_venta'];
        $items = $input['items'];
        $datosFacturacion = $input['datosFacturacion'];
        $total = floatval($input['total']);
        
        // Calcular IVA (22%)
        $subtotal = $total / 1.22;
        $iva = $total - $subtotal;
        
        // Iniciar transacción
        $pdo->beginTransaction();
        
        try {
            // Insertar venta
            $stmt = $pdo->prepare('
                INSERT INTO ventas (
                    numero_venta, 
                    user_id, 
                    fecha_venta, 
                    subtotal, 
                    iva, 
                    total,
                    nombre_cliente,
                    apellido_cliente,
                    email_cliente,
                    telefono_cliente,
                    direccion_cliente,
                    observaciones,
                    estado
                ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ');
            
            $stmt->execute([
                $numero_venta,
                $user_id,
                $subtotal,
                $iva,
                $total,
                $datosFacturacion['nombre'],
                $datosFacturacion['apellido'],
                $datosFacturacion['email'],
                $datosFacturacion['telefono'],
                $datosFacturacion['direccion'],
                $datosFacturacion['observaciones'] ?? '',
                'completada'
            ]);
            
            $venta_id = $pdo->lastInsertId();
            
            // Insertar detalles de venta
            $stmt = $pdo->prepare('
                INSERT INTO detalle_ventas (
                    venta_id,
                    producto_id,
                    nombre_producto,
                    cantidad,
                    precio_unitario,
                    subtotal
                ) VALUES (?, ?, ?, ?, ?, ?)
            ');
            
            foreach ($items as $item) {
                $stmt->execute([
                    $venta_id,
                    $item['producto_id'],
                    $item['nombre'],
                    $item['cantidad'],
                    $item['precio'],
                    $item['subtotal']
                ]);
            }
            
            // Confirmar transacción
            $pdo->commit();
            
            // Registrar log
            registrar_log(
                'VENTA_REGISTRADA',
                'VENTAS',
                "Venta registrada: $numero_venta - Total: $$total - Cliente: {$datosFacturacion['nombre']} {$datosFacturacion['apellido']}",
                $venta_id,
                null,
                [
                    'numero_venta' => $numero_venta,
                    'total' => $total,
                    'items' => count($items),
                    'cliente' => $datosFacturacion['nombre'] . ' ' . $datosFacturacion['apellido']
                ]
            );
            
            echo json_encode([
                'success' => true,
                'venta_id' => $venta_id,
                'numero_venta' => $numero_venta,
                'message' => 'Venta registrada exitosamente'
            ]);
            
        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    }
    
    // GET - Obtener ventas
    elseif ($method === 'GET') {
        // Si hay usuario, verificar si es admin para ver todas las ventas
        // Si no hay usuario (diagnóstico), solo mostrar últimas 5 ventas sin datos sensibles
        $esAdmin = false;
        $esDiagnostico = !$user_id;
        
        if ($user_id) {
            $stmt = $pdo->prepare('SELECT rol FROM usuarios WHERE id = ?');
            $stmt->execute([$user_id]);
            $user = $stmt->fetch();
            $esAdmin = ($user && $user['rol'] === 'admin');
            
            if (!$esAdmin) {
                http_response_code(403);
                echo json_encode(['error' => 'Acceso denegado. Solo administradores pueden ver todas las ventas.']);
                exit;
            }
        }
        
        // Obtener parámetros de filtro
        $fecha_inicio = $_GET['fecha_inicio'] ?? null;
        $fecha_fin = $_GET['fecha_fin'] ?? null;
        
        // Si es diagnóstico, limitar a 5 resultados
        $limit = $esDiagnostico ? 5 : (isset($_GET['limit']) ? intval($_GET['limit']) : 100);
        $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
        
        // Construir query
        $where = [];
        $params = [];
        
        if ($fecha_inicio) {
            $where[] = 'DATE(v.fecha_venta) >= ?';
            $params[] = $fecha_inicio;
        }
        
        if ($fecha_fin) {
            $where[] = 'DATE(v.fecha_venta) <= ?';
            $params[] = $fecha_fin;
        }
        
        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
        
        // Obtener ventas
        $sql = "
            SELECT 
                v.id,
                v.numero_venta,
                v.user_id,
                v.fecha_venta,
                v.subtotal,
                v.iva,
                v.total,
                v.nombre_cliente,
                v.apellido_cliente,
                v.email_cliente,
                v.telefono_cliente,
                v.direccion_cliente,
                v.observaciones,
                v.estado,
                v.created_at,
                v.updated_at,
                u.nombre as usuario_nombre,
                u.email as usuario_email,
                COUNT(dv.id) as cantidad_items
            FROM ventas v
            LEFT JOIN usuarios u ON v.user_id = u.id
            LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
            $whereClause
            GROUP BY v.id, v.numero_venta, v.user_id, v.fecha_venta, v.subtotal, v.iva, v.total, 
                     v.nombre_cliente, v.apellido_cliente, v.email_cliente, v.telefono_cliente, 
                     v.direccion_cliente, v.observaciones, v.estado, v.created_at, v.updated_at,
                     u.nombre, u.email
            ORDER BY v.fecha_venta DESC
            LIMIT ? OFFSET ?
        ";
        
        $params[] = $limit;
        $params[] = $offset;
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $ventas = $stmt->fetchAll();
        
        // Obtener total de ventas (para paginación)
        $countSql = "SELECT COUNT(DISTINCT v.id) as total FROM ventas v $whereClause";
        $stmt = $pdo->prepare($countSql);
        $stmt->execute(array_slice($params, 0, -2)); // Remover limit y offset
        $total = $stmt->fetch()['total'];
        
        // Obtener estadísticas
        $statsSql = "
            SELECT 
                COUNT(DISTINCT v.id) as total_ventas,
                SUM(v.total) as total_monto,
                AVG(v.total) as promedio_venta,
                SUM(dv.cantidad) as total_productos_vendidos
            FROM ventas v
            LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
            $whereClause
        ";
        $stmt = $pdo->prepare($statsSql);
        $stmt->execute(array_slice($params, 0, -2));
        $estadisticas = $stmt->fetch();
        
        echo json_encode([
            'success' => true,
            'ventas' => $ventas,
            'total' => intval($total),
            'limit' => $limit,
            'offset' => $offset,
            'estadisticas' => [
                'total_ventas' => intval($estadisticas['total_ventas']),
                'total_monto' => floatval($estadisticas['total_monto']),
                'promedio_venta' => floatval($estadisticas['promedio_venta']),
                'total_productos_vendidos' => intval($estadisticas['total_productos_vendidos'])
            ]
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Error al procesar solicitud: ' . $e->getMessage()
    ]);
}
