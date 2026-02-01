import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://zhfqewgnnfejfyfkmyae.supabase.co";
const supabaseKey = "sb_publishable_DGpfjOL9IQ4t8DEiz06fhQ_YDnJABI6";

const supabase = createClient(supabaseUrl, supabaseKey);

const lista = document.getElementById("historico");
const btnLimpar = document.getElementById("limpar-historico");

/* 🔄 carregar histórico */
async function carregarHistorico() {
  const { data, error } = await supabase
    .from("roll_history")
    .select("*")
    .order("created_at", { ascending: false });

  lista.innerHTML = "";

  if (error || !data || data.length === 0) {
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

/* 🗑️ limpar histórico */
btnLimpar.addEventListener("click", async () => {
  if (!confirm("Apagar todo o histórico?")) return;

  await supabase.from("roll_history").delete().neq("id", "000");
  carregarHistorico();
});

/* 🚀 iniciar */
carregarHistorico();
