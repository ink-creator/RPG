function ligarBarra(atualId, maxId, barraId) {
  const atualInput = document.getElementById(atualId);
  const maxInput   = document.getElementById(maxId);
  const barra      = document.getElementById(barraId);

  // segurança: se algo não existir, não quebra o site
  if (!atualInput || !maxInput || !barra) return;

  function atualizar() {
    const atual = Number(atualInput.value);
    const max   = Number(maxInput.value);

    // validações
    if (isNaN(atual) || isNaN(max) || max <= 0) {
      barra.style.width = "0%";
      return;
    }

    // cálculo proporcional
    let porcentagem = (atual / max) * 100;

    // trava entre 0 e 100
    porcentagem = Math.max(0, Math.min(100, porcentagem));

    barra.style.width = porcentagem + "%";
  }

  // eventos
  atualInput.addEventListener("input", atualizar);
  maxInput.addEventListener("input", atualizar);
  atualInput.addEventListener("change", atualizar);
  maxInput.addEventListener("change", atualizar);

  // atualiza imediatamente
  atualizar();

  // retorna função para uso externo (Firebase / localStorage)
  return atualizar;
}

// ===============================
// INICIALIZAÇÃO SEGURA
// ===============================
window.addEventListener("DOMContentLoaded", () => {

  // VIDA
  window.atualizarVida = ligarBarra(
    "vida-atual",
    "vida-max",
    "vida"
  );

  // SANIDADE
  window.atualizarSanidade = ligarBarra(
    "sanidade-atual",
    "sanidade-max",
    "sanidade"
  );

  // ENERGIA
  window.atualizarEnergia = ligarBarra(
    "energia-atual",
    "energia-max",
    "energia"
  );

});
atualizar()
