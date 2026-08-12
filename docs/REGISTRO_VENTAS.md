# Sistema de Registro de Ventas - Configuración Completada

## 📋 Descripción General

Se ha implementado un sistema completo de registro y gestión de ventas que permite:

1. **Registrar automáticamente cada venta** cuando un cliente finaliza su compra
2. **Almacenar información completa** del cliente y productos comprados
3. **Consultar historial de ventas** con filtros por fecha
4. **Generar reportes y estadísticas** de ventas
5. **Ver detalles completos** de cada venta

---

## 🗄️ Tablas de Base de Datos Creadas

### Tabla: `ventas`
Almacena la información principal de cada venta:
- `id`: Identificador único
- `numero_venta`: Número de venta único (visible en factura)
- `user_id`: ID del usuario que realizó la compra
- `fecha_venta`: Fecha y hora de la venta
- `subtotal`: Total sin IVA
- `iva`: Monto del IVA (22%)
- `total`: Total incluyendo IVA
- `nombre_cliente`, `apellido_cliente`, `email_cliente`, etc.
- `estado`: Estado de la venta (completada, pendiente, cancelada)

### Tabla: `detalle_ventas`
Almacena los productos de cada venta:
- `id`: Identificador único
- `venta_id`: Referencia a la venta
- `producto_id`: ID del producto vendido
- `nombre_producto`: Nombre del producto (guardado por si se elimina el producto)
- `cantidad`: Cantidad vendida
- `precio_unitario`: Precio al momento de la venta
- `subtotal`: Total de la línea (cantidad × precio)

---

## 🚀 Instrucciones de Instalación

### Paso 1: Crear las Tablas en la Base de Datos

Ejecuta el siguiente script SQL en tu base de datos MySQL:

```bash
# Opción 1: Desde phpMyAdmin
1. Abre phpMyAdmin
2. Selecciona tu base de datos (pruebaweb_chatgpt)
3. Ve a la pestaña "SQL"
4. Copia y pega el contenido del archivo: crear_tabla_ventas.sql
5. Haz clic en "Continuar"

# Opción 2: Desde línea de comandos
mysql -u root -p pruebaweb_chatgpt < crear_tabla_ventas.sql
```

### Paso 2: Verificar la Instalación

Verifica que las tablas se hayan creado correctamente:

```sql
SHOW TABLES LIKE 'ventas';
SHOW TABLES LIKE 'detalle_ventas';
```

---

## 📦 Archivos Modificados/Creados

### Nuevos Archivos:
- ✅ `crear_tabla_ventas.sql` - Script SQL para crear las tablas
- ✅ `api/ventas.php` - API para registrar y consultar ventas
- ✅ `api/detalle_venta.php` - API para obtener detalles de una venta específica
- ✅ `REGISTRO_VENTAS.md` - Este documento

### Archivos Modificados:
- ✅ `carrito.js` - Función `finalizarCompra()` actualizada para registrar ventas
- ✅ `admin.html` - Nueva pestaña "Ventas" con filtros y tabla de ventas
- ✅ `admin.js` - Funciones para cargar, filtrar y mostrar ventas
- ✅ `styles.css` - Estilos para la interfaz de ventas

---

## 🎯 Funcionalidades Implementadas

### 1. Registro Automático de Ventas
- Al finalizar una compra en el carrito, se registra automáticamente en la base de datos
- Se guarda toda la información del cliente (nombre, email, dirección, teléfono)
- Se almacenan todos los productos comprados con sus precios y cantidades
- Se genera un número de venta único

### 2. Panel de Ventas en Admin
- **Acceso**: Solo disponible para usuarios con rol de administrador
- **Ubicación**: Panel Admin → Pestaña "💰 Ventas"

### 3. Filtros de Búsqueda
- **Filtro por Fecha Inicio**: Buscar ventas desde una fecha específica
- **Filtro por Fecha Fin**: Buscar ventas hasta una fecha específica
- **Por defecto**: Muestra ventas de los últimos 30 días
- **Botón "Filtrar"**: Aplica los filtros seleccionados
- **Botón "Limpiar"**: Restaura los filtros a valores por defecto

### 4. Estadísticas de Ventas
Se muestran 4 indicadores principales:
- **Total Ventas**: Cantidad de ventas en el período
- **Monto Total**: Suma total de todas las ventas
- **Promedio por Venta**: Monto promedio de cada venta
- **Productos Vendidos**: Total de unidades vendidas

### 5. Tabla de Ventas
Muestra todas las ventas con:
- Número de venta
- Fecha y hora
- Nombre y email del cliente
- Cantidad de items
- Total de la venta
- Estado (completada/pendiente/cancelada)
- Botón para ver detalle

### 6. Detalle de Venta
Al hacer clic en el ícono 👁️ se abre un modal con:

**Información General:**
- Número de venta
- Fecha
- Estado

**Datos del Cliente:**
- Nombre completo
- Email
- Teléfono
- Dirección
- Observaciones (si las hay)

**Productos Comprados:**
- Tabla con cada producto
- Cantidad
- Precio unitario
- Subtotal

**Totales:**
- Subtotal (sin IVA)
- IVA (22%)
- Total final

**Acciones:**
- Botón "Imprimir" para imprimir el detalle
- Botón "Cerrar"

---

## 📊 Endpoints API Creados

### POST api/ventas.php
Registra una nueva venta

**Parámetros:**
```json
{
  "numero_venta": "1234567890",
  "items": [
    {
      "producto_id": 1,
      "nombre": "Pelota de Fútbol",
      "cantidad": 2,
      "precio": 1500.00,
      "subtotal": 3000.00
    }
  ],
  "datosFacturacion": {
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "telefono": "099123456",
    "direccion": "Calle 123",
    "observaciones": "Envío urgente"
  },
  "total": 3660.00
}
```

**Respuesta:**
```json
{
  "success": true,
  "venta_id": 1,
  "numero_venta": "1234567890",
  "message": "Venta registrada exitosamente"
}
```

### GET api/ventas.php
Obtiene listado de ventas (solo admin)

**Parámetros opcionales:**
- `fecha_inicio`: YYYY-MM-DD
- `fecha_fin`: YYYY-MM-DD
- `limit`: Número de resultados (default: 100)
- `offset`: Offset para paginación (default: 0)

**Ejemplo:**
```
GET api/ventas.php?fecha_inicio=2025-01-01&fecha_fin=2025-01-31
```

**Respuesta:**
```json
{
  "success": true,
  "ventas": [...],
  "total": 50,
  "estadisticas": {
    "total_ventas": 50,
    "total_monto": 125000.00,
    "promedio_venta": 2500.00,
    "total_productos_vendidos": 200
  }
}
```

### GET api/detalle_venta.php
Obtiene detalle de una venta específica (solo admin)

**Parámetros:**
- `id`: ID de la venta

**Ejemplo:**
```
GET api/detalle_venta.php?id=1
```

**Respuesta:**
```json
{
  "success": true,
  "venta": {
    "id": 1,
    "numero_venta": "1234567890",
    "fecha_venta": "2025-01-11 14:30:00",
    "total": 3660.00,
    ...
  },
  "detalles": [
    {
      "producto_id": 1,
      "nombre_producto": "Pelota de Fútbol",
      "cantidad": 2,
      "precio_unitario": 1500.00,
      "subtotal": 3000.00
    }
  ]
}
```

---

## 💡 Uso del Sistema

### Para Clientes:
1. Agregar productos al carrito
2. Hacer clic en "Confirmar Compra"
3. Llenar el formulario de facturación
4. Revisar la factura generada
5. Hacer clic en "Finalizar Compra"
6. **¡La venta se registra automáticamente!**

### Para Administradores:
1. Iniciar sesión como administrador
2. Ir a "Panel Admin"
3. Hacer clic en la pestaña "💰 Ventas"
4. Usar los filtros de fecha para buscar ventas específicas
5. Ver estadísticas del período seleccionado
6. Hacer clic en 👁️ para ver detalles de cualquier venta
7. Imprimir detalles si es necesario

---

## 🔐 Seguridad

- ✅ **Autenticación**: Solo usuarios autenticados pueden realizar compras
- ✅ **Autorización**: Solo administradores pueden ver el historial de ventas
- ✅ **Validación**: Todos los datos se validan antes de guardar
- ✅ **Transacciones**: Se usan transacciones SQL para garantizar integridad
- ✅ **Índices**: Tablas optimizadas con índices para búsquedas rápidas

---

## 📈 Reportes Disponibles

### Estadísticas en Tiempo Real:
- Total de ventas en el período
- Monto total recaudado
- Ticket promedio
- Cantidad de productos vendidos

### Filtros de Búsqueda:
- Por rango de fechas
- Paginación para grandes volúmenes

### Información Detallada:
- Cliente que realizó la compra
- Productos comprados
- Precios al momento de la compra
- Desglose de IVA

---

## 🛠️ Solución de Problemas

### Problema: No se registran las ventas
**Solución**: Verificar que las tablas estén creadas ejecutando:
```sql
SHOW TABLES LIKE 'ventas';
```

### Problema: Error al acceder a la pestaña Ventas
**Solución**: Verificar que el usuario tenga rol 'admin' en la tabla usuarios

### Problema: No aparecen ventas en el panel
**Solución**: 
1. Verificar los filtros de fecha
2. Realizar una compra de prueba
3. Verificar en la base de datos que se guardó:
```sql
SELECT * FROM ventas ORDER BY fecha_venta DESC LIMIT 10;
```

---

## 🎉 ¡Sistema Completado!

El sistema de registro de ventas está completamente funcional y listo para usar. Cada venta se registrará automáticamente y podrás consultar el historial completo desde el panel de administración.

### Próximos pasos recomendados:
- Probar con una compra real
- Verificar que los datos se guardan correctamente
- Explorar las estadísticas en el panel de ventas
- Generar tu primer reporte de ventas

---

**Fecha de implementación**: 11 de enero de 2026  
**Versión**: 1.0
