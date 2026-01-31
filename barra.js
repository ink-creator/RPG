// barra.js
import { supabase } from "./supabase.js";

const playerId = document.body.dataset.player;

function ligarBarra(atualId, maxId, barraId, tipo) {
  const atualInput = document.getElementById(atualId);
  const maxInput   = document.getElementById(maxId);
  const barra      = document.getElementById(barraId);

  if (!atualInput || !maxInput || !barra) return;

  function atualizarBarra() {
    const atual = Number(atualInput.value);
    const max   = Number(maxInput.value);

    if (!max || max <= 0) {
      barra.style.width = "0%";
      return;
    }

    const pct = Math.max(0, Math.min(100, (atual / max) * 100));
    barra.style.width = pct + "%";
  }

  async function salvar() {
    await supabase
      .from("player_status")
      .upsert(
        {
          player_id: playerId,
          tipo,
          atual: Number(atualInput.value) || 0,
          max: Number(maxInput.value) || 0
        },
        { onConflict: "player_id,tipo" }
      );
  }

  atualInput.addEventListener("input", () => {
    atualizarBarra();
    salvar();
  });

  maxInput.addEventListener("input", () => {
    atualizarBarra();
    salvar();
  });

  async function carregar() {
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

  carregar();

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
        if (!payload.new) return;
        atualInput.value = payload.new.atual;
        maxInput.value   = payload.new.max;
        atualizarBarra();
      }
    )
    .subscribe();
}

window.addEventListener("DOMContentLoaded", () => {
  ligarBarra("vida-atual", "vida-max", "vida", "vida");
  ligarBarra("sanidade-atual", "sanidade-max", "sanidade", "sanidade");
  ligarBarra("energia-atual", "energia-max", "energia", "energia");
});
