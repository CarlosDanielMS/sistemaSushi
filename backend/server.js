// Em index.js (o arquivo principal)

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Importações do nosso banco de dados e modelo
import db from './database/database.js';
import User from './models/usuario';

const app = express();
const PORT = 3000;
// BOA PRÁTICA: Mova a chave secreta para variáveis de ambiente em produção!
const SECRET_KEY = 'ca7d10e9f937ce3ac4f57a7158db675682150f3f';

app.use(express.json());

// --- ROTAS ---

// ROTA DE CADASTRO DE USUÁRIO
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Criptografa a senha antes de salvar no banco
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o usuário no banco de dados
        const newUser = await User.create({ 
            username, 
            password: hashedPassword,
            role: role || 'user' // Se o papel não for fornecido, usa 'user'
        });

        res.status(201).json({ message: 'User created successfully', userId: newUser.id });
    } catch (error) {
        // Trata o erro de username duplicado
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Username already exists' });
        }
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// ROTA DE LOGIN (MODIFICADA PARA USAR O BANCO DE DADOS)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Procura o usuário no banco de dados
    const user = await User.findOne({ where: { username } });

    // Se o usuário existe e a senha está correta
    if (user && await bcrypt.compare(password, user.password)) {
        // Gera o token JWT com os dados do usuário do banco
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// --- MIDDLEWARE DE AUTENTICAÇÃO (sem alterações) ---
const authenticateTOKEN = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// --- ROTAS PROTEGIDAS (sem alterações) ---
app.get('/protected', authenticateTOKEN, (req, res) => {
    res.status(200).json({ message: `Hello ${req.user.username}, you have access to this protected route!`, role: req.user.role });
});

app.get('/admin', authenticateTOKEN, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json({ message: `Hello ${req.user.username}, you have access to this admin route!`, role: req.user.role });
});


// --- INICIALIZAÇÃO DO SERVIDOR E BANCO DE DADOS ---
const startServer = async () => {
    try {
        // Sincroniza o modelo com o banco de dados.
        // Isso criará a tabela 'Users' se ela não existir.
        await db.sync(); 
        console.log('Database synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();