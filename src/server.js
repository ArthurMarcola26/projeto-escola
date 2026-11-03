require('dotenv').config();
const app = require('./app');
const conectarBanco = require('./config/db');

const PORT = process.env.PORT || 3000;

conectarBanco()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((erro) => {
    console.error('Falha ao conectar no MongoDB:', erro.message);
    process.exit(1);
  });
