// ============================
// IMPORTS
// ============================
import { rolarDado2D } from "./dice.js"; // ajuste o caminho se necessário
import { db } from "./firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ============================
// CHECAGEM DO PLAYER ID
// ============================
window.PLAYER_ID = localStorage.getItem("playerId");

if (!window.PLAYER_ID) {
  alert("Sessão inválida. Faça login novamente.");
  window.location.href = "./index.html";
}

// ============================
// FUNÇÃO DE HISTÓRICO
// ============================
function salvarHistorico(data) {
  if (!window.PLAYER_ID || !db) {
    console.error("PLAYER_ID ou db não definido. Histórico não enviado.", data);
    return;
  }

  try {
    const historicoRef = ref(db, `historico/${window.PLAYER_ID}/logs`);
    push(historicoRef, {
      player: window.PLAYER_ID,
      ...data,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error("Erro ao enviar histórico:", err, data);
  }
}

// ============================
// OVERLAY DO DADO
// ============================
function mostrarOverlay(dado, resultado) {
  const overlay = document.getElementById("dice-overlay");
  const sprite = document.getElementById("dice-sprite");
  const texto = document.getElementById("dice-text");

  if (!overlay || !sprite || !texto) return;

  overlay.classList.remove("hidden");
  sprite.classList.add("rolling");
  texto.textContent = "";

  setTimeout(() => {
    sprite.classList.remove("rolling");
    sprite.style.backgroundPositionX = `${-64 * (dado - 1)}px`;

    texto.textContent = `${resultado} (${dado})`;
    texto.className = `dice-text ${resultado}`;

    setTimeout(() => overlay.classList.add("hidden"), 1500);
  }, 1000);
}

// ============================
// EVENTOS DE CLIQUE
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const labels = document.querySelectorAll("label.roll-label");

  labels.forEach(label => {
    label.addEventListener("mousedown", e => e.preventDefault(), true);

    label.addEventListener("click", e => {
      e.preventDefault();

      const input = document.getElementById(label.dataset.input);
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
