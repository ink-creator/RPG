// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBCCbxXH6UZEqpItsdVaaG354Nqu28HA44",
  authDomain: "rpg-ficha-online.firebaseapp.com",
  databaseURL: "https://rpg-ficha-online-default-rtdb.firebaseio.com",
  projectId: "rpg-ficha-online",
  storageBucket: "rpg-ficha-online.firebasestorage.app",
  messagingSenderId: "213971701978",
  appId: "1:213971701978:web:b030274505603fd49255e3"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ EXPORTA TUDO O QUE O PROJETO USA
export { db, ref, set, push, onValue, remove };
