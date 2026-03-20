// ink.js

/* =========================
   🎲 TABELA ORDEM
========================= */
const TABELA = {
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

/* =========================
   🧠 ATRIBUTOS
========================= */
const mapa = {
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

/* =========================
   🛠 UTILS
========================= */
function get(id) {
  const el = document.getElementById(id);
  return el ? parseInt(el.value) || 0 : 0;
}

function avaliar(valor, dado) {
  const r = TABELA[valor];
  if (!r) return "FALHA";
  if (r.extremo && dado >= r.extremo) return "EXTREMO";
  if (r.bom && dado >= r.bom) return "BOM";
  if (dado >= r.normal) return "NORMAL";
  return "FALHA";
}

/* =========================
   🎲 ROLAGEM
========================= */
async function rolar(periciaId, nome) {

  const overlay = document.getElementById("dice-overlay");
  const dice = document.getElementById("dice-sprite");
  const text = document.getElementById("dice-text");

  const pericia = get(periciaId);
  const atributo = get(mapa[periciaId]);
  const total = pericia + atributo;

  const defesa = get("defesa");
  const DT = 10;

  overlay.classList.add("show");
  text.textContent = "";

  await new Promise(r => setTimeout(r, 800));

  const dado = Math.floor(Math.random() * 20) + 1;

  let resultado = avaliar(total, dado);
  let extra = "";

  if (dado === 20) {
    resultado = "CRÍTICO";
    extra = "🔥 SUCESSO CRÍTICO";
  }

  if (dado === 1) {
    resultado = "DESASTRE";
    extra = "💀 FALHA CRÍTICA";
  }

  let combate = "";
  if (["luta", "pontaria"].includes(periciaId)) {
    combate = (dado + total >= defesa) ? "✅ ACERTOU" : "❌ ERROU";
  }

  let teste = "";
  if (!["luta", "pontaria"].includes(periciaId)) {
    teste = (dado + total >= DT) ? "✔ SUCESSO" : "✖ FALHA";
  }

  text.textContent =
    `${nome}
🎲 ${dado}
Perícia: ${pericia}
Atributo: ${atributo}
Total: ${total}

${resultado} ${extra}
${combate || teste}`;

  text.className = "dice-text " + resultado;

  setTimeout(() => {
    overlay.classList.remove("show");
  }, 2500);
}

/* =========================
   ❤️ BARRAS
========================= */
function atualizarBarra(atualId, maxId, barraId) {
  const atual = get(atualId);
  const max = get(maxId);

  const barra = document.getElementById(barraId);
  if (!barra) return;

  const porcentagem = max > 0 ? (atual / max) * 100 : 0;
  barra.style.width = porcentagem + "%";
}

function atualizarTudo() {
  atualizarBarra("vida-atual", "vida-max", "vida");
  atualizarBarra("sanidade-atual", "sanidade-max", "sanidade");
  atualizarBarra("energia-atual", "energia-max", "energia");
}

/* =========================
   🖱 EVENTOS
========================= */
document.addEventListener("DOMContentLoaded", () => {

  // clique nas perícias
  document.querySelectorAll(".roll-label").forEach(label => {
    label.addEventListener("click", () => {
      const id = label.dataset.input;
      const nome = label.textContent;
      rolar(id, nome);
    });
  });

  // atualizar barras automaticamente
  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", atualizarTudo);
  });

  atualizarTudo();

});
