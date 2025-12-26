import { db, ref, set, onValue } from "./firebase.js";

const inputs = document.querySelectorAll("input");

/* =========================
   BARRAS
========================= */

function atualizarBarra(tipo) {
  const atual = document.getElementById(`${tipo}-atual`);
  const max = document.getElementById(`${tipo}-max`);
  const barra = document.getElementById(tipo);

  if (!atual || !max || !barra) return;

  let a = Number(atual.value);
  let m = Number(max.value);

  if (!Number.isFinite(a)) a = 0;
  if (!Number.isFinite(m)) m = 0;

  if (m <= 0) {
    barra.style.width = "0%";
    return;
  }

  if (a > m) a = m;
  if (a < 0) a = 0;

  barra.style.width = (a / m) * 100 + "%";
}

/* =========================
   INPUTS + FIREBASE
========================= */

inputs.forEach(input => {
  if (!input.id) return;

  const caminho = `jogadores/${PLAYER_ID}/${input.id}`;
  const referencia = ref(db, caminho);

  // Firebase → Input
  onValue(referencia, snapshot => {
    if (!snapshot.exists()) return;

    const valor = String(snapshot.val());
    if (input.value !== valor) {
      input.value = valor;
    }

    const partes = input.id.split("-");
    if (partes.length === 2) {
      atualizarBarra(partes[0]);
    }
  });

  const salvarLocal = () => {
    set(referencia, input.value);

    const partes = input.id.split("-");
    if (partes.length === 2) {
      atualizarBarra(partes[0]);
    }
  };

  input.addEventListener("input", salvarLocal);
  input.addEventListener("change", salvarLocal);
  input.addEventListener("blur", salvarLocal);
});

/* =========================
   FORÇAR ATUALIZAÇÃO MOBILE
========================= */

// garante atualização mesmo se o teclado não disparar eventos
["vida", "sanidade", "energia"].forEach(tipo => {
  const atual = document.getElementById(`${tipo}-atual`);
  const max = document.getElementById(`${tipo}-max`);

  if (atual) {
    setInterval(() => atualizarBarra(tipo), 200);
  }
});

/* =========================
   INICIALIZAÇÃO
========================= */

["vida", "sanidade", "energia"].forEach(atualizarBarra);
