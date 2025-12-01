// Este script protege las páginas - solo usuarios autenticados pueden acceder

firebase.auth().onAuthStateChanged((user) => {
  const currentPage = window.location.pathname;
  const isLoginPage = currentPage.includes('login.html');
  
  if (!user && !isLoginPage) {
    // Si no hay usuario y no está en login, redirigir
    window.location.href = 'login.html';
  } else if (user) {
    // Si hay usuario, mostrar su nombre en el navbar
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
      userNameElement.textContent = user.displayName || user.email;
    }
  }
});

// Función de logout
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = 'login.html';
  }).catch((error) => {
    console.error('Error al cerrar sesión:', error);
  });
}
