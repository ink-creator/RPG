import { db } from "./firebase.js";
import {
  ref,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const historicoDiv = document.getElementById("historico");
const filtroJogador = document.getElementById("filtroJogador");
const filtroPericia = document.getElementById("filtroPericia");
const btnLimpar = document.getElementById("limparHistorico");

let historicoCompleto = [];

// ============================
// CARREGA HISTÓRICO
// ============================

const historicoRef = ref(db, "historicoDados");

onValue(historicoRef, snapshot => {
  historicoCompleto = [];

  const dados = snapshot.val();
  if (!dados) {
    historicoDiv.innerHTML = "<p>Sem rolagens.</p>";
    return;
  }

  Object.values(dados).forEach(item => {
    historicoCompleto.push(item);
  });

  historicoCompleto.sort((a, b) => b.timestamp - a.timestamp);

  atualizarFiltros();
  renderizarHistorico();
});

// ============================
// ATUALIZA FILTROS
// ============================

function atualizarFiltros() {
  const jogadores = new Set();
  const pericias = new Set();

  historicoCompleto.forEach(h => {
    jogadores.add(h.jogador);
    pericias.add(h.pericia);
  });

  filtroJogador.innerHTML =
    `<option value="">Todos os jogadores</option>` +
    [...jogadores].map(j => `<option value="${j}">${j}</option>`).join("");

  filtroPericia.innerHTML =
    `<option value="">Todas as perícias</option>` +
    [...pericias].map(p => `<option value="${p}">${p}</option>`).join("");
}

// ============================
// RENDERIZA HISTÓRICO
// ============================

function renderizarHistorico() {
  historicoDiv.innerHTML = "";

  const jogadorSel = filtroJogador.value;
  const periciaSel = filtroPericia.value;

  historicoCompleto
    .filter(h =>
      (!jogadorSel || h.jogador === jogadorSel) &&
      (!periciaSel || h.pericia === periciaSel)
    )
    .slice(0, 100)
    .forEach(h => {
      const div = document.createElement("div");
      div.className = `log ${h.resultado}`;

      const data = new Date(h.timestamp).toLocaleString("pt-BR");

      div.innerHTML = `
        <strong>${h.jogador}</strong>
        — ${h.pericia} (${h.valorSkill})
        → <strong>${h.resultado}</strong>
        <span class="dado">[d20: ${h.dado}]</span>
        <span class="data">${data}</span>
      `;

      historicoDiv.appendChild(div);
    });
}

// ============================
// EVENTOS DOS FILTROS
// ============================

filtroJogador.addEventListener("change", renderizarHistorico);
filtroPericia.addEventListener("change", renderizarHistorico);

// ============================
// LIMPAR HISTÓRICO (SÓ MESTRE)
// ============================

btnLimpar.addEventListener("click", () => {
  const ok = confirm("Tem certeza que deseja apagar TODO o histórico?");
  if (!ok) return;

  remove(historicoRef);
});
