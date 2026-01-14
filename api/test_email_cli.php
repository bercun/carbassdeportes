<?php
/**
 * Script CLI para probar envío de emails
 * Uso: php test_email_cli.php tu@email.com
 */

if (php_sapi_name() !== 'cli') {
    die("Este script solo puede ejecutarse desde la línea de comandos\n");
}

echo "\n===========================================\n";
echo "  TEST DE ENVÍO DE EMAILS - CarbassDeportes\n";
echo "===========================================\n\n";

// Verificar argumentos
if ($argc < 2) {
    echo "❌ Error: Debes proporcionar un email de destino\n";
    echo "Uso: php test_email_cli.php tu@email.com [numero_venta]\n\n";
    echo "Ejemplos:\n";
    echo "  php test_email_cli.php tu@email.com              (envía email de prueba)\n";
    echo "  php test_email_cli.php tu@email.com V-20250114-001 (envía email de venta específica)\n\n";
    exit(1);
}

$emailDestino = $argv[1];
$numeroVenta = $argv[2] ?? null;

// Validar email
if (!filter_var($emailDestino, FILTER_VALIDATE_EMAIL)) {
    echo "❌ Error: '$emailDestino' no es un email válido\n\n";
    exit(1);
}

echo "📧 Email destino: $emailDestino\n";

// 1. Verificar función mail()
echo "\n1. Verificando función mail()...\n";
if (function_exists('mail')) {
    echo "   ✅ Función mail() disponible\n";
} else {
    echo "   ❌ Función mail() NO disponible\n";
    exit(1);
}

// 2. Conectar a base de datos
echo "\n2. Conectando a base de datos...\n";
try {
    require_once __DIR__ . '/db.php';
    echo "   ✅ Conexión exitosa\n";
} catch (Exception $e) {
    echo "   ❌ Error: " . $e->getMessage() . "\n\n";
    exit(1);
}

// 3. Verificar administradores
echo "\n3. Verificando administradores...\n";
try {
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM usuarios WHERE rol = 'admin'");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "   ✅ Se encontraron {$result['total']} administrador(es)\n";
} catch (Exception $e) {
    echo "   ⚠️  No se pudo verificar: " . $e->getMessage() . "\n";
}

// 4. Enviar email
if ($numeroVenta) {
    echo "\n4. Enviando email de venta #$numeroVenta...\n";
    
    // Obtener datos de la venta
    $stmt = $pdo->prepare("SELECT * FROM ventas WHERE numero_venta = ?");
    $stmt->execute([$numeroVenta]);
    $venta = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$venta) {
        echo "   ❌ Venta no encontrada\n\n";
        exit(1);
    }
    
    echo "   📦 Venta encontrada: {$venta['nombre']} {$venta['apellido']}\n";
    echo "   💰 Total: \${$venta['total']}\n";
    
    // Llamar a enviar_factura.php
    $url = "http://" . gethostname() . "/api/enviar_factura.php";
    $data = json_encode(['numero_venta' => $numeroVenta]);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $result = json_decode($response, true);
    
    if ($httpCode === 200 && $result['success']) {
        echo "   ✅ Emails enviados exitosamente!\n";
        echo "   📧 Email cliente: {$result['email_cliente']}\n";
        echo "   🛠️  Admins notificados: {$result['admins_notificados']}\n";
    } else {
        echo "   ❌ Error al enviar: " . ($result['message'] ?? 'Error desconocido') . "\n";
    }
    
} else {
    echo "\n4. Enviando email de prueba a $emailDestino...\n";
    
    $asunto = "Test de Email - CarbassDeportes";
    $mensaje = construirEmailPrueba();
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: CarbassDeportes <noreply@carbassdeportes.com>" . "\r\n";
    
    $resultado = mail($emailDestino, $asunto, $mensaje, $headers);
    
    if ($resultado) {
        echo "   ✅ Email enviado exitosamente!\n";
        echo "   📥 Verifica la bandeja de entrada (y spam) de: $emailDestino\n";
    } else {
        echo "   ❌ Error al enviar el email\n";
        echo "\n   Posibles causas:\n";
        echo "   - El servidor no tiene configurado un servicio de correo\n";
        echo "   - El email del remitente no está autorizado\n";
        echo "   - Firewall bloqueando el puerto 25\n";
        echo "   - Necesitas usar SMTP autenticado (PHPMailer)\n";
    }
}

echo "\n===========================================\n";
echo "  Test completado\n";
echo "===========================================\n\n";

function construirEmailPrueba() {
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
    </head>
    <body style='font-family: Arial, sans-serif;'>
        <div style='max-width: 600px; margin: 0 auto; background: white;'>
            <div style='background: #1ecb63; padding: 20px; text-align: center;'>
                <h1 style='color: white; margin: 0;'>CarbassDeportes</h1>
                <p style='color: white; margin: 5px 0 0 0;'>Test de Email</p>
            </div>
            <div style='padding: 20px;'>
                <h2 style='color: #1ecb63;'>✅ Sistema Funcionando</h2>
                <p>Si estás leyendo esto, el sistema de emails está configurado correctamente.</p>
                <p><strong>Fecha:</strong> " . date('Y-m-d H:i:s') . "</p>
                <p><strong>Servidor:</strong> " . gethostname() . "</p>
            </div>
        </div>
    </body>
    </html>
    ";
}
?>
