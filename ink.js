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
  return el ? parseInt(el.value) || 0 : 0;
}

/* =========================
   🎲 ROLAGEM + HISTÓRICO
========================= */
async function rolarDado2D(periciaId, labelTexto) {
  const overlay = document.getElementById("dice-overlay");
  const dice = document.getElementById("dice-sprite");
  const text = document.getElementById("dice-text");

  // valores
  const valorPericia = getValor(periciaId);
  const atributoId = mapaAtributos[periciaId];
  const valorAtributo = getValor(atributoId);

  const valorTotal = valorPericia + valorAtributo;

  // reset visual
  text.textContent = "";
  text.className = "dice-text";
  dice.style.backgroundPositionX = "0px";

  overlay.classList.add("show");
  dice.classList.add("rolling");

  await new Promise(r => setTimeout(r, 1200));

  const dado = Math.floor(Math.random() * 20) + 1;
  const resultado = avaliar(valorTotal, dado);

  dice.classList.remove("rolling");

  const posX = -((dado - 1) * 64);
  dice.style.backgroundPositionX = `${posX}px`;

  // TEXTO MELHORADO 🔥
  text.textContent =
    `${labelTexto}\n` +
    `🎲 ${dado} | Perícia: ${valorPericia} | Atributo: ${valorAtributo}\n` +
    `Total: ${valorTotal} → ${resultado}`;

  text.classList.add(resultado);

  // salva no supabase (mantido)
  const { error } = await supabase
    .from("roll_history")
    .insert({
      player_id: PLAYER_ID,
      pericia: periciaId,
      dado: dado,
      input_valor: valorTotal,
      resultado: resultado
    });

  if (error) {
    console.error("Erro ao salvar histórico:", error);
  }

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

    const periciaId = label.dataset.input;
    const labelTexto = label.textContent.trim();

    if (!periciaId) return;

    rolarDado2D(periciaId, labelTexto);
  });
});
