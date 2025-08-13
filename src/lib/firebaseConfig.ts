import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// O getAnalytics é opcional, mas vamos mantê-lo já que estava na sua config
import { getAnalytics } from "firebase/analytics";

// A configuração do seu app da web no Firebase que você encontrou
const firebaseConfig = {
  apiKey: "AIzaSyBkL7HNd1z7eflN_NirnhT6Pm1O2EcTOnk",
  authDomain: "cardio-learn-pro.firebaseapp.com",
  projectId: "cardio-learn-pro",
  storageBucket: "cardio-learn-pro.appspot.com", // Corrigi o final para o formato correto
  messagingSenderId: "63675807006",
  appId: "1:63675807006:web:4e4f19e2d0f0218daa050f",
  measurementId: "G-3WC3WEWN4Y"
};

// Inicializa o Firebase e os serviços que vamos usar
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Exporta os serviços para serem usados em outras partes da sua aplicação
export { auth, db, storage, analytics };
