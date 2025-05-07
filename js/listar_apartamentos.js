document.addEventListener('DOMContentLoaded', () => {
    const tabela = document.querySelector('#tabela-apartamentos tbody');
    const campoPesquisa = document.getElementById('pesquisa-apartamento');
  
    function carregarApartamentos(filtro = '') {
      fetch('http://localhost:3000/listar_apartamentos')
        .then(res => res.json())
        .then(apartamentos => {
          tabela.innerHTML = '';
          apartamentos
            .filter(ap => 
              ap.numero.toLowerCase().includes(filtro.toLowerCase()) || 
              ap.bloco.toLowerCase().includes(filtro.toLowerCase())
            )
            .forEach(ap => {
              const linha = document.createElement('tr');
              linha.innerHTML = `
                <td>${ap.id}</td>
                <td onclick="consultarApartamento(${ap.id})">${ap.numero}</td>
                <td onclick="consultarApartamento(${ap.id})">${ap.bloco}</td>
                <td>
                  <button onclick="alterarApartamento(${ap.id})">Alterar</button>
                  <button onclick="excluirApartamento(${ap.id})">Excluir</button>
                </td>
              `;
              tabela.appendChild(linha);
            });
        })
        .catch(erro => {
          alert('Erro ao carregar apartamentos');
          console.error(erro);
        });
    }
  
    campoPesquisa.addEventListener('input', () => {
      carregarApartamentos(campoPesquisa.value);
    });
  
    window.alterarApartamento = id => {
      window.location.href = `apartamentos.html?modo=alterar&id=${id}`;
    };
  
    window.consultarApartamento = id => {
      window.location.href = `apartamentos.html?modo=consultar&id=${id}`;
    };
  
    window.excluirApartamento = id => {
      if (confirm('Deseja realmente excluir este apartamento?')) {
        fetch(`http://localhost:3000/excluir_apartamentos/${id}`, {
          method: 'DELETE'
        })
          .then(res => res.json())
          .then(result => {
            if (result.status === 'success') {
              alert('Apartamento excluído com sucesso!');
              carregarApartamentos();
            } else {
              alert('Erro ao excluir apartamento');
            }
          })
          .catch(erro => {
            alert('Erro na conexão ao excluir');
            console.error(erro);
          });
      }
    };
  
    carregarApartamentos();
  });