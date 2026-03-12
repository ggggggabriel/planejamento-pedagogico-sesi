const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const disciplinaRoutes = require('./routes/disciplina.routes');
const planejamentoRoutes = require('./routes/planejamento.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/disciplinas', disciplinaRoutes);
app.use('/planejamentos', planejamentoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;
