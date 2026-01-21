# Manual de Usuario - CarbassDeportes

## 📖 Índice

1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Acceso al Sistema](#acceso-al-sistema)
4. [Funciones para Usuarios](#funciones-para-usuarios)
5. [Funciones de Administración](#funciones-de-administración)
6. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🎯 Introducción

**CarbassDeportes** es una plataforma de comercio electrónico especializada en artículos deportivos y coleccionables. El sistema permite a los usuarios explorar productos, realizar compras y gestionar su carrito de compras, mientras que los administradores pueden gestionar el inventario, usuarios y ventas.

### Características principales:
- ✅ Catálogo de productos organizado por categorías
- ✅ Sistema de carrito de compras
- ✅ Autenticación de usuarios (registro/login)
- ✅ Panel de administración completo
- ✅ Gestión de inventario y stock
- ✅ Sistema de facturación automática
- ✅ Diseño responsive (adaptado a móviles y tablets)

---

## 💻 Requisitos del Sistema

### Para Usuarios:
- **Navegador web moderno**: Chrome, Firefox, Safari, Edge (versiones actualizadas)
- **Conexión a Internet**: Estable para cargar productos e imágenes
- **JavaScript habilitado**: Necesario para funcionalidades interactivas
- **Resolución mínima**: 320px (compatible con móviles)

### Para Administradores:
- Los mismos requisitos que usuarios
- **Cuenta de administrador**: Solicitarla al equipo técnico

---

## 🔐 Acceso al Sistema

### Registro de Nueva Cuenta

1. **Acceder a la página de registro**
   - Desde la página principal, haz clic en **"Iniciar Sesión"** en la barra superior
   - O navega directamente a `login.html`

2. **Cambiar a modo registro**
   - En la página de login, haz clic en **"Regístrate aquí"**
   - El formulario cambiará para mostrar campos adicionales

3. **Completar el formulario**
   - **Email**: Introduce tu correo electrónico (debe ser único)
   - **Contraseña**: Mínimo 6 caracteres
   - **Nombre completo**: Tu nombre para identificarte en el sistema

4. **Confirmar registro**
   - Haz clic en **"Registrarse"**
   - Si el registro es exitoso, serás redirigido a la página principal
   - Tu sesión se iniciará automáticamente

### Iniciar Sesión

1. **Acceder al login**
   - Haz clic en **"Iniciar Sesión"** en la barra superior

2. **Introducir credenciales**
   - **Email**: El correo con el que te registraste
   - **Contraseña**: Tu contraseña

3. **Acceder**
   - Haz clic en **"Iniciar Sesión"**
   - Serás redirigido a la página principal
   - Tu nombre aparecerá en la barra superior

### Cerrar Sesión

- Haz clic en el botón **"Salir"** en la barra superior derecha
- Tu sesión se cerrará y volverás a la página principal

---

## 👥 Funciones para Usuarios

### 1. Navegación Principal

#### Barra de Usuario (Superior)
- **Nombre de usuario**: Muestra tu nombre cuando estás conectado
- **🛠️ Panel Admin**: Visible solo para administradores
- **🛒 Carrito**: Acceso directo a tu carrito de compras
- **Iniciar Sesión / Salir**: Según tu estado de sesión

#### Menú de Navegación
- **Home**: Página principal con productos destacados
- **Categorías**: Navegación rápida por tipos de productos
- **Coleccionables**: Sección especial de artículos de colección
- **Ofertas**: Productos con descuentos especiales
- **Catálogo**: Vista completa de todos los productos
- **Nosotros**: Información de contacto y ubicación

#### Menú Móvil
- En dispositivos móviles, el menú se convierte en un **menú hamburguesa** (☰)
- Haz clic en el ícono para abrir el menú lateral
- Haz clic en **✕** o fuera del menú para cerrarlo

### 2. Explorar Productos

#### Página Principal (Home)

**Carrusel de Imágenes**
- Visualización automática de imágenes promocionales
- Controles manuales: **◀** (anterior) y **▶** (siguiente)
- Navegación con teclado: flechas izquierda/derecha
- Cambio automático cada 4 segundos

**Secciones de Productos**:

1. **Artículos Destacados**
   - Productos seleccionados como prioritarios
   - Máximo 3 productos visibles
   - Enlace "Ver todo" para acceder al catálogo completo

2. **Categorías** (Íconos)
   - ⚽ **Fútbol**: Pelotas, camisetas, botines, etc.
   - 🏀 **Basket**: Pelotas, zapatillas, uniformes
   - 💪 **Gym**: Pesas, equipamiento, ropa deportiva
   - 🏆 **Coleccionables**: Artículos de edición limitada

3. **Coleccionables**
   - Productos únicos y de edición limitada
   - Camisetas históricas, banderines, figuras

4. **Recién Agregados**
   - Últimos productos incorporados al catálogo
   - Vista en grilla pequeña (4 productos)

5. **Ofertas**
   - Productos con descuentos especiales
   - Precio destacado en rojo

**Panel Lateral (Aside - Solo en Desktop)**:
- **Promociones visuales**: Banners de ofertas especiales
- **Video promocional**: Se reproduce al pasar el mouse
- **Coleccionable aleatorio**: Cambia en cada visita

#### Catálogo Completo

1. **Acceder al catálogo**
   - Haz clic en **"Catálogo"** en el menú
   - O en cualquier enlace **"Ver todo"**

2. **Navegación por categorías**
   - Los productos están organizados en secciones:
     - **Fútbol**
     - **Baloncesto**
     - **Gym/Running**
     - **Coleccionables**
   - Cada sección tiene su ícono distintivo

3. **Información del producto**
   Cada tarjeta muestra:
   - **Imagen**: Foto del producto
   - **Nombre**: Título del artículo
   - **Descripción**: Breve descripción
   - **Precio**: En formato $XX.XX
   - **Estado de stock**:
     - ✅ "Agregar al carrito" - Disponible
     - 🚫 "Sin stock" - No disponible
   - **Etiquetas especiales**:
     - 🌟 Destacado
     - 🔥 Oferta
     - ✨ Nuevo

### 3. Gestión del Carrito de Compras

#### Agregar Productos al Carrito

1. **Requisito previo**: Debes estar autenticado
   - Si no has iniciado sesión, el sistema te pedirá hacerlo

2. **Agregar producto**
   - En la tarjeta del producto, haz clic en **"Agregar al carrito"**
   - Aparecerá un mensaje de confirmación
   - El producto se agregará con cantidad = 1

3. **Notificaciones**:
   - ✅ "Producto agregado al carrito"
   - ⚠️ "Ya tienes este producto en el carrito"
   - ❌ Error si no hay stock disponible

#### Ver y Gestionar el Carrito

1. **Acceder al carrito**
   - Haz clic en el ícono **🛒** en la barra superior

2. **Vista del carrito**

   **Si está vacío**:
   - Mensaje: "Tu carrito está vacío"
   - Botón "Continuar Comprando" para volver

   **Si tiene productos**:
   
   **Lista de productos** (Lado izquierdo):
   - Imagen del producto
   - Nombre y descripción
   - Precio unitario
   - **Controles de cantidad**:
     - **➖** Disminuir cantidad
     - Número (cantidad actual)
     - **➕** Aumentar cantidad
   - **🗑️ Eliminar**: Quitar producto del carrito
   - **Subtotal** por producto

   **Resumen del pedido** (Lado derecho):
   - **Subtotal**: Suma de todos los productos
   - **IVA (22%)**: Impuesto calculado automáticamente
   - **Total**: Monto final a pagar
   - **Botones de acción**:
     - **Confirmar Compra**: Proceder al pago
     - **Vaciar Carrito**: Eliminar todos los productos
     - **Continuar Comprando**: Volver al catálogo

3. **Modificar cantidades**
   - Usa los botones **➕** y **➖**
   - Los precios se actualizan automáticamente
   - La cantidad mínima es 1
   - Si reduces a 0, se elimina el producto

4. **Eliminar productos**
   - Haz clic en el ícono **🗑️**
   - El producto se eliminará inmediatamente
   - Los totales se recalculan

5. **Vaciar carrito completo**
   - Haz clic en **"Vaciar Carrito"**
   - Se solicitará confirmación
   - Todos los productos serán eliminados

#### Proceso de Compra

1. **Confirmar compra**
   - Haz clic en **"Confirmar Compra"**
   - Se abrirá el **formulario de facturación**

2. **Completar datos de facturación**
   - **Nombre completo**: Tu nombre (prellenado si está en tu perfil)
   - **Email**: Tu correo (prellenado)
   - **Teléfono**: Número de contacto
   - **Dirección**: Dirección de envío completa
   - **Observaciones**: Notas adicionales (opcional)

3. **Confirmar pedido**
   - Revisa que los datos sean correctos
   - Haz clic en **"Confirmar Pedido"**
   - O **"Cancelar"** para volver al carrito

4. **Factura generada**
   - Se mostrará la **factura final** con:
     - Número de venta único
     - Fecha y hora
     - Datos del cliente
     - Detalle de productos (nombre, cantidad, precio)
     - Subtotal, IVA y Total
   - **Opciones**:
     - **📄 Imprimir**: Imprimir la factura
     - **✅ Finalizar**: Completar la compra

5. **Finalizar compra**
   - El stock se actualiza automáticamente
   - El carrito se vacía
   - Recibirás un mensaje de confirmación
   - Serás redirigido a la página principal

**Notas importantes**:
- La factura también se envía por email (si está configurado)
- El número de venta es único e irrepetible
- Los productos sin stock no se pueden agregar al carrito

---

## 🔧 Funciones de Administración

### Acceso al Panel de Administración

1. **Requisitos**:
   - Tener una cuenta con rol **"admin"**
   - Estar autenticado en el sistema

2. **Acceder al panel**:
   - Haz clic en el ícono **🛠️** en la barra superior
   - O navega directamente a `admin.html`

3. **Seguridad**:
   - Si no eres administrador, verás: **"⛔ Acceso Denegado"**
   - Solo usuarios con rol "admin" pueden acceder

### Dashboard de Administración

**Estadísticas principales** (Parte superior):
- **Total de Productos**: Cantidad de productos en el catálogo
- **Total de Usuarios**: Usuarios registrados en el sistema
- **Total de Categorías**: Categorías disponibles

**Pestañas de gestión**:
- 📦 **Productos**: Gestión del catálogo
- 👥 **Usuarios**: Administración de cuentas
- 💰 **Ventas**: Registro de transacciones
- 📋 **Logs**: Registro de actividad del sistema

### 1. Gestión de Productos

#### Ver Listado de Productos

**Tabla de productos** muestra:
- **ID**: Identificador único
- **Imagen**: Miniatura del producto
- **Nombre**: Título del producto
- **Categoría**: Fútbol, Basket, Gym, Coleccionables
- **Precio**: Precio en formato monetario
- **Estado**: Destacado, Oferta, Nuevo, Normal
- **Stock**: Cantidad disponible
- **Acciones**: Editar y Eliminar

**Indicadores visuales**:
- 🌟 Destacado (fondo dorado)
- 🔥 Oferta (fondo rojo)
- ✨ Nuevo (fondo verde)

#### Agregar Nuevo Producto

1. **Abrir formulario**
   - Haz clic en **"➕ Agregar Producto"**
   - Se abrirá un modal (ventana emergente)

2. **Completar datos del producto**:
   - **Nombre**: Nombre descriptivo del producto
   - **Descripción**: Descripción detallada
   - **Precio**: Precio en formato decimal (ej: 29.99)
   - **Categoría**: Seleccionar de la lista:
     - Fútbol
     - Basket
     - Gym/Running
     - Coleccionables
   - **Estado**: Seleccionar:
     - Normal (predeterminado)
     - Destacado (aparece en la sección principal)
     - Oferta (se muestra en ofertas)
     - Recién Agregado (aparece en "nuevos")
   - **Stock**: Cantidad disponible (número entero)
   - **Imagen**: Subir archivo de imagen
     - Formatos aceptados: JPG, PNG, GIF
     - Se sube al servidor automáticamente

3. **Guardar producto**
   - Haz clic en **"Guardar Producto"**
   - Si todos los campos son correctos, se creará el producto
   - Aparecerá en la tabla inmediatamente
   - O haz clic en **"Cancelar"** para descartar

**Validaciones**:
- ✅ Todos los campos obligatorios deben completarse
- ✅ El precio debe ser un número válido
- ✅ El stock debe ser un número entero positivo
- ✅ La imagen debe ser un archivo válido

#### Editar Producto Existente

1. **Seleccionar producto**
   - En la tabla, haz clic en el botón **"✏️ Editar"**
   - Se abrirá el modal con los datos prellenados

2. **Modificar campos**
   - Cambia los valores que desees actualizar
   - Todos los campos son editables

3. **Guardar cambios**
   - Haz clic en **"Guardar Cambios"**
   - Los cambios se reflejarán inmediatamente
   - O **"Cancelar"** para descartar cambios

**Nota**: El ID del producto no se puede modificar

#### Eliminar Producto

1. **Seleccionar producto a eliminar**
   - Haz clic en **"🗑️ Eliminar"**

2. **Confirmar eliminación**
   - Aparecerá un mensaje de confirmación
   - Haz clic en **"Aceptar"** para confirmar
   - O **"Cancelar"** para abortar

3. **Resultado**:
   - El producto se elimina permanentemente
   - Se quita de la base de datos
   - También se elimina de los carritos de usuarios
   - La acción **no se puede deshacer**

**⚠️ Advertencia**: Al eliminar un producto:
- Se eliminará de todos los carritos
- Se perderá el historial asociado
- Las ventas previas mantendrán el registro

### 2. Gestión de Usuarios

#### Ver Listado de Usuarios

**Tabla de usuarios** muestra:
- **ID**: Identificador único
- **Email**: Correo electrónico
- **Nombre**: Nombre completo
- **Rol**: admin o user
- **Fecha de creación**: Cuándo se registró
- **Acciones**: Editar y Eliminar

**Filtros y búsqueda**:
- Puedes buscar usuarios por email o nombre
- Filtrar por rol (admin/user)

#### Editar Usuario

1. **Seleccionar usuario**
   - Haz clic en **"✏️ Editar"**

2. **Modificar datos**:
   - **Email**: Cambiar correo electrónico
   - **Nombre**: Actualizar nombre
   - **Rol**: Cambiar entre "admin" y "user"
   - **Contraseña**: (Opcional) Restablecer contraseña

3. **Guardar cambios**
   - Los cambios se aplican inmediatamente

**⚠️ Precaución**:
- No te elimines a ti mismo como administrador
- Mantén al menos un administrador activo

#### Eliminar Usuario

1. **Seleccionar usuario**
   - Haz clic en **"🗑️ Eliminar"**

2. **Confirmación**
   - El sistema pedirá confirmación

3. **Resultado**:
   - Se elimina la cuenta del usuario
   - Se elimina su carrito
   - Se mantiene el historial de ventas

### 3. Gestión de Ventas

#### Ver Registro de Ventas

**Tabla de ventas** muestra:
- **ID Venta**: Número único de transacción
- **Cliente**: Nombre del comprador
- **Email**: Correo del cliente
- **Total**: Monto total de la venta
- **Fecha**: Cuándo se realizó
- **Estado**: Pendiente, Completada, Cancelada
- **Acciones**: Ver detalle

**Funciones disponibles**:
- **Filtrar por fecha**: Seleccionar rango de fechas
- **Filtrar por estado**: Pendiente, Completada, Cancelada
- **Buscar**: Por ID de venta o email de cliente
- **Exportar**: Descargar reporte en CSV

#### Ver Detalle de Venta

1. **Abrir detalle**
   - Haz clic en **"👁️ Ver"** en una venta

2. **Información completa**:
   - **Datos del cliente**:
     - Nombre completo
     - Email
     - Teléfono
     - Dirección de envío
     - Observaciones
   
   - **Productos vendidos**:
     - Nombre del producto
     - Cantidad
     - Precio unitario
     - Subtotal
   
   - **Resumen financiero**:
     - Subtotal
     - IVA (22%)
     - Total
   
   - **Información de la transacción**:
     - Número de venta
     - Fecha y hora exacta
     - Estado actual

3. **Acciones disponibles**:
   - **Cambiar estado**: Marcar como Completada/Cancelada
   - **Reimprimir factura**: Generar nueva impresión
   - **Enviar factura por email**: Reenviar al cliente

#### Cambiar Estado de Venta

1. **Seleccionar venta**
   - En el detalle de la venta

2. **Cambiar estado**:
   - **Pendiente → Completada**: Cuando se procesa el pedido
   - **Pendiente → Cancelada**: Si se cancela la orden
   - **Completada → Cancelada**: Reversar una venta

3. **Efecto en el stock**:
   - Al cancelar una venta **completada**, el stock se restaura
   - Las ventas pendientes ya tienen el stock reservado

### 4. Sistema de Logs

#### Ver Registro de Actividad

**Tabla de logs** muestra:
- **ID**: Identificador del log
- **Usuario**: Quién realizó la acción
- **Acción**: Tipo de operación
- **Tabla**: Tabla afectada (usuarios, productos, ventas)
- **Registro ID**: ID del elemento afectado
- **Detalles**: Información adicional en formato JSON
- **Fecha**: Timestamp exacto

**Tipos de acciones registradas**:
- **INSERT**: Creación de nuevos registros
- **UPDATE**: Modificaciones
- **DELETE**: Eliminaciones
- **LOGIN**: Inicios de sesión
- **LOGOUT**: Cierres de sesión

**Filtros disponibles**:
- Por usuario
- Por tipo de acción
- Por tabla afectada
- Por rango de fechas

**Utilidad del sistema de logs**:
- 🔍 Auditoría: Rastrear cambios
- 🛡️ Seguridad: Detectar accesos no autorizados
- 🐛 Debugging: Identificar problemas
- 📊 Análisis: Comportamiento del sistema

#### Exportar Logs

1. **Aplicar filtros** (opcional)
   - Selecciona el período o tipo de eventos

2. **Exportar**
   - Haz clic en **"📥 Exportar Logs"**
   - Se descargará un archivo CSV
   - Útil para análisis externo

---

## ❓ Preguntas Frecuentes

### Para Usuarios

**P: ¿Necesito registrarme para ver los productos?**  
R: No, puedes explorar el catálogo sin registrarte. Solo necesitas una cuenta para agregar productos al carrito y realizar compras.

**P: ¿Puedo cambiar la cantidad de un producto en el carrito?**  
R: Sí, usa los botones ➕ y ➖ en cada producto dentro del carrito.

**P: ¿Qué pasa si un producto se queda sin stock después de agregarlo al carrito?**  
R: Al confirmar la compra, el sistema verificará el stock disponible. Si no hay suficiente, se te notificará y deberás ajustar tu pedido.

**P: ¿Cómo sé cuánto es el total con impuestos?**  
R: En el carrito, el resumen muestra claramente el Subtotal, IVA (22%) y Total final.

**P: ¿Puedo recuperar mi contraseña?**  
R: Actualmente, debes contactar al administrador para restablecer tu contraseña.

**P: ¿Cómo veo el historial de mis compras?**  
R: Esta funcionalidad está en desarrollo. Por ahora, conserva tus facturas enviadas por email.

**P: ¿El sitio funciona en móviles?**  
R: Sí, el sitio es completamente responsive y se adapta a smartphones y tablets.

**P: ¿Puedo eliminar mi cuenta?**  
R: Contacta al administrador del sistema para eliminar tu cuenta.

### Para Administradores

**P: ¿Cómo creo una cuenta de administrador?**  
R: Un administrador existente debe cambiar el rol de tu cuenta a "admin" desde el panel de usuarios, o se puede crear directamente en la base de datos.

**P: ¿Puedo recuperar un producto eliminado?**  
R: No, las eliminaciones son permanentes. Considera desactivar productos en lugar de eliminarlos (puedes poner stock en 0).

**P: ¿Cómo subo imágenes de productos?**  
R: Al crear/editar un producto, usa el botón "Seleccionar archivo" en el campo de imagen. Las imágenes se suben automáticamente al servidor.

**P: ¿Dónde se guardan las imágenes?**  
R: Las imágenes se guardan en la carpeta `sours/img/articulos/` del servidor.

**P: ¿Puedo exportar el catálogo completo?**  
R: Actualmente no hay función de exportación masiva. Puedes acceder directamente a la base de datos para exportaciones.

**P: ¿Cómo sé si una venta fue completada?**  
R: En la pestaña "Ventas", el estado de cada venta indica si está Pendiente, Completada o Cancelada.

**P: ¿Qué pasa con el stock cuando cancelo una venta?**  
R: Si la venta estaba completada, el stock se restaura automáticamente. Si estaba pendiente, el stock ya estaba disponible.

**P: ¿Los logs se pueden eliminar?**  
R: Por razones de auditoría, los logs deben conservarse. Contacta al administrador del sistema si necesitas limpiarlos.

**P: ¿Puedo cambiar los precios de múltiples productos a la vez?**  
R: No hay función de edición masiva actualmente. Debes editar cada producto individualmente.

**P: ¿Cómo agrego una nueva categoría?**  
R: Las categorías son fijas actualmente (Fútbol, Basket, Gym, Coleccionables). Para agregar nuevas categorías, se requiere modificación en la base de datos.

### Problemas Técnicos

**P: No puedo iniciar sesión**  
R: Verifica:
- Email correcto (distingue mayúsculas/minúsculas)
- Contraseña correcta
- Conexión a Internet estable
- Si persiste, contacta al administrador

**P: Las imágenes no cargan**  
R: 
- Verifica tu conexión a Internet
- Limpia la caché del navegador
- Recarga la página (F5 o Ctrl+R)

**P: No veo el botón "Agregar al carrito"**  
R: Asegúrate de haber iniciado sesión. Este botón solo aparece para usuarios autenticados.

**P: El menú móvil no se abre**  
R: Verifica que JavaScript esté habilitado en tu navegador.

**P: Los precios no se calculan correctamente**  
R: Recarga la página. Si persiste, reporta al administrador con detalles.

**P: No puedo confirmar mi compra**  
R: Verifica:
- Que tengas productos en el carrito
- Que los productos tengan stock disponible
- Que todos los campos del formulario estén completos

---

## 📞 Soporte y Contacto

### Información de Contacto

- **Email**: contacto@carbassdeportes.com
- **Teléfono**: +598 0000 0000
- **Redes Sociales**: @carbassdeportes

### Ubicación

**Galería Cristal**  
Montevideo, Uruguay

Ver mapa en la sección "Sobre Nosotros" de la página principal.

### Horarios de Atención

- Lunes a Viernes: 9:00 - 18:00
- Sábados: 10:00 - 14:00
- Domingos: Cerrado

---

## 📝 Notas Finales

### Seguridad

- **Nunca compartas tu contraseña** con nadie
- **Cierra sesión** cuando uses computadoras públicas
- Usa **contraseñas seguras** (combinación de letras, números y símbolos)
- Los administradores **nunca te pedirán tu contraseña**

### Privacidad

- Tus datos personales están protegidos
- No compartimos información con terceros
- Los datos de facturación solo se usan para procesar tu pedido

### Actualizaciones

Este manual corresponde a la versión actual del sistema. Las funcionalidades pueden variar con actualizaciones futuras. Consulta la documentación técnica para desarrolladores en `README.md`.

---

**Versión del Manual**: 1.0  
**Fecha**: Enero 2026  
**Sistema**: CarbassDeportes E-commerce Platform

---

*¡Gracias por usar CarbassDeportes! Esperamos que disfrutes de tu experiencia de compra.* 🏆⚽🏀
