import { db, ref, set, onValue } from "./firebase.js";

document.querySelectorAll("input").forEach(input => {
  if (!input.id) return;

  const caminho = `jogadores/${PLAYER_ID}/${input.id}`;
  const referencia = ref(db, caminho);

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

  const salvar = () => {
    set(referencia, input.value);

    const partes = input.id.split("-");
    if (partes.length === 2) {
      atualizarBarra(partes[0]);
    }
  };

  input.addEventListener("input", salvar);
  input.addEventListener("change", salvar);
  input.addEventListener("keyup", salvar);
});

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

  barra.style.width = (a / m) * 100 + "%";
}

["vida", "sanidade", "energia"].forEach(atualizarBarra);
