// ficha.js
import { PLAYER_ID } from "./players.js";
import { supabase } from "./supabase.js";

const inputs = document.querySelectorAll("input");

inputs.forEach(input => {
  if (!input.id) return;

  const tipo = input.id;

  // 🔹 Carregar valor inicial
  supabase
    .from("player_status")
    .select("valor")
    .eq("player_id", PLAYER_ID)
    .eq("tipo", tipo)
    .single()
    .then(({ data }) => {
      if (data) input.value = data.valor;
    });

  // 🔹 Atualizar ao digitar
  input.addEventListener("input", async () => {
    await supabase
      .from("player_status")
      .upsert({
        player_id: PLAYER_ID,
        tipo,
        valor: input.value
      });
  });
});
