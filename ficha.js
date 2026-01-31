// ficha.js
import { PLAYER_ID } from "./players.js";
import { supabase } from "./supabase.js";

const inputs = document.querySelectorAll("input");

inputs.forEach(input => {
  if (!input.id) return;

  // ignora campos de barra
  if (
    input.id.includes("vida-") ||
    input.id.includes("sanidade-") ||
    input.id.includes("energia-")
  ) return;

  const campo = input.id;

  // carregar valor
  supabase
    .from("player_fields")
    .select("valor")
    .eq("player_id", PLAYER_ID)
    .eq("campo", campo)
    .single()
    .then(({ data }) => {
      if (data) input.value = data.valor;
    });

  // salvar ao digitar
  input.addEventListener("input", async () => {
    await supabase
      .from("player_fields")
      .upsert({
        player_id: PLAYER_ID,
        campo,
        valor: Number(input.value) || 0
      });
  });
});
