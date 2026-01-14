function ligarBarra(atualId, maxId, barraId) {
  const atualInput = document.getElementById(atualId);
  const maxInput   = document.getElementById(maxId);
  const barra      = document.getElementById(barraId);

  function atualizar() {
    const atual = Number(atualInput.value);
    const max   = Number(maxInput.value);

    if (isNaN(atual) || isNaN(max) || max <= 0) {
      barra.style.width = "0%";
      return;
    }

    let porcentagem = (atual / max) * 100;

    // trava entre 0 e 100
    porcentagem = Math.max(0, Math.min(100, porcentagem));

    barra.style.width = porcentagem + "%";
  }

  atualInput.addEventListener("input", atualizar);
  maxInput.addEventListener("input", atualizar);

  atualizar(); // atualiza ao carregar
}

// VIDA
ligarBarra("vida-atual", "vida-max", "vida");

// SANIDADE
ligarBarra("sanidade-atual", "sanidade-max", "sanidade");

// ENERGIA
ligarBarra("energia-atual", "energia-max", "energia");


