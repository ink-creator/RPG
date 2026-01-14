// ink.js
import { db, ref, push } from "./firebase.js";

const PLAYER_ID = localStorage.getItem("playerId");
if (!PLAYER_ID) alert("PLAYER_ID não definido! Faça login.");

// ============================
// TABELA DE RESULTADOS
// ============================
const TABELA_ORDEM = {
  1:  { extremo: null, bom: null, normal: 20 },
  2:  { extremo: null, bom: 20,  normal: 19 },
  3:  { extremo: null, bom: 20,  normal: 18 },
  4:  { extremo: 20,  bom: 19,  normal: 17 },
  5:  { extremo: 20,  bom: 19,  normal: 16 },
  6:  { extremo: 20,  bom: 18,  normal: 15 },
  7:  { extremo: 20,  bom: 18,  normal: 14 },
  8:  { extremo: 20,  bom: 17,  normal: 13 },
  9:  { extremo: 20,  bom: 17,  normal: 12 },
  10: { extremo: 19,  bom: 16,  normal: 11 },
  11: { extremo: 19,  bom: 16,  normal: 10 },
  12: { extremo: 19,  bom: 15,  normal: 9 },
  13: { extremo: 19,  bom: 15,  normal: 8 },
  14: { extremo: 19,  bom: 14,  normal: 7 },
  15: { extremo: 18,  bom: 14,  normal: 6 },
  16: { extremo: 18,  bom: 13,  normal: 5 },
  17: { extremo: 18,  bom: 13,  normal: 4 },
  18: { extremo: 18,  bom: 12,  normal: 3 },
  19: { extremo: 18,  bom: 12,  normal: 2 },
  20: { extremo: 17,  bom: 11,  normal: 1 },
};

// ============================
// AVALIA RESULTADO
// ============================
function avaliarResultado(valorSkill, dado) {
  const regra = TABELA_ORDEM[valorSkill];
  if (!regra) return "FALHA";

  if (regra.extremo !== null && dado >= regra.extremo) return "EXTREMO";
  if (regra.bom !== null && dado >= regra.bom) return "BOM";
  if (regra.normal !== null && dado >= regra.normal) return "NORMAL";

  return "FALHA";
}

// ============================
// FUNÇÃO DE ROLAR DADO
// ============================
function rolarDado2D(nome, valorSkill) {
  const overlay = document.getElementById("dice-overlay");
  const sprite  = document.getElementById("dice-sprite");
  const texto   = document.getElementById("dice-text");

  if (!overlay || !sprite || !texto) return;

  overlay.classList.remove("hidden");
  sprite.classList.add("rolling");
  texto.textContent = "";

  setTimeout(() => {
    sprite.classList.remove("rolling");

    const dado = Math.floor(Math.random() * 20) + 1;
    const resultado = avaliarResultado(valorSkill, dado);

    // atualiza visual do dado
    sprite.style.backgroundPositionX = `${-64 * (dado - 1)}px`;

    texto.textContent = `${nome}: ${resultado} (${dado})`;
    texto.className = `dice-text ${resultado}`;

    // salva no Firebase
    const histRef = ref(db, `historico/${PLAYER_ID}`);
    push(histRef, {
      nome,
      valorSkill,
      resultado,
      dado,
      data: Date.now()
    });

    setTimeout(() => overlay.classList.add("hidden"), 1500);
  }, 1000);
}

// ============================
// LABELS CLIQUE → ROLAR
// ============================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("label[for]").forEach(label => {
    label.style.cursor = "pointer";

    // bloqueia foco nativo
    label.addEventListener("mousedown", e => {
      e.preventDefault();
      e.stopImmediatePropagation();
    }, true);

    // clique chama dado
    label.addEventListener("click", e => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const inputId = label.getAttribute("for");
      const input = document.getElementById(inputId);
      if (!input) return;

      const valor = parseInt(input.value, 10);
      if (isNaN(valor) || valor < 1 || valor > 20) {
        alert(`O valor de "${label.textContent.trim()}" precisa ser de 1 a 20.`);
        return;
      }

      rolarDado2D(label.textContent.trim(), valor);
    });
  });
});

export { rolarDado2D };
