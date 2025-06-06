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
    data = request.json  # Verifique se request.json está pegando os dados corretamente
    
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400  # Se não houver dados JSON

    try:
        cursor.execute("""
            INSERT INTO Filme (Id_tmdb, Nome_Filme, Descricao, Classificacao)
            VALUES (?, ?, ?, ?)
        """, (data.get('Id_tmdb'), data.get('Nome_Filme'), data.get('Descricao'), data.get('Classificacao')))
        conn.commit()
        return jsonify({'message': 'Filme inserido com sucesso'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    login_input = data.get('login_email')  # pode ser login ou email
    senha = data.get('senha')

    cursor.execute("""
        SELECT Cod_Usuario, Nome_Usuario, Login_Usuario, Email_Usuario
        FROM Usuario
        WHERE (Login_Usuario = ? OR Email_Usuario = ?) AND Senha_Usuario = ?
    """, (login_input, login_input, senha))
    user = cursor.fetchone()

    if user:
        return jsonify({
            'Cod_Usuario': user.Cod_Usuario,
            'Nome_Usuario': user.Nome_Usuario,
            'Login_Usuario': user.Login_Usuario,
            'Email_Usuario': user.Email_Usuario
        }), 200
    else:
        return jsonify({'erro': 'Usuário ou senha inválidos'}), 401

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

@app.route('/cadastro', methods=['POST'])
def cadastrar_usuario():
    data = request.get_json()

    nome = data.get('nome')
    login = data.get('usuario')
    email = data.get('email')
    senha = data.get('senha')  # em produção, hasheie isso!
    cpf = data.get('cpf')
    data_nasc = data.get('data_nasc')  # formato esperado: 'DD/MM/YYYY'
    telefone = data.get('telefone')

    # Verificar se o login ou email já existem
    cursor.execute("""
        SELECT 1 FROM Usuario WHERE Login_Usuario = ? OR Email_Usuario = ?
    """, (login, email))
    if cursor.fetchone():
        return jsonify({'erro': 'Usuário ou email já cadastrado'}), 409

    try:
        # Inserir usuário
        cursor.execute("""
            INSERT INTO Usuario 
            (Nome_Usuario, Login_Usuario, Email_Usuario, Senha_Usuario, CPF, Data_Nascimento, Telefone)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (nome, login, email, senha, cpf, data_nasc, telefone))

        conn.commit()
        return jsonify({'mensagem': 'Usuário cadastrado com sucesso'}), 201

    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
# Roda o servidor
if __name__ == '__main__':
    app.run(debug=True)
