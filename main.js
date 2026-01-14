import "./firebase.js"; // garante inicialização
import "./ficha.js";
import "./ink.js";

console.log("main.js carregado");
  function atualizarBarra(atualId, maxId, barraId) {
  const atualInput = document.getElementById(atualId);
  const maxInput   = document.getElementById(maxId);
  const barra      = document.getElementById(barraId);

  function atualizar() {
    const atual = parseFloat(atualInput.value) || 0;
    const max   = parseFloat(maxInput.value) || 0;

    let porcentagem = 0;
    if (max > 0) {
      porcentagem = Math.min((atual / max) * 100, 100);
    }

    barra.style.width = porcentagem + "%";
  }

  atualInput.addEventListener("input", atualizar);
  maxInput.addEventListener("input", atualizar);

  atualizar(); // atualiza ao carregar a página
}

// VIDA
atualizarBarra("vida-atual", "vida-max", "vida");

// SANIDADE
atualizarBarra("sanidade-atual", "sanidade-max", "sanidade");

// ENERGIA
atualizarBarra("energia-atual", "energia-max", "energia");
