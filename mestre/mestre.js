import { supabase } from "../supabase.js";

const lista = document.getElementById("historico");
const btnLimpar = document.getElementById("limpar-historico");

/* =========================
   🔄 CARREGAR HISTÓRICO
========================= */
async function carregarHistorico() {
  const { data, error } = await supabase
    .from("roll_history")
    .select("*")
    .order("created_at", { ascending: false });

  lista.innerHTML = "";

  if (error) {
    console.error("Erro ao carregar histórico:", error);
    const li = document.createElement("li");
    li.textContent = "Erro ao carregar histórico.";
    lista.appendChild(li);
    return;
  }

  if (!data || data.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma rolagem ainda.";
    lista.appendChild(li);
    return;
  }

  data.forEach(r => {
    const li = document.createElement("li");
    li.textContent =
      `[${new Date(r.created_at).toLocaleString()}] ` +
      `${r.player_id} — ${r.pericia} | ` +
      `Dado: ${r.dado} + Input: ${r.input_valor} = ${r.resultado}`;
    lista.appendChild(li);
  });
}

/* =========================
   🧹 LIMPAR HISTÓRICO
========================= */
btnLimpar.addEventListener("click", async () => {
  if (!confirm("Apagar TODO o histórico de rolagens?")) return;

  const { error } = await supabase
    .from("roll_history")
    const { data, error } = await supabase
   .from("roll_history")
   .delete()
   .not("id", "is", null)
   .select(); // ← IMPORTANTE


  if (error) {
    console.error("Erro ao limpar histórico:", error);
    alert("Erro ao limpar histórico. Veja o console.");
    return;
  }

  carregarHistorico();
});

/* =========================
   🚀 INIT
========================= */
carregarHistorico();
