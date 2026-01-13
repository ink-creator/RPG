// =========================
// FIREBASE + HISTÓRICO MESTRE
// =========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy
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
// PLAYERS
// =========================
const players = {
  p1: "Apolo (Ravir)",
  p2: "Laugh (Ruan)",
  p3: "Luma",
  p4: "Claymant (Cayo)",
  p5: "Stella (Juliana)"
};

const container = document.getElementById("historico-mestre");

// =========================
// LISTENERS EM TEMPO REAL
// =========================
for (const id in players) {
  const bloco = document.createElement("div");
  bloco.style.border = "2px solid #5a0000";
  bloco.style.margin = "10px 0";
  bloco.style.padding = "10px";

  container.appendChild(bloco);

  const q = query(
    collection(db, "historico", id, "logs"),
    orderBy("data", "desc")
  );

  onSnapshot(q, (snapshot) => {
    let html = `<h3>${players[id]}</h3>`;

    if (snapshot.empty) {
      html += "<p><i>Sem histórico.</i></p>";
    }

    snapshot.forEach(doc => {
      const d = doc.data();
      const data = d.data?.toDate().toLocaleString() || "";
      html += `<p>[${data}] ${d.texto}</p>`;
    });

    bloco.innerHTML = html;
  });
}
