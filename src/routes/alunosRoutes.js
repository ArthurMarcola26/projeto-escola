const express = require('express');
const controller = require('../controllers/alunosController');
const { asyncHandler } = require('../middlewares/erros');

const router = express.Router();

// Alunos
router.get('/', asyncHandler(controller.listar));
router.post('/', asyncHandler(controller.criar));
router.get('/:ra', asyncHandler(controller.buscarPorRa));
router.put('/:ra', asyncHandler(controller.atualizar));
router.delete('/:ra', asyncHandler(controller.excluir));

// Consultas avançadas
router.get('/:ra/resumo', asyncHandler(controller.resumo));

// Disciplinas do aluno
router.get('/:ra/disciplinas', asyncHandler(controller.listarDisciplinas));
router.post('/:ra/disciplinas', asyncHandler(controller.adicionarDisciplina));
router.put('/:ra/disciplinas/:codigo', asyncHandler(controller.atualizarDisciplina));
router.delete('/:ra/disciplinas/:codigo', asyncHandler(controller.removerDisciplina));

module.exports = router;
