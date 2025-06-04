from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc

app = Flask(__name__)
CORS(app)

# Conexão com SQL Server (ajuste conforme seu ambiente)
conn_str = (
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=ALUNO26;'
    'DATABASE=ABSOLUTE_CINEMA;'
    'UID=cinema;'
    'PWD=cinema;'
)
conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

# POST - Inserir novo filme
@app.route('/filmes', methods=['POST'])
def inserir_filme():
    data = request.json
    try:
        cursor.execute("""
            INSERT INTO Filme (Id_tmdb, Nome_Filme, Descricao, Classificacao)
            VALUES (?, ?, ?, ?)
        """, data.get('Id_tmdb'), data.get('Nome_Filme'), data.get('Descricao'), data.get('Classificacao'))
        conn.commit()
        return jsonify({'message': 'Filme inserido com sucesso'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET - Listar filmes
@app.route('/filmes', methods=['GET'])
def listar_filmes():
    try:
        cursor.execute("SELECT Cod_Filme, Id_tmdb, Nome_Filme, Descricao, Classificacao FROM Filme")
        filmes = cursor.fetchall()
        resultado = []
        for f in filmes:
            resultado.append({
                'id': f.Cod_Filme,
                'tmdb': f.Id_tmdb,
                'nome': f.Nome_Filme,
                'descricao': f.Descricao,
                'classificacao': f.Classificacao
            })
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# PATCH - Atualizar classificação (ex: inativar)
@app.route('/filmes/<int:filme_id>', methods=['PATCH'])
def atualizar_classificacao(filme_id):
    data = request.json
    nova_classificacao = data.get('Classificacao')
    if nova_classificacao not in ['ativo', 'inativo']:
        return jsonify({'error': 'Classificacao inválida'}), 400
    try:
        cursor.execute("""
            UPDATE Filme SET Classificacao = ?
            WHERE Cod_Filme = ?
        """, nova_classificacao, filme_id)
        conn.commit()
        return jsonify({'message': 'Filme atualizado com sucesso'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Roda o servidor
if __name__ == '__main__':
    app.run(debug=True)
