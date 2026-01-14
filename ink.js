// ============================
// IMPORTS
// ============================
import { rolarDado2D } from "./dice.js";
import { db } from "./firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ============================
// PLAYER ID
// ============================
window.PLAYER_ID = localStorage.getItem("playerId");

if (!window.PLAYER_ID) {
  alert("Sessão inválida. Faça login novamente.");
  window.location.href = "../index.html";
}

// ============================
// FUNÇÃO SEGURA PARA SALVAR HISTÓRICO
// ============================
function salvarHistorico(data) {
  if (!window.PLAYER_ID) {
    console.warn("PLAYER_ID indefinido, não foi possível salvar o histórico.");
    return;
  }

  const historicoRef = ref(db, `historico/${window.PLAYER_ID}/logs`);

  push(historicoRef, {
    player: window.PLAYER_ID,
    ...data,
    timestamp: Date.now()
  })
  .then(() => console.log("Histórico salvo:", data))
  .catch(err => console.error("Erro ao salvar histórico:", err));
}

// ============================
// OVERLAY DE DADO
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

    setTimeout(() => overlay.classList.add("hidden"), 1500);
  }, 1000);
}

// ============================
// ROLAGEM DE DADOS
// ============================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("label.roll-label").forEach(label => {
    label.addEventListener("mousedown", e => e.preventDefault(), true);

    label.addEventListener("click", e => {
      e.preventDefault();

      const input = document.getElementById(label.dataset.input);
      if (!input) {
        console.warn("Input não encontrado para:", label.dataset.input);
        return;
      }

      const valor = parseInt(input.value, 10);
      if (isNaN(valor) || valor < 1 || valor > 20) {
        alert("Valor precisa ser entre 1 e 20");
        return;
      }

      const { dado, resultado } = rolarDado2D(valor);
      mostrarOverlay(dado, resultado);

      // Salva histórico com segurança
      salvarHistorico({
        skill: label.textContent.trim(),
        valor,
        dado,
        resultado
      });
    });
  });
});
