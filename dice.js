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

// ============================
// TABELA DE RESULTADOS
// ============================
const TABELA_ORDEM = {
  1:  { extremo: null, bom: null, normal: 20 },
  2:  { extremo: null, bom: 20,  normal: 19 },
  3:  { extremo: null, bom: 20,  normal: 18 },
  4:  { extremo: 20,  bom: 19,  normal: 17 },
  5:  { extremo: 20,  bom: 19,  normal: 16 },
  6:  { extremo: 20,  bom: 18,  normal: 15 },
  7:  { extremo: 20,  bom: 18,  normal: 14 },
  8:  { extremo: 20,  bom: 17,  normal: 13 },
  9:  { extremo: 20,  bom: 17,  normal: 12 },
  10: { extremo: 19,  bom: 16,  normal: 11 },
  11: { extremo: 19,  bom: 16,  normal: 10 },
  12: { extremo: 19,  bom: 15,  normal: 9 },
  13: { extremo: 19,  bom: 15,  normal: 8 },
  14: { extremo: 19,  bom: 14,  normal: 7 },
  15: { extremo: 18,  bom: 14,  normal: 6 },
  16: { extremo: 18,  bom: 13,  normal: 5 },
  17: { extremo: 18,  bom: 13,  normal: 4 },
  18: { extremo: 18,  bom: 12,  normal: 3 },
  19: { extremo: 18,  bom: 12,  normal: 2 },
  20: { extremo: 17,  bom: 11,  normal: 1 },
};

function avaliarResultado(valor, dado) {
  const regra = TABELA_ORDEM[valor];
  if (!regra) return "FALHA";
  if (regra.extremo && dado >= regra.extremo) return "EXTREMO";
  if (regra.bom && dado >= regra.bom) return "BOM";
  if (regra.normal && dado >= regra.normal) return "NORMAL";
  return "FALHA";
}

// EXPORTA FUNÇÃO ÚNICA
export function rolarDado2D(valorSkill) {
  const dado = Math.floor(Math.random() * 20) + 1;
  const resultado = avaliarResultado(valorSkill, dado);

  return { dado, resultado };
}
