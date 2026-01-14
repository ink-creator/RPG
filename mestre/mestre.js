// ============================
// FIREBASE (IMPORTS)
// ============================
// ⚠️ Ajuste os caminhos conforme seu projeto
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onChildAdded } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ============================
// CONFIG FIREBASE
// ============================
// ⚠️ USE A MESMA CONFIG DO JOGADOR
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO",
  databaseURL: "SUA_DATABASE_URL",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// ============================
// REFERÊNCIA DO HISTÓRICO
// ============================
// Exemplo: historico/mesa01
const historicoRef = ref(db, "historico");

// ============================
// ELEMENTO HTML DO HISTÓRICO
// ============================
// <div id="historico"></div>
const container = document.getElementById("historico");

if (!container) {
  console.warn("Elemento #historico não encontrado");
}

// ============================
// ESCUTA NOVAS ROLAGENS
// ============================
onChildAdded(historicoRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  adicionarAoHistorico(data);
});

// ============================
// ADICIONA NO DOM
// ============================
function adicionarAoHistorico(dado) {
  if (!container) return;

  /*
    Estrutura esperada do dado:
    {
      jogador: "Gustavo",
      pericia: "Luta",
      valor: 12,
      dado: 17,
      resultado: "BOM",
      timestamp: 1700000000000
    }
  */

  const linha = document.createElement("div");
  linha.className = `log ${dado.resultado || "FALHA"}`;

  linha.innerHTML = `
    <span class="jogador">${dado.jogador || "?"}</span>
    <span class="pericia">${dado.pericia || "?"}</span>
    <span class="resultado">${dado.resultado || "?"}</span>
    <span class="dado">(${dado.dado ?? "?"})</span>
  `;

  container.prepend(linha);

  destacarSeExtremo(linha, dado.resultado);
}

// ============================
// DESTAQUE EXTREMO
// ============================
function destacarSeExtremo(elemento, resultado) {
  if (resultado !== "EXTREMO") return;

  elemento.classList.add("extremo-flash");
  setTimeout(() => {
    elemento.classList.remove("extremo-flash");
  }, 1200);
}
