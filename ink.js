// ink.js
import { PLAYER_ID } from "./players.js";
import { supabase } from "./supabase.js";

/* =========================
   🎲 TABELA DE RESULTADOS
========================= */
const TABELA_ORDEM = {
  1:{extremo:null,bom:null,normal:20},
  2:{extremo:null,bom:20,normal:19},
  3:{extremo:null,bom:20,normal:18},
  4:{extremo:20,bom:19,normal:17},
  5:{extremo:20,bom:19,normal:16},
  6:{extremo:20,bom:18,normal:15},
  7:{extremo:20,bom:18,normal:14},
  8:{extremo:20,bom:17,normal:13},
  9:{extremo:20,bom:17,normal:12},
  10:{extremo:19,bom:16,normal:11},
  11:{extremo:19,bom:16,normal:10},
  12:{extremo:19,bom:15,normal:9},
  13:{extremo:19,bom:15,normal:8},
  14:{extremo:19,bom:14,normal:7},
  15:{extremo:18,bom:14,normal:6},
  16:{extremo:18,bom:13,normal:5},
  17:{extremo:18,bom:13,normal:4},
  18:{extremo:18,bom:12,normal:3},
  19:{extremo:18,bom:12,normal:2},
  20:{extremo:17,bom:11,normal:1}
};

function avaliar(valor, dado) {
  const r = TABELA_ORDEM[valor];
  if (!r) return "FALHA";
  if (r.extremo && dado >= r.extremo) return "EXTREMO";
  if (r.bom && dado >= r.bom) return "BOM";
  if (dado >= r.normal) return "NORMAL";
  return "FALHA";
}

/* =========================
   🧠 ROLAGEM + HISTÓRICO
========================= */
async function rolarDado2D(pericia, valor) {
  const overlay = document.getElementById("dice-overlay");
  const dice = document.getElementById("dice-sprite");
  const text = document.getElementById("dice-text");

  // reset visual
  text.textContent = "";
  text.className = "dice-text";
  dice.style.backgroundPositionX = "0px";

  // mostra overlay e anima
  overlay.classList.add("show");
  dice.classList.add("rolling");

  // tempo da animação girando
  await new Promise(r => setTimeout(r, 1200));

  // sorteio real
  const dado = Math.floor(Math.random() * 20) + 1;
  const resultado = avaliar(valor, dado);

  // para animação
  dice.classList.remove("rolling");

  // posiciona sprite no número correto
  const posX = -((dado - 1) * 64);
  dice.style.backgroundPositionX = `${posX}px`;

  // texto + cor
  text.textContent = `${resultado} (${dado})`;
  text.classList.add(resultado);

  // salva no supabase
  const { error } = await supabase
    .from("roll_history")
    .insert({
      player_id: PLAYER_ID,
      pericia: pericia,
      dado: dado,
      input_valor: valor,
      resultado: resultado
    });

  if (error) {
    console.error("Erro ao salvar histórico:", error);
  }

  // fecha overlay
  setTimeout(() => {
    overlay.classList.remove("show");
  }, 2200);
}

/* =========================
   🖱️ EVENTOS
========================= */
document.querySelectorAll(".roll-label").forEach(label => {
  label.addEventListener("click", e => {
    e.preventDefault();

    const input = document.getElementById(label.dataset.input);
    if (!input) return alert("Input não encontrado");

    const valor = parseInt(input.value, 10);
    if (isNaN(valor)) return alert("Valor inválido");

    rolarDado2D(label.textContent.trim(), valor);
  });
});

