import { db, ref, set, onValue } from "./firebase.js";

/* SALVAR + OUVIR CAMPOS */
document.querySelectorAll("input").forEach(input => {
  if (!input.id) return;

  const caminho = `jogadores/${PLAYER_ID}/${input.id}`;
  const referencia = ref(db, caminho);

  // OUVIR mudanças em tempo real
  onValue(referencia, snapshot => {
    if (snapshot.exists()) {
      input.value = snapshot.val();
    }
  });

  // SALVAR ao digitar
  input.addEventListener("input", () => {
    set(referencia, input.value);
  });
});

/* BARRAS */
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

  barra.style.width = (a / m) * 100 + "%";
}
