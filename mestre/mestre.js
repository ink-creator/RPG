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
  apiKey: "AIzaSyBCCbxXH6UZEqpItsdVaaG354Nqu28HA44",
  authDomain: "rpg-ficha-online.firebaseapp.com",
  databaseURL: "https://rpg-ficha-online-default-rtdb.firebaseio.com",
  projectId: "rpg-ficha-online",
  storageBucket: "rpg-ficha-online.firebasestorage.app",
  messagingSenderId: "213971701978",
  appId: "1:213971701978:web:b030274505603fd49255e3"
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
