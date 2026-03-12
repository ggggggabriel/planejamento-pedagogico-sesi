const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth.middleware');
const { gerarPlanejamentoDocx } = require('../services/docx.service');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const {
      unidade, serie, bimestre, periodo, periodoFim, capitulo,
      habilidades, desenvolvimento, estrategia, observacoes,
      duracaoAula, nomeArquivo, disciplinaId,
    } = req.body;

    const planejamento = await prisma.planejamento.create({
      data: {
        unidade, serie, bimestre, periodo, periodoFim, capitulo,
        habilidades, desenvolvimento, estrategia, observacoes,
        duracaoAula, nomeArquivo,
        usuarioId: req.user.id,
        disciplinaId: Number(disciplinaId),
      },
      include: { disciplina: true, usuario: { select: { nome: true, email: true } } },
    });

    res.status(201).json(planejamento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const where = req.user.perfil === 'COORDENADOR' || req.user.perfil === 'ADMIN'
      ? {}
      : { usuarioId: req.user.id };

    const planejamentos = await prisma.planejamento.findMany({
      where,
      include: { disciplina: true, usuario: { select: { nome: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(planejamentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/download', async (req, res) => {
  try {
    const planejamento = await prisma.planejamento.findFirst({
      where: {
        id: Number(req.params.id),
        ...(req.user.perfil === 'PROFESSOR' ? { usuarioId: req.user.id } : {}),
      },
      include: { disciplina: true, usuario: { select: { nome: true } } },
    });

    if (!planejamento) {
      return res.status(404).json({ error: 'Planejamento não encontrado' });
    }

    const buffer = await gerarPlanejamentoDocx({
      unidade: planejamento.unidade,
      professor: planejamento.usuario.nome,
      serie: planejamento.serie,
      bimestre: planejamento.bimestre,
      duracaoAula: planejamento.duracaoAula,
      periodo: planejamento.periodo,
      periodoFim: planejamento.periodoFim,
      capitulo: planejamento.capitulo,
      disciplina: planejamento.disciplina.nome,
      habilidades: planejamento.habilidades,
      desenvolvimento: planejamento.desenvolvimento,
      estrategia: planejamento.estrategia,
      observacoes: planejamento.observacoes,
    });

    const filename = `${planejamento.nomeArquivo || 'planejamento'}.docx`;
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
