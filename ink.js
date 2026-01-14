import { rolarDado2D } from "../dice.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ============================
// CONFIGURAÇÃO DO FIREBASE
// ============================
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://SEU_PROJECT_ID.firebaseio.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
window.db = getDatabase(app); // Salva o database globalmente para usar no salvarHistorico
window.PLAYER_ID = "player1"; // Pode mudar para cada jogador dinamicamente

// ============================
// EVENTOS
// ============================
document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("label[for]").forEach(label => {

    label.addEventListener("mousedown", e => {
      e.preventDefault();
    }, true);

    label.addEventListener("click", e => {
      e.preventDefault();

      const input = document.getElementById(label.htmlFor);
      if (!input) return;

      const valor = parseInt(input.value, 10);
      if (isNaN(valor) || valor < 1 || valor > 20) {
        alert("Valor precisa ser entre 1 e 20");
        return;
      }

      const { dado, resultado } = rolarDado2D(valor);

      mostrarOverlay(dado, resultado);
      salvarHistorico({
        skill: label.textContent.trim(),
        valor,
        dado,
        resultado
      });
    });
  });
});

// ============================
// OVERLAY
// ============================
function mostrarOverlay(dado, resultado) {
  const overlay = document.getElementById("dice-overlay");
  const sprite = document.getElementById("dice-sprite");
  const texto = document.getElementById("dice-text");

  overlay.classList.remove("hidden");
  sprite.classList.add("rolling");
  texto.textContent = "";

  setTimeout(() => {
    sprite.classList.remove("rolling");
    sprite.style.backgroundPositionX = `${-64 * (dado - 1)}px`;

    texto.textContent = `${resultado} (${dado})`;
    texto.className = `dice-text ${resultado}`;

    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 1500);
  }, 1000);
}

// ============================
// FIREBASE
// ============================
function salvarHistorico(data) {
  if (!window.db || !window.PLAYER_ID) return;

  const historicoRef = ref(
    window.db,
    `historico/${window.PLAYER_ID}/logs`
  );

  push(historicoRef, {
    player: window.PLAYER_ID,
    ...data,
    timestamp: Date.now()
  });
}
