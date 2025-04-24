import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// 🔐 Configuración usando variables de entorno
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };

    // Inicializa la app
    const appfirebase = initializeApp(firebaseConfig);

    // Inicializa Firestore con persistencia offline
    let db;
    try {
    db = initializeFirestore(appfirebase, {
        localCache: persistentLocalCache({
        cacheSizeBytes: 100 * 1024 * 1024, // opcional: 100MB
        }),
    });
    console.log("Firestore inicializado con persistencia offline.");
    } catch (error) {
    console.error("Error al inicializar Firestore con persistencia:", error);
    // fallback sin caché
    db = initializeFirestore(appfirebase, {});
}

// 🔐 Inicializa Auth
const auth = getAuth(appfirebase);

// ☁️ Inicializa Storage
const storage = getStorage(appfirebase);

// 📤 Exporta
export { appfirebase, db, auth, storage };
