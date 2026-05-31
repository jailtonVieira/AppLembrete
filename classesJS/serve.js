const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'app_Lembretes'
});

db.connect((err) => {
    if (err) {
        console.log('Erro ao conectar:', err);
        return;
    }
    console.log('Conectado ao banco de dados');
});

// Busca todos os usuários
app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, result) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json(result);
    });
});

// Cadastro de novo usuário
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        db.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senhaHash],
            (err, result) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }
                res.json({ mensagem: 'Usuário cadastrado com sucesso' });
            }
        );
    } catch (error) {
        res.status(500).json(error);
    }
});

// Login do usuário
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    db.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email],
        async (err, result) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            if (result.length === 0) {
                res.status(401).json({ mensagem: 'Usuário não encontrado' });
                return;
            }
            const usuario = result[0];
            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
            if (senhaCorreta) {
                res.json({
                    mensagem: 'Login realizado',
                    nome: usuario.nome,
                    email: usuario.email,
                });
            } else {
                res.status(401).json({ mensagem: 'Senha incorreta' });
            }
        }
    );
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});