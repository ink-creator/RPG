import { db, ref, remove } from "../firebase.js";

document.getElementById("limpar-historico").addEventListener("click", () => {
  if (!confirm("Tem certeza que deseja apagar TODO o histórico?")) return;

  remove(ref(db, "historico"));
});

import { db, ref, onValue } from "../firebase.js";

const lista = document.getElementById("historico");

onValue(ref(db, "historico"), snapshot => {
  lista.innerHTML = "";

  if (!snapshot.exists()) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma rolagem ainda.";
    lista.appendChild(li);
    return;
  }

  const data = snapshot.val();

  for (const playerId in data) {
    const rolls = data[playerId];

    for (const key in rolls) {
      const r = rolls[key];
      const li = document.createElement("li");
      li.textContent =
        `[${new Date(r.data).toLocaleString()}] ${playerId} — ${r.nome}: ${r.resultado} (${r.dado})`;
      lista.appendChild(li);
    }
  }
});
