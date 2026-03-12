const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, BorderStyle, AlignmentType, HeadingLevel } = require('docx');

async function gerarPlanejamentoDocx(dados) {
  const makeRow = (label, value) =>
    new TableRow({
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20 })] })],
        }),
        new TableCell({
          width: { size: 70, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: String(value || ''), size: 20 })] })],
        }),
      ],
    });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'PLANEJAMENTO PEDAGÓGICO',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              makeRow('Unidade', dados.unidade),
              makeRow('Professor', dados.professor),
              makeRow('Série', dados.serie),
              makeRow('Bimestre', dados.bimestre),
              makeRow('Duração da Aula', dados.duracaoAula),
              makeRow('Período', dados.periodo),
              makeRow('Até', dados.periodoFim),
              makeRow('Capítulo', dados.capitulo),
              makeRow('Área ou Disciplina', dados.disciplina),
              makeRow('Habilidades', dados.habilidades),
              makeRow('Desenvolvimento da Aula', dados.desenvolvimento),
              makeRow('Estratégias e Evidências de Aprendizagem', dados.estrategia),
              makeRow('Observações', dados.observacoes),
            ],
          }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

module.exports = { gerarPlanejamentoDocx };
