document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-bloco");
    if (!form) return;
  
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const nome = document.getElementById("nome-bloco").value.trim();
      if (!nome) {
        alert("Preencha o nome do bloco.");
        return;
      }
  
      try {
        const resp = await fetch("http://localhost:3000/cadastrar-bloco", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome })
        });
        const data = await resp.json();
        if (!resp.ok) alert("Erro: " + data.message);
        else {
          alert(data.message);
          form.reset();
        }
      } catch (err) {
        console.error(err);
        alert("Erro de conexão.");
      }
    });
  });
  