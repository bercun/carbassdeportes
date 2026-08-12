<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

// Log para debugging
error_log("=== INICIO enviar_factura.php ===");

// Recibir datos del pedido
$input = file_get_contents('php://input');
error_log("Input recibido: " . $input);

$data = json_decode($input, true);
error_log("Data decodificado: " . print_r($data, true));

if (!isset($data['numero_venta'])) {
    error_log("ERROR: numero_venta no proporcionado");
    echo json_encode(['success' => false, 'message' => 'Datos incompletos', 'debug' => $data]);
    exit;
}

$numero_venta = $data['numero_venta'];
error_log("Procesando venta: " . $numero_venta);

try {
    // Obtener datos de la venta desde la base de datos
    $stmt = $pdo->prepare("
        SELECT v.*, u.email as usuario_email, u.nombre as usuario_nombre
        FROM ventas v
        LEFT JOIN usuarios u ON v.user_id = u.id
        WHERE v.numero_venta = ?
    ");
    $stmt->execute([$numero_venta]);
    $venta = $stmt->fetch(PDO::FETCH_ASSOC);

    error_log("Venta encontrada: " . ($venta ? "SI" : "NO"));
    if ($venta) {
        error_log("Datos venta: " . print_r($venta, true));
    }

    if (!$venta) {
        error_log("ERROR: Venta $numero_venta no encontrada en BD");
        echo json_encode(['success' => false, 'message' => 'Venta no encontrada', 'numero_venta' => $numero_venta]);
        exit;
    }

    // Decodificar items de la venta
    $items = json_decode($venta['items'], true);
    
    // Si items está en detalle_ventas, obtenerlos
    if (!$items) {
        $stmt = $pdo->prepare("
            SELECT producto_id, nombre_producto as nombre, cantidad, 
                   precio_unitario as precio, subtotal
            FROM detalle_ventas
            WHERE venta_id = ?
        ");
        $stmt->execute([$venta['id']]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Construir HTML del email para cliente
    $htmlCliente = construirEmailCliente($venta, $items);

    // Construir HTML del email para administradores
    $htmlAdmin = construirEmailAdmin($venta, $items);

    // Email del cliente
    $emailCliente = $venta['email_cliente'] ?: $venta['usuario_email'];
    error_log("Email cliente: $emailCliente");
    
    // Enviar email al cliente
    error_log("Enviando email al cliente...");
    $resultadoCliente = enviarEmail(
        $emailCliente,
        "Confirmación de Pedido #$numero_venta - CarbassDeportes",
        $htmlCliente
    );

    // Obtener emails de administradores
    error_log("Obteniendo administradores...");
    $stmt = $pdo->query("SELECT id, nombre, email FROM usuarios WHERE rol = 'admin'");
    $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
    error_log("Administradores encontrados: " . count($admins));
    
    if (count($admins) > 0) {
        error_log("Emails admins: " . json_encode(array_column($admins, 'email')));
    } else {
        error_log("WARNING: No se encontraron administradores con rol='admin'");
    }

    $resultadoAdmins = true;
    $adminsEnviados = 0;
    foreach ($admins as $admin) {
        error_log("Enviando a admin: {$admin['nombre']} ({$admin['email']})");
        $resultado = enviarEmail(
            $admin['email'],
            "Nuevo Pedido #$numero_venta - CarbassDeportes",
            $htmlAdmin
        );
        if ($resultado) {
            $adminsEnviados++;
        }
        $resultadoAdmins = $resultadoAdmins && $resultado;
    }

    error_log("Resultado cliente: " . ($resultadoCliente ? "OK" : "FALLO"));
    error_log("Resultado admins: " . ($resultadoAdmins ? "OK" : "FALLO"));
    error_log("Admins enviados exitosamente: $adminsEnviados de " . count($admins));
    
    if ($resultadoCliente && $resultadoAdmins) {
        error_log("=== EXITO: Todos los emails enviados ===");
        echo json_encode([
            'success' => true,
            'message' => 'Emails enviados correctamente',
            'email_cliente' => $emailCliente,
            'admins_notificados' => $adminsEnviados,
            'debug' => [
                'numero_venta' => $numero_venta,
                'items_count' => count($items),
                'admins_total' => count($admins)
            ]
        ]);
    } else {
        error_log("=== ERROR: Algunos emails fallaron ===");
        echo json_encode([
            'success' => false,
            'message' => 'Error al enviar algunos emails',
            'cliente_enviado' => $resultadoCliente,
            'admins_enviados' => $resultadoAdmins,
            'email_cliente' => $emailCliente,
            'admins_count' => count($admins),
            'admins_ok' => $adminsEnviados
        ]);
    }

} catch (Exception $e) {
    error_log("=== EXCEPCION en enviar_factura.php: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}

// Función para enviar email
function enviarEmail($destinatario, $asunto, $contenidoHTML) {
    error_log("Enviando email a: $destinatario - Asunto: $asunto");
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: CarbassDeportes <noreply@carbassdeportes.com>" . "\r\n";
    $headers .= "Reply-To: contacto@carbassdeportes.com" . "\r\n";
    
    $resultado = @mail($destinatario, $asunto, $contenidoHTML, $headers);
    
    error_log("Resultado envío a $destinatario: " . ($resultado ? "EXITO" : "FALLO"));
    
    return $resultado;
}

// Función para construir HTML de email para cliente
function construirEmailCliente($venta, $items) {
    $itemsHTML = '';
    foreach ($items as $item) {
        $itemsHTML .= "
            <tr>
                <td style='padding: 10px; border-bottom: 1px solid #ddd;'>{$item['nombre']}</td>
                <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: center;'>{$item['cantidad']}</td>
                <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right;'>\${$item['precio']}</td>
                <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right;'>\${$item['subtotal']}</td>
            </tr>
        ";
    }
    
    $html = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>Confirmación de Pedido</title>
    </head>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;'>
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff;'>
            <!-- Encabezado -->
            <div style='background-color: #1ecb63; padding: 30px 20px; text-align: center;'>
                <h1 style='margin: 0; color: white; font-size: 28px;'>CarbassDeportes</h1>
                <p style='margin: 5px 0 0 0; color: white; font-size: 16px;'>Confirmación de Pedido</p>
            </div>
            
            <!-- Contenido -->
            <div style='padding: 30px 20px;'>
                <h2 style='color: #1ecb63; margin-top: 0; font-size: 24px;'>¡Gracias por tu compra!</h2>
                
                <p style='font-size: 16px;'>Hola <strong>{$venta['nombre_cliente']}</strong>,</p>
                <p style='font-size: 14px; line-height: 1.6;'>Tu pedido ha sido recibido exitosamente. A continuación los detalles:</p>
                
                <!-- Información del Pedido -->
                <div style='background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #1ecb63; border-radius: 4px;'>
                    <p style='margin: 8px 0; font-size: 14px;'><strong>Número de Pedido:</strong> #{$venta['numero_venta']}</p>
                    <p style='margin: 8px 0; font-size: 14px;'><strong>Fecha:</strong> {$venta['fecha_venta']}</p>
                    <p style='margin: 8px 0; font-size: 14px;'><strong>Dirección de Envío:</strong> {$venta['direccion_cliente']}</p>
                    <p style='margin: 8px 0; font-size: 14px;'><strong>Teléfono:</strong> {$venta['telefono_cliente']}</p>
                    <p style='margin: 8px 0; font-size: 14px;'><strong>Email:</strong> {$venta['email_cliente']}</p>
                </div>
                
                <!-- Tabla de Productos -->
                <h3 style='color: #1ecb63; font-size: 18px; margin-top: 30px;'>Productos:</h3>
                <table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>
                    <thead>
                        <tr style='background-color: #f5f5f5;'>
                            <th style='padding: 12px 10px; text-align: left; border-bottom: 2px solid #1ecb63; font-size: 14px;'>Producto</th>
                            <th style='padding: 12px 10px; text-align: center; border-bottom: 2px solid #1ecb63; font-size: 14px;'>Cant.</th>
                            <th style='padding: 12px 10px; text-align: right; border-bottom: 2px solid #1ecb63; font-size: 14px;'>Precio</th>
                            <th style='padding: 12px 10px; text-align: right; border-bottom: 2px solid #1ecb63; font-size: 14px;'>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        $itemsHTML
                    </tbody>
                </table>
                
                <!-- Total -->
                <div style='text-align: right; margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 4px;'>
                    <p style='margin: 0; font-size: 20px; color: #1ecb63;'><strong>Total: \${$venta['total']}</strong></p>
                </div>
                
                <!-- Observaciones -->
                " . (!empty($venta['observaciones']) ? "
                <div style='margin-top: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;'>
                    <p style='margin: 0; font-weight: bold; font-size: 14px;'>Observaciones:</p>
                    <p style='margin: 8px 0 0 0; font-size: 14px;'>{$venta['observaciones']}</p>
                </div>
                " : "") . "
                
                <!-- Mensaje de agradecimiento -->
                <div style='margin-top: 30px; padding: 25px; background-color: #e8f5e9; text-align: center; border-radius: 4px;'>
                    <p style='margin: 0; color: #2e7d32; font-size: 16px; font-weight: bold;'>¡Gracias por confiar en CarbassDeportes!</p>
                    <p style='margin: 10px 0 0 0; font-size: 14px; color: #555;'>Recibirás una notificación cuando tu pedido sea enviado.</p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style='background-color: #f4f4f4; text-align: center; padding: 20px; color: #666; font-size: 12px;'>
                <p style='margin: 5px 0;'><strong>CarbassDeportes</strong></p>
                <p style='margin: 5px 0;'>CRA 80 N. 35-50, Montevideo, Uruguay</p>
                <p style='margin: 5px 0;'>NIT: 100331819-1</p>
                <p style='margin: 10px 0 0 0;'>
                    <a href='mailto:contacto@carbassdeportes.com' style='color: #1ecb63; text-decoration: none;'>contacto@carbassdeportes.com</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    return $html;
}

// Función para construir HTML para administradores
function construirEmailAdmin($venta, $items) {
    $itemsHTML = '';
    foreach ($items as $item) {
        $itemsHTML .= "
            <tr>
                <td style='padding: 10px; border-bottom: 1px solid #ddd;'>{$item['nombre']}</td>
                <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: center;'>{$item['cantidad']}</td>
                <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right;'>\${$item['precio']}</td>
                <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right;'>\${$item['subtotal']}</td>
            </tr>
        ";
    }
    
    $html = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>Nuevo Pedido</title>
    </head>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;'>
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff;'>
            <!-- Encabezado -->
            <div style='background-color: #ff9800; padding: 30px 20px; text-align: center;'>
                <h1 style='margin: 0; color: white; font-size: 28px;'>🛠️ Nuevo Pedido Recibido</h1>
                <p style='margin: 5px 0 0 0; color: white; font-size: 16px;'>Panel de Administración</p>
            </div>
            
            <!-- Contenido -->
            <div style='padding: 30px 20px;'>
                <h2 style='color: #ff9800; margin-top: 0; font-size: 24px;'>Detalles del Pedido #{$venta['numero_venta']}</h2>
                
                <!-- Información del Cliente -->
                <div style='background-color: #fff3e0; padding: 20px; margin: 20px 0; border-left: 4px solid #ff9800; border-radius: 4px;'>
                    <h3 style='margin-top: 0; color: #ff9800; font-size: 18px;'>Datos del Cliente:</h3>
                    <p style='margin: 8px 0; font-size: 14px;'><strong>Nombre:</strong> {$venta['nombre_cliente']} {$venta['apellido_cliente']}</p>
                    <p style='margin: 8px 0; font-size: 14px;'><strong>Email:</strong> {$venta['email_cliente']}</p>
                    <p style='margin: 8px 0; font-size: 14px;'><strong>Teléfono:</strong> {$venta['telefono_cliente']}</p>
                    <p style='margin: 8px 0; font-size: 14px;'><strong>Dirección:</strong> {$venta['direccion_cliente']}</p>
                </div>
                
                <!-- Información del Pedido -->
                <div style='background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 4px;'>
                    <p style='margin: 8px 0; font-size: 14px;'><strong>Fecha del Pedido:</strong> {$venta['fecha_venta']}</p>
                    <p style='margin: 8px 0; font-size: 14px;'><strong>Estado:</strong> <span style='background-color: #4caf50; color: white; padding: 4px 8px; border-radius: 3px;'>{$venta['estado']}</span></p>
                </div>
                
                <!-- Tabla de Productos -->
                <h3 style='color: #ff9800; font-size: 18px; margin-top: 30px;'>Productos Ordenados:</h3>
                <table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>
                    <thead>
                        <tr style='background-color: #f5f5f5;'>
                            <th style='padding: 12px 10px; text-align: left; border-bottom: 2px solid #ff9800; font-size: 14px;'>Producto</th>
                            <th style='padding: 12px 10px; text-align: center; border-bottom: 2px solid #ff9800; font-size: 14px;'>Cant.</th>
                            <th style='padding: 12px 10px; text-align: right; border-bottom: 2px solid #ff9800; font-size: 14px;'>Precio</th>
                            <th style='padding: 12px 10px; text-align: right; border-bottom: 2px solid #ff9800; font-size: 14px;'>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        $itemsHTML
                    </tbody>
                </table>
                
                <!-- Total -->
                <div style='text-align: right; margin-top: 20px; padding: 15px; background-color: #fff3e0; border-radius: 4px;'>
                    <p style='margin: 0; font-size: 20px; color: #ff9800;'><strong>Total del Pedido: \${$venta['total']}</strong></p>
                </div>
                
                <!-- Observaciones -->
                " . (!empty($venta['observaciones']) ? "
                <div style='margin-top: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;'>
                    <p style='margin: 0; font-weight: bold; font-size: 14px;'>Observaciones del Cliente:</p>
                    <p style='margin: 8px 0 0 0; font-size: 14px;'>{$venta['observaciones']}</p>
                </div>
                " : "") . "
                
                <!-- Acción requerida -->
                <div style='margin-top: 30px; padding: 25px; background-color: #e3f2fd; text-align: center; border-left: 4px solid #2196f3; border-radius: 4px;'>
                    <p style='margin: 0; color: #1976d2; font-weight: bold; font-size: 16px;'>⚠️ Acción Requerida</p>
                    <p style='margin: 10px 0; font-size: 14px;'>Por favor, procesa este pedido lo antes posible.</p>
                    <p style='margin: 15px 0 0 0;'>
                        <a href='https://carbass.brkoon.uy/admin.html' 
                           style='display: inline-block; padding: 12px 24px; background-color: #2196f3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;'>
                            Ver en Panel Admin
                        </a>
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style='background-color: #f4f4f4; text-align: center; padding: 20px; color: #666; font-size: 12px;'>
                <p style='margin: 5px 0;'>Este es un mensaje automático del sistema de CarbassDeportes</p>
                <p style='margin: 5px 0;'>No respondas a este email</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    return $html;
}
?>
