/****************************
 * 1️⃣ CONEXÃO COM SUPABASE
 ****************************/
const SUPABASE_URL = "https://zhfqewgnnfejfyfkmyae.supabase.co";
const SUPABASE_KEY = "sb_publishable_DGpfjOL9IQ4t8DEiz06fhQ_YDnJABI6";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ===============================
// 2. IDENTIDADE DO PLAYER
// ===============================
const playerId = localStorage.getItem("playerId") || "p1";

// ===============================
// 3. PEGAR TODOS OS INPUTS
// ===============================
const inputs = document.querySelectorAll("input");

// ===============================
// 4. CARREGAR DADOS DO BANCO
// ===============================
async function carregarDados() {
  const { data, error } = await supabase
    .from("player_status")
    .select("*")
    .eq("player_id", playerId);

  if (error) {
    console.error("Erro ao carregar:", error);
    return;
  }

  data.forEach(item => {
    const input = document.getElementById(item.campo);
    if (input) {
      input.value = item.valor;
    }
  });
}

// ===============================
// 5. SALVAR DADOS NO BANCO
// ===============================
async function salvarCampo(campo, valor) {
  const { error } = await supabase
    .from("player_status")
    .upsert(
      {
        player_id: playerId,
        campo: campo,
        valor: valor
      },
      {
        onConflict: "player_id,campo"
      }
    );

  if (error) {
    console.error("Erro ao salvar:", error);
  }
}
// ===============================
// 6. ESCUTAR MUDANÇAS
// ===============================
inputs.forEach(input => {
  input.addEventListener("input", () => {
    salvarCampo(input.id, input.value);
  });
});

// ===============================
// 7. INICIAR
// ===============================
carregarDados();
