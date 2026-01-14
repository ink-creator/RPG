// ink.js
import { PLAYER_ID } from "./players.js";
import { db, ref, push } from "./firebase.js";

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
  20: { extremo: 17,  bom: 11,  normal: 1 },
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
// ROLAR DADO
// ============================
function rolarDado2D(nome, valorSkill) {
  const overlay = document.getElementById("dice-overlay");
  const sprite = document.getElementById("dice-sprite");
  const texto = document.getElementById("dice-text");

  if (!overlay || !sprite || !texto) return;

  overlay.classList.add("show");
  sprite.classList.add("rolling");
  texto.textContent = "";
  texto.className = "dice-text";

  setTimeout(() => {
    const dado = Math.floor(Math.random() * 20) + 1;
    const resultado = avaliarResultado(valorSkill, dado);

    texto.textContent = `${nome}: ${resultado} (${dado})`;

    push(ref(db, `historico/${PLAYER_ID}`), {
      nome,
      resultado,
      dado,
      data: Date.now()
    });

    setTimeout(() => overlay.classList.remove("show"), 2000);
  }, 1000);
}

// ============================
// ATIVA LABELS
// ============================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".roll-label").forEach(label => {
    label.addEventListener("click", e => {
      e.preventDefault();

      const input = document.getElementById(label.dataset.input);
      if (!input) return;

      const valor = parseInt(input.value, 10);
      if (isNaN(valor) || valor < 1 || valor > 20) {
        alert("Valor deve ser entre 1 e 20");
        return;
      }

      rolarDado2D(label.textContent.trim(), valor);
    });
  });
});

export { rolarDado2D };
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

