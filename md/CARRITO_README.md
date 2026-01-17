# Sistema de Carrito de Compras - Implementación Completa

## Cambios Realizados

### 1. Corrección de Validación de Stock
**Archivo:** `api/carrito.php`

**Problema:** Cuando un producto ya estaba en el carrito, la validación de stock fallaba porque comparaba la cantidad total contra el stock ya decrementado.

**Solución:** Ahora solo valida la cantidad adicional que se quiere agregar contra el stock disponible.

```php
// Antes: if ($nueva_cantidad > $producto['stock'])
// Ahora: if ($producto['stock'] < $cantidad)
```

### 2. Nueva Página de Carrito
**Archivos creados:**
- `carrito.html` - Vista del carrito de compras
- `carrito.js` - Lógica del carrito

**Características:**
- ✅ Lista de productos en el carrito
- ✅ Cambiar cantidad (+/-)
- ✅ Eliminar productos individuales
- ✅ Vaciar carrito completo
- ✅ Desglose de factura con IVA (22%)
- ✅ Botón de confirmar compra
- ✅ Devolución automática de stock al eliminar productos
- ✅ Diseño responsive

### 3. Desglose de Factura
```
Subtotal:  $100.00
IVA (22%): $ 22.00
-----------------------
Total:     $122.00
```

### 4. Gestión de Stock Mejorada
**Archivo:** `api/admin_productos.php`

Nuevo endpoint para devolver stock:
```javascript
PUT api/admin_productos.php
{
  "id": 123,
  "devolver_stock": 2
}
```

### 5. Actualización de Enlaces
Todos los íconos de carrito ahora apuntan a `carrito.html`:
- `index.html` ✅
- `catalogo.html` ✅
- `carrito.html` ✅

### 6. Estilos CSS Completos
**Archivo:** `styles.css`

Nuevos estilos agregados:
- `.carrito-page` - Contenedor principal
- `.carrito-item` - Tarjeta de producto
- `.carrito-resumen` - Panel de resumen (sticky)
- `.btn-confirmar`, `.btn-vaciar`, `.btn-continuar` - Botones de acción
- Responsive design para móviles

## Cómo Usar

### Ver el Carrito
1. Haz clic en el ícono 🛒 en cualquier página
2. Se abrirá `carrito.html` con todos tus productos

### Modificar Cantidades
- Usa los botones **+** y **-** para cambiar cantidades
- Si reduces a 0, el producto se elimina automáticamente
- El stock se devuelve automáticamente

### Eliminar Productos
- Haz clic en el ícono 🗑️ junto a cada producto
- Confirma la eliminación
- El stock se devuelve automáticamente a la base de datos

### Vaciar Carrito
- Haz clic en "Vaciar Carrito"
- Confirma la acción
- Todo el stock se devuelve

### Confirmar Compra
1. Revisa el desglose de IVA y total
2. Haz clic en "Confirmar Compra"
3. Confirma el pedido
4. El carrito se vacía y redirige a inicio

## Flujo Completo de Stock

```
1. Usuario agrega producto → Stock se decrementa en BD
2. Usuario aumenta cantidad → Stock se decrementa adicional
3. Usuario reduce cantidad → Stock se incrementa
4. Usuario elimina producto → Stock se devuelve completo
5. Usuario vacía carrito → Todo el stock se devuelve
6. Usuario confirma compra → Carrito se vacía (stock ya decrementado)
```

## Script de Corrección de Stock

Si hay problemas con el stock, ejecutar:
```bash
php api/corregir_stock.php
```

Este script:
- Muestra productos con stock negativo
- Lista productos en carritos
- Permite corregir manualmente

## Archivos Modificados

### Backend (PHP)
- ✅ `api/carrito.php` - Validación de stock corregida
- ✅ `api/admin_productos.php` - Endpoint para devolver stock
- ✅ `api/corregir_stock.php` - Script de diagnóstico (nuevo)

### Frontend (HTML)
- ✅ `carrito.html` - Página de carrito (nueva)
- ✅ `index.html` - Enlace actualizado
- ✅ `catalogo.html` - Enlace actualizado

### JavaScript
- ✅ `carrito.js` - Lógica del carrito (nuevo)
- ✅ `script.js` - Logs de debug eliminados

### CSS
- ✅ `styles.css` - Estilos del carrito agregados

## Pendientes/Mejoras Futuras

1. **Sistema de Pedidos:** Guardar pedidos confirmados en una tabla `pedidos`
2. **Histórico:** Mostrar pedidos anteriores del usuario
3. **Métodos de Pago:** Integrar pasarelas de pago
4. **Email de Confirmación:** Enviar email al confirmar compra
5. **Cupones de Descuento:** Sistema de cupones y promociones
6. **Stock Reservation:** Reservar stock por tiempo limitado
