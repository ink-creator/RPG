/* SALVAR CAMPOS PELO ID */
document.querySelectorAll("input").forEach(input => {
  if (!input.id) return;

  input.value = localStorage.getItem(input.id) || "";

  input.addEventListener("input", () => {
    localStorage.setItem(input.id, input.value);
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

/* EVENTOS */
["vida", "sanidade", "energia"].forEach(tipo => {
  ["atual", "max"].forEach(sufixo => {
    const campo = document.getElementById(`${tipo}-${sufixo}`);
    if (campo) {
      campo.addEventListener("input", () => atualizarBarra(tipo));
    }
  });

  atualizarBarra(tipo);
});
