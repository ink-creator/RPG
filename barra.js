// barra.js
import { supabase } from "./supabase.js";
import { PLAYER_ID } from "./players.js";

function atualizarBarra(atualId, maxId, barraId) {
  const atual = Number(document.getElementById(atualId)?.value) || 0;
  const max = Number(document.getElementById(maxId)?.value) || 1;

  const percent = Math.min((atual / max) * 100, 100);
  const barra = document.getElementById(barraId);

  if (barra) barra.style.width = percent + "%";
}

// ===============================
// CARREGAR STATUS
// ===============================
async function carregarDados() {
  const { data, error } = await supabase
    .from("player_status")
    .select("*")
    .eq("player_id", PLAYER_ID);

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(item => {
    const input = document.getElementById(item.campo);
    if (input) input.value = item.valor;
  });

  // 🔁 atualizar barras depois de carregar
  atualizarBarra("vida-atual", "vida-max", "vida");
  atualizarBarra("sanidade-atual", "sanidade-max", "sanidade");
  atualizarBarra("energia-atual", "energia-max", "energia");
}

// ===============================
// SALVAR + ATUALIZAR
// ===============================
document.querySelectorAll("input").forEach(input => {
  if (!input.id) return;

  input.addEventListener("input", async () => {
    await supabase
      .from("player_status")
      .upsert(
        {
          player_id: PLAYER_ID,
          campo: input.id,
          valor: input.value
        },
        { onConflict: "player_id,campo" }
      );

    // atualizar barras em tempo real
    atualizarBarra("vida-atual", "vida-max", "vida");
    atualizarBarra("sanidade-atual", "sanidade-max", "sanidade");
    atualizarBarra("energia-atual", "energia-max", "energia");
  });
});

carregarDados();
