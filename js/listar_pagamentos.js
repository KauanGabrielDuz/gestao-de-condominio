document.addEventListener("DOMContentLoaded", async () => {
    const tabela = document.querySelector("#tabela-pagamentos tbody");
    const pagamentos = await fetch("/listar_pagamentos").then(r => r.json());
  
    pagamentos.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.morador_nome}</td>
        <td>R$ ${parseFloat(p.valor).toFixed(2)}</td>
        <td>${p.data_pagamento.slice(0, 10)}</td>
        <td>
          <button onclick="location.href='pagamentos.html?modo=consultar&id=${p.id}'">Consultar</button>
          <button onclick="location.href='pagamentos.html?modo=alterar&id=${p.id}'">Alterar</button>
          <button onclick="excluir(${p.id})">Excluir</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
  });
  
  async function excluir(id) {
    if (confirm("Deseja excluir este pagamento?")) {
      await fetch(`/excluir_pagamento/${id}`, { method: "DELETE" });
      location.reload();
    }
  }
  