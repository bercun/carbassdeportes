/**
 * Script de migración: Realtime Database -> Cloud Firestore
 * 
 * Este script copia los datos de 'articulos' y 'usuarios' desde RTDB a Firestore.
 * Para ejecutarlo, puedes incluirlo temporalmente en index.html o pegarlo en la consola
 * del navegador estando en tu aplicación.
 */

async function migrateToFirestore() {
    console.log("🚀 Iniciando migración a Firestore...");
    const dbRT = firebase.database();
    const dbFS = firebase.firestore();

    try {
        // 1. Migrar Artículos
        console.log("📦 Migrando artículos...");
        const articulosSnapshot = await dbRT.ref('articulos').once('value');
        const articulos = articulosSnapshot.val();

        if (articulos) {
            const batch = dbFS.batch();
            Object.entries(articulos).forEach(([id, data]) => {
                const docRef = dbFS.collection('articulos').doc(id);
                batch.set(docRef, {
                    ...data,
                    precio: parseFloat(data.precio) || 0,
                    fechaMigracion: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            await batch.commit();
            console.log(`✅ ${Object.keys(articulos).length} artículos migrados.`);
        } else {
            console.log("ℹ️ No hay artículos para migrar.");
        }

        // 2. Migrar Usuarios
        console.log("👥 Migrando usuarios...");
        const usuariosSnapshot = await dbRT.ref('usuarios').once('value');
        const usuarios = usuariosSnapshot.val();

        if (usuarios) {
            const batch = dbFS.batch();
            Object.entries(usuarios).forEach(([uid, data]) => {
                const docRef = dbFS.collection('usuarios').doc(uid);
                batch.set(docRef, {
                    ...data,
                    fechaMigracion: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            await batch.commit();
            console.log(`✅ ${Object.keys(usuarios).length} usuarios migrados.`);
        } else {
            console.log("ℹ️ No hay usuarios para migrar.");
        }

        console.log("🎉 Migración completada con éxito.");
        alert("Migración completada. Revisa la consola para más detalles.");

    } catch (error) {
        console.error("❌ Error durante la migración:", error);
        alert("Hubo un error en la migración. Revisa la consola.");
    }
}

// Hacer la función disponible globalmente
window.migrateToFirestore = migrateToFirestore;
