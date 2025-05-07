document.addEventListener('DOMContentLoaded', () => {
    fetch('/listar_moradores')
      .then(res => res.json())
      .then(moradores => {
        const tabela = document.getElementById('tabelaMoradores');
        moradores.forEach(m => {
          const linha = document.createElement('tr');
          linha.innerHTML = `
            <td>${m.nome}</td>
            <td>${m.cpf}</td>
            <td>Apto ${m.apartamento_numero} - Bloco ${m.bloco_nome}</td>
            <td>
              <button onclick="editarMorador(${m.id})">Editar</button>
              <button onclick="excluirMorador(${m.id})">Excluir</button>
            </td>
          `;
          tabela.appendChild(linha);
        });
      })
      .catch(err => {
        console.error('Erro ao buscar moradores:', err);
        alert('Erro ao carregar lista de moradores.');
      });
  });
  
  function excluirMorador(id) {
    if (!confirm('Tem certeza que deseja excluir este morador?')) return;
    fetch(`/excluir_moradores/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) location.reload();
        else throw new Error('Erro ao excluir');
      })
      .catch(err => {
        console.error('Erro ao excluir morador:', err);
        alert('Erro ao excluir morador.');
      });
  }
  
  function editarMorador(id) {
    window.location.href = `moradores.html?id=${id}`;
  }
  