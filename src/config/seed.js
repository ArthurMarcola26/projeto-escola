// Popula o banco com 3 alunos iniciais. Uso: npm run seed
// ATENÇÃO: apaga os alunos existentes e recria os dados de exemplo.
require('dotenv').config();
const mongoose = require('mongoose');
const conectarBanco = require('./db');
const Aluno = require('../models/Aluno');

const alunos = [
  {
    ra: '1',
    nome: 'João',
    disciplinas: [
      { codigo: 'MAT101', nome: 'Matemática', professor: 'Prof. Carlos' },
      { codigo: 'HIS101', nome: 'História', professor: 'Prof. Ana' }
    ]
  },
  {
    ra: '2',
    nome: 'Maria',
    disciplinas: [
      { codigo: 'MAT101', nome: 'Matemática', professor: 'Prof. Carlos' },
      { codigo: 'FIS101', nome: 'Física', professor: 'Prof. Paulo' }
    ]
  },
  {
    ra: '3',
    nome: 'José',
    disciplinas: [
      { codigo: 'HIS101', nome: 'História', professor: 'Prof. Ana' },
      { codigo: 'GEO101', nome: 'Geografia', professor: 'Prof. Marta' }
    ]
  }
];

(async () => {
  try {
    await conectarBanco();
    await Aluno.deleteMany({});
    await Aluno.insertMany(alunos);
    console.log('Banco populado com', alunos.length, 'alunos');
  } catch (erro) {
    console.error('Erro no seed:', erro.message);
  } finally {
    await mongoose.disconnect();
  }
})();
