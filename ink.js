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
  12: { extremo: 19,  bom: 15,  normal: 9  },
  13: { extremo: 19,  bom: 15,  normal: 8  },
  14: { extremo: 19,  bom: 14,  normal: 7  },
  15: { extremo: 18,  bom: 14,  normal: 6  },
  16: { extremo: 18,  bom: 13,  normal: 5  },
  17: { extremo: 18,  bom: 13,  normal: 4  },
  18: { extremo: 18,  bom: 12,  normal: 3  },
  19: { extremo: 18,  bom: 12,  normal: 2  },
  20: { extremo: 17,  bom: 11,  normal: 1  },
};

// ============================
// AVALIA RESULTADO
// ============================
function avaliarResultado(valor, dado) {
  const regra = TABELA_ORDEM[valor];
  if (!regra) return "FALHA";

  if (regra.extremo !== null && dado >= regra.extremo) return "EXTREMO";
  if (regra.bom !== null && dado >= regra.bom) return "BOM";
  if (regra.normal !== null && dado >= regra.normal) return "NORMAL";
  return "FALHA";
}

// ============================
// FUNÇÃO PARA ROLAR DADO 2D COM SPRITE
// ============================
function rolarDado2D(valorSkill) {
  const overlay = document.getElementById("dice-overlay");
  overlay.classList.remove("hidden");
  const sprite = document.getElementById("dice-sprite");
  const texto = document.getElementById("dice-text");

  overlay.classList.remove("hidden");
  sprite.classList.add("rolling");
  texto.textContent = "";
  texto.className = "dice-text";

  // rolagem animada por 1s
  setTimeout(() => {
    sprite.classList.remove("rolling");

    // valor do dado
    const dado = Math.floor(Math.random() * 20) + 1;
    const resultado = avaliarResultado(valorSkill, dado);

    // ajusta frame do dado
    sprite.style.backgroundPositionX = `${-64 * (dado - 1)}px`;

    // mostra resultado
    texto.textContent = `${resultado} (${dado})`;
    texto.className = `dice-text ${resultado}`;

    // fecha overlay depois de 1.5s
    setTimeout(() => overlay.classList.add("hidden"), 1500);
  }, 1000);
}

// ============================
// CLIQUE NOS LABELS PARA ROLAR
// ============================
document.querySelectorAll("label[for]").forEach(label => {
  label.style.cursor = "pointer";

  label.addEventListener("click", (event) => {
    event.preventDefault(); // evita foco no input
    const input = document.getElementById(label.getAttribute("for"));
    if (!input) return;

    const valor = parseInt(input.value, 10);
    if (isNaN(valor) || valor < 1 || valor > 20) return;

    rolarDado2D(valor);
  });
});
function verificarInput(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return false;

  const valor = input.value.trim(); // remove espaços
  if (valor === "") {
    alert(`O campo "${inputId}" está vazio!`);
    return false;
  }

  return true;
}

// Exemplo de uso no clique do label
document.querySelectorAll("label[for]").forEach(label => {
  label.style.cursor = "pointer";

  label.addEventListener("click", (event) => {
    event.preventDefault(); // previne foco automático

    const inputId = label.getAttribute("for");

    // Verifica se está vazio
    if (!verificarInput(inputId)) return;

    const input = document.getElementById(inputId);
    const valor = parseInt(input.value, 10);

    // Valor inválido
    if (isNaN(valor) || valor < 1 || valor > 20) {
      alert(`O valor do campo "${inputId}" precisa ser de 1 a 20.`);
      return;
    }

    rolarDado2D(valor);
  });
});

