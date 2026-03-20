// ficha.js
import { PLAYER_ID } from "./players.js";
import { supabase } from "./supabase.js";

/* =========================
   ⚡ DEBOUNCE
========================= */
const timers = {};

function debounceSave(campo, valor) {
  clearTimeout(timers[campo]);

  timers[campo] = setTimeout(async () => {
    await supabase
      .from("player_fields")
      .upsert(
        {
          player_id: PLAYER_ID,
          campo,
          valor
        },
        { onConflict: "player_id,campo" }
      );

    console.log("Salvo:", campo, valor);
  }, 500); // tempo de espera (pode ajustar)
}

/* =========================
   📦 INICIALIZAÇÃO
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const campos = document.querySelectorAll("input, textarea");

  campos.forEach(input => {
    if (!input.id) return;

    const campo = input.id;

    /* 🔹 CARREGAR */
    supabase
      .from("player_fields")
      .select("valor")
      .eq("player_id", PLAYER_ID)
      .eq("campo", campo)
      .single()
      .then(({ data, error }) => {
        if (error) return;
        if (data) input.value = data.valor;
      });

    /* 🔹 SALVAR OTIMIZADO */
    input.addEventListener("input", () => {
      const valor =
        input.type === "number"
          ? Number(input.value) || 0
          : input.value;

      debounceSave(campo, valor);
    });

  });

});
