document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("tabela-blocos");
    const urlBase = "http://localhost:3000";
  
    // Leitura e montagem da tabela
    async function carregarBlocos() {
      tbody.innerHTML = "";
      try {
        const resp = await fetch(`${urlBase}/listar_blocos`);
        const blocos = await resp.json();
        blocos.forEach(b => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${b.id}</td>
            <td>${b.nome}</td>
            <td>
              <button class="edit" data-id="${b.id}" data-nome="${b.nome}">Editar</button>
              <button class="delete" data-id="${b.id}">Excluir</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      } catch (e) {
        console.error("Erro ao listar blocos:", e);
        alert("Não foi possível carregar a lista de blocos.");
      }
    }
  
    // Handler de clique em Editar ou Excluir via delegation
    tbody.addEventListener("click", async e => {
      const alvo = e.target;
      const id = alvo.dataset.id;
  
      // EXCLUIR
      if (alvo.classList.contains("delete")) {
        if (!confirm("Deseja realmente excluir este bloco?")) return;
        try {
          const resp = await fetch(`${urlBase}/excluir_blocos/${id}`, { method: "DELETE" });
          if (resp.ok) {
            alert("Bloco excluído com sucesso!");
            carregarBlocos();
          } else {
            const err = await resp.json();
            alert("Erro: " + err.message);
          }
        } catch {
          alert("Erro de conexão ao excluir.");
        }
      }
  
      // EDITAR
      if (alvo.classList.contains("edit")) {
        const novoNome = prompt("Informe o novo nome do bloco:", alvo.dataset.nome);
        if (!novoNome) return;
        try {
          const resp = await fetch(`${urlBase}/editar_blocos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: novoNome.trim() })
          });
          if (resp.ok) {
            alert("Bloco atualizado com sucesso!");
            carregarBlocos();
          } else {
            const err = await resp.json();
            alert("Erro: " + err.message);
          }
        } catch {
          alert("Erro de conexão ao editar.");
        }
      }
    });
  
    // Botão Voltar
    document.getElementById("voltar-inicio")
      .addEventListener("click", () => window.location.href = "../index.html");
  
    // Carrega inicialmente
    carregarBlocos();
  });
  