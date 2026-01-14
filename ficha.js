// ficha.js
import { PLAYER_ID } from "./players.js";
import { db, ref, set, onValue } from "./firebase.js";

// ============================
// INPUTS
// ============================
const inputs = document.querySelectorAll("input");

inputs.forEach(input => {
  if (!input.id) return;

  const caminho = `jogadores/${PLAYER_ID}/${input.id}`;
  const referencia = ref(db, caminho);

  onValue(referencia, snapshot => {
    if (snapshot.exists()) input.value = snapshot.val();
  });

  input.addEventListener("input", () => {
    set(referencia, input.value);
  });
});
