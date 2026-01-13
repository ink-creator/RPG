// =========================
// FIREBASE + HISTÓRICO PLAYER
// =========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔧 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =========================
// PLAYER ID (vem do HTML)
// =========================
const playerId = document.body.dataset.player;
if (!playerId) {
  console.error("Player ID não definido no HTML");
}

// =========================
// FUNÇÃO GLOBAL DE HISTÓRICO
// =========================
window.registrarHistorico = async function (texto, tipo = "") {
  if (!playerId) return;

  await addDoc(
    collection(db, "historico", playerId, "logs"),
    {
      texto,
      tipo,
      data: serverTimestamp()
    }
  );
};

// =========================
// EXEMPLO DE USO COM DADO
// =========================
// rolarD20("EXTREMO");
// registrarHistorico("Rolou 1d20 → EXTREMO", "EXTREMO");
