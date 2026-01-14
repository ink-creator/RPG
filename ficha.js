// ficha.js
import { db, ref, set, onValue } from "./firebase.js";

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
