const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
    // Como o multer vai armazenar os arquivos
    storage: multer.diskStorage({
        // Onde os arquivos serão salvos
        destination: (req, file, cb) => {
            // path.resolve navega para o diretório e cria se não existir
            cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
        },
        // Como o arquivo será nomeado
        filename: (req, file, cb) => {
            // Gera um nome de arquivo único para evitar sobreposição
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                const fileName = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, fileName);
            });
        },
    }),
    // Limites do arquivo
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    // Como filtrar os tipos de arquivo
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true); // Aceita o arquivo
        } else {
            cb(new Error('Tipo de arquivo inválido.')); // Rejeita o arquivo
        }
    },
};