// admin.js - Lógica del panel de administración
// userSession es definida en auth-check-php.js

let currentEditingProductId = null;

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
      loadCategories();
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
}

// Cargar categorías dinámicamente
async function loadCategories() {
  const select = document.getElementById('product-categoria');
  if (!select) return;
  
  select.innerHTML = '<option value="">Cargando...</option>';
  select.disabled = true;
  
  try {
    const response = await fetch('api/categorias.php');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categorias = await response.json();
    
    if (!Array.isArray(categorias)) {
      throw new Error('La respuesta no es un array de categorías');
    }
    
    select.innerHTML = '<option value="">Seleccionar...</option>';
    
    categorias.forEach(categoria => {
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = categoria.nombre;
      select.appendChild(option);
    });
    
    select.disabled = false;
    
    const totalCategorias = document.getElementById('total-categorias');
    if (totalCategorias) {
      totalCategorias.textContent = categorias.length;
    }
  } catch (error) {
    select.innerHTML = `
      <option value="">Seleccionar...</option>
      <option value="1">Fútbol</option>
      <option value="2">Basket</option>
      <option value="3">Gym/Running</option>
      <option value="4">Coleccionables</option>
    `;
    select.disabled = false;
  }
}

// Cargar productos
async function loadProducts() {
  try {
    const response = await fetch('api/productos.php');
    const productos = await response.json();
    
    const tbody = document.getElementById('products-table-body');
    
    if (productos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay productos registrados</td></tr>';
      return;
    }

    // Calcular totales
    let totalStock = 0;
    let totalValor = 0;

    productos.forEach(product => {
      const stock = parseInt(product.stock) || 0;
      const precio = parseFloat(product.precio) || 0;
      totalStock += stock;
      totalValor += (stock * precio);
    });

    tbody.innerHTML = productos.map(product => `
      <tr>
        <td data-label="Imagen"><img src="${product.imagen_url || 'sours/img/articulos/default.jpg'}" alt="${product.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" /></td>
        <td data-label="Nombre">${product.nombre}</td>
        <td data-label="Categoría"><span class="categoria-badge">${product.categoria_nombre || 'Sin categoría'}</span></td>
        <td data-label="Precio">$${parseFloat(product.precio).toFixed(2)}</td>
        <td data-label="Stock">${product.stock || 0}</td>
        <td data-label="Estado"><span class="estatus-badge ${product.estado === 'destacado' ? 'estatus-destacado' : ''}">${product.estado || 'normal'}</span></td>
        <td data-label="Acciones">
          <button class="btn-edit" onclick="editProduct(${product.id})">✏️</button>
          <button class="btn-delete" onclick="deleteProduct(${product.id}, '${product.nombre.replace(/'/g, "\\'")}')">🗑️</button>
        </td>
      </tr>
    `).join('') + `
      <tr class="totals-row">
        <td colspan="3" style="text-align: right; font-weight: bold; padding-right: 20px;">TOTALES:</td>
        <td style="font-weight: bold; color: #2e7d32;">$${totalValor.toFixed(2)}</td>
        <td style="font-weight: bold; color: #1976d2;">${totalStock}</td>
        <td colspan="2"></td>
      </tr>
    `;
  } catch (error) {
    console.error("Error al cargar productos:", error);
    const tbody = document.getElementById('products-table-body');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: red;">Error al cargar productos</td></tr>';
    }
  }
}

// Cargar usuarios
async function loadUsers() {
  try {
    const response = await fetch('api/usuarios.php');
    const usuarios = await response.json();
    
    const tbody = document.getElementById('users-table-body');
    
    if (!tbody) return;
    
    if (usuarios.error) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">${usuarios.error}</td></tr>`;
      return;
    }
    
    if (usuarios.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay usuarios registrados</td></tr>';
      return;
    }

    tbody.innerHTML = usuarios.map(user => `
      <tr>
        <td data-label="Nombre">${user.nombre || 'Sin nombre'}</td>
        <td data-label="Email">${user.email}</td>
        <td data-label="Rol">
          <select onchange="updateUserRole(${user.id}, this.value)" class="role-select">
            <option value="user" ${user.rol === 'user' ? 'selected' : ''}>Usuario</option>
            <option value="admin" ${user.rol === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </td>
        <td data-label="Fecha Registro">${new Date(user.fecha_registro).toLocaleDateString('es-ES')}</td>
        <td data-label="Acciones">
          <button class="btn-delete" onclick="deleteUser(${user.id}, '${user.email.replace(/'/g, "\\'")}')">🗑️</button>
        </td>
      </tr>
    `).join('');
    
    // Actualizar contador de usuarios
    document.getElementById('total-usuarios').textContent = usuarios.length;
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    const tbody = document.getElementById('users-table-body');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error al cargar usuarios</td></tr>';
    }
  }
}

// Actualizar rol de usuario
async function updateUserRole(userId, newRole) {
  if (!confirm(`¿Cambiar el rol de este usuario a ${newRole === 'admin' ? 'Administrador' : 'Usuario'}?`)) {
    loadUsers(); // Recargar para revertir el select
    return;
  }
  
  try {
    const response = await fetch('api/usuarios.php', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        rol: newRole
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('✅ Rol actualizado exitosamente');
      loadUsers();
    } else {
      alert('❌ Error: ' + (data.error || 'No se pudo actualizar el rol'));
      loadUsers();
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error al actualizar el rol');
    loadUsers();
  }
}

// Eliminar usuario
async function deleteUser(userId, userEmail) {
  if (!confirm(`¿Estás seguro de eliminar al usuario ${userEmail}?`)) {
    return;
  }
  
  try {
    const response = await fetch('api/usuarios.php', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `id=${userId}`
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('✅ Usuario eliminado exitosamente');
      loadUsers();
    } else {
      alert('❌ Error: ' + (data.error || 'No se pudo eliminar el usuario'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error al eliminar usuario');
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
  
  // Cargar datos según la pestaña
  if (tabName === 'usuarios') {
    loadUsers();
  } else if (tabName === 'ventas') {
    loadVentas();
  } else if (tabName === 'logs') {
    loadLogs();
  }
}

// Mostrar modal para agregar producto
function showAddProductModal() {
  currentEditingProductId = null;
  document.getElementById('modal-title').textContent = 'Agregar Producto';
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
  document.getElementById('product-modal').classList.remove('hidden');
  // Cargar categorías cuando se abre el modal
  loadCategories();
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
    
    if (!response.ok) {
      throw new Error('Error al obtener el producto del servidor');
    }
    
    const product = await response.json();
    
    if (!product || !product.id) {
      throw new Error('Producto no encontrado');
    }

    currentEditingProductId = productId;
    
    // Primero mostrar el modal
    document.getElementById('modal-title').textContent = 'Editar Producto';
    document.getElementById('product-modal').classList.remove('hidden');
    
    // Cargar las categorías
    await loadCategories();
    
    // Establecer todos los valores
    document.getElementById('product-id').value = productId;
    document.getElementById('product-nombre').value = product.nombre || '';
    document.getElementById('product-imagen').value = product.imagen_url || '';
    document.getElementById('product-descripcion').value = product.descripcion || '';
    document.getElementById('product-precio').value = product.precio || 0;
    document.getElementById('product-stock').value = product.stock || 1;
    document.getElementById('product-categoria').value = product.categoria_id || '';
    document.getElementById('product-estatus').value = product.estado || 'normal';
    
  } catch (error) {
    alert('Error al cargar el producto: ' + error.message);
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

// Función para subir imagen
async function uploadImage(fileInput) {
  const file = fileInput.files[0];
  if (!file) return null;

  const formData = new FormData();
  formData.append('imagen', file);

  try {
    const response = await fetch('api/upload_image.php', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      return data.url;
    } else {
      throw new Error(data.error || 'Error al subir imagen');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Error al subir la imagen: ' + error.message);
    return null;
  }
}

// Manejar envío del formulario de producto
document.getElementById('product-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const btnSave = document.getElementById('btn-save-product');
  btnSave.disabled = true;
  btnSave.textContent = 'Guardando...';

  // Verificar si hay una imagen para subir
  const fileInput = document.getElementById('product-imagen-file');
  const urlInput = document.getElementById('product-imagen');
  
  let imagen_url = urlInput.value.trim();

  // Si hay un archivo seleccionado, subirlo primero
  if (fileInput.files.length > 0) {
    btnSave.textContent = 'Subiendo imagen...';
    const uploadedUrl = await uploadImage(fileInput);
    if (uploadedUrl) {
      imagen_url = uploadedUrl;
    } else {
      btnSave.disabled = false;
      btnSave.textContent = 'Guardar Producto';
      return;
    }
  }

  btnSave.textContent = 'Guardando...';

  const productData = {
    nombre: document.getElementById('product-nombre').value,
    imagen_url: imagen_url,
    descripcion: document.getElementById('product-descripcion').value,
    precio: parseFloat(document.getElementById('product-precio').value),
    categoria_id: parseInt(document.getElementById('product-categoria').value) || null,
    stock: parseInt(document.getElementById('product-stock').value) || 1,
    estado: document.getElementById('product-estatus').value || 'normal'
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

// Preview de imagen cuando se selecciona un archivo o se ingresa URL
document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('product-imagen-file');
  const urlInput = document.getElementById('product-imagen');
  const preview = document.getElementById('imagen-preview');

  if (fileInput) {
    fileInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          preview.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; max-height: 200px; border: 1px solid #ddd; border-radius: 4px; padding: 5px; margin-top: 5px;">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (urlInput) {
    urlInput.addEventListener('input', function() {
      if (this.value.trim()) {
        preview.innerHTML = `<img src="${this.value}" style="max-width: 200px; max-height: 200px; border: 1px solid #ddd; border-radius: 4px; padding: 5px; margin-top: 5px;" onerror="this.style.display='none'">`;
      } else {
        preview.innerHTML = '';
      }
    });
  }

  // Establecer fechas por defecto en filtros de ventas
  const hoy = new Date();
  const fechaFin = document.getElementById('fecha-fin');
  const fechaInicio = document.getElementById('fecha-inicio');
  
  if (fechaFin) {
    fechaFin.valueAsDate = hoy;
  }
  
  if (fechaInicio) {
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    fechaInicio.valueAsDate = hace30Dias;
  }
  
  // Establecer fechas por defecto en filtros de logs
  const logFechaFin = document.getElementById('log-fecha-fin');
  const logFechaInicio = document.getElementById('log-fecha-inicio');
  
  if (logFechaFin) {
    logFechaFin.valueAsDate = hoy;
  }
  
  if (logFechaInicio) {
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);
    logFechaInicio.valueAsDate = hace7Dias;
  }
});

// ============================================
// GESTIÓN DE VENTAS
// ============================================

// Cargar ventas
async function loadVentas() {
  try {
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;
    
    let url = 'api/ventas.php';
    const params = new URLSearchParams();
    
    if (fechaInicio) params.append('fecha_inicio', fechaInicio);
    if (fechaFin) params.append('fecha_fin', fechaFin);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al cargar ventas');
    }
    
    const ventas = data.ventas || [];
    const estadisticas = data.estadisticas || {};
    
    // Debug: Ver los datos de ventas
    console.log('Ventas recibidas:', ventas);
    if (ventas.length > 0) {
      console.log('Primera venta:', ventas[0]);
      console.log('Estado de primera venta:', ventas[0].estado);
    }
    
    // Actualizar estadísticas
    document.getElementById('total-ventas-count').textContent = estadisticas.total_ventas || 0;
    document.getElementById('total-ventas-monto').textContent = '$' + (estadisticas.total_monto || 0).toFixed(2);
    document.getElementById('promedio-venta').textContent = '$' + (estadisticas.promedio_venta || 0).toFixed(2);
    document.getElementById('productos-vendidos').textContent = estadisticas.total_productos_vendidos || 0;
    
    // Renderizar tabla
    const tbody = document.getElementById('ventas-table-body');
    
    if (ventas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No se encontraron ventas en el período seleccionado</td></tr>';
      return;
    }
    
    tbody.innerHTML = ventas.map(venta => `
      <tr>
        <td data-label="Nº Venta"><strong>${venta.numero_venta}</strong></td>
        <td data-label="Fecha">${formatearFecha(venta.fecha_venta)}</td>
        <td data-label="Cliente">
          <div>${venta.nombre_cliente} ${venta.apellido_cliente}</div>
          <small style="color: #666;">${venta.email_cliente}</small>
        </td>
        <td data-label="Items" style="text-align: center;">${venta.cantidad_items}</td>
        <td data-label="Total"><strong>$${parseFloat(venta.total).toFixed(2)}</strong></td>
        <td data-label="Estado">
          <span class="badge badge-${venta.estado || 'completada'}">
            ${venta.estado ? venta.estado : 'completada'}
          </span>
        </td>
        <td data-label="Acciones">
          <button class="btn-icon" onclick="verDetalleVenta(${venta.id})" title="Ver detalle">
            👁️
          </button>
        </td>
      </tr>
    `).join('');
    
  } catch (error) {
    console.error('Error al cargar ventas:', error);
    alert('Error al cargar ventas: ' + error.message);
  }
}

// Ver detalle de venta
async function verDetalleVenta(ventaId) {
  try {
    const response = await fetch(`api/detalle_venta.php?id=${ventaId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al cargar detalle de venta');
    }
    
    const venta = data.venta;
    const detalles = data.detalles || [];
    
    // Llenar información de la venta
    document.getElementById('venta-numero').textContent = venta.numero_venta;
    document.getElementById('venta-fecha').textContent = formatearFecha(venta.fecha_venta);
    document.getElementById('venta-estado').textContent = venta.estado;
    document.getElementById('venta-estado').className = `badge badge-${venta.estado}`;
    
    // Datos del cliente
    document.getElementById('venta-cliente-nombre').textContent = 
      `${venta.nombre_cliente} ${venta.apellido_cliente}`;
    document.getElementById('venta-cliente-email').textContent = venta.email_cliente;
    document.getElementById('venta-cliente-telefono').textContent = venta.telefono_cliente;
    document.getElementById('venta-cliente-direccion').textContent = venta.direccion_cliente;
    
    // Observaciones
    const obsRow = document.getElementById('venta-observaciones-row');
    if (venta.observaciones && venta.observaciones.trim()) {
      document.getElementById('venta-observaciones').textContent = venta.observaciones;
      obsRow.style.display = 'flex';
    } else {
      obsRow.style.display = 'none';
    }
    
    // Productos
    const itemsTbody = document.getElementById('venta-items');
    itemsTbody.innerHTML = detalles.map(item => `
      <tr>
        <td>${item.nombre_producto}</td>
        <td style="text-align: center;">${item.cantidad}</td>
        <td>$${parseFloat(item.precio_unitario).toFixed(2)}</td>
        <td><strong>$${parseFloat(item.subtotal).toFixed(2)}</strong></td>
      </tr>
    `).join('');
    
    // Totales
    document.getElementById('venta-subtotal').textContent = '$' + parseFloat(venta.subtotal).toFixed(2);
    document.getElementById('venta-iva').textContent = '$' + parseFloat(venta.iva).toFixed(2);
    document.getElementById('venta-total').textContent = '$' + parseFloat(venta.total).toFixed(2);
    
    // Mostrar modal
    document.getElementById('venta-modal').classList.remove('hidden');
    
  } catch (error) {
    console.error('Error al cargar detalle:', error);
    alert('Error al cargar detalle de venta: ' + error.message);
  }
}

// Cerrar modal de venta
function closeVentaModal() {
  document.getElementById('venta-modal').classList.add('hidden');
}

// Imprimir venta
function imprimirVenta() {
  window.print();
}

// Aplicar filtros de ventas
function aplicarFiltrosVentas() {
  loadVentas();
}

// Limpiar filtros de ventas
function limpiarFiltrosVentas() {
  // Establecer fechas por defecto (últimos 30 días)
  const hoy = new Date();
  const hace30Dias = new Date();
  hace30Dias.setDate(hoy.getDate() - 30);
  
  document.getElementById('fecha-inicio').valueAsDate = hace30Dias;
  document.getElementById('fecha-fin').valueAsDate = hoy;
  
  loadVentas();
}

// Formatear fecha
function formatearFecha(fechaStr) {
  const fecha = new Date(fechaStr);
  const opciones = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return fecha.toLocaleDateString('es-UY', opciones);
}

// ============================================
// GESTIÓN DE LOGS
// ============================================

// Cargar logs
async function loadLogs() {
  try {
    const modulo = document.getElementById('log-modulo').value;
    const fechaInicio = document.getElementById('log-fecha-inicio').value;
    const fechaFin = document.getElementById('log-fecha-fin').value;
    
    let url = 'api/logs.php';
    const params = new URLSearchParams();
    
    if (modulo) params.append('modulo', modulo);
    if (fechaInicio) params.append('fecha_inicio', fechaInicio);
    if (fechaFin) params.append('fecha_fin', fechaFin);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al cargar logs');
    }
    
    const logs = data.logs || [];
    const estadisticas = data.estadisticas || {};
    
    // Actualizar estadísticas
    document.getElementById('total-logs-count').textContent = estadisticas.total_logs || 0;
    document.getElementById('usuarios-activos-logs').textContent = estadisticas.usuarios_activos || 0;
    document.getElementById('dias-actividad').textContent = estadisticas.dias_con_actividad || 0;
    
    // Renderizar tabla
    const tbody = document.getElementById('logs-table-body');
    
    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No se encontraron logs en el período seleccionado</td></tr>';
      return;
    }
    
    tbody.innerHTML = logs.map(log => `
      <tr>
        <td style="white-space: nowrap;">${formatearFecha(log.fecha_hora)}</td>
        <td>
          <div>${log.usuario_email || 'Sistema'}</div>
          ${log.ip_address ? `<small style="color: #666;">${log.ip_address}</small>` : ''}
        </td>
        <td><span class="badge badge-modulo-${log.modulo.toLowerCase()}">${log.modulo}</span></td>
        <td><span class="badge badge-accion">${log.accion}</span></td>
        <td>${log.descripcion || '-'}</td>
        <td style="white-space: nowrap;">${log.ip_address || '-'}</td>
      </tr>
    `).join('');
    
  } catch (error) {
    console.error('Error al cargar logs:', error);
    alert('Error al cargar logs: ' + error.message);
  }
}

// Aplicar filtros de logs
function aplicarFiltrosLogs() {
  loadLogs();
}

// Limpiar filtros de logs
function limpiarFiltrosLogs() {
  const hoy = new Date();
  const hace7Dias = new Date();
  hace7Dias.setDate(hoy.getDate() - 7);
  
  document.getElementById('log-modulo').value = '';
  document.getElementById('log-fecha-inicio').valueAsDate = hace7Dias;
  document.getElementById('log-fecha-fin').valueAsDate = hoy;
  
  loadLogs();
}
