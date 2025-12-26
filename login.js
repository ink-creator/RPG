const contas = {
  player1: { senha: "p1", pagina: "players/p1.html" },
  player2: { senha: "p2", pagina: "players/p2.html" },
  player3: { senha: "p3", pagina: "players/p3.html" },
  player4: { senha: "p4", pagina: "players/p4.html" },
  player5: { senha: "p5", pagina: "players/p5.html" },
  mestre:  { senha: "mestre123", pagina: "mestre/mestre.html" }
};

function login() {
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("senha").value;

  if (contas[user] && contas[user].senha === pass) {
    localStorage.setItem("logado", user);
    window.location.href = contas[user].pagina;
  } else {
    document.getElementById("erro").innerText = "Usuário ou senha incorretos";
  }
}
