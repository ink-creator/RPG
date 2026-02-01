// barra.js
import { supabase } from "./supabase.js";
import { PLAYER_ID } from "./players.js";

const inputs = document.querySelectorAll("input");

async function carregarDados() {
  const { data, error } = await supabase
    .from("player_status")
    .select("*")
    .eq("player_id", PLAYER_ID);

  if (error) {
    console.error("Erro ao carregar:", error);
    return;
  }

  data.forEach(item => {
    const input = document.getElementById(item.campo);
    if (input) input.value = item.valor;
  });
}

async function salvarCampo(campo, valor) {
  await supabase
    .from("player_status")
    .upsert(
      {
        player_id: PLAYER_ID,
        campo,
        valor
      },
      {
        onConflict: "player_id,campo"
      }
    );
}

inputs.forEach(input => {
  if (!input.id) return;
  input.addEventListener("input", () => {
    salvarCampo(input.id, input.value);
  });
});

carregarDados();

