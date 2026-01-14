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
.bar {
  background: #111;
  height: 16px;
  border-radius: 6px;
  border: 1px solid #000;
  overflow: hidden;
  margin: 6px 0;
  box-shadow: inset 0 0 6px rgba(0,0,0,0.8);
}

.bar div {
  height: 100%;
  width: 0%;
  transition: width 0.3s ease;
  border-radius: 6px;
}

/* VIDA */
#vida {
  background: linear-gradient(90deg, #ff1a1a, #ff5e5e);
  box-shadow:
    0 0 6px #ff1a1a,
    0 0 12px rgba(255, 26, 26, 0.8);
}

/* SANIDADE */
#sanidade {
  background: linear-gradient(90deg, #8a00ff, #d05fff);
  box-shadow:
    0 0 6px #8a00ff,
    0 0 12px rgba(138, 0, 255, 0.8);
}

/* ENERGIA */
#energia {
  background: linear-gradient(90deg, #00fff7, #00c4b7);
  box-shadow:
    0 0 6px #00fff7,
    0 0 12px rgba(0, 255, 247, 0.8);
}



