const inputs = document.querySelectorAll("input");

/* Salvar tudo */
inputs.forEach((input, i) => {
  input.value = localStorage.getItem("campo_" + i) || "";
  input.addEventListener("input", () => {
    localStorage.setItem("campo_" + i, input.value);
  });
});

/* Barras com atual / máximo */
function atualizarBarra(tipo) {
  const atual = document.querySelector(`.current[data-bar="${tipo}"]`);
  const max = document.querySelector(`.max[data-bar="${tipo}"]`);
  const barra = document.getElementById(tipo);

  let a = parseInt(atual.value) || 0;
  let m = parseInt(max.value) || 0;

  if (m <= 0) {
    barra.style.width = "0%";
    return;
  }

  if (a > m) a = m;
  if (a < 0) a = 0;

  const porcentagem = (a / m) * 100;
  barra.style.width = porcentagem + "%";
}

["vida", "sanidade", "energia"].forEach(tipo => {
  document.querySelectorAll(`[data-bar="${tipo}"]`).forEach(input => {
    input.addEventListener("input", () => atualizarBarra(tipo));
  });

  atualizarBarra(tipo);
});


