// src/routes/routes.js
const express = require('express');
const UsuarioController = require('../controllers/usuarioController.js');
const ProdutoController = require('../controllers/produtoController.js');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('../config/multerConfig');
const upload = multer(multerConfig);

// --- Rotas de Autenticação e Registro (Públicas) ---
router.post('/usuarios', UsuarioController.Insert);
router.post('/login', UsuarioController.Login);

// --- Rotas de Gerenciamento de Usuários (SEM AUTENTICAÇÃO, para testes) ---
// Atenção: SearchAll está em /api/usuarios, enquanto as outras estão em /usuarios/:id
// O ideal é padronizar, ex: tudo em /usuarios ou tudo em /api/usuarios
router.get('/api/usuarios', UsuarioController.SearchAll);
router.get('/usuarios/:id', UsuarioController.SearchOne);
router.put('/usuarios/:id', UsuarioController.Update);
router.delete('/usuarios/:id', UsuarioController.Delete);

// --- Rotas de Gerenciamento de Produtos (SEM AUTENTICAÇÃO, para testes) ---
router.post('/produtos', upload.single('imagem'), ProdutoController.Insert);
router.get('/produtos', ProdutoController.SearchAll);
router.get('/produtos/:id', ProdutoController.SearchOne);
router.put('/produtos/:id', ProdutoController.Update);
router.delete('/produtos/:id', ProdutoController.Delete);


module.exports = router;
// Exemplo se fosse apenas para usuários logados:
// router.get('/produtos', UsuarioController.authenticateToken, ProdutoController.SearchAll);

// Rota para buscar um produto específico (PÚBLICA ou para CLIENTES/ADMINS)
router.get('/produtos/:id', ProdutoController.SearchOne);
// Exemplo se fosse apenas para usuários logados:
// router.get('/produtos/:id', UsuarioController.authenticateToken, ProdutoController.SearchOne);


// Rota para atualizar um produto (APENAS ADMIN)
router.put('/produtos/:id', ProdutoController.Update);

// Rota para excluir um produto (APENAS ADMIN)
router.delete('/produtos/:id', ProdutoController.Delete);


module.exports = router;
