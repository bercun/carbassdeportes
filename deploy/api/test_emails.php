<?php
/**
 * Script de Prueba de Envío de Emails
 * Verifica que el sistema de correo esté configurado correctamente
 */

header('Content-Type: text/html; charset=UTF-8');

echo "<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <title>Test de Envío de Emails - CarbassDeportes</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1ecb63;
            border-bottom: 3px solid #1ecb63;
            padding-bottom: 10px;
        }
        h2 {
            color: #333;
            margin-top: 30px;
        }
        .test-section {
            background: #f9f9f9;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #1ecb63;
            border-radius: 4px;
        }
        .success {
            color: #4caf50;
            font-weight: bold;
        }
        .error {
            color: #f44336;
            font-weight: bold;
        }
        .warning {
            color: #ff9800;
            font-weight: bold;
        }
        .info {
            background: #e3f2fd;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #2196f3;
            border-radius: 4px;
        }
        code {
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background: #1ecb63;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }
        .button:hover {
            background: #17a352;
        }
        pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class='container'>
        <h1>🧪 Test de Sistema de Emails - CarbassDeportes</h1>
";

// 1. Verificar configuración de PHP
echo "<h2>1. Configuración de PHP</h2>";
echo "<div class='test-section'>";

if (function_exists('mail')) {
    echo "<p class='success'>✅ Función mail() está disponible</p>";
} else {
    echo "<p class='error'>❌ Función mail() NO está disponible</p>";
    echo "<p>Necesitas habilitar la función mail() en php.ini</p>";
}

// Mostrar configuración de email
$sendmail_path = ini_get('sendmail_path');
$smtp_server = ini_get('SMTP');
$smtp_port = ini_get('smtp_port');

echo "<p><strong>Sendmail Path:</strong> " . ($sendmail_path ?: "<span class='warning'>No configurado</span>") . "</p>";
echo "<p><strong>SMTP Server:</strong> " . ($smtp_server ?: "<span class='warning'>No configurado</span>") . "</p>";
echo "<p><strong>SMTP Port:</strong> " . ($smtp_port ?: "<span class='warning'>No configurado</span>") . "</p>";

echo "</div>";

// 2. Verificar base de datos
echo "<h2>2. Conexión a Base de Datos</h2>";
echo "<div class='test-section'>";

try {
    require_once 'db.php';
    echo "<p class='success'>✅ Conexión a base de datos exitosa</p>";
    
    // Verificar si hay administradores
    $stmt = $pdo->query("SELECT COUNT(*) as total, GROUP_CONCAT(email) as emails FROM usuarios WHERE rol = 'admin'");
    $admins = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admins['total'] > 0) {
        echo "<p class='success'>✅ Se encontraron {$admins['total']} administrador(es)</p>";
        echo "<p><strong>Emails de administradores:</strong> {$admins['emails']}</p>";
    } else {
        echo "<p class='error'>❌ No se encontraron administradores en la base de datos</p>";
    }
    
} catch (Exception $e) {
    echo "<p class='error'>❌ Error de conexión: " . $e->getMessage() . "</p>";
}

echo "</div>";

// 3. Test de envío de email
echo "<h2>3. Test de Envío de Email</h2>";
echo "<div class='test-section'>";

// Formulario para enviar email de prueba
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['test_email'])) {
    $destinatario = $_POST['email_destino'];
    
    echo "<p>📧 Intentando enviar email de prueba a: <strong>$destinatario</strong></p>";
    
    $asunto = "Test de Email - CarbassDeportes";
    $mensaje = construirEmailPrueba();
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: CarbassDeportes <noreply@carbassdeportes.com>" . "\r\n";
    $headers .= "Reply-To: contacto@carbassdeportes.com" . "\r\n";
    
    $resultado = @mail($destinatario, $asunto, $mensaje, $headers);
    
    if ($resultado) {
        echo "<p class='success'>✅ Email enviado exitosamente!</p>";
        echo "<p>Verifica la bandeja de entrada (y spam) de: <strong>$destinatario</strong></p>";
    } else {
        echo "<p class='error'>❌ Error al enviar el email</p>";
        echo "<p class='warning'>⚠️ Posibles causas:</p>";
        echo "<ul>";
        echo "<li>El servidor no tiene configurado un servicio de correo</li>";
        echo "<li>El email del remitente no está autorizado</li>";
        echo "<li>Firewall bloqueando el puerto 25</li>";
        echo "<li>Necesitas usar SMTP autenticado (PHPMailer)</li>";
        echo "</ul>";
    }
    
    echo "<hr>";
}

// Formulario
echo "
<form method='POST'>
    <p><strong>Ingresa un email para enviar una prueba:</strong></p>
    <input type='email' name='email_destino' required 
           placeholder='tu@email.com' 
           style='padding: 10px; width: 300px; border: 1px solid #ddd; border-radius: 4px;'>
    <button type='submit' name='test_email' class='button'>📧 Enviar Email de Prueba</button>
</form>
";

echo "</div>";

// 4. Test de verificación de venta
echo "<h2>4. Verificar Ventas Recientes</h2>";
echo "<div class='test-section'>";

try {
    $stmt = $pdo->query("SELECT * FROM ventas ORDER BY fecha_venta DESC LIMIT 5");
    $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($ventas) > 0) {
        echo "<p class='success'>✅ Se encontraron " . count($ventas) . " venta(s) reciente(s)</p>";
        echo "<table style='width: 100%; border-collapse: collapse; margin-top: 15px;'>";
        echo "<tr style='background: #f5f5f5;'>
                <th style='padding: 8px; border: 1px solid #ddd;'>Número</th>
                <th style='padding: 8px; border: 1px solid #ddd;'>Fecha</th>
                <th style='padding: 8px; border: 1px solid #ddd;'>Email</th>
                <th style='padding: 8px; border: 1px solid #ddd;'>Total</th>
                <th style='padding: 8px; border: 1px solid #ddd;'>Acción</th>
              </tr>";
        
        foreach ($ventas as $venta) {
            echo "<tr>";
            echo "<td style='padding: 8px; border: 1px solid #ddd;'>{$venta['numero_venta']}</td>";
            echo "<td style='padding: 8px; border: 1px solid #ddd;'>{$venta['fecha_venta']}</td>";
            echo "<td style='padding: 8px; border: 1px solid #ddd;'>{$venta['email']}</td>";
            echo "<td style='padding: 8px; border: 1px solid #ddd;'>\${$venta['total']}</td>";
            echo "<td style='padding: 8px; border: 1px solid #ddd;'>
                    <form method='POST' style='margin: 0;'>
                        <input type='hidden' name='numero_venta_test' value='{$venta['numero_venta']}'>
                        <button type='submit' style='padding: 5px 10px; background: #2196f3; color: white; border: none; border-radius: 3px; cursor: pointer;'>
                            📧 Reenviar Email
                        </button>
                    </form>
                  </td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p class='warning'>⚠️ No se encontraron ventas recientes</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>❌ Error al consultar ventas: " . $e->getMessage() . "</p>";
}

// Test de reenvío de email de venta
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['numero_venta_test'])) {
    $numero_venta = $_POST['numero_venta_test'];
    
    echo "<hr><h3>📧 Reenviando email para venta #$numero_venta</h3>";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://" . $_SERVER['HTTP_HOST'] . "/api/enviar_factura.php");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['numero_venta' => $numero_venta]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $result = json_decode($response, true);
    
    if ($httpCode === 200 && $result['success']) {
        echo "<p class='success'>✅ Emails reenviados exitosamente!</p>";
        echo "<p>📧 Email cliente: {$result['email_cliente']}</p>";
        echo "<p>🛠️ Admins notificados: {$result['admins_notificados']}</p>";
    } else {
        echo "<p class='error'>❌ Error al reenviar: " . ($result['message'] ?? 'Error desconocido') . "</p>";
        echo "<pre>" . htmlspecialchars($response) . "</pre>";
    }
}

echo "</div>";

// 5. Información de diagnóstico
echo "<h2>5. Información de Diagnóstico</h2>";
echo "<div class='info'>";
echo "<p><strong>Servidor:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>Host:</strong> " . $_SERVER['HTTP_HOST'] . "</p>";
echo "<p><strong>Document Root:</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "</div>";

// 6. Recomendaciones
echo "<h2>6. Recomendaciones</h2>";
echo "<div class='test-section'>";
echo "<h3>Si los emails NO se están enviando:</h3>";
echo "<ol>";
echo "<li><strong>Verifica la configuración del servidor:</strong> Algunos hosting requieren SMTP autenticado</li>";
echo "<li><strong>Usa PHPMailer:</strong> Más confiable que mail() nativo</li>";
echo "<li><strong>Revisa spam:</strong> Los emails pueden estar llegando a spam</li>";
echo "<li><strong>Logs del servidor:</strong> Revisa /var/log/mail.log o logs de PHP</li>";
echo "<li><strong>SPF/DKIM:</strong> Configura registros DNS para evitar ser marcado como spam</li>";
echo "</ol>";

echo "<h3>Para instalar PHPMailer (recomendado):</h3>";
echo "<pre>composer require phpmailer/phpmailer</pre>";
echo "</div>";

echo "
        <div style='text-align: center; margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 5px;'>
            <a href='test_emails.php' class='button'>🔄 Recargar Tests</a>
            <a href='../admin.html' class='button' style='background: #ff9800;'>🛠️ Ir al Panel Admin</a>
        </div>
    </div>
</body>
</html>
";

// Función para construir email de prueba
function construirEmailPrueba() {
    $html = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>Test de Email</title>
    </head>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;'>
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff;'>
            <!-- Encabezado -->
            <div style='background-color: #1ecb63; padding: 30px 20px; text-align: center;'>
                <h1 style='margin: 0; color: white; font-size: 28px;'>CarbassDeportes</h1>
                <p style='margin: 5px 0 0 0; color: white; font-size: 16px;'>Test de Configuración de Email</p>
            </div>
            
            <!-- Contenido -->
            <div style='padding: 30px 20px;'>
                <h2 style='color: #1ecb63; margin-top: 0;'>✅ ¡Sistema de Email Funcionando!</h2>
                
                <p>Si estás leyendo este mensaje, significa que el sistema de envío de emails está configurado correctamente.</p>
                
                <div style='background-color: #e8f5e9; padding: 20px; margin: 20px 0; border-left: 4px solid #1ecb63; border-radius: 4px;'>
                    <p style='margin: 0; font-size: 14px;'><strong>Fecha de prueba:</strong> " . date('Y-m-d H:i:s') . "</p>
                    <p style='margin: 8px 0 0 0; font-size: 14px;'><strong>Servidor:</strong> " . $_SERVER['HTTP_HOST'] . "</p>
                    <p style='margin: 8px 0 0 0; font-size: 14px;'><strong>PHP Version:</strong> " . phpversion() . "</p>
                </div>
                
                <p><strong>Próximos pasos:</strong></p>
                <ul style='line-height: 1.8;'>
                    <li>El sistema está listo para enviar confirmaciones de pedidos</li>
                    <li>Los clientes recibirán un email similar a este</li>
                    <li>Los administradores serán notificados de nuevos pedidos</li>
                </ul>
                
                <div style='margin-top: 30px; padding: 25px; background-color: #fff3e0; text-align: center; border-radius: 4px;'>
                    <p style='margin: 0; color: #f57c00; font-size: 16px; font-weight: bold;'>🎉 Sistema de Emails Configurado Correctamente</p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style='background-color: #f4f4f4; text-align: center; padding: 20px; color: #666; font-size: 12px;'>
                <p style='margin: 5px 0;'><strong>CarbassDeportes</strong></p>
                <p style='margin: 5px 0;'>Este es un email de prueba del sistema</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    return $html;
}
?>
