function ligarBarra(atualId, maxId, barraId) {
  const atualInput = document.getElementById(atualId);
  const maxInput   = document.getElementById(maxId);
  const barra      = document.getElementById(barraId);

  if (!atualInput || !maxInput || !barra) return;

  function atualizar() {
    const atual = Number(atualInput.value);
    const max   = Number(maxInput.value);

    if (isNaN(atual) || isNaN(max) || max <= 0) {
      barra.style.width = "0%";
      return;
    }

    const porcentagem = Math.max(0, Math.min(100, (atual / max) * 100));
    barra.style.width = porcentagem + "%";
  }

  atualInput.addEventListener("input", atualizar);
  maxInput.addEventListener("input", atualizar);

  atualizar(); // 👈 CRUCIAL: atualiza ao carregar
}

// garante que o DOM existe
window.addEventListener("DOMContentLoaded", () => {
  ligarBarra("vida-atual", "vida-max", "vida");
  ligarBarra("sanidade-atual", "sanidade-max", "sanidade");
  ligarBarra("energia-atual", "energia-max", "energia");
});
