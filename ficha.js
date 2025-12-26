const inputs = document.querySelectorAll("input");

inputs.forEach((input, i) => {
  input.value = localStorage.getItem("campo_" + i) || "";
  input.addEventListener("input", () => {
    localStorage.setItem("campo_" + i, input.value);
  });
});

document.querySelectorAll(".bar-input").forEach(input => {
  const barId = input.dataset.bar;
  const bar = document.getElementById(barId);

  function atualizar() {
    let valor = parseInt(input.value) || 0;
    if (valor < 0) valor = 0;
    if (valor > 100) valor = 100;
    bar.style.width = valor + "%";
  }

  atualizar();
  input.addEventListener("input", atualizar);
});

