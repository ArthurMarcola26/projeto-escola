const Aluno = require('../models/Aluno');

// ---------- Funções auxiliares ----------

// Verifica se um valor é um texto não vazio
function textoValido(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

// Verifica se a disciplina tem código, nome e professor
function disciplinaValida(d) {
  return d && textoValido(d.codigo) && textoValido(d.nome) && textoValido(d.professor);
}

// Escapa caracteres especiais para usar o texto da busca dentro de uma regex
function escapar(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------- Consultas de alunos ----------

// GET /alunos  (aceita ?nome=  e  ?disciplina=)
exports.listar = async (req, res) => {
  const filtro = {};
  if (req.query.nome) {
    // busca parcial, sem diferenciar maiúsculas e minúsculas
    filtro.nome = { $regex: escapar(String(req.query.nome)), $options: 'i' };
  }
  if (req.query.disciplina) {
    filtro['disciplinas.codigo'] = String(req.query.disciplina);
  }
  const alunos = await Aluno.find(filtro);
  res.status(200).json(alunos);
};

// GET /alunos/:ra
exports.buscarPorRa = async (req, res) => {
  const aluno = await Aluno.findOne({ ra: req.params.ra });
  if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });
  res.status(200).json(aluno);
};

// GET /alunos/:ra/disciplinas
exports.listarDisciplinas = async (req, res) => {
  const aluno = await Aluno.findOne({ ra: req.params.ra });
  if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });
  res.status(200).json(aluno.disciplinas);
};

// GET /alunos/:ra/resumo
exports.resumo = async (req, res) => {
  const aluno = await Aluno.findOne({ ra: req.params.ra });
  if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });

  // Set remove professores repetidos
  const professores = [...new Set(aluno.disciplinas.map((d) => d.professor))];
  res.status(200).json({
    ra: aluno.ra,
    nome: aluno.nome,
    totalDisciplinas: aluno.disciplinas.length,
    professores
  });
};

// ---------- Cadastro, atualização e exclusão de alunos ----------

// POST /alunos
exports.criar = async (req, res) => {
  const { ra, nome, disciplinas } = req.body;

  if (!textoValido(String(ra ?? '')) || !textoValido(nome)) {
    return res.status(400).json({ erro: 'Os campos ra e nome são obrigatórios' });
  }

  if (disciplinas !== undefined) {
    if (!Array.isArray(disciplinas) || !disciplinas.every(disciplinaValida)) {
      return res
        .status(400)
        .json({ erro: 'Toda disciplina deve ter codigo, nome e professor' });
    }
    const codigos = disciplinas.map((d) => d.codigo);
    if (new Set(codigos).size !== codigos.length) {
      return res.status(409).json({ erro: 'Disciplina duplicada para o mesmo aluno' });
    }
  }

  const existente = await Aluno.findOne({ ra: String(ra) });
  if (existente) return res.status(409).json({ erro: 'RA duplicado' });

  const novo = await Aluno.create({ ra: String(ra), nome, disciplinas: disciplinas || [] });
  res.status(201).json(novo);
};

// PUT /alunos/:ra  (atualiza somente o nome)
exports.atualizar = async (req, res) => {
  const { nome } = req.body;
  if (!textoValido(nome)) {
    return res.status(400).json({ erro: 'O campo nome é obrigatório' });
  }
  const aluno = await Aluno.findOneAndUpdate(
    { ra: req.params.ra },
    { nome: nome.trim() },
    { new: true }
  );
  if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });
  res.status(200).json(aluno);
};

// DELETE /alunos/:ra
exports.excluir = async (req, res) => {
  const aluno = await Aluno.findOneAndDelete({ ra: req.params.ra });
  if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });
  res.status(200).json({ mensagem: 'Aluno excluído com sucesso', aluno });
};

// ---------- Gerenciamento de disciplinas ----------

// POST /alunos/:ra/disciplinas
exports.adicionarDisciplina = async (req, res) => {
  const aluno = await Aluno.findOne({ ra: req.params.ra });
  if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });

  if (!disciplinaValida(req.body)) {
    return res
      .status(400)
      .json({ erro: 'Os campos codigo, nome e professor são obrigatórios' });
  }

  const { codigo, nome, professor } = req.body;
  if (aluno.disciplinas.some((d) => d.codigo === codigo)) {
    return res.status(409).json({ erro: 'Disciplina duplicada para este aluno' });
  }

  aluno.disciplinas.push({ codigo, nome, professor });
  await aluno.save();
  res.status(201).json(aluno);
};

// PUT /alunos/:ra/disciplinas/:codigo  (atualiza nome e professor)
exports.atualizarDisciplina = async (req, res) => {
  const aluno = await Aluno.findOne({ ra: req.params.ra });
  if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });

  const disciplina = aluno.disciplinas.find((d) => d.codigo === req.params.codigo);
  if (!disciplina) return res.status(404).json({ erro: 'Disciplina não encontrada' });

  const { nome, professor } = req.body;
  if (!textoValido(nome) || !textoValido(professor)) {
    return res.status(400).json({ erro: 'Os campos nome e professor são obrigatórios' });
  }

  disciplina.nome = nome.trim();
  disciplina.professor = professor.trim();
  await aluno.save();
  res.status(200).json(aluno);
};

// DELETE /alunos/:ra/disciplinas/:codigo
exports.removerDisciplina = async (req, res) => {
  const aluno = await Aluno.findOne({ ra: req.params.ra });
  if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });

  const indice = aluno.disciplinas.findIndex((d) => d.codigo === req.params.codigo);
  if (indice === -1) return res.status(404).json({ erro: 'Disciplina não encontrada' });

  aluno.disciplinas.splice(indice, 1);
  await aluno.save();
  res.status(200).json({ mensagem: 'Disciplina removida com sucesso', aluno });
};
