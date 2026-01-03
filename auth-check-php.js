// Este script maneja la visualización del usuario y protege acciones

let userSession = null;

// Verificar autenticación al cargar la página
async function checkAuth() {
  try {
    const response = await fetch('api/check_auth.php');
    const data = await response.json();
    
    console.log('🔍 Estado de autenticación:', data.logged_in ? 'Usuario logueado' : 'No hay usuario');
    
    const userNameElement = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const loginBtn = document.getElementById('login-btn');
    const adminLink = document.getElementById('admin-link');
    
    if (data.logged_in) {
      userSession = data.user;
      console.log('✅ Usuario autenticado:', userSession.email);
      
      // Mostrar nombre del usuario
      if (userNameElement) {
        userNameElement.textContent = userSession.nombre || userSession.email.split('@')[0];
        userNameElement.style.display = 'inline';
      }
      
      // Mostrar botón de cerrar sesión
      if (logoutBtn) {
        logoutBtn.style.display = 'inline-block';
      }
      
      // Ocultar botón de login
      if (loginBtn) {
        loginBtn.style.display = 'none';
      }
      
      // Mostrar enlace de admin si es administrador
      if (adminLink) {
        if (userSession.rol === 'admin') {
          adminLink.style.display = 'inline-block';
        } else {
          adminLink.style.display = 'none';
        }
      }
    } else {
      console.log('❌ No hay usuario autenticado');
      userSession = null;
      
      // Ocultar nombre de usuario
      if (userNameElement) {
        userNameElement.textContent = '';
        userNameElement.style.display = 'none';
      }
      
      // Ocultar botón de cerrar sesión
      if (logoutBtn) {
        logoutBtn.style.display = 'none';
      }
      
      // Mostrar botón de login
      if (loginBtn) {
        loginBtn.style.display = 'inline-block';
      }
      
      // Ocultar enlace de admin
      if (adminLink) {
        adminLink.style.display = 'none';
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
