# Sistema de Logs de Auditoría - CarbassDeportes

## 📋 Descripción
Sistema completo de auditoría que registra todas las acciones importantes del sistema, permitiendo rastrear cambios, detectar problemas de seguridad y mantener un historial completo de operaciones.

## 🗄️ Estructura de la Base de Datos

### Tabla: `logs_auditoria`
```sql
- id (INT) - ID único del log
- user_id (INT) - ID del usuario que realizó la acción (NULL para acciones anónimas)
- usuario_email (VARCHAR) - Email del usuario
- accion (VARCHAR) - Tipo de acción realizada
- modulo (VARCHAR) - Módulo del sistema (AUTH, PRODUCTOS, USUARIOS, VENTAS)
- descripcion (TEXT) - Descripción detallada de la acción
- registro_afectado (INT) - ID del registro afectado
- ip_address (VARCHAR) - Dirección IP del cliente
- user_agent (TEXT) - Navegador/dispositivo usado
- datos_anteriores (JSON) - Estado previo del registro (para UPDATE/DELETE)
- datos_nuevos (JSON) - Estado posterior del registro (para INSERT/UPDATE)
- fecha_hora (TIMESTAMP) - Fecha y hora de la acción
```

## 📊 Módulos del Sistema

### 🔐 AUTH (Autenticación)
**Acciones registradas:**
- `LOGIN` - Inicio de sesión exitoso
- `LOGIN_FAILED` - Intento de inicio de sesión fallido
- `LOGOUT` - Cierre de sesión

**Archivos involucrados:**
- `api/login.php` - Registra LOGIN y LOGIN_FAILED
- `api/logout.php` - Registra LOGOUT

### 📦 PRODUCTOS
**Acciones registradas:**
- `PRODUCTO_CREADO` - Nuevo producto agregado
- `PRODUCTO_ACTUALIZADO` - Producto modificado
- `PRODUCTO_ELIMINADO` - Producto eliminado

**Archivos involucrados:**
- `api/admin_productos.php` - Registra todos los cambios en productos

### 👥 USUARIOS
**Acciones registradas:**
- `USUARIO_CREADO` - Nuevo usuario registrado
- `USUARIO_ELIMINADO` - Usuario eliminado
- `ROL_CAMBIADO` - Rol de usuario modificado

**Archivos involucrados:**
- `api/register.php` - Registra USUARIO_CREADO
- `api/usuarios.php` - Registra ROL_CAMBIADO y USUARIO_ELIMINADO

### 💰 VENTAS
**Acciones registradas:**
- `VENTA_REGISTRADA` - Nueva venta realizada

**Archivos involucrados:**
- `api/ventas.php` - Registra nuevas ventas

## 🛠️ Uso del Sistema

### Cómo Registrar un Log (Helper Function)
```php
<?php
require_once 'logger.php';

// Función helper
registrar_log(
    $accion,              // Ej: 'PRODUCTO_CREADO'
    $modulo,              // Ej: 'PRODUCTOS'
    $descripcion,         // Descripción detallada
    $registro_afectado,   // ID del registro (opcional)
    $datos_anteriores,    // Array con datos previos (opcional)
    $datos_nuevos,        // Array con datos nuevos (opcional)
    $user_id,             // ID usuario (opcional, se obtiene de sesión)
    $usuario_email        // Email (opcional, se obtiene de sesión)
);
```

### Ejemplo Práctico
```php
// Al crear un producto
registrar_log(
    'PRODUCTO_CREADO',
    'PRODUCTOS',
    "Producto creado: Zapatillas Nike",
    $producto_id,
    null,
    [
        'nombre' => 'Zapatillas Nike',
        'precio' => 5000,
        'stock' => 10
    ]
);

// Al cambiar rol de usuario
registrar_log(
    'ROL_CAMBIADO',
    'USUARIOS',
    "Rol de Juan Pérez cambiado de user a admin",
    $user_id,
    ['rol' => 'user'],
    ['rol' => 'admin']
);
```

## 🖥️ Interfaz de Consulta

### Panel de Administración
Pestaña **"📋 Logs"** en el admin que permite:

**Filtros disponibles:**
- Por módulo (AUTH, PRODUCTOS, USUARIOS, VENTAS)
- Por rango de fechas (inicio - fin)

**Estadísticas mostradas:**
- Total de logs registrados
- Usuarios activos
- Días con actividad
- Distribución por módulo

**Tabla de logs muestra:**
- Fecha y hora del evento
- Usuario que realizó la acción
- Módulo afectado
- Tipo de acción
- Descripción detallada
- Dirección IP

## 📁 Archivos del Sistema

### Core
- `crear_tabla_logs.sql` - Script SQL para crear la tabla
- `api/logger.php` - Helper para registrar logs
- `api/logs.php` - API para consultar logs

### Integración
- `api/login.php` - Logs de autenticación
- `api/logout.php` - Logs de cierre de sesión
- `api/register.php` - Logs de registro
- `api/admin_productos.php` - Logs de productos
- `api/usuarios.php` - Logs de usuarios
- `api/ventas.php` - Logs de ventas

### Frontend
- `admin.html` - Tab de logs en el panel
- `admin.js` - Funciones para cargar/mostrar logs
- `styles.css` - Estilos para badges y tabla

## 🔍 Casos de Uso

### 1. Auditoría de Seguridad
Detectar intentos de acceso no autorizados revisando logs de `LOGIN_FAILED`

### 2. Rastreo de Cambios
Ver quién modificó un producto y qué cambios se realizaron usando `datos_anteriores` y `datos_nuevos`

### 3. Análisis de Actividad
Identificar usuarios más activos y períodos de mayor actividad

### 4. Resolución de Problemas
Rastrear la secuencia de eventos que llevaron a un error

### 5. Cumplimiento Normativo
Mantener registro de todas las operaciones para auditorías externas

## 📈 Futuras Mejoras

- [ ] Exportar logs a CSV/Excel
- [ ] Alertas automáticas por actividad sospechosa
- [ ] Retención de logs con eliminación automática después de X días
- [ ] Dashboard con gráficos de actividad
- [ ] Búsqueda avanzada por texto completo
- [ ] Logs de visualización de datos sensibles

## 🚀 Instalación

1. **Ejecutar el script SQL:**
   ```bash
   Abrir phpMyAdmin → Importar → crear_tabla_logs.sql
   ```

2. **Verificar que todos los archivos PHP incluyan logger.php:**
   ```php
   require_once 'logger.php';
   ```

3. **Acceder al panel de administración:**
   ```
   Admin → Pestaña "Logs"
   ```

## 🛡️ Seguridad

- Solo usuarios con rol `admin` pueden ver los logs
- Las contraseñas nunca se registran en los logs
- IPs y User Agents se capturan para rastreo
- Datos sensibles se almacenan en formato JSON para fácil consulta

---

**Desarrollado para:** CarbassDeportes  
**Versión:** 1.0  
**Fecha:** Enero 2026
