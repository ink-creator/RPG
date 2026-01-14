const contas = {
  Ravir:   { senha: "furryto", pagina: "players/p1.html" },
  Ruan:    { senha: "pato", pagina: "players/p2.html" },
  Luma:    { senha: "monitora", pagina: "players/p3.html" },
  Cayo:    { senha: "cabeludo", pagina: "players/p4.html" },
  Juliana: { senha: "ruiva", pagina: "players/p5.html" },
  mestre:  { senha: "papocarei", pagina: "mestre/mestre.html" }
};

function login() {
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("senha").value;

  if (contas[user] && contas[user].senha === pass) {
    localStorage.setItem("logado", user);

    // 👇 PLAYER_ID GLOBAL
    if (user !== "mestre") {
      localStorage.setItem("playerId", user);
    }

    window.location.href = contas[user].pagina;
  } else {
    document.getElementById("erro").innerText = "Usuário ou senha incorretos";
  }
}
