// DEBUG: Agregar al final de index.html temporalmente para diagnosticar

console.log('=== DEBUG AUTH-CHECK ===');

// Esperar a que Firebase esté listo
setTimeout(() => {
  const user = firebase.auth().currentUser;
  
  console.log('Usuario actual:', user);
  
  if (user) {
    console.log('UID:', user.uid);
    console.log('Email:', user.email);
    console.log('Display Name:', user.displayName);
    
    // Leer datos de la base de datos
    firebase.database().ref('usuarios/' + user.uid).once('value')
      .then((snapshot) => {
        const userData = snapshot.val();
        console.log('Datos del usuario desde DB:', userData);
        console.log('Rol del usuario:', userData?.rol);
        
        if (userData?.rol === 'administrador') {
          console.log('✅ El usuario ES administrador');
          console.log('Elemento user-name:', document.getElementById('user-name'));
          console.log('Contenido actual:', document.getElementById('user-name').innerHTML);
        } else {
          console.log('❌ El usuario NO es administrador, rol:', userData?.rol);
        }
      })
      .catch((error) => {
        console.error('Error leyendo datos:', error);
      });
  } else {
    console.log('No hay usuario autenticado');
  }
}, 2000);
