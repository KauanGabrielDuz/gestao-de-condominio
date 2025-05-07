document.addEventListener('DOMContentLoaded', () => {
    fetch('/listar_apartamentos')
      .then(res => res.json())
      .then(apartamentos => {
        const select = document.getElementById('apartamento_id');
        apartamentos.forEach(apt => {
          const option = document.createElement('option');
          option.value = apt.id;
          option.textContent = `Apt ${apt.numero} - Bloco ${apt.bloco_id}`;
          select.appendChild(option);
        });
      });
  
    document.getElementById('formMorador').addEventListener('submit', e => {
      e.preventDefault();
      const nome = document.getElementById('nome').value.trim();
      const cpf = document.getElementById('cpf').value.trim();
      const apartamento_id = document.getElementById('apartamento_id').value;
  
      fetch('/cadastrar_moradores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, apartamento_id })
      })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao cadastrar');
        alert('Morador cadastrado com sucesso!');
        document.getElementById('formMorador').reset();
      })
      .catch(err => alert('Erro: ' + err.message));
    });
  });
  