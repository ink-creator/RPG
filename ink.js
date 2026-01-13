// ============================
// FIREBASE
// ============================

import { db } from "../firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ============================
// TABELA DE RESULTADOS
// ============================

const TABELA_ORDEM = {
  1:  { extremo: null, bom: null, normal: 20 },
  2:  { extremo: null, bom: 20, normal: 19 },
  3:  { extremo: null, bom: 20, normal: 18 },
  4:  { extremo: 20,  bom: 19, normal: 17 },
  5:  { extremo: 20,  bom: 19, normal: 16 },
  6:  { extremo: 20,  bom: 18, normal: 15 },
  7:  { extremo: 20,  bom: 18, normal: 14 },
  8:  { extremo: 20,  bom: 17, normal: 13 },
  9:  { extremo: 20,  bom: 17, normal: 12 },
  10: { extremo: 19,  bom: 16, normal: 11 },
  11: { extremo: 19,  bom: 16, normal: 10 },
  12: { extremo: 19,  bom: 15, normal: 9  },
  13: { extremo: 19,  bom: 15, normal: 8  },
  14: { extremo: 19,  bom: 14, normal: 7  },
  15: { extremo: 18,  bom: 14, normal: 6  },
  16: { extremo: 18,  bom: 13, normal: 5  },
  17: { extremo: 18,  bom: 13, normal: 4  },
  18: { extremo: 18,  bom: 12, normal: 3  },
  19: { extremo: 18,  bom: 12, normal: 2  },
  20: { extremo: 17,  bom: 11, normal: 1  }
};

// ============================
// AVALIAR RESULTADO
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
// SALVAR HISTÓRICO
// ============================

function salvarHistorico({ jogador, playerId, pericia, valorSkill, dado, resultado }) {
  const historicoRef = ref(db, "historicoDados");

  push(historicoRef, {
    jogador,
    playerId,
    pericia,
    valorSkill,
    dado,
    resultado,
    timestamp: Date.now()
  });
}

// ============================
// ROLAGEM DE DADO
// ============================

function rolarDado2D(valorSkill) {
  const overlay = document.getElementById("dice-overlay");
  const sprite  = document.getElementById("dice-sprite");
  const texto   = document.getElementById("dice-text");

  overlay.classList.remove("hidden");
  sprite.classList.add("rolling");

  texto.textContent = "";
  texto.className = "dice-text";

  setTimeout(() => {
    sprite.classList.remove("rolling");

    const dado = Math.floor(Math.random() * 20) + 1;
    const resultado = avaliarResultado(valorSkill, dado);

    sprite.style.backgroundPositionX = `${-64 * (dado - 1)}px`;

    texto.textContent = `${resultado} (${dado})`;
    texto.className = `dice-text ${resultado}`;

    const nomeJogador =
      document.getElementById("nome")?.value || "Desconhecido";

    salvarHistorico({
      jogador: nomeJogador,
      playerId: window.PLAYER_ID || "desconhecido",
      pericia: window.periciaAtual || "Perícia",
      valorSkill,
      dado,
      resultado
    });

    setTimeout(() => overlay.classList.add("hidden"), 1500);
  }, 1000);
}

// ============================
// DOM READY
// ============================

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("label[for]").forEach(label => {

    // IMPEDE O FOCO NO INPUT (isso é o segredo)
    label.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });

    // Clique = rolar dado
    label.addEventListener("click", () => {

      const inputId = label.getAttribute("for");
      const input = document.getElementById(inputId);
      if (!input) return;

      window.periciaAtual = label.textContent.trim();

      if (input.value.trim() === "") {
        alert(`O campo "${window.periciaAtual}" está vazio!`);
        return;
      }

      const valor = parseInt(input.value, 10);
      if (isNaN(valor) || valor < 1 || valor > 20) {
        alert(`O valor de "${window.periciaAtual}" precisa ser de 1 a 20.`);
        return;
      }

      rolarDado2D(valor);
    });

  });

});
