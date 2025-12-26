import { db, ref, set, onValue } from "./firebase.js";

/* ================================
   INPUTS + FIREBASE
================================ */

document.querySelectorAll("input").forEach(input => {
  if (!input.id) return;

  const caminho = `jogadores/${PLAYER_ID}/${input.id}`;
  const referencia = ref(db, caminho);

  // ouvir mudanças em tempo real
  onValue(referencia, snapshot => {
    if (!snapshot.exists()) return;

    const valor = snapshot.val();

    // evita reatribuição desnecessária
    if (input.value !== String(valor)) {
      input.value = valor;
    }

    // se o input pertence a uma barra, atualiza
    const partes = input.id.split("-");
    if (partes.length === 2) {
      atualizarBarra(partes[0]);
    }
  });

  // salvar ao digitar
  input.addEventListener("input", () => {
    set(referencia, input.value);
  });
});

/* ================================
   BARRAS RPG
================================ */

function atualizarBarra(tipo) {
  const atual = document.getElementById(`${tipo}-atual`);
  const max = document.getElementById(`${tipo}-max`);
  const barra = document.getElementById(tipo);

  if (!atual || !max || !barra) return;

  let a = parseInt(atual.value) || 0;
  let m = parseInt(max.value) || 0;

  if (m <= 0) {
    barra.style.width = "0%";
    return;
  }

  if (a > m) a = m;
  if (a < 0) a = 0;

  barra.style.width = ((a / m) * 100) + "%";
}

/* ================================
   INICIALIZAR BARRAS
================================ */

["vida", "sanidade", "energia"].forEach(tipo => {
  atualizarBarra(tipo);
});
