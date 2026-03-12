from flask import Flask, render_template, request, redirect, url_for, send_file
from docx import Document
import pandas as pd
import os

app = Flask(__name__)

# Caminho do arquivo Excel
EXCEL_FILE = 'HABILIDADES FUND.xlsx'

# Carregar dados do Excel
df = pd.read_excel(EXCEL_FILE)
disciplinas = df.columns.tolist()

@app.route('/')
def home():
    return render_template('index.html')  # Página inicial

@app.route('/create-plan', methods=['GET', 'POST'])
def create_plan():
    if request.method == 'POST':
        # Capturar os dados do formulário
        unidade = request.form['unidade']
        professor = request.form['professor']
        serie=request.form['serie']
        bimestre = request.form['bimestre']
        periodo = request.form['periodo']
        a = request.form['a']
        capitulo = request.form['capitulo']
        disciplina = request.form['disciplina']
        habilidades = request.form.getlist('habilidades')
        desenvolvimento = request.form['desenvolvimento']
        estrategia = request.form['estrategia']
        observacoes = request.form['observacoes']
        duracao_aula = request.form['duracao_aula']
        nome_arquivo = request.form['nome_arquivo']

        # Inserir dados no modelo Word
        caminho_arquivo = inserir_texto_no_modelo({
            'Unidade': unidade,
            'Professor': professor,
            'Série': serie,
            'Bimestre': bimestre,
            'Período': periodo,
            'Período Fim': a,
            'Capítulo': capitulo,
            'Área ou Disciplina': disciplina,
            'Habilidades': '\n'.join(habilidades),
            'Desenvolvimento da Aula': desenvolvimento,
            'Estratégia': estrategia,
            'Observações': observacoes,
            'Duração da Aula': duracao_aula
        }, 'static/docx/Folha do Planejamento Pedagógico.docx', 'static/docx/', nome_arquivo)

        # Verificar se o arquivo foi gerado corretamente
        if caminho_arquivo:
            return send_file(caminho_arquivo, as_attachment=True, download_name=f"{nome_arquivo}.docx")
        else:
            return "Erro ao gerar o arquivo", 500

    return render_template('form.html', disciplinas=disciplinas)

@app.route('/get-habilidades')
def get_habilidades():
    disciplina = request.args.get('disciplina')
    if disciplina in df.columns:
        habilidades = df[disciplina].dropna().tolist()
        return {'habilidades': habilidades}
    return {'habilidades': []}

def inserir_texto_no_modelo(dados, modelo_path, pasta_salvar, nome_arquivo):
    try:
        if not os.path.exists(pasta_salvar):
            os.makedirs(pasta_salvar)

        doc = Document(modelo_path)

        table = doc.add_table(rows=0, cols=2)
        table.style = 'Table Grid'

        for chave, valor in dados.items():
            row = table.add_row()
            label_run = row.cells[0].paragraphs[0].add_run(chave)
            label_run.bold = True
            row.cells[1].paragraphs[0].add_run(str(valor))

        caminho_arquivo = os.path.join(pasta_salvar, f'{nome_arquivo}.docx')
        doc.save(caminho_arquivo)
        return caminho_arquivo
    except Exception as e:
        print(f"Erro ao inserir texto no modelo: {e}")
        return None

if __name__ == '__main__':
    app.run(debug=True)









