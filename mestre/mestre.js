import {
  ref,
  onChildAdded,
  remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {

  if (!window.db) {
    console.error("DB não carregado");
    return;
  }

  const logDiv = document.getElementById("historico-mestre");
  const limparBtn = document.getElementById("limpar-historico");

  if (!logDiv || !limparBtn) return;

  const historicoRef = ref(window.db, "historico");

  // 🔴 ESCUTA TODOS OS JOGADORES
  onChildAdded(historicoRef, playerSnap => {
    const playerId = playerSnap.key;

    const logsRef = ref(
      window.db,
      `historico/${playerId}/logs`
    );

    onChildAdded(logsRef, snap => {
      const data = snap.val();
      if (!data) return;

      const hora = new Date(data.timestamp)
        .toLocaleTimeString();

      const div = document.createElement("div");
      div.className = "log-item";
      div.innerHTML = `
        <div class="log-player">
          ${data.player}
        </div>
        <strong>${data.skill}</strong>
        (${data.valor})
        → <b>${data.dado}</b>
        —
        <span class="${data.resultado}">
          ${data.resultado}
        </span>
        <small> [${hora}]</small>
      `;

      logDiv.prepend(div);
    });
  });

  // 🧹 LIMPAR HISTÓRICO GLOBAL
  limparBtn.addEventListener("click", () => {
    if (!confirm("Tem certeza que deseja apagar TODO o histórico?")) {
      return;
    }

    remove(historicoRef)
      .then(() => {
        logDiv.innerHTML = "";
        alert("Histórico apagado.");
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao apagar histórico.");
      });
  });

});
