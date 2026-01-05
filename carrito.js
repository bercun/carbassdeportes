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
    btnConfirmar.addEventListener('click', confirmarCompra);
  }
  
  if (btnVaciar) {
    btnVaciar.addEventListener('click', vaciarCarrito);
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
  const subtotal = carritoItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;
  
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('iva').textContent = `$${iva.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
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
  
  const subtotal = carritoItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;
  
  const confirmacion = confirm(
    `¿Confirmar compra?\n\n` +
    `Subtotal: $${subtotal.toFixed(2)}\n` +
    `IVA (22%): $${iva.toFixed(2)}\n` +
    `Total: $${total.toFixed(2)}`
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
