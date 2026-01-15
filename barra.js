// ===============================
// FIREBASE
// ===============================
import {
  getDatabase,
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const db = getDatabase();

// ID DO PLAYER (ex: p1, p2...)
// coloque no <body data-player="p1">
const playerId = document.body.dataset.player;

if (!playerId) {
  console.warn("Player ID não definido no body");
}

// ===============================
// FUNÇÃO GENÉRICA DE BARRA
// ===============================
function ligarBarra(atualId, maxId, barraId, tipo) {
  const atualInput = document.getElementById(atualId);
  const maxInput   = document.getElementById(maxId);
  const barra      = document.getElementById(barraId);

  if (!atualInput || !maxInput || !barra) return;

  function atualizarBarra() {
    const atual = Number(atualInput.value);
    const max   = Number(maxInput.value);

    if (isNaN(atual) || isNaN(max) || max <= 0) {
      barra.style.width = "0%";
      return;
    }

    let porcentagem = (atual / max) * 100;
    porcentagem = Math.max(0, Math.min(100, porcentagem));

    barra.style.width = porcentagem + "%";
  }

  function salvarFirebase() {
    if (!playerId) return;

    set(ref(db, `players/${playerId}/status/${tipo}`), {
      atual: Number(atualInput.value) || 0,
      max: Number(maxInput.value) || 0
    });
  }

  // eventos
  atualInput.addEventListener("input", () => {
    atualizarBarra();
    salvarFirebase();
  });

  maxInput.addEventListener("input", () => {
    atualizarBarra();
    salvarFirebase();
  });

  // carregar do Firebase
  onValue(ref(db, `players/${playerId}/status/${tipo}`), snapshot => {
    const dados = snapshot.val();
    if (!dados) return;

    atualInput.value = dados.atual;
    maxInput.value   = dados.max;

    atualizarBarra();
  });

  // inicializa
  atualizarBarra();

  // expõe globalmente (dano automático, mestre, etc)
  return atualizarBarra;
}

// ===============================
// INICIALIZAÇÃO
// ===============================
window.addEventListener("DOMContentLoaded", () => {

  window.atualizarVida = ligarBarra(
    "vida-atual",
    "vida-max",
    "vida",
    "vida"
  );

  window.atualizarSanidade = ligarBarra(
    "sanidade-atual",
    "sanidade-max",
    "sanidade",
    "sanidade"
  );

  window.atualizarEnergia = ligarBarra(
    "energia-atual",
    "energia-max",
    "energia",
    "energia"
  );

});
