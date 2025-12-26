import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBCCbxXH6UZEqpItsdVaaG354Nqu28HA44",
  authDomain: "rpg-ficha-online.firebaseapp.com",
  databaseURL: "https://rpg-ficha-online-default-rtdb.firebaseio.com",
  projectId: "rpg-ficha-online",
  storageBucket: "rpg-ficha-online.firebasestorage.app",
  messagingSenderId: "213971701978",
  appId: "1:213971701978:web:b030274505603fd49255e3"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, set, onValue };
