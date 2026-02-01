// ficha.js
import { PLAYER_ID } from "./players.js";
import { supabase } from "./supabase.js";

/* =========================
   🔹 CAMPOS DA FICHA
========================= */

const inputs = document.querySelectorAll("input");

inputs.forEach(input => {
  if (!input.id) return;

  const campo = input.id;

  /* 🔹 CARREGAR VALOR */
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

  /* 🔹 SALVAR EM TEMPO REAL */
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
        { onConflict: "player_id,campo" }
      );
  });
});

/* =========================
   🎲 ROLAGEM + HISTÓRICO
========================= */

function rolarDado(lados = 20) {
  return Math.floor(Math.random() * lados) + 1;
}

window.rolarTeste = async function (pericia) {
  const input = document.getElementById(pericia);
  if (!input) {
    alert("Input da perícia não encontrado");
    return;
  }

  const inputValor = Number(input.value) || 0;
  const dado = rolarDado(20);
  const resultado = dado + inputValor;

  /* 📝 SALVAR HISTÓRICO */
  await supabase
    .from("roll_history")
    .insert([{
      player_id: PLAYER_ID,
      pericia: pericia,
      dado: dado,
      input_valor: inputValor,
      resultado: resultado
    }]);

  /* 🖥️ FEEDBACK */
  alert(
    `Teste de ${pericia.toUpperCase()}\n` +
    `Dado: ${dado}\n` +
    `Valor: ${inputValor}\n` +
    `Resultado: ${resultado}`
  );
};
