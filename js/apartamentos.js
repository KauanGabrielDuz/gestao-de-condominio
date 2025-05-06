document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-apartamento');
  const selectBlocos = document.getElementById('bloco-apartamento');
  const btnCadastrar = document.getElementById('btn-cadastrar');
  const titulo = document.getElementById('titulo-apartamento');

  const urlParams = new URLSearchParams(window.location.search);
  const modo = urlParams.get('modo') || 'novo';
  const id = urlParams.get('id');

  function carregarBlocosSelecionado(selecionadoId = '') {
    fetch('http://localhost:3000/listar_blocos')
      .then(res => res.json())
      .then(data => {
        selectBlocos.innerHTML = '<option value="">Selecione um bloco</option>';
        data.forEach(bloco => {
          const option = document.createElement('option');
          option.value = bloco.id;
          option.textContent = bloco.nome;
          if (bloco.id == selecionadoId) option.selected = true;
          selectBlocos.appendChild(option);
        });
      })
      .catch(err => {
        alert('Erro ao carregar blocos');
        console.error(err);
      });
  }

  if (modo === 'alterar' || modo === 'consultar') {
    fetch(`http://localhost:3000/consultar_apartamentos/${id}`)
      .then(res => res.json())
      .then(ap => {
        document.getElementById('numero-apartamento').value = ap.numero;
        carregarBlocosSelecionado(ap.blocoId);
        if (modo === 'consultar') {
          form.querySelectorAll('input, select, button[type="submit"]').forEach(el => el.disabled = true);
          titulo.textContent = 'Consulta de Apartamento';
        } else {
          titulo.textContent = 'Alterar Apartamento';
        }
      })
      .catch(err => {
        alert('Erro ao carregar apartamento');
        console.error(err);
      });
  } else {
    carregarBlocosSelecionado();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const numero = document.getElementById('numero-apartamento').value.trim();
    const blocoId = selectBlocos.value;

    if (!numero || !blocoId) {
      alert('Preencha todos os campos!');
      return;
    }

    const body = JSON.stringify({ numero, blocoId });

    let url = 'http://localhost:3000/cadastrar_apartamentos';
    let method = 'POST';

    if (modo === 'alterar') {
      url = `http://localhost:3000/atualizar_apartamentos/${id}`;
      method = 'PUT';
    }

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          alert(modo === 'alterar' ? 'Apartamento atualizado com sucesso!' : 'Apartamento cadastrado!');
          window.location.href = 'listar_apartamentos.html';
        } else {
          alert(`Erro: ${result.message}`);
        }
      })
      .catch(err => {
        alert('Erro na requisição');
        console.error(err);
      });
  });
});
