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
   🧠 MAPA DE ATRIBUTOS
========================= */
const mapaAtributos = {
  luta: "forca",
  atletismo: "forca",

  pontaria: "agilidade",
  furtividade: "agilidade",

  investigacao: "intelecto",
  tecnologia: "intelecto",
  medicina: "intelecto",
  tatica: "intelecto",

  percepcao: "vigor",

  intimidacao: "presenca",
  persuasao: "presenca"
};

function getValor(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  return parseInt(el.value) || 0;
}

/* =========================
   ⚔️ ROLAGEM COMPLETA
========================= */
async function rolarDado2D(periciaId, labelTexto) {

  const overlay = document.getElementById("dice-overlay");
  const dice = document.getElementById("dice-sprite");
  const text = document.getElementById("dice-text");

  if (!overlay || !dice || !text) {
    console.error("Overlay não encontrado");
    return;
  }

  const valorPericia = getValor(periciaId);
  const atributoId = mapaAtributos[periciaId];
  const valorAtributo = getValor(atributoId);

  const valorTotal = valorPericia + valorAtributo;

  const defesa = getValor("defesa");
  const DT = 10;

  // reset visual
  text.textContent = "";
  text.className = "dice-text";
  dice.style.backgroundPositionX = "0px";

  overlay.classList.add("show");
  dice.classList.add("rolling");

  await new Promise(r => setTimeout(r, 1200));

  const dado = Math.floor(Math.random() * 20) + 1;

  dice.classList.remove("rolling");

  const posX = -((dado - 1) * 64);
  dice.style.backgroundPositionX = `${posX}px`;

  let resultado = avaliar(valorTotal, dado);
  let extra = "";

  // crítico
  if (dado === 20) {
    resultado = "CRÍTICO";
    extra = "🔥 SUCESSO CRÍTICO!";
  } else if (dado === 1) {
    resultado = "DESASTRE";
    extra = "💀 FALHA CRÍTICA!";
  }

  // combate
  let combate = "";
  if (["luta", "pontaria"].includes(periciaId)) {
    combate = (dado + valorTotal >= defesa)
      ? "✅ ACERTOU"
      : "❌ ERROU";
  }

  // DT
  let testeDT = "";
  if (!["luta", "pontaria"].includes(periciaId)) {
    testeDT = (dado + valorTotal >= DT)
      ? "✔ SUCESSO"
      : "✖ FALHA";
  }

  text.textContent =
    `${labelTexto}\n` +
    `🎲 ${dado}\n` +
    `Perícia: ${valorPericia} | Atributo: ${valorAtributo}\n` +
    `Total: ${valorTotal}\n` +
    `${resultado} ${extra}\n` +
    `${combate || testeDT}`;

  text.classList.add(resultado);

  // salvar no banco
  try {
    await supabase.from("roll_history").insert({
      player_id: PLAYER_ID,
      pericia: periciaId,
      dado: dado,
      input_valor: valorTotal,
      resultado: resultado
    });
  } catch (err) {
    console.error("Erro ao salvar:", err);
  }

  setTimeout(() => {
    overlay.classList.remove("show");
  }, 2600);
}

/* =========================
   🖱️ EVENTOS (CORRIGIDO)
========================= */
document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".roll-label").forEach(label => {
    label.addEventListener("click", e => {
      e.preventDefault();

      const periciaId = label.dataset.input;
      const labelTexto = label.textContent.trim();

      if (!periciaId) {
        console.warn("Sem data-input");
        return;
      }

      rolarDado2D(periciaId, labelTexto);
    });
  });

});
