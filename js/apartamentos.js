document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-apartamento');
  const selectBlocos = document.getElementById('bloco-apartamento');

  // Carrega lista de blocos para o <select>
  function carregarBlocos() {
    fetch('http://localhost:3000/listar_blocos')
      .then(response => response.json())
      .then(data => {
        data.forEach(bloco => {
          const option = document.createElement('option');
          option.value = bloco.id;
          option.textContent = bloco.nome;
          selectBlocos.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Erro ao carregar blocos:', error);
        alert('Não foi possível carregar a lista de blocos.');
      });
  }

  carregarBlocos();

  // Trata o envio do formulário de cadastro de apartamento
  form.addEventListener('submit', event => {
    event.preventDefault();

    const numero = document.getElementById('numero-apartamento').value.trim();
    const blocoId = selectBlocos.value;

    if (!numero || !blocoId) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    fetch('http://localhost:3000/cadastrar_apartamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero, blocoId })
    })
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          alert(`Apartamento cadastrado com sucesso! ID: ${result.apartamentoId}`);
          form.reset();
        } else {
          alert(`Erro ao cadastrar apartamento: ${result.message}`);
        }
      })
      .catch(error => {
        console.error('Erro na conexão:', error);
        alert('Não foi possível conectar ao servidor.');
      });
  });
});
