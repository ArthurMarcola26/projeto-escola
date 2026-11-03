const mongoose = require('mongoose');

const disciplinaSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, trim: true },
    nome: { type: String, required: true, trim: true },
    professor: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const alunoSchema = new mongoose.Schema(
  {
    ra: { type: String, required: true, unique: true, trim: true }, // RA único
    nome: { type: String, required: true, trim: true },
    disciplinas: { type: [disciplinaSchema], default: [] }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Aluno', alunoSchema);
