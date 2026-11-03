const express = require('express');
const alunosRoutes = require('./routes/alunosRoutes');
const { errorHandler } = require('./middlewares/erros');

const app = express();

app.use(express.json());
app.use('/alunos', alunosRoutes);

// Rota inexistente
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use(errorHandler);

module.exports = app;
