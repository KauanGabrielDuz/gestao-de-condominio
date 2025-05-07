const express = require('express');
const mysql   = require('mysql2');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve arquivos estáticos: css, js e páginas HTML
app.use(express.static(path.join(__dirname)));

const conexao = mysql.createConnection({
  host:     'localhost',
  user:     'root',
  password: 'root',
  database: 'condominio_gestao'
});

conexao.connect(erro => {
  if (erro) {
    console.error('Falha ao conectar ao MySQL:', erro);
    process.exit(1);
  }
  console.log('Conectado ao MySQL em condominio_gestao');
});

// Rota para cadastrar_blocos
app.post('/cadastrar_blocos', (req, res) => {
  const nome = (req.body.nome || '').trim();
  if (!nome) {
    return res.status(400).json({ status: 'error', message: 'O nome do bloco é obrigatório.' });
  }
  const sql = 'INSERT INTO blocos (nome) VALUES (?)';
  conexao.query(sql, [nome], (erro, resultado) => {
    if (erro) {
      // Tratamento para entradas duplicadas
      if (erro.code === 'ER_DUP_ENTRY') {
        console.warn(`Tentativa de bloco duplicado: ${nome}`);
        return res.status(409).json({ status: 'error', message: 'Este bloco já existe.' });
      }
      console.error('ERRO ao inserir bloco:', erro);
      return res.status(500).json({ status: 'error', message: 'Erro interno ao cadastrar blocos.' });
    }
    res.status(201).json({ status: 'success', message: 'Bloco cadastrado com sucesso!', blocoId: resultado.insertId });
  });
});

// Listar todos os moradores
app.get('/listar_moradores', (req, res) => {
  conexao.query('SELECT * FROM moradores', (err, result) => {
    if (err) res.status(500).send(err);
    else res.json(result);
  });
});

// Obter um morador específico
app.get('/moradores/:id', (req, res) => {
  conexao.query('SELECT * FROM moradores WHERE id = ?', [req.params.id], (err, result) => {
    if (err) res.status(500).send(err);
    else res.json(result[0]);
  });
});

// Cadastrar morador
app.post('/cadastrar_moradores', (req, res) => {
  const { nome, cpf, apartamento_id } = req.body;
  conexao.query('INSERT INTO moradores (nome, cpf, apartamento_id) VALUES (?, ?, ?)', [nome, cpf, apartamento_id], (err, result) => {
    if (err) res.status(500).send(err);
    else res.status(201).json({ id: result.insertId });
  });
});

// Atualizar morador
app.put('/atualizar_moradores/:id', (req, res) => {
  const { nome, cpf, apartamento_id } = req.body;
  conexao.query('UPDATE moradores SET nome = ?, cpf = ?, apartamento_id = ? WHERE id = ?', [nome, cpf, apartamento_id, req.params.id], (err) => {
    if (err) res.status(500).send(err);
    else res.sendStatus(204);
  });
});

// Excluir morador
app.delete('/excluir_moradores/:id', (req, res) => {
  conexao.query('DELETE FROM moradores WHERE id = ?', [req.params.id], (err) => {
    if (err) res.status(500).send(err);
    else res.sendStatus(204);
  });
});


// Rota para listar_blocos
// Rota para listar_blocos
app.get('/listar_blocos', (req, res) => {
  const sql = `
    SELECT
      b.id,
      b.nome,
      COUNT(a.id) AS qtd_apartamentos
    FROM blocos b
    LEFT JOIN apartamentos a
      ON a.bloco_id = b.id
    GROUP BY b.id, b.nome
  `;
  conexao.query(sql, (erro, resultados) => {
    if (erro) {
      console.error('ERRO ao listar blocos:', erro);
      return res.status(500).json({ status: 'error', message: 'Erro ao listar blocos.' });
    }
    res.json(resultados);
  });
});

//teste 1234

// Rota GET para obter dados de um bloco específico
app.get('/blocos/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM blocos WHERE id = ?';
  conexao.query(sql, [id], (erro, resultados) => {
    if (erro) {
      console.error('Erro ao consultar bloco:', erro);
      return res.status(500).json({ status: 'error', message: 'Erro ao consultar bloco.' });
    }
    if (resultados.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Bloco não encontrado.' });
    }
    res.json(resultados[0]);
  });
});

// Rota PUT para atualizar um bloco
app.put('/atualizar_blocos/:id', (req, res) => {
  const id = req.params.id;
  const nome = (req.body.nome || '').trim();
  if (!nome) {
    return res.status(400).json({ status: 'error', message: 'Nome do bloco é obrigatório.' });
  }

  const sql = 'UPDATE blocos SET nome = ? WHERE id = ?';
  conexao.query(sql, [nome, id], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao atualizar bloco:', erro);
      return res.status(500).json({ status: 'error', message: 'Erro ao atualizar bloco.' });
    }
    res.json({ status: 'success', message: 'Bloco atualizado com sucesso!' });
  });
});

// Rota DELETE para excluir um bloco
app.delete('/excluir_blocos/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM blocos WHERE id = ?';
  conexao.query(sql, [id], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao excluir bloco:', erro);
      return res.status(500).json({ status: 'error', message: 'Erro ao excluir bloco.' });
    }
    res.json({ status: 'success', message: 'Bloco excluído com sucesso!' });
  });
});

// Rota para cadastrar_apartamentos
app.post('/cadastrar_apartamentos', (req, res) => {
  const numero  = (req.body.numero  || '').trim();
  const blocoId = req.body.blocoId;
  if (!numero || !blocoId) {
    return res.status(400).json({ status: 'error', message: 'Número do apartamento e bloco são obrigatórios.' });
  }
  const sql = 'INSERT INTO apartamentos (numero, bloco_id) VALUES (?, ?)';
  conexao.query(sql, [numero, blocoId], (erro, resultado) => {
    if (erro) {
      console.error('ERRO ao inserir apartamento:', erro);
      return res.status(500).json({ status: 'error', message: 'Erro interno ao cadastrar apartamentos.' });
    }
    res.status(201).json({ status: 'success', message: 'Apartamento cadastrado com sucesso!', apartamentoId: resultado.insertId });
  });
});

// Rota para listar_apartamentos
app.get('/listar_apartamentos', (req, res) => {
  const sql = 'SELECT * FROM apartamentos';
  conexao.query(sql, (erro, resultados) => {
    if (erro) {
      console.error('ERRO ao listar apartamentos:', erro);
      return res.status(500).json({ status: 'error', message: 'Erro ao listar apartamentos.' });
    }
    res.json(resultados);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
