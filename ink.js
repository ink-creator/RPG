// ink.js
import { db, ref, push } from "./firebase.js";

const PLAYER_ID = localStorage.getItem("playerId");
if (!PLAYER_ID) alert("PLAYER_ID não definido!");

function rolarDado2D(nome, valor) {
  // Exibe overlay
  const overlay = document.getElementById("dice-overlay");
  const sprite = document.getElementById("dice-sprite");
  const texto = document.getElementById("dice-text");

  overlay.classList.remove("hidden");
  sprite.classList.add("rolling");

  // Escolhe resultado aleatório
  const resultado = Math.floor(Math.random() * valor) + 1;

  setTimeout(() => {
    sprite.classList.remove("rolling");
    texto.textContent = `${nome}: ${resultado}`;

    // Salva no histórico
    const histRef = ref(db, `historico/${PLAYER_ID}`);
    push(histRef, {
      nome,
      resultado,
      data: Date.now()
    });

    setTimeout(() => overlay.classList.add("hidden"), 2000);
  }, 1000);
}

// Ativa todos os inputs com roll-label
document.querySelectorAll(".roll-label").forEach(label => {
  label.addEventListener("click", () => {
    const inputId = label.dataset.input;
    const valor = Number(document.getElementById(inputId).value) || 20;
    rolarDado2D(label.textContent, valor);
  });
});

export { rolarDado2D };
