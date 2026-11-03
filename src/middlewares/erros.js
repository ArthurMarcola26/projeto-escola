// Permite usar async/await nos controllers sem try/catch em cada função
exports.asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Tratamento central de erros: sempre responde JSON com status HTTP adequado
exports.errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ erro: 'RA duplicado' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ erro: err.message });
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
};
