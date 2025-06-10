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

@app.route('/filme/<int:id_tmdb>', methods=['GET'])
def get_sessoes_by_tmdb(id_tmdb):
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT sa.Cod_Sala, sa.Numero_Sala, se.Cod_Sessao, se.Horario
            FROM Sessao se
            INNER JOIN Sala sa ON se.Cod_Sala = sa.Cod_Sala
            INNER JOIN Filme fi ON se.Cod_Filme = fi.Cod_Filme
            WHERE fi.Id_tmdb = ?
            ORDER BY sa.Cod_Sala, se.Horario
        """, id_tmdb)

        rows = cursor.fetchall()

        if not rows:
            return jsonify({"erro": "Filme não encontrado"}), 404

        # Agrupar sessões por sala
        salas_dict = {}
        for row in rows:
            cod_sala = row.Cod_Sala
            if cod_sala not in salas_dict:
                salas_dict[cod_sala] = {
                    "Cod_Sala": cod_sala,
                    "Numero_Sala": row.Numero_Sala,
                    "Sessoes": []
                }
            salas_dict[cod_sala]["Sessoes"].append({
                "Cod_Sessao": row.Cod_Sessao,
                "Horario": str(row.Horario)
            })

        return jsonify(list(salas_dict.values()))

    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


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

@app.route('/sessao/<int:cod_sessao>/cadeiras', methods=['GET'])
def get_cadeiras_sessao(cod_sessao):
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT c.Cod_Cadeira, f.Id_tmdb,c.Fileira, c.Assento, c.Status_Filme
            FROM Sessao sc
            INNER JOIN Cadeiras c ON c.Cod_Sala = sc.Cod_Sala
            INNER JOIN Filme f ON f.Cod_Filme = sc.Cod_Filme
            WHERE sc.Cod_Sessao = ?
        """, cod_sessao)

        results = cursor.fetchall()
        cadeiras = []
        for row in results:
            cadeiras.append({
                "Cod_Cadeira": row.Cod_Cadeira,
                "tmdb":row.Id_tmdb,
                "Fileira": row.Fileira,
                "Assento": row.Assento,
                "Status_Filme": row.Status_Filme
            })

        return jsonify(cadeiras)
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/sessao/<int:cod_sessao>', methods=['GET'])
def get_sessao(cod_sessao):
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT sc.Cod_Sessao, sc.Cod_Filme, f.Id_tmdb, sa.Numero_Sala, sc.horario
            FROM Sessao sc
            INNER JOIN Filme f ON f.Cod_Filme = sc.Cod_Filme
            INNER JOIN Sala sa ON sc.Cod_Sala = sa.Cod_Sala
            WHERE sc.Cod_Sessao = ?
        """, cod_sessao)

        results = cursor.fetchall()
        filme = []
        for row in results:
            filme.append({
                "Cod_Sessao": row.Cod_Sessao,
                "Cod_Filme": row.Cod_Filme,
                "tmdb":row.Id_tmdb,
                "sala": row.Numero_Sala,
                "horario": str(row.horario)
            })

        return jsonify(filme)
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/sessao/<int:cod_sessao>/comprar', methods=['POST'])
def comprar_cadeiras(cod_sessao):
    try:
        cadeiras = request.json.get('cadeiras')

        if not cadeiras:
            return jsonify({"erro": "Nenhuma cadeira enviada"}), 400

        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        for cod_cadeira in cadeiras:
            cursor.execute("""
                UPDATE Sessao_Cadeira
                SET Status_Filme = 'ocupada'
                WHERE Cod_Sessao = ? AND Cod_Cadeira = ?
            """, cod_sessao, cod_cadeira)

        conn.commit()
        return jsonify({"mensagem": "Compra confirmada"})
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
        
# Roda o servidor
if __name__ == '__main__':
    app.run(debug=True)
