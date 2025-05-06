document.addEventListener('DOMContentLoaded', () => {
    const BASE     = 'http://localhost:3000';
    const form     = document.getElementById('form-bloco');
    const inpNome  = document.getElementById('nome-bloco');
    const titulo   = document.getElementById('titulo-bloco');
    const btnVolta = document.getElementById('btn-voltar');
  
    const params = new URLSearchParams(window.location.search);
    const modo = params.get('modo') || 'novo';
    const id     = params.get('id');
  
    function configurarTela() {
      if (modo === 'novo') {
        titulo.textContent = 'Novo Bloco';
        form.querySelector('button').textContent = 'Cadastrar';
      }
      else if ((modo === 'alterar' || modo === 'consultar') && id) {
        fetch(`${BASE}/blocos/${id}`)
          .then(r => r.json())
          .then(d => {
            inpNome.value = d.nome;
            titulo.textContent = modo === 'alterar'
              ? 'Alterar Bloco'
              : 'Consultar Bloco';
            form.querySelector('button').textContent =
              modo === 'alterar' ? 'Salvar' : 'OK';
            if (modo === 'consultar') inpNome.setAttribute('disabled', '');
          });
      }
      else {
        window.location.href = 'listar_blocos.html';
      }
    }
  
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (modo === 'consultar') return;
      const nome = inpNome.value.trim();
      if (!nome) return alert('Nome do bloco é obrigatório.');
  
      const url    = modo === 'alterar'
        ? `${BASE}/atualizar_blocos/${id}`
        : `${BASE}/cadastrar_blocos`;
      const method = modo === 'alterar' ? 'PUT' : 'POST';
  
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome })
      })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        alert(data.message);
        window.location.href = 'listar_blocos.html';
      })
      .catch(err => alert('Erro: ' + err.message));
    });
  
    btnVolta.addEventListener('click', () => {
      window.location.href = 'listar_blocos.html';
    });
  
    configurarTela();
  });
  