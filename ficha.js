// ficha.js
import { PLAYER_ID } from "./players.js";
import { supabase } from "./supabase.js";

const inputs = document.querySelectorAll("input");

inputs.forEach(input => {
  if (!input.id) return;

  const campo = input.id;

  // 🔹 CARREGAR
  supabase
    .from("player_fields")
    .select("valor")
    .eq("player_id", PLAYER_ID)
    .eq("campo", campo)
    .single()
    .then(({ data }) => {
      if (data) input.value = data.valor;
    });

  // 🔹 SALVAR EM TEMPO REAL (texto ou número)
  input.addEventListener("input", async () => {
    const valor =
      input.type === "number"
        ? Number(input.value) || 0
        : input.value;

    await supabase
      .from("player_fields")
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
  });
});
