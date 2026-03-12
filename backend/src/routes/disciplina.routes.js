const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const disciplinas = await prisma.disciplina.findMany({ orderBy: { nome: 'asc' } });
    res.json(disciplinas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/habilidades', authMiddleware, async (req, res) => {
  try {
    const habilidades = await prisma.habilidade.findMany({
      where: { disciplinaId: Number(req.params.id) },
      orderBy: { id: 'asc' },
    });
    res.json(habilidades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
