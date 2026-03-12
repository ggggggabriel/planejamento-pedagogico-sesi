const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const disciplinasData = [
  {
    nome: 'Matemática',
    habilidades: [
      'Resolver problemas envolvendo adição e subtração',
      'Resolver problemas envolvendo multiplicação e divisão',
      'Identificar e representar frações',
      'Trabalhar com geometria plana e espacial',
      'Utilizar medidas de comprimento, massa e capacidade',
    ],
  },
  {
    nome: 'Língua Portuguesa',
    habilidades: [
      'Ler e interpretar textos de diferentes gêneros',
      'Produzir textos com coesão e coerência',
      'Identificar classes gramaticais',
      'Utilizar corretamente pontuação e acentuação',
      'Desenvolver fluência leitora',
    ],
  },
  {
    nome: 'Ciências',
    habilidades: [
      'Identificar características dos seres vivos',
      'Compreender o ciclo da água',
      'Relacionar alimentação saudável e saúde',
      'Entender fenômenos físicos do cotidiano',
      'Reconhecer impactos ambientais',
    ],
  },
  {
    nome: 'História',
    habilidades: [
      'Identificar mudanças e permanências no tempo',
      'Compreender a formação do Brasil',
      'Reconhecer fontes históricas',
      'Relacionar passado e presente',
    ],
  },
  {
    nome: 'Geografia',
    habilidades: [
      'Identificar elementos do espaço geográfico',
      'Utilizar mapas e representações cartográficas',
      'Compreender relações entre sociedade e natureza',
      'Reconhecer regiões e biomas brasileiros',
    ],
  },
];

async function main() {
  console.log('Iniciando seed...');

  for (const d of disciplinasData) {
    const disciplina = await prisma.disciplina.upsert({
      where: { nome: d.nome },
      update: {},
      create: {
        nome: d.nome,
        habilidades: {
          create: d.habilidades.map((h) => ({ descricao: h })),
        },
      },
    });
    console.log(`Disciplina criada/atualizada: ${disciplina.nome}`);
  }

  const senhaHash = await bcrypt.hash('admin123', 10);
  await prisma.usuario.upsert({
    where: { email: 'admin@sesi.com.br' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@sesi.com.br',
      senha: senhaHash,
      perfil: 'ADMIN',
    },
  });
  console.log('Usuário admin criado: admin@sesi.com.br / admin123');

  const professorHash = await bcrypt.hash('prof123', 10);
  await prisma.usuario.upsert({
    where: { email: 'professor@sesi.com.br' },
    update: {},
    create: {
      nome: 'Professor Demo',
      email: 'professor@sesi.com.br',
      senha: professorHash,
      perfil: 'PROFESSOR',
    },
  });
  console.log('Usuário professor criado: professor@sesi.com.br / prof123');

  console.log('Seed concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
