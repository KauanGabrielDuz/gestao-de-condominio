document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-bloco");
    if (!form) return;
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const input = document.getElementById("nome-bloco");
      const nome  = input.value.trim();
      if (!nome) {
        alert("Preencha o nome do bloco.");
        return;
      }
  
      try {
        const resp = await fetch("http://localhost:3000/cadastrar_blocos", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ nome })
        });
        const data = await resp.json();
  
        if (!resp.ok) {
          alert("Erro: " + data.message);
        } else {
          alert(data.message);
          form.reset();
        }
      } catch (err) {
        console.error("Erro ao chamar o servidor:", err);
        alert("Erro de conexão.");
      }
    });
  
    // Botão voltar
    const btnVoltar = document.getElementById("voltar-inicio");
    if (btnVoltar) {
      btnVoltar.addEventListener("click", () => {
        window.location.href = "../index.html";
      });
    }
  });
  
  const BASE = 'http://localhost:3000';

function carregarBlocos() {
  fetch(`${BASE}/listar_blocos`)
    .then(res => res.json())
    // …
}

form.addEventListener('submit', e => {
  e.preventDefault();
  // …
  fetch(`${BASE}/cadastrar_blocos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome })
  })
  // …
});
