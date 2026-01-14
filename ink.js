import { rolarDado2D } from "../dice.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ============================
// CONFIGURAÇÃO DO FIREBASE
// ============================
const firebaseConfig = {
  apiKey: "AIzaSyBCCbxXH6UZEqpItsdVaaG354Nqu28HA44",
  authDomain: "rpg-ficha-online.firebaseapp.com",
  databaseURL: "https://rpg-ficha-online-default-rtdb.firebaseio.com",
  projectId: "rpg-ficha-online",
  storageBucket: "rpg-ficha-online.firebasestorage.app",
  messagingSenderId: "213971701978",
  appId: "1:213971701978:web:b030274505603fd49255e3"
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

