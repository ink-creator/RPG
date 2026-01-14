import { db } from "../firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const historicoContainer = document.getElementById("historico");

// ============================
// FUNÇÃO PARA RENDERIZAR O HISTÓRICO
// ============================
function renderHistorico(data) {
  if (!historicoContainer) return;

  historicoContainer.innerHTML = ""; // limpa antes de renderizar

  // data = objeto com keys sendo os ids dos logs
  for (const key in data) {
    const log = data[key];
    const div = document.createElement("div");
    div.className = "log-entry";
    div.textContent = `${log.skill} → Valor: ${log.valor}, Dado: ${log.dado}, Resultado: ${log.resultado} (${new Date(log.timestamp).toLocaleTimeString()})`;
    historicoContainer.appendChild(div);
  }
}

// ============================
// PEGANDO TODOS OS HISTÓRICOS
// ============================
const historicoRef = ref(db, "historico"); // pega todos os jogadores

onValue(historicoRef, snapshot => {
  if (!snapshot.exists()) return;

  const allData = snapshot.val();
  historicoContainer.innerHTML = "";

  for (const playerId in allData) {
    const playerLogs = allData[playerId].logs;
    const titulo = document.createElement("h3");
    titulo.textContent = `Jogador: ${playerId}`;
    historicoContainer.appendChild(titulo);

    renderHistorico(playerLogs);
  }
});
