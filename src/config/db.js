const mongoose = require('mongoose');

// Conecta ao MongoDB usando a string definida no arquivo .env
async function conectarBanco() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Defina MONGODB_URI no arquivo .env');
  }
  await mongoose.connect(uri);
  console.log('Conectado ao MongoDB');
}

module.exports = conectarBanco;
