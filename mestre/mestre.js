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
    lista.innerHTML = "<li>Erro ao carregar histórico.</li>";
    return;
  }

  if (!data || data.length === 0) {
    lista.innerHTML = "<li>Nenhuma rolagem ainda.</li>";
    return;
  }

  data.forEach(renderItem);
}

/* =========================
   🧾 RENDER ITEM
========================= */
function renderItem(r) {
  const li = document.createElement("li");
  li.textContent =
    `[${new Date(r.created_at).toLocaleString()}] ` +
    `${r.player_id} — ${r.pericia} | ` +
    `Dado: ${r.dado} + Input: ${r.input_valor} = ${r.resultado}`;
  lista.appendChild(li);
}

/* =========================
   🧹 LIMPAR HISTÓRICO
========================= */
btnLimpar.addEventListener("click", async () => {
  if (!confirm("Apagar TODO o histórico de rolagens?")) return;

  const { error: deleteError } = await supabase
    .from("roll_history")
    .delete()
    .not("id", "is", null);

  if (deleteError) {
    console.error("Erro ao limpar histórico:", deleteError);
    alert("Erro ao limpar histórico.");
    return;
  }

  lista.innerHTML = "<li>Histórico limpo.</li>";
});

/* =========================
   📡 REALTIME (AUTO UPDATE)
========================= */
supabase
  .channel("roll-history-realtime")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "roll_history" },
    payload => {
      renderItem(payload.new);
    }
  )
  .subscribe();

/* =========================
   🚀 INIT
========================= */
carregarHistorico();
