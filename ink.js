// =========================
// ⚔️ ROLAGEM COMPLETA (COMBATE)
// =========================
async function rolarDado2D(periciaId, labelTexto) {
  const overlay = document.getElementById("dice-overlay");
  const dice = document.getElementById("dice-sprite");
  const text = document.getElementById("dice-text");

  const valorPericia = getValor(periciaId);
  const atributoId = mapaAtributos[periciaId];
  const valorAtributo = getValor(atributoId);

  const valorTotal = valorPericia + valorAtributo;

  // 👉 DEFESA (para combate)
  const defesa = getValor("defesa");

  // 👉 DT padrão (pode mudar depois)
  const DT = 10;

  text.textContent = "";
  text.className = "dice-text";
  dice.style.backgroundPositionX = "0px";

  overlay.classList.add("show");
  dice.classList.add("rolling");

  await new Promise(r => setTimeout(r, 1200));

  const dado = Math.floor(Math.random() * 20) + 1;

  dice.classList.remove("rolling");

  const posX = -((dado - 1) * 64);
  dice.style.backgroundPositionX = `${posX}px`;

  let resultado = avaliar(valorTotal, dado);
  let extra = "";

  // 💀 CRÍTICO E FALHA
  if (dado === 20) {
    resultado = "CRÍTICO";
    extra = "🔥 SUCESSO CRÍTICO!";
  } else if (dado === 1) {
    resultado = "DESASTRE";
    extra = "💀 FALHA CRÍTICA!";
  }

  // ⚔️ VERIFICA SE ACERTOU
  let combate = "";
  if (["luta", "pontaria"].includes(periciaId)) {
    if (dado + valorTotal >= defesa) {
      combate = "✅ ACERTOU";
    } else {
      combate = "❌ ERROU";
    }
  }

  // 🎯 TESTE DE DT (para perícias)
  let testeDT = "";
  if (!["luta", "pontaria"].includes(periciaId)) {
    if (dado + valorTotal >= DT) {
      testeDT = "✔ SUCESSO";
    } else {
      testeDT = "✖ FALHA";
    }
  }

  // 🔥 TEXTO FINAL
  text.textContent =
    `${labelTexto}\n` +
    `🎲 ${dado}\n` +
    `Perícia: ${valorPericia} | Atributo: ${valorAtributo}\n` +
    `Total: ${valorTotal}\n` +
    `${resultado} ${extra}\n` +
    `${combate || testeDT}`;

  text.classList.add(resultado);

  // 💾 salva no supabase
  const { error } = await supabase
    .from("roll_history")
    .insert({
      player_id: PLAYER_ID,
      pericia: periciaId,
      dado: dado,
      input_valor: valorTotal,
      resultado: resultado
    });

  if (error) {
    console.error("Erro ao salvar histórico:", error);
  }

  setTimeout(() => {
    overlay.classList.remove("show");
  }, 2600);
}
