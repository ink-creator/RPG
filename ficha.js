// ficha.js
import { db, ref, set, onValue, push } from "./firebase.js";

// PLAYER_ID precisa estar definido antes
const PLAYER_ID = localStorage.getItem("playerId");
if (!PLAYER_ID) alert("PLAYER_ID não definido! Faça login primeiro.");

const inputs = document.querySelectorAll("input");

/* =========================
   ATUALIZA BARRAS
========================= */
function atualizarBarra(tipo) {
  const atual = document.getElementById(`${tipo}-atual`);
  const max = document.getElementById(`${tipo}-max`);
  const barra = document.getElementById(tipo);
  if (!atual || !max || !barra) return;

  let a = Number(atual.value) || 0;
  let m = Number(max.value) || 0;

  if (m <= 0) {
    barra.style.width = "0%";
    return;
  }

  if (a > m) a = m;
  if (a < 0) a = 0;

  barra.style.width = (a / m) * 100 + "%";
}

/* =========================
   SINCRONIZAÇÃO COM FIREBASE
========================= */
inputs.forEach(input => {
  if (!input.id) return;
  const caminho = `jogadores/${PLAYER_ID}/${input.id}`;
  const referencia = ref(db, caminho);

  // Firebase → Input
  onValue(referencia, snapshot => {
    if (!snapshot.exists()) return;
    const valor = String(snapshot.val());
    if (input.value !== valor) input.value = valor;
    const partes = input.id.split("-");
    if (partes.length === 2) atualizarBarra(partes[0]);
  });

  // Input → Firebase
  const salvar = () => {
    set(referencia, input.value);
    const partes = input.id.split("-");
    if (partes.length === 2) atualizarBarra(partes[0]);
  };

  input.addEventListener("input", salvar);
  input.addEventListener("change", salvar);
  input.addEventListener("blur", salvar);
});

/* =========================
   Atualização periódica mobile
========================= */
["vida", "sanidade", "energia"].forEach(tipo => {
  const atual = document.getElementById(`${tipo}-atual`);
  if (atual) setInterval(() => atualizarBarra(tipo), 200);
});

/* =========================
   Inicializa barras
========================= */
["vida", "sanidade", "energia"].forEach(atualizarBarra);
// Seleciona todos os elementos que podem rolar
document.querySelectorAll(".roll-label").forEach(label => {
  label.addEventListener("click", () => {
    const inputId = label.dataset.input;
    const inputEl = document.getElementById(inputId);
    if (!inputEl) return;

    // rolagem aleatória
    const resultado = Math.floor(Math.random() * 20) + 1; // d20
    inputEl.value = resultado;

    // mostra animação
    const overlay = document.getElementById("dice-overlay");
    const sprite = document.getElementById("dice-sprite");
    const texto = document.getElementById("dice-text");
    overlay.classList.remove("hidden");
    texto.textContent = resultado;

    sprite.classList.add("rolling");
    setTimeout(() => {
      sprite.classList.remove("rolling");
      overlay.classList.add("hidden");
    }, 1000);

    // envia para histórico
    const playerId = PLAYER_ID; // define em algum lugar
    const data = {
      nome: inputId,
      resultado,
      data: Date.now()
    };
    set(ref(db, `historico/${playerId}/${Date.now()}`), data);
  });
});
