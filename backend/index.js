const http = require('http');
const express = require('express');
const status = require('http-status');
const sequelize = require('./src/database/database');
const app = express();
const routes = require('./src/routes/routes.js');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

app.use('/files', express.static(path.resolve(__dirname, 'uploads')));

// Garante que a pasta uploads exista
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configuração personalizada do CORS para permitir cabeçalhos comuns de upload
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Middleware para adicionar o cabeçalho 'crossorigin' em todas as respostas
app.use((req, res, next) => {
    res.header('crossorigin', 'anonymous');
    next();
});

app.use('/', routes);

// Middleware para rota não encontrada
app.use((req, res, next) => {
    res.status(status.NOT_FOUND).send("Page not found");
});

// Middleware de erro global
app.use((error, req, res, next) => {
    res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message });
});

// Configuração do multer para salvar imagens na pasta uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
};
const upload = multer({ storage, fileFilter });

// Rota para upload de imagem
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(status.BAD_REQUEST).json({ error: 'Nenhum arquivo enviado ou tipo inválido.' });
    }
    // Retorna a URL do arquivo salvo
    res.json({ url: `/files/${req.file.filename}` });
});

// Inicialização do servidor
sequelize.sync({ force: false }).then(() => {
    const port = 3003;
    app.set("port", port);
    const server = http.createServer(app);
    server.listen(port);
});