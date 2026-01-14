import {
  ref,
  onChildAdded,
  remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {

  const area = document.getElementById("historico-mestre");
  const btn = document.getElementById("limpar-historico");

  const historicoRef = ref(window.db, "historico");

  onChildAdded(historicoRef, playerSnap => {
    const player = playerSnap.key;

    onChildAdded(
      ref(window.db, `historico/${player}/logs`),
      snap => {
        const d = snap.val();
        const hora = new Date(d.timestamp)
          .toLocaleTimeString();

        const div = document.createElement("div");
        div.className = "log-item";
        div.innerHTML = `
          <small>${player}</small><br>
          <b>${d.skill}</b> (${d.valor})
          → <b>${d.dado}</b>
          <span class="${d.resultado}">
            ${d.resultado}
          </span>
          <small>[${hora}]</small>
        `;
        area.prepend(div);
      }
    );
  });

  btn.onclick = () => {
    if (!confirm("Apagar TODO o histórico?")) return;
    remove(historicoRef);
    area.innerHTML = "";
  };
});
