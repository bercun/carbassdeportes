// admin.js - Lógica del panel de administración

const db = firebase.firestore();
let currentEditingProductId = null;

// Verificar permisos de administrador al cargar la página
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    // No hay usuario autenticado, redirigir a login
    window.location.href = 'login.html';
    return;
  }

  // Verificar rol del usuario en Firestore
  db.collection('usuarios').doc(user.uid).get().then((doc) => {
    const userData = doc.data();
    const userRole = userData?.rol || 'comprador';

    if (userRole !== 'administrador') {
      // No es administrador, mostrar mensaje de acceso denegado
      document.getElementById('access-denied').classList.remove('hidden');
      document.getElementById('admin-panel').classList.add('hidden');
    } else {
      // Es administrador, mostrar el panel
      document.getElementById('access-denied').classList.add('hidden');
      document.getElementById('admin-panel').classList.remove('hidden');
      
      // Cargar datos
      loadProducts();
      loadUsers();
      loadStats();
    }
  }).catch((error) => {
    console.error("Error al verificar rol:", error);
    window.location.href = 'index.html';
  });
});

// Cargar estadísticas
function loadStats() {
  // Contar productos
  db.collection('articulos').get().then((snapshot) => {
    const count = snapshot.size;
    document.getElementById('total-productos').textContent = count;
  }).catch(err => console.error("Error al contar productos:", err));

  // Contar usuarios
  db.collection('usuarios').get().then((snapshot) => {
    const count = snapshot.size;
    document.getElementById('total-usuarios').textContent = count;
  }).catch(err => {
    console.error("Error al contar usuarios:", err);
    document.getElementById('total-usuarios').textContent = "Error";
  });
}

// Cargar productos
function loadProducts() {
  db.collection('articulos').onSnapshot((snapshot) => {
    const tbody = document.getElementById('products-table-body');
    
    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay productos registrados</td></tr>';
      return;
    }

    const productosArray = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    tbody.innerHTML = productosArray.map(product => `
      <tr>
        <td><img src="${product.imagen}" alt="${product.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" /></td>
        <td>${product.nombre}</td>
        <td><span class="categoria-badge categoria-${product.categoria}">${getCategoriaName(product.categoria)}</span></td>
        <td>$${parseFloat(product.precio).toFixed(2)}</td>
        <td><span class="estatus-badge estatus-${product.estatus?.replace(' ', '-')}">${product.estatus || 'normal'}</span></td>
        <td>
          <button class="btn-edit" onclick="editProduct('${product.id}')">✏️</button>
          <button class="btn-delete" onclick="deleteProduct('${product.id}', '${product.nombre}')">🗑️</button>
        </td>
      </tr>
    `).join('');
  });
}

// Cargar usuarios
function loadUsers() {
  db.collection('usuarios').onSnapshot((snapshot) => {
    const tbody = document.getElementById('users-table-body');
    
    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay usuarios registrados</td></tr>';
      return;
    }

    const usuariosArray = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    tbody.innerHTML = usuariosArray.map(user => `
      <tr>
        <td>${user.nombre}</td>
        <td>${user.email}</td>
        <td>
          <select class="role-select" onchange="changeUserRole('${user.uid}', this.value)">
            <option value="comprador" ${user.rol === 'comprador' ? 'selected' : ''}>Comprador</option>
            <option value="administrador" ${user.rol === 'administrador' ? 'selected' : ''}>Administrador</option>
          </select>
        </td>
        <td>${formatDate(user.fechaRegistro)}</td>
        <td>
          <button class="btn-delete" onclick="deleteUser('${user.uid}', '${user.nombre}')" ${user.rol === 'administrador' ? 'disabled' : ''}>🗑️</button>
        </td>
      </tr>
    `).join('');
  }, (error) => {
    console.error("Error al cargar usuarios:", error);
    const tbody = document.getElementById('users-table-body');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Error de permisos: No puedes ver la lista de usuarios.</td></tr>`;
    }
  });
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
function editProduct(productId) {
  db.collection('articulos').doc(productId).get().then((doc) => {
    const product = doc.data();
    if (!product) return;

    currentEditingProductId = productId;
    document.getElementById('modal-title').textContent = 'Editar Producto';
    document.getElementById('product-id').value = productId;
    document.getElementById('product-nombre').value = product.nombre;
    document.getElementById('product-imagen').value = product.imagen;
    document.getElementById('product-descripcion').value = product.descripción || product.descripcion || '';
    document.getElementById('product-precio').value = product.precio;
    document.getElementById('product-categoria').value = product.categoria;
    document.getElementById('product-estatus').value = product.estatus || '';
    
    document.getElementById('product-modal').classList.remove('hidden');
  });
}

// Eliminar producto
function deleteProduct(productId, productName) {
  if (!confirm(`¿Estás seguro de eliminar el producto "${productName}"?`)) {
    return;
  }

  db.collection('articulos').doc(productId).delete()
    .then(() => {
      alert('Producto eliminado exitosamente');
    })
    .catch((error) => {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    });
}

// Manejar envío del formulario de producto
document.getElementById('product-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const btnSave = document.getElementById('btn-save-product');
  btnSave.disabled = true;
  btnSave.textContent = 'Guardando...';

  const productData = {
    nombre: document.getElementById('product-nombre').value,
    imagen: document.getElementById('product-imagen').value,
    descripción: document.getElementById('product-descripcion').value,
    precio: parseFloat(document.getElementById('product-precio').value),
    categoria: document.getElementById('product-categoria').value,
    estatus: document.getElementById('product-estatus').value,
    ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    if (currentEditingProductId) {
      // Actualizar producto existente
      await db.collection('articulos').doc(currentEditingProductId).update(productData);
      alert('Producto actualizado exitosamente');
    } else {
      // Crear nuevo producto
      await db.collection('articulos').add(productData);
      alert('Producto agregado exitosamente');
    }
    
    closeProductModal();
  } catch (error) {
    console.error('Error al guardar producto:', error);
    alert('Error al guardar el producto');
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = 'Guardar Producto';
  }
});

// Cambiar rol de usuario
function changeUserRole(uid, newRole) {
  const currentUser = firebase.auth().currentUser;
  
  if (currentUser.uid === uid && newRole !== 'administrador') {
    alert('No puedes quitarte los permisos de administrador a ti mismo');
    loadUsers(); // Recargar para restaurar el select
    return;
  }

  if (!confirm(`¿Cambiar el rol de este usuario a "${newRole}"?`)) {
    loadUsers(); // Recargar para restaurar el select
    return;
  }

  db.collection('usuarios').doc(uid).update({ rol: newRole })
    .then(() => {
      alert('Rol actualizado exitosamente');
    })
    .catch((error) => {
      console.error('Error al cambiar rol:', error);
      alert('Error al cambiar el rol');
      loadUsers();
    });
}

// Eliminar usuario
function deleteUser(uid, userName) {
  if (!confirm(`¿Estás seguro de eliminar al usuario "${userName}"?\n\nNOTA: Esto solo eliminará los datos del usuario en la base de datos, no su cuenta de autenticación.`)) {
    return;
  }

  db.collection('usuarios').doc(uid).delete()
    .then(() => {
      alert('Datos del usuario eliminados exitosamente');
    })
    .catch((error) => {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar el usuario');
    });
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
