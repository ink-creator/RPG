import { supabase } from "../supabase.js";

const lista = document.getElementById("historico");
const btnLimpar = document.getElementById("limpar-historico");

/* =========================
   🕒 FORMATAR DATA
========================= */
function formatarData(data) {
  if (!data) return "sem data";
  return new Date(data).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium"
  });
}

/* =========================
   🧾 RENDER ITEM
========================= */
function renderItem(r, topo = false) {
  const li = document.createElement("li");
  li.textContent =
    `[${formatarData(r.created_at)}] ` +
    `${r.player_id} — ${r.pericia} | ` +
    `Dado: ${r.dado} + Input: ${r.input_valor} = ${r.resultado}`;

  topo ? lista.prepend(li) : lista.appendChild(li);
}

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
    console.error(error);
    lista.innerHTML = "<li>Erro ao carregar histórico.</li>";
    return;
  }

  if (!data || data.length === 0) {
    lista.innerHTML = "<li>Nenhuma rolagem ainda.</li>";
    return;
  }

  data.forEach(r => renderItem(r));
}

/* =========================
   🧹 LIMPAR HISTÓRICO
========================= */
btnLimpar.addEventListener("click", async () => {
  if (!confirm("Apagar TODO o histórico?")) return;

  const { error: deleteError } = await supabase
    .from("roll_history")
    .delete()
    .not("id", "is", null);

  if (deleteError) {
    console.error(deleteError);
    alert("Erro ao limpar histórico.");
    return;
  }

  lista.innerHTML = "<li>Histórico limpo.</li>";
});

/* =========================
   📡 REALTIME
========================= */
supabase
  .channel("roll-history-realtime")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "roll_history" },
    payload => {
      renderItem(payload.new, true); // 👈 entra no topo
    }
  )
  .subscribe();

/* =========================
   🚀 INIT
========================= */
carregarHistorico();
