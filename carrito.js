// Carrito de compras - JavaScript

let carritoItems = [];
const IVA_RATE = 0.22; // 22%

// Inicializar
document.addEventListener('DOMContentLoaded', async () => {
  await verificarAutenticacion();
  await cargarCarrito();
  setupEventListeners();
});

// Verificar autenticación del usuario
async function verificarAutenticacion() {
  try {
    const response = await fetch('api/check_auth.php');
    const data = await response.json();
    
    if (!data.logged_in) {
      window.location.href = 'login.html';
      return;
    }
    
    // Actualizar UI con datos del usuario
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && data.user) {
      userNameElement.textContent = data.user.nombre || data.user.email;
      userNameElement.parentElement.classList.remove('hidden');
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.classList.remove('hidden');
    }
    
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.classList.add('hidden');
    }
    
    // Mostrar link de admin si es admin
    if (data.user && data.user.rol === 'admin') {
      const adminLink = document.getElementById('admin-link');
      if (adminLink) {
        adminLink.classList.remove('hidden');
      }
    }
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    window.location.href = 'login.html';
  }
}

// Event listeners
function setupEventListeners() {
  const btnConfirmar = document.getElementById('btn-confirmar');
  const btnVaciar = document.getElementById('btn-vaciar');
  
  if (btnConfirmar) {
    btnConfirmar.addEventListener('click', abrirModalFacturacion);
  }
  
  if (btnVaciar) {
    btnVaciar.addEventListener('click', vaciarCarrito);
  }

  // Listeners del modal de facturación
  const closeModalFacturacion = document.getElementById('close-modal-facturacion');
  const btnCancelarFacturacion = document.getElementById('btn-cancelar-facturacion');
  const formFacturacion = document.getElementById('form-facturacion');
  
  if (closeModalFacturacion) {
    closeModalFacturacion.addEventListener('click', cerrarModalFacturacion);
  }
  
  if (btnCancelarFacturacion) {
    btnCancelarFacturacion.addEventListener('click', cerrarModalFacturacion);
  }
  
  if (formFacturacion) {
    formFacturacion.addEventListener('submit', procesarFacturacion);
  }

  // Listeners del modal de factura
  const closeModalFactura = document.getElementById('close-modal-factura');
  const btnImprimir = document.getElementById('btn-imprimir');
  const btnFinalizar = document.getElementById('btn-finalizar');
  
  if (closeModalFactura) {
    closeModalFactura.addEventListener('click', cerrarModalFactura);
  }
  
  if (btnImprimir) {
    btnImprimir.addEventListener('click', imprimirFactura);
  }
  
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', finalizarCompra);
  }

  // Cerrar modal al hacer clic fuera
  const modalFacturacion = document.getElementById('modal-facturacion');
  const modalFactura = document.getElementById('modal-factura');
  
  if (modalFacturacion) {
    modalFacturacion.addEventListener('click', (e) => {
      if (e.target === modalFacturacion) {
        cerrarModalFacturacion();
      }
    });
  }
  
  if (modalFactura) {
    modalFactura.addEventListener('click', (e) => {
      if (e.target === modalFactura) {
        cerrarModalFactura();
      }
    });
  }
}

// Delegación de eventos para items del carrito (se configura después de renderizar)
function setupItemsListeners() {
  const itemsLista = document.getElementById('items-lista');
  if (!itemsLista) return;
  
  // Remover listener anterior si existe
  itemsLista.replaceWith(itemsLista.cloneNode(true));
  const nuevaLista = document.getElementById('items-lista');
  
  nuevaLista.addEventListener('click', (e) => {
    const target = e.target;
    
    // Botón de aumentar cantidad
    if (target.classList.contains('btn-aumentar')) {
      const carritoId = parseInt(target.dataset.carritoId);
      const productoId = parseInt(target.dataset.productoId);
      const cantidadActual = parseInt(target.dataset.cantidad);
      cambiarCantidad(carritoId, productoId, cantidadActual + 1);
    }
    
    // Botón de disminuir cantidad
    if (target.classList.contains('btn-disminuir')) {
      const carritoId = parseInt(target.dataset.carritoId);
      const productoId = parseInt(target.dataset.productoId);
      const cantidadActual = parseInt(target.dataset.cantidad);
      cambiarCantidad(carritoId, productoId, cantidadActual - 1);
    }
    
    // Botón de eliminar
    if (target.classList.contains('btn-eliminar') || target.closest('.btn-eliminar')) {
      const btn = target.classList.contains('btn-eliminar') ? target : target.closest('.btn-eliminar');
      const carritoId = parseInt(btn.dataset.carritoId);
      const productoId = parseInt(btn.dataset.productoId);
      const cantidad = parseInt(btn.dataset.cantidad);
      eliminarItem(carritoId, productoId, cantidad);
    }
  });
}

// Cargar items del carrito
async function cargarCarrito() {
  try {
    const response = await fetch('api/carrito.php');
    
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = 'login.html';
        return;
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al cargar el carrito');
    }
    
    const data = await response.json();
    carritoItems = data.items || [];
    
    if (carritoItems.length === 0) {
      mostrarCarritoVacio();
    } else {
      mostrarCarritoConItems();
      renderizarItems();
      calcularTotales();
      setupItemsListeners(); // Configurar listeners después de renderizar
    }
    
    actualizarBadgeCarrito();
  } catch (error) {
    console.error('Error al cargar carrito:', error);
    alert('Error al cargar el carrito: ' + error.message);
  }
}

// Mostrar carrito vacío}

// Mostrar carrito vacío
function mostrarCarritoVacio() {
  document.getElementById('carrito-vacio').classList.remove('hidden');
  document.getElementById('carrito-contenido').classList.add('hidden');
}

// Mostrar carrito con items
function mostrarCarritoConItems() {
  document.getElementById('carrito-vacio').classList.add('hidden');
  document.getElementById('carrito-contenido').classList.remove('hidden');
}

// Renderizar items del carrito
function renderizarItems() {
  const lista = document.getElementById('items-lista');
  
  if (!lista) return;
  
  lista.innerHTML = carritoItems.map(item => `
    <div class="carrito-item" data-item-id="${item.id}">
      <div class="item-imagen">
        <img src="${item.imagen_url || 'sours/img/articulos/default.jpg'}" alt="${item.nombre}">
      </div>
      <div class="item-info">
        <h3>${item.nombre}</h3>
        <p class="item-categoria">${item.categoria_nombre || 'Sin categoría'}</p>
        <p class="item-precio">$${parseFloat(item.precio).toFixed(2)}</p>
      </div>
      <div class="item-cantidad">
        <button class="btn-cantidad btn-disminuir" 
                data-carrito-id="${item.id}" 
                data-producto-id="${item.producto_id}" 
                data-cantidad="${item.cantidad}">-</button>
        <span class="cantidad">${item.cantidad}</span>
        <button class="btn-cantidad btn-aumentar" 
                data-carrito-id="${item.id}" 
                data-producto-id="${item.producto_id}" 
                data-cantidad="${item.cantidad}">+</button>
      </div>
      <div class="item-subtotal">
        <p>$${parseFloat(item.subtotal).toFixed(2)}</p>
      </div>
      <div class="item-acciones">
        <button class="btn-eliminar" 
                data-carrito-id="${item.id}" 
                data-producto-id="${item.producto_id}" 
                data-cantidad="${item.cantidad}"
                title="Eliminar">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

// Calcular totales
function calcularTotales() {
  // El total es la suma de los subtotales (precios con IVA incluido)
  const totalConIVA = carritoItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  
  // Calcular el subtotal sin IVA (precio base)
  const subtotalSinIVA = totalConIVA / (1 + IVA_RATE);
  
  // El IVA es la diferencia
  const iva = totalConIVA - subtotalSinIVA;
  
  document.getElementById('subtotal').textContent = `$${subtotalSinIVA.toFixed(2)}`;
  document.getElementById('iva').textContent = `$${iva.toFixed(2)}`;
  document.getElementById('total').textContent = `$${totalConIVA.toFixed(2)}`;
}

// Cambiar cantidad de un item
async function cambiarCantidad(carritoId, productoId, nuevaCantidad) {
  if (nuevaCantidad < 1) {
    const item = carritoItems.find(i => i.id === carritoId);
    if (item) {
      eliminarItem(carritoId, productoId, item.cantidad);
    }
    return;
  }
  
  try {
    const response = await fetch('api/carrito.php', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: carritoId,
        cantidad: nuevaCantidad
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      cargarCarrito(); // Recargar para actualizar
    } else {
      alert(result.error || 'Error al actualizar cantidad');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al actualizar cantidad');
  }
}

// Eliminar item del carrito
async function eliminarItem(carritoId, productoId, cantidad) {
  if (!confirm('¿Eliminar este producto del carrito?')) {
    return;
  }
  
  try {
    const response = await fetch('api/carrito.php', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: carritoId
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // El stock ya se devolvió en el servidor
      cargarCarrito(); // Recargar
    } else {
      alert(result.error || 'Error al eliminar producto');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al eliminar producto');
  }
}

// Vaciar carrito completo
async function vaciarCarrito() {
  if (!confirm('¿Estás seguro de vaciar todo el carrito?')) {
    return;
  }
  
  try {
    // Eliminar cada item (la API devolverá automáticamente el stock)
    for (const item of carritoItems) {
      await fetch('api/carrito.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: item.id
        })
      });
    }
    
    cargarCarrito();
  } catch (error) {
    console.error('Error:', error);
    alert('Error al vaciar el carrito');
  }
}

// Confirmar compra
async function confirmarCompra() {
  if (carritoItems.length === 0) {
    alert('El carrito está vacío');
    return;
  }
  
  // El total con IVA incluido
  const totalConIVA = carritoItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const subtotalSinIVA = totalConIVA / (1 + IVA_RATE);
  const iva = totalConIVA - subtotalSinIVA;
  
  const confirmacion = confirm(
    `¿Confirmar compra?\n\n` +
    `Subtotal: $${subtotalSinIVA.toFixed(2)}\n` +
    `IVA (22%): $${iva.toFixed(2)}\n` +
    `Total: $${totalConIVA.toFixed(2)}`
  );
  
  if (!confirmacion) return;
  
  try {
    // El stock NO se devuelve al confirmar compra porque ya fue vendido
    // Solo vaciar el carrito
    for (const item of carritoItems) {
      await fetch('api/carrito.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: item.id,
          confirmar_compra: true  // Flag para NO devolver stock
        })
      });
    }
    
    alert('¡Compra confirmada! Gracias por tu pedido.');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error:', error);
    alert('Error al procesar la compra');
  }
}

// Abrir modal de facturación
function abrirModalFacturacion() {
  if (carritoItems.length === 0) {
    alert('El carrito está vacío');
    return;
  }
  
  const modal = document.getElementById('modal-facturacion');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
  }
}

// Cerrar modal de facturación
function cerrarModalFacturacion() {
  const modal = document.getElementById('modal-facturacion');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restaurar scroll
  }
}

// Procesar formulario de facturación
async function procesarFacturacion(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  
  // Obtener datos del formulario
  const datosFacturacion = {
    nombre: formData.get('nombre'),
    apellido: formData.get('apellido'),
    email: formData.get('email'),
    telefono: formData.get('telefono'),
    direccion: formData.get('direccion'),
    metodoPago: formData.get('metodo_pago'),
    observaciones: formData.get('observaciones') || ''
  };
  
  // Cerrar modal de facturación
  cerrarModalFacturacion();
  
  // Generar y mostrar factura
  mostrarFactura(datosFacturacion);
}

// Mostrar factura
function mostrarFactura(datosFacturacion) {
  // Calcular totales
  const totalConIVA = carritoItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  
  // Llenar datos de facturación
  document.getElementById('factura-nombre').textContent = `${datosFacturacion.nombre} ${datosFacturacion.apellido}`;
  document.getElementById('factura-direccion').textContent = datosFacturacion.direccion;
  document.getElementById('factura-telefono').textContent = datosFacturacion.telefono;
  document.getElementById('factura-email').textContent = datosFacturacion.email;
  
  // Fecha actual
  const fecha = new Date();
  const fechaFormateada = fecha.toLocaleDateString('es-UY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  document.getElementById('factura-fecha').textContent = fechaFormateada;
  
  // ID de factura (generado aleatoriamente)
  const facturaId = generarIdFactura();
  document.getElementById('factura-id').textContent = facturaId;
  document.getElementById('factura-emision').textContent = fechaFormateada;
  
  // Llenar tabla de productos
  const tbody = document.getElementById('factura-items');
  tbody.innerHTML = carritoItems.map(item => `
    <tr>
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>$${parseFloat(item.precio).toFixed(2)}</td>
      <td>$${parseFloat(item.subtotal).toFixed(2)}</td>
    </tr>
  `).join('');
  
  // Observaciones
  const observacionesTexto = datosFacturacion.observaciones.trim() || '(Vacío)';
  document.getElementById('factura-observaciones').textContent = observacionesTexto;
  
  // Total
  document.getElementById('factura-total-final').textContent = `$${totalConIVA.toFixed(2)}`;
  
  // Abrir modal de factura
  const modal = document.getElementById('modal-factura');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

// Generar número de pedido
function generarIdFactura() {
  // Generar un número de pedido secuencial basado en timestamp
  const timestamp = Date.now();
  // Tomar los últimos 8 dígitos y agregar un número aleatorio de 2 dígitos
  const numeroPedido = timestamp.toString().slice(-8) + Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return numeroPedido;
}

// Cerrar modal de factura
function cerrarModalFactura() {
  const modal = document.getElementById('modal-factura');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Imprimir factura
function imprimirFactura() {
  window.print();
}

// Finalizar compra
async function finalizarCompra() {
  const btnFinalizar = document.getElementById('btn-finalizar');
  const textoOriginal = btnFinalizar.textContent;
  
  try {
    // Deshabilitar botón y mostrar indicador de carga
    btnFinalizar.disabled = true;
    btnFinalizar.textContent = '⏳ Procesando...';
    
    // Obtener número de venta del DOM
    const numeroVenta = document.getElementById('factura-id').textContent;
    
    // Obtener datos de facturación del DOM
    const datosFacturacion = {
      nombre: document.getElementById('factura-nombre').textContent.split(' ')[0],
      apellido: document.getElementById('factura-nombre').textContent.split(' ').slice(1).join(' '),
      direccion: document.getElementById('factura-direccion').textContent,
      telefono: document.getElementById('factura-telefono').textContent,
      email: document.getElementById('factura-email').textContent,
      observaciones: document.getElementById('factura-observaciones').textContent !== '(Vacío)' 
        ? document.getElementById('factura-observaciones').textContent 
        : ''
    };
    
    // Calcular total
    const total = carritoItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    
    // Registrar venta en la base de datos
    btnFinalizar.textContent = '💾 Registrando venta...';
    const responseVenta = await fetch('api/ventas.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        numero_venta: numeroVenta,
        items: carritoItems,
        datosFacturacion: datosFacturacion,
        total: total
      })
    });
    
    const resultVenta = await responseVenta.json();
    
    if (!resultVenta.success) {
      throw new Error(resultVenta.error || 'Error al registrar la venta');
    }
    
    // Enviar emails de confirmación
    btnFinalizar.textContent = '📧 Enviando emails...';
    console.log('🔄 Iniciando envío de emails para venta:', numeroVenta);
    
    try {
      const responseEmail = await fetch('api/enviar_factura.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          numero_venta: numeroVenta
        })
      });
      
      console.log('📥 Respuesta HTTP recibida:', responseEmail.status);
      
      const resultEmail = await responseEmail.json();
      console.log('📧 Resultado completo:', resultEmail);
      
      if (resultEmail.success) {
        console.log('✅ Emails enviados correctamente:', resultEmail);
        alert('✅ Pedido confirmado y emails enviados correctamente');
      } else {
        console.error('⚠️ Error al enviar emails:', resultEmail);
        alert('⚠️ Pedido registrado pero hubo un problema al enviar los emails:\n' + resultEmail.message);
      }
    } catch (errorEmail) {
      console.error('❌ Error al enviar emails:', errorEmail);
      alert('⚠️ Pedido registrado pero no se pudieron enviar los emails de confirmación');
      // Continuar aunque falle el envío de emails
    }
    
    // Vaciar carrito sin devolver stock (compra confirmada)
    btnFinalizar.textContent = '🧹 Limpiando carrito...';
    for (const item of carritoItems) {
      await fetch('api/carrito.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: item.id,
          confirmar_compra: true  // Flag para NO devolver stock
        })
      });
    }
    
    cerrarModalFactura();
    alert(`✅ ¡Compra confirmada!\n\n📧 Se han enviado emails de confirmación a:\n• Tu correo electrónico\n• Administradores del sistema\n\nNúmero de venta: ${numeroVenta}\n\n¡Gracias por tu pedido!`);
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error:', error);
    btnFinalizar.disabled = false;
    btnFinalizar.textContent = textoOriginal;
    alert('❌ Error al procesar la compra: ' + error.message);
  }
}

// Actualizar badge del carrito
function actualizarBadgeCarrito() {
  const cartIcon = document.querySelector('.carrito');
  if (!cartIcon) return;
  
  let badge = cartIcon.querySelector('.cart-badge');
  const count = carritoItems.length;
  
  if (count > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      cartIcon.appendChild(badge);
    }
    badge.textContent = count;
  } else if (badge) {
    badge.remove();
  }
}

// Función logout para el botón Salir
function logout() {
  fetch('api/logout.php')
    .then(() => {
      window.location.href = 'login.html';
    })
    .catch(error => {
      console.error('Error:', error);
      window.location.href = 'login.html';
    });
}

// Función logout
function logout() {
  fetch('api/logout.php')
    .then(() => {
      window.location.href = 'login.html';
    })
    .catch(error => {
      console.error('Error:', error);
      window.location.href = 'login.html';
    });
}
