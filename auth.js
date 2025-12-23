const auth = firebase.auth();
// database ya está declarado en firebase-config.js

// Variables del formulario
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nameInput = document.getElementById('name');
const nameGroup = document.getElementById('name-group');
const submitBtn = document.getElementById('submit-btn');
const formTitle = document.getElementById('form-title');
const toggleLink = document.getElementById('toggle-link');
const toggleText = document.getElementById('toggle-text');
const errorMessage = document.getElementById('error-message');

let isLoginMode = true;

// Función para alternar entre login y registro
function toggleMode(e) {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  
  if (isLoginMode) {
    formTitle.textContent = 'Iniciar Sesión';
    submitBtn.textContent = 'Iniciar Sesión';
    toggleText.innerHTML = '¿No tienes cuenta? <a href="#" id="toggle-link">Regístrate aquí</a>';
    nameGroup.style.display = 'none';
    nameInput.required = false;
  } else {
    formTitle.textContent = 'Crear Cuenta';
    submitBtn.textContent = 'Registrarse';
    toggleText.innerHTML = '¿Ya tienes cuenta? <a href="#" id="toggle-link">Inicia sesión</a>';
    nameGroup.style.display = 'block';
    nameInput.required = true;
  }
  
  // Re-asignar evento al nuevo link
  const newToggleLink = document.getElementById('toggle-link');
  if (newToggleLink) {
    newToggleLink.addEventListener('click', toggleMode);
  }
  errorMessage.textContent = '';
}

// Alternar entre login y registro
if (toggleLink) {
  toggleLink.addEventListener('click', toggleMode);
}

// Manejar envío del formulario
if (authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const name = nameInput.value.trim();

    try {
      if (isLoginMode) {
        // LOGIN
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        // REGISTRO
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Actualizar perfil con nombre
        await user.updateProfile({ displayName: name });
        
        // Guardar datos adicionales en Firestore
        await firestore.collection('usuarios').doc(user.uid).set({
          nombre: name,
          email: email,
          rol: 'comprador', // Por defecto todos los nuevos usuarios son compradores
          fechaRegistro: new Date().toISOString()
        });
      }
      
      // Redirigir a la página principal
      window.location.href = 'index.html';
      
    } catch (error) {
      console.error('Error de autenticación:', error);
      
      // Mensajes de error en español
      let errorMsg = 'Ocurrió un error. Intenta nuevamente.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMsg = 'Este email ya está registrado.';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Email inválido.';
          break;
        case 'auth/weak-password':
          errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
          break;
        case 'auth/user-not-found':
          errorMsg = 'No existe una cuenta con este email.';
          break;
        case 'auth/wrong-password':
          errorMsg = 'Contraseña incorrecta.';
          break;
      }
      
      errorMessage.textContent = errorMsg;
      submitBtn.disabled = false;
      submitBtn.textContent = isLoginMode ? 'Iniciar Sesión' : 'Registrarse';
    }
  });
}

// Verificar si el usuario ya está autenticado
auth.onAuthStateChanged((user) => {
  if (user && window.location.pathname.includes('login.html')) {
    // Si ya está logueado y está en la página de login, redirigir
    window.location.href = 'index.html';
  }
});
