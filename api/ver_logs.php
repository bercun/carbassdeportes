<?php
/**
 * Visor de logs de PHP
 * Muestra los últimos errores y mensajes de debug
 */

header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <title>Logs del Sistema - CarbassDeportes</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background-color: #1e1e1e;
            color: #d4d4d4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        h1 {
            color: #1ecb63;
            border-bottom: 2px solid #1ecb63;
            padding-bottom: 10px;
        }
        .log-entry {
            background: #252526;
            padding: 10px;
            margin: 5px 0;
            border-left: 3px solid #555;
            border-radius: 3px;
            font-size: 12px;
            line-height: 1.5;
        }
        .log-entry.error {
            border-left-color: #f44336;
            background: #2d1e1e;
        }
        .log-entry.success {
            border-left-color: #4caf50;
            background: #1e2d1e;
        }
        .log-entry.warning {
            border-left-color: #ff9800;
            background: #2d281e;
        }
        .log-entry.info {
            border-left-color: #2196f3;
            background: #1e242d;
        }
        .timestamp {
            color: #858585;
            margin-right: 10px;
        }
        .refresh-btn {
            background: #1ecb63;
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 5px;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .refresh-btn:hover {
            background: #17a352;
        }
        .clear-btn {
            background: #f44336;
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 5px;
            font-size: 14px;
            margin-bottom: 20px;
            margin-left: 10px;
        }
        .clear-btn:hover {
            background: #d32f2f;
        }
        .filter {
            margin-bottom: 20px;
        }
        .filter label {
            margin-right: 15px;
            color: #d4d4d4;
        }
        .filter input {
            margin-right: 5px;
        }
        .stats {
            background: #252526;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .stats span {
            margin-right: 20px;
        }
        .no-logs {
            text-align: center;
            padding: 50px;
            color: #858585;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <h1>📋 Logs del Sistema</h1>
        
        <button class='refresh-btn' onclick='location.reload()'>🔄 Actualizar</button>
        <button class='clear-btn' onclick='clearLogs()'>🗑️ Limpiar Logs</button>
        
        <div class='filter'>
            <label><input type='checkbox' id='show-error' checked onchange='filterLogs()'> ❌ Errores</label>
            <label><input type='checkbox' id='show-success' checked onchange='filterLogs()'> ✅ Éxitos</label>
            <label><input type='checkbox' id='show-info' checked onchange='filterLogs()'> ℹ️ Info</label>
            <label><input type='checkbox' id='show-warning' checked onchange='filterLogs()'> ⚠️ Advertencias</label>
        </div>
        
        <?php
        // Intentar leer el archivo de logs de PHP
        $logFiles = [
            'php_errors.log',
            '../php_errors.log',
            '../../php_errors.log',
            '/var/log/php_errors.log',
            ini_get('error_log')
        ];
        
        $logContent = '';
        $logFile = '';
        
        // Buscar el archivo de logs
        foreach ($logFiles as $file) {
            if ($file && file_exists($file) && is_readable($file)) {
                $logFile = $file;
                $logContent = file_get_contents($file);
                break;
            }
        }
        
        // Si no se encuentra, usar error_log() de PHP
        if (!$logContent) {
            echo "<div class='stats'>";
            echo "<p><strong>📁 Archivo de logs:</strong> No se encontró archivo de logs configurado</p>";
            echo "<p><strong>💡 Sugerencia:</strong> Los logs se mostrarán en la consola del servidor o en el archivo configurado en php.ini</p>";
            echo "<p><strong>⚙️ error_log actual:</strong> " . (ini_get('error_log') ?: 'No configurado') . "</p>";
            echo "</div>";
            
            // Mostrar logs simulados de la sesión actual
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            if (!isset($_SESSION['app_logs'])) {
                $_SESSION['app_logs'] = [];
            }
            
            if (count($_SESSION['app_logs']) > 0) {
                echo "<div id='logs-container'>";
                foreach (array_reverse($_SESSION['app_logs']) as $log) {
                    $class = 'log-entry';
                    if (stripos($log, 'error') !== false || stripos($log, 'fallo') !== false) {
                        $class .= ' error';
                    } elseif (stripos($log, 'exito') !== false || stripos($log, 'success') !== false) {
                        $class .= ' success';
                    } elseif (stripos($log, 'warning') !== false || stripos($log, 'advertencia') !== false) {
                        $class .= ' warning';
                    } else {
                        $class .= ' info';
                    }
                    echo "<div class='$class'>" . htmlspecialchars($log) . "</div>";
                }
                echo "</div>";
            } else {
                echo "<div class='no-logs'>📭 No hay logs disponibles. Realiza alguna operación para ver los logs aquí.</div>";
            }
        } else {
            // Procesar y mostrar los últimos 100 logs
            $lines = explode("\n", $logContent);
            $lines = array_filter($lines); // Eliminar líneas vacías
            $lines = array_slice($lines, -100); // Últimas 100 líneas
            
            echo "<div class='stats'>";
            echo "<span><strong>📁 Archivo:</strong> $logFile</span>";
            echo "<span><strong>📊 Total líneas:</strong> " . count($lines) . "</span>";
            echo "</div>";
            
            if (count($lines) > 0) {
                echo "<div id='logs-container'>";
                foreach (array_reverse($lines) as $line) {
                    if (empty(trim($line))) continue;
                    
                    $class = 'log-entry';
                    if (stripos($line, 'error') !== false || stripos($line, 'fatal') !== false || stripos($line, 'fallo') !== false) {
                        $class .= ' error';
                    } elseif (stripos($line, 'exito') !== false || stripos($line, 'success') !== false || stripos($line, 'ok') !== false) {
                        $class .= ' success';
                    } elseif (stripos($line, 'warning') !== false || stripos($line, 'notice') !== false) {
                        $class .= ' warning';
                    } else {
                        $class .= ' info';
                    }
                    
                    echo "<div class='$class'>" . htmlspecialchars($line) . "</div>";
                }
                echo "</div>";
            } else {
                echo "<div class='no-logs'>📭 El archivo de logs está vacío</div>";
            }
        }
        ?>
        
        <script>
            function filterLogs() {
                const showError = document.getElementById('show-error').checked;
                const showSuccess = document.getElementById('show-success').checked;
                const showInfo = document.getElementById('show-info').checked;
                const showWarning = document.getElementById('show-warning').checked;
                
                const logs = document.querySelectorAll('.log-entry');
                logs.forEach(log => {
                    let show = false;
                    if (log.classList.contains('error') && showError) show = true;
                    if (log.classList.contains('success') && showSuccess) show = true;
                    if (log.classList.contains('info') && showInfo) show = true;
                    if (log.classList.contains('warning') && showWarning) show = true;
                    
                    log.style.display = show ? 'block' : 'none';
                });
            }
            
            function clearLogs() {
                if (confirm('¿Estás seguro de que quieres limpiar los logs?')) {
                    fetch('clear_logs.php', { method: 'POST' })
                        .then(() => location.reload());
                }
            }
            
            // Auto-refresh cada 5 segundos
            setTimeout(() => location.reload(), 5000);
        </script>
    </div>
</body>
</html>
