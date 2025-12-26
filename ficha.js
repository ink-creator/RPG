/* SALVAR CAMPOS PELO ID + PLAYER */
document.querySelectorAll("input").forEach(input => {
  if (!input.id) return;

  const chave = PLAYER_ID + "_" + input.id;

  // carregar valor salvo
  input.value = localStorage.getItem(chave) || "";

  // salvar ao digitar
  input.addEventListener("input", () => {
    localStorage.setItem(chave, input.value);
  });
});

/* ATUALIZAR BARRAS */
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

/* EVENTOS DAS BARRAS */
["vida", "sanidade", "energia"].forEach(tipo => {
  ["atual", "max"].forEach(sufixo => {
    const campo = document.getElementById(`${tipo}-${sufixo}`);
    if (campo) {
      campo.addEventListener("input", () => atualizarBarra(tipo));
    }
  });

  atualizarBarra(tipo);
});
