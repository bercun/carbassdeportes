// admin.js - Lógica del panel de administración

let currentEditingProductId = null;
// userSession es definida en auth-check-php.js

// Verificar permisos de administrador al cargar la página
async function checkAdminAccess() {
  try {
    const response = await fetch('api/check_auth.php');
    const data = await response.json();
    
    if (!data.logged_in) {
      // No hay usuario autenticado, redirigir a login
      window.location.href = 'login.html';
      return;
    }
    
    userSession = data.user;
    
    if (userSession.rol !== 'admin') {
      // No es administrador, mostrar mensaje de acceso denegado
      document.getElementById('access-denied').classList.remove('hidden');
      document.getElementById('admin-panel').classList.add('hidden');
    } else {
      // Es administrador, mostrar el panel
      document.getElementById('access-denied').classList.add('hidden');
      document.getElementById('admin-panel').classList.remove('hidden');
      
      // Cargar datos
      loadProducts();
      loadStats();
    }
  } catch (error) {
    console.error("Error al verificar autenticación:", error);
    window.location.href = 'login.html';
  }
}

// Ejecutar verificación al cargar la página
checkAdminAccess();

// Cargar estadísticas
async function loadStats() {
  try {
    const response = await fetch('api/productos.php');
    const productos = await response.json();
    document.getElementById('total-productos').textContent = productos.length;
  } catch (err) {
    console.error("Error al contar productos:", err);
    document.getElementById('total-productos').textContent = "Error";
  }
  
  // Total de usuarios (podrías crear un endpoint para esto)
  document.getElementById('total-usuarios').textContent = "-";
}

// Cargar productos
async function loadProducts() {
  try {
    const response = await fetch('api/productos.php');
    const productos = await response.json();
    
    const tbody = document.getElementById('products-table-body');
    
    if (productos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay productos registrados</td></tr>';
      return;
    }

    tbody.innerHTML = productos.map(product => `
      <tr>
        <td><img src="${product.imagen_url || 'https://placehold.co/50x50'}" alt="${product.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" /></td>
        <td>${product.nombre}</td>
        <td><span class="categoria-badge">${product.categoria_nombre || 'Sin categoría'}</span></td>
        <td>$${parseFloat(product.precio).toFixed(2)}</td>
        <td><span class="estatus-badge ${product.destacado ? 'estatus-destacado' : ''}">${product.destacado ? 'Destacado' : 'Normal'}</span></td>
        <td>
          <button class="btn-edit" onclick="editProduct(${product.id})">✏️</button>
          <button class="btn-delete" onclick="deleteProduct(${product.id}, '${product.nombre.replace(/'/g, "\\'")}')">🗑️</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error("Error al cargar productos:", error);
    const tbody = document.getElementById('products-table-body');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error al cargar productos</td></tr>';
    }
  }
}

// Cargar usuarios (ahora deshabilitado - necesitarías crear api/usuarios.php)
function loadUsers() {
  const tbody = document.getElementById('users-table-body');
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Función deshabilitada - requiere endpoint de usuarios</td></tr>';
  }
}

// Cambiar entre tabs
function switchTab(tabName) {
  // Actualizar botones
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Actualizar contenido
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.add('active');
}

// Mostrar modal para agregar producto
function showAddProductModal() {
  currentEditingProductId = null;
  document.getElementById('modal-title').textContent = 'Agregar Producto';
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
  document.getElementById('product-modal').classList.remove('hidden');
}

// Cerrar modal
function closeProductModal() {
  document.getElementById('product-modal').classList.add('hidden');
  document.getElementById('product-form').reset();
  currentEditingProductId = null;
}

// Editar producto
async function editProduct(productId) {
  try {
    const response = await fetch(`api/productos.php?id=${productId}`);
    const product = await response.json();
    
    if (!product) return;

    currentEditingProductId = productId;
    document.getElementById('modal-title').textContent = 'Editar Producto';
    document.getElementById('product-id').value = productId;
    document.getElementById('product-nombre').value = product.nombre;
    document.getElementById('product-imagen').value = product.imagen_url || '';
    document.getElementById('product-descripcion').value = product.descripcion || '';
    document.getElementById('product-precio').value = product.precio;
    document.getElementById('product-categoria').value = product.categoria_id || '';
    document.getElementById('product-estatus').value = product.destacado ? 'destacado' : '';
    
    document.getElementById('product-modal').classList.remove('hidden');
  } catch (error) {
    console.error('Error al cargar producto:', error);
    alert('Error al cargar el producto');
  }
}

// Eliminar producto
async function deleteProduct(productId, productName) {
  if (!confirm(`¿Estás seguro de eliminar el producto "${productName}"?`)) {
    return;
  }

  try {
    const response = await fetch('api/admin_productos.php', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: productId })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Producto eliminado exitosamente');
      loadProducts(); // Recargar lista
    } else {
      alert(data.error || 'Error al eliminar el producto');
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    alert('Error al eliminar el producto');
  }
}

// Manejar envío del formulario de producto
document.getElementById('product-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const btnSave = document.getElementById('btn-save-product');
  btnSave.disabled = true;
  btnSave.textContent = 'Guardando...';

  const productData = {
    nombre: document.getElementById('product-nombre').value,
    imagen_url: document.getElementById('product-imagen').value,
    descripcion: document.getElementById('product-descripcion').value,
    precio: parseFloat(document.getElementById('product-precio').value),
    categoria_id: parseInt(document.getElementById('product-categoria').value) || null,
    destacado: document.getElementById('product-estatus').value === 'destacado' ? 1 : 0,
    stock: 0
  };

  try {
    let response;
    
    if (currentEditingProductId) {
      // Actualizar producto existente
      productData.id = currentEditingProductId;
      response = await fetch('api/admin_productos.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
    } else {
      // Crear nuevo producto
      response = await fetch('api/admin_productos.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
    }
    
    const data = await response.json();
    
    if (response.ok) {
      alert(currentEditingProductId ? 'Producto actualizado exitosamente' : 'Producto agregado exitosamente');
      closeProductModal();
      loadProducts(); // Recargar lista
    } else {
      alert(data.error || 'Error al guardar el producto');
    }
  } catch (error) {
    console.error('Error al guardar producto:', error);
    alert('Error al guardar el producto');
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = 'Guardar Producto';
  }
});

// Cambiar rol de usuario (deshabilitado)
function changeUserRole(uid, newRole) {
  alert('Función deshabilitada - requiere endpoint de usuarios');
  loadUsers();
}

// Eliminar usuario (deshabilitado)
function deleteUser(uid, userName) {
  alert('Función deshabilitada - requiere endpoint de usuarios');
}

// Funciones auxiliares
function getCategoriaName(categoria) {
  const nombres = {
    'futbol': 'Fútbol',
    'basket': 'Basket',
    'gym': 'Gym/Running',
    'coleccionables': 'Coleccionables'
  };
  return nombres[categoria] || categoria;
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Cerrar modal al hacer clic fuera de él
document.getElementById('product-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'product-modal') {
    closeProductModal();
  }
});
