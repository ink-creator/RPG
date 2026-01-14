import { rolarDado2D } from "./dice.js";
import { db } from "./firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("label.roll-label").forEach(label => {
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

function salvarHistorico(data) {
  if (!db || !window.PLAYER_ID) return;

  const historicoRef = ref(db, `historico/${window.PLAYER_ID}/logs`);
  push(historicoRef, {
    player: window.PLAYER_ID,
    ...data,
    timestamp: Date.now()
  });
}
