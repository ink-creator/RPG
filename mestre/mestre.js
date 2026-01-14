import { db, ref, onValue, remove } from "../firebase.js";

const lista = document.getElementById("historico");
const btnLimpar = document.getElementById("limpar-historico");

// 🔄 Escuta TODAS as rolagens de TODOS os jogadores
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

    for (const rollId in rolls) {
      const r = rolls[rollId];

      const li = document.createElement("li");
      li.textContent =
        `[${new Date(r.data).toLocaleString()}] ${playerId} — ${r.nome}: ${r.resultado} (${r.dado})`;

      lista.appendChild(li);
    }
  }
});

// 🗑️ Botão para apagar TODO o histórico
btnLimpar.addEventListener("click", () => {
  if (!confirm("Apagar todo o histórico?")) return;
  remove(ref(db, "historico"));
});
