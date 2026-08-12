// Este script maneja la visualización del usuario y protege acciones

let userSession = null;

// Verificar autenticación al cargar la página
async function checkAuth() {
  try {
    const response = await fetch('api/check_auth.php');
    const data = await response.json();
    
    console.log('🔍 Estado de autenticación:', data.logged_in ? 'Usuario logueado' : 'No hay usuario');
    
    const userNameElement = document.getElementById('user-name');
    const userInfoContainer = document.querySelector('.user-info');
    const logoutBtn = document.getElementById('logout-btn');
    const loginBtn = document.getElementById('login-btn');
    const adminLink = document.getElementById('admin-link');
    
    if (data.logged_in) {
      userSession = data.user;
      console.log('✅ Usuario autenticado:', userSession.email);
      
      // Mostrar contenedor de usuario y nombre
      if (userInfoContainer) {
        userInfoContainer.classList.remove('hidden');
      }
      if (userNameElement) {
        userNameElement.textContent = userSession.nombre || userSession.email.split('@')[0];
      }
      
      // Mostrar botón de cerrar sesión, ocultar login
      if (logoutBtn) {
        logoutBtn.classList.remove('hidden');
      }
      if (loginBtn) {
        loginBtn.classList.add('hidden');
      }
      
      // Mostrar enlace de admin si es administrador
      if (adminLink) {
        if (userSession.rol === 'admin') {
          adminLink.classList.remove('hidden');
        } else {
          adminLink.classList.add('hidden');
        }
      }
    } else {
      console.log('❌ No hay usuario autenticado');
      userSession = null;
      
      // Ocultar contenedor de usuario y limpiar nombre
      if (userInfoContainer) {
        userInfoContainer.classList.add('hidden');
      }
      if (userNameElement) {
        userNameElement.textContent = '';
      }
      
      // Ocultar botón de cerrar sesión, mostrar login
      if (logoutBtn) {
        logoutBtn.classList.add('hidden');
      }
      if (loginBtn) {
        loginBtn.classList.remove('hidden');
      }
      
      // Ocultar enlace de admin
      if (adminLink) {
        adminLink.classList.add('hidden');
      }
    }
  } catch (error) {
    console.error('Error verificando autenticación:', error);
  }
}

// Ejecutar verificación al cargar la página
checkAuth();

// Función para cerrar sesión
async function logout() {
  try {
    const response = await fetch('api/logout.php', {
      method: 'POST'
    });
    
    if (response.ok) {
      console.log('✅ Sesión cerrada exitosamente');
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

// Asignar evento al botón de logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}
