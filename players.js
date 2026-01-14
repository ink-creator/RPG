// player.js
export function getPlayerId() {
  const body = document.body;
  const id = body?.dataset?.player;

  if (!id) {
    console.warn("data-player não definido no <body>, usando debug-player");
    return "debug-player";
  }

  return id;
}
