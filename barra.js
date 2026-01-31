// ===============================
// SUPABASE - CONEXÃO
// ===============================
const supabaseUrl = "https://zhfqewgnnfejfyfkmyae.supabase.co"; // <-- Project URL
const supabaseKey = "sb_publishable_DGpfjOL9IQ4t8DEiz06fhQ_YDnJABI6";             // <-- anon public key

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

// ===============================
// PLAYER
// ===============================
// coloque no <body data-player="p1">
const playerId = document.body.dataset.player;

if (!playerId) {
  console.warn("Player ID não definido no body");
}

// ===============================
// FUNÇÃO GENÉRICA DE BARRA
// ===============================
function ligarBarra(atualId, maxId, barraId, tipo) {
  const atualInput = document.getElementById(atualId);
  const maxInput   = document.getElementById(maxId);
  const barra      = document.getElementById(barraId);

  if (!atualInput || !maxInput || !barra) return;

  // -------------------------------
  // ATUALIZA VISUAL DA BARRA
  // -------------------------------
  function atualizarBarra() {
    const atual = Number(atualInput.value);
    const max   = Number(maxInput.value);

    if (isNaN(atual) || isNaN(max) || max <= 0) {
      barra.style.width = "0%";
      return;
    }

    let porcentagem = (atual / max) * 100;
    porcentagem = Math.max(0, Math.min(100, porcentagem));

    barra.style.width = porcentagem + "%";
  }

  // -------------------------------
  // SALVAR NO SUPABASE
  // -------------------------------
  async function salvarSupabase() {
    if (!playerId) return;

    await supabase
      .from("player_status")
      .upsert(
        {
          player_id: playerId,
          tipo: tipo,
          atual: Number(atualInput.value) || 0,
          max: Number(maxInput.value) || 0
        },
        {
          onConflict: "player_id,tipo"
        }
      );
  }

  // -------------------------------
  // EVENTOS DE INPUT
  // -------------------------------
  atualInput.addEventListener("input", () => {
    atualizarBarra();
    salvarSupabase();
  });

  maxInput.addEventListener("input", () => {
    atualizarBarra();
    salvarSupabase();
  });

  // -------------------------------
  // CARREGAR DADOS AO ABRIR
  // -------------------------------
  async function carregarInicial() {
    const { data } = await supabase
      .from("player_status")
      .select("*")
      .eq("player_id", playerId)
      .eq("tipo", tipo)
      .single();

    if (!data) return;

    atualInput.value = data.atual;
    maxInput.value   = data.max;

    atualizarBarra();
  }

  carregarInicial();

  // -------------------------------
  // REALTIME (SUBSTITUI onValue)
  // -------------------------------
  supabase
    .channel(`status-${playerId}-${tipo}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "player_status",
        filter: `player_id=eq.${playerId},tipo=eq.${tipo}`
      },
      payload => {
        const dados = payload.new;
        if (!dados) return;

        atualInput.value = dados.atual;
        maxInput.value   = dados.max;

        atualizarBarra();
      }
    )
    .subscribe();

  // inicializa
  atualizarBarra();

  return atualizarBarra;
}

// ===============================
// INICIALIZAÇÃO
// ===============================
window.addEventListener("DOMContentLoaded", () => {

  window.atualizarVida = ligarBarra(
    "vida-atual",
    "vida-max",
    "vida",
    "vida"
  );

  window.atualizarSanidade = ligarBarra(
    "sanidade-atual",
    "sanidade-max",
    "sanidade",
    "sanidade"
  );

  window.atualizarEnergia = ligarBarra(
    "energia-atual",
    "energia-max",
    "energia",
    "energia"
  );

});
