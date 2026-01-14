// ink.js
import { db, ref, push } from "./firebase.js";

const PLAYER_ID = localStorage.getItem("playerId");
if (!PLAYER_ID) alert("PLAYER_ID não definido!");

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
// FUNÇÃO PARA AVALIAR RESULTADO
// ============================
function avaliarResultado(valorSkill, dado) {
  const regra = TABELA_ORDEM[valorSkill];
  if (!regra) return "FALHA";
  if (regra.extremo && dado >= regra.extremo) return "EXTREMO";
  if (regra.bom && dado >= regra.bom) return "BOM";
  if (regra.normal && dado >= regra.normal) return "NORMAL";
  return "FALHA";
}

// ============================
// FUNÇÃO PRINCIPAL PARA ROLAR DADO
// ============================
function rolarDado(nome, valorSkill, inputId) {
  const overlay = document.getElementById("dice-overlay");
  const sprite = document.getElementById("dice-sprite");
  const texto = document.getElementById("dice-text");

  overlay.classList.remove("hidden");
  sprite.classList.add("rolling");

  // Rola dado 1–20
  const dado = Math.floor(Math.random() * 20) + 1;
  const resultado = avaliarResultado(valorSkill, dado);

  setTimeout(() => {
    sprite.classList.remove("rolling");

    // Define cor do resultado
    let cor = "#2196f3"; // NORMAL
    if (resultado === "EXTREMO") cor = "gold";
    else if (resultado === "BOM") cor = "#4caf50";
    else if (resultado === "FALHA") cor = "#f44336";

    // Mostra resultado no overlay
    texto.innerHTML = `${nome}: <span style="color:${cor}">${resultado}</span> (${dado})`;

    // Salva no Firebase
    const histRef = ref(db, `historico/${PLAYER_ID}`);
    push(histRef, {
      nome,
      valorSkill,
      dado,
      resultado,
      data: Date.now(),
      inputId
    });

    // Fecha overlay depois de 2s
    setTimeout(() => overlay.classList.add("hidden"), 2000);
  }, 1000);
}

// ============================
// ATIVA TODOS OS LABELS
// ============================
document.querySelectorAll(".roll-label").forEach(label => {
  label.addEventListener("click", () => {
    const inputId = label.dataset.input;
    const valorSkill = Number(document.getElementById(inputId)?.value) || 1; // pega do input
    const nome = label.textContent;
    rolarDado(nome, valorSkill, inputId);
  });
});

export { rolarDado };
