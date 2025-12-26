const inputs = document.querySelectorAll("input");

/* SALVAR CAMPOS (modo antigo) */
inputs.forEach((input, i) => {
  input.value = localStorage.getItem("campo_" + i) || "";
  input.addEventListener("input", () => {
    localStorage.setItem("campo_" + i, input.value);
  });
});

/* BARRAS */
function atualizarBarra(tipo) {
  const atual = document.querySelector(`.current[data-bar="${tipo}"]`);
  const max = document.querySelector(`.max[data-bar="${tipo}"]`);
  const barra = document.getElementById(tipo);

  if (!atual || !max || !barra) return;

  let a = parseInt(atual.value) || 0;
  let m = parseInt(max.value) || 0;

  if (m <= 0) {
    barra.style.width = "0%";
    return;
  }

  barra.style.width = Math.min((a / m) * 100, 100) + "%";
}

["vida", "sanidade", "energia"].forEach(tipo => {
  document.querySelectorAll(`[data-bar="${tipo}"]`).forEach(input => {
    input.addEventListener("input", () => atualizarBarra(tipo));
  });
  atualizarBarra(tipo);
});
