document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo");
    const id = params.get("id");
  
    const titulo = document.getElementById("titulo-pagamento");
    const form = document.getElementById("form-pagamento");
    const moradorSelect = document.getElementById("morador");
    const valorInput = document.getElementById("valor");
    const dataInput = document.getElementById("data_pagamento");
  
    const btnVoltar = document.getElementById("btn-voltar");
    btnVoltar.onclick = () => window.location.href = "listar_pagamentos.html";
  
    // Carrega moradores para o select
    const moradores = await fetch("/listar_moradores").then(r => r.json());
    moradores.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = m.nome;
      moradorSelect.appendChild(opt);
    });
  
    if (modo === "novo") {
      titulo.textContent = "Novo Pagamento";
    } else if (modo === "alterar" || modo === "consultar") {
      titulo.textContent = modo === "alterar" ? "Alterar Pagamento" : "Consultar Pagamento";
      const dados = await fetch(`/pagamentos/${id}`).then(r => r.json());
      moradorSelect.value = dados.morador_id;
      valorInput.value = dados.valor;
      dataInput.value = dados.data_pagamento.slice(0, 10);
      if (modo === "consultar") {
        moradorSelect.disabled = true;
        valorInput.disabled = true;
        dataInput.disabled = true;
        form.querySelector("button[type='submit']").style.display = "none";
      }
    }
  
    form.onsubmit = async e => {
      e.preventDefault();
      const payload = {
        morador_id: moradorSelect.value,
        valor: valorInput.value,
        data_pagamento: dataInput.value
      };
      const metodo = modo === "alterar" ? "PUT" : "POST";
      const url = modo === "alterar" ? `/atualizar_pagamento/${id}` : "/cadastrar_pagamento";
      await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      window.location.href = "listar_pagamentos.html";
    };
  });
  