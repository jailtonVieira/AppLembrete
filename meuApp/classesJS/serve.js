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
    if (err ) {
        console.log('Erro ao conectar:', err);
        return;
    }
    else {
        console.log('Conectado:');
    }
});

app.get('/usuarios', (req, res) => {
    db.query('/SELECT * FROM usuarios' , (err, result) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        else {
            res.json(result);
        }
    });
});

app.listen(3000, () => {
    console.log('servidor rodando')
});


//CADASTRO

app.post('/cadastro', async (req , res) => {
    const { nome , email , senha} = req.body;

    try {
        const senhaHash = await bcrypt.hash(senha,10);

        db.query(
            'INSERT INTO usuarios (n , e ,s) VALUE (???)',
            [nome , email , senhaHash],

            (err , result) => {
                if(err) {
                    res.status(500).json(err);
                    return;
                }
                res.json({
                    mensagem: 'usuario cadastrado'
                });
            }
        )
    }
    catch (error) {
        res.status(500).json(error);
    }
})

//LOGIN

app.post('/login', (req , res => {
    const { email , senha} = req.body;

    db.query(
        'SELECT * FROM usuarios WHERE email',
        [email],
        
        async (err, result) => {
            if(err) {
                res.status(500).json(err);
                return;
            }
            if(result.length === 0) {
                res.status(401).json({
                    mensagem: 'Usuario não emcontradado'
                });
                return
            }
            const usuario = result[0];
            const senhaCorreta = await bcrypt.compare(senha,usuario.senha);

            if( senhaCorreta) {
                res.json({
                    mensagem: 'Login realizado'
                });
            }
            else {
                res.status(401).json({
                    mensagem: 'Senha Incorreta'
                });
            }
        }
    )
}))



/* VOCE COLA ESSE API E COLOCA NO APP.TSX
     AQUI VC PRECISA TROCAR O IP

    fetch('http://192.168.0.15:3000/usuarios') 
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            })
        .catch((error) => {
            console.log(error);
            });

            
*/



