// Este script maneja la visualización del usuario y protege acciones

firebase.auth().onAuthStateChanged((user) => {
  const userNameElement = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');
  const loginBtn = document.getElementById('login-btn');
  
  if (user) {
    // Usuario autenticado: mostrar nombre y botón de logout
    if (userNameElement) {
      userNameElement.textContent = user.displayName || user.email;
      userNameElement.style.display = 'inline';
    }
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (loginBtn) loginBtn.style.display = 'none';
  } else {
    // Usuario NO autenticado: mostrar botón de login
    if (userNameElement) {
      userNameElement.style.display = 'none';
    }
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'inline-block';
  }
});

// Función de logout
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = 'index.html';
  }).catch((error) => {
    console.error('Error al cerrar sesión:', error);
  });
}
