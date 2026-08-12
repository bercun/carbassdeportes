<?php
// logger.php - Helper para registrar logs de auditoría

require_once __DIR__ . '/db.php';

class Logger {
    private $pdo;
    
    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }
    
    /**
     * Registrar un log de auditoría
     * 
     * @param string $accion - Acción realizada (LOGIN, PRODUCTO_CREADO, etc.)
     * @param string $modulo - Módulo del sistema (AUTH, PRODUCTOS, USUARIOS, VENTAS)
     * @param string $descripcion - Descripción detallada de la acción
     * @param int|null $registro_afectado - ID del registro afectado
     * @param array|null $datos_anteriores - Datos antes del cambio (para UPDATE/DELETE)
     * @param array|null $datos_nuevos - Datos después del cambio (para INSERT/UPDATE)
     * @param int|null $user_id - ID del usuario (null para acciones anónimas)
     * @param string|null $usuario_email - Email del usuario
     */
    public function log(
        $accion, 
        $modulo, 
        $descripcion, 
        $registro_afectado = null, 
        $datos_anteriores = null, 
        $datos_nuevos = null,
        $user_id = null,
        $usuario_email = null
    ) {
        try {
            // Obtener IP del cliente
            $ip_address = $this->getClientIP();
            
            // Obtener User Agent
            $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;
            
            // Si no se proporciona user_id, intentar obtenerlo de la sesión
            if ($user_id === null && isset($_SESSION['user_id'])) {
                $user_id = $_SESSION['user_id'];
            }
            
            // Si no se proporciona email, intentar obtenerlo de la sesión
            if ($usuario_email === null && isset($_SESSION['email'])) {
                $usuario_email = $_SESSION['email'];
            }
            
            // Convertir arrays a JSON
            $datos_anteriores_json = $datos_anteriores ? json_encode($datos_anteriores) : null;
            $datos_nuevos_json = $datos_nuevos ? json_encode($datos_nuevos) : null;
            
            // Insertar log
            $stmt = $this->pdo->prepare("
                INSERT INTO logs_auditoria (
                    user_id, 
                    usuario_email, 
                    accion, 
                    modulo, 
                    descripcion, 
                    registro_afectado,
                    ip_address,
                    user_agent,
                    datos_anteriores,
                    datos_nuevos
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $user_id,
                $usuario_email,
                $accion,
                $modulo,
                $descripcion,
                $registro_afectado,
                $ip_address,
                $user_agent,
                $datos_anteriores_json,
                $datos_nuevos_json
            ]);
            
            return true;
        } catch (Exception $e) {
            // No fallar si el log falla, solo registrar el error
            error_log("Error al registrar log: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Obtener la IP real del cliente
     */
    private function getClientIP() {
        $ip_keys = [
            'HTTP_CLIENT_IP',
            'HTTP_X_FORWARDED_FOR',
            'HTTP_X_FORWARDED',
            'HTTP_X_CLUSTER_CLIENT_IP',
            'HTTP_FORWARDED_FOR',
            'HTTP_FORWARDED',
            'REMOTE_ADDR'
        ];
        
        foreach ($ip_keys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP) !== false) {
                        return $ip;
                    }
                }
            }
        }
        
        return $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    }
}

// Función helper global
function registrar_log(
    $accion, 
    $modulo, 
    $descripcion, 
    $registro_afectado = null, 
    $datos_anteriores = null, 
    $datos_nuevos = null,
    $user_id = null,
    $usuario_email = null
) {
    $logger = new Logger();
    return $logger->log(
        $accion, 
        $modulo, 
        $descripcion, 
        $registro_afectado, 
        $datos_anteriores, 
        $datos_nuevos,
        $user_id,
        $usuario_email
    );
}
