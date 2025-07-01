const status = require('http-status');
const Produto = require('../models/produto');

// Inserir produto com upload de imagem
exports.Insert = async (req, res, next) => {
    const { nome, descricao, preco, cardapio } = req.body;

    if (!req.file) {
        return res.status(status.BAD_REQUEST).json({ error: 'A imagem do produto é obrigatória.' });
    }

    const imagemPath = req.file.path;

    try {
        const newProduct = await Produto.create({
            nome,
            descricao,
            preco,
            imagem: imagemPath,
            ativo: false, // Sempre inativo ao criar
            cardapio: cardapio === 'on' || cardapio === true || cardapio === 'true'
        });

        if (newProduct) {
            res.status(status.CREATED).json({
                message: 'Produto cadastrado com sucesso!',
                product: {
                    id: newProduct.id,
                    nome: newProduct.nome,
                    descricao: newProduct.descricao,
                    preco: newProduct.preco,
                    imagem: newProduct.imagem,
                    ativo: !!newProduct.ativo, // garante boolean
                    cardapio: !!newProduct.cardapio
                }
            });
        } else {
            res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'Erro ao cadastrar produto.' });
        }

    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(status.BAD_REQUEST).json({
                error: 'Dados de produto inválidos.',
                details: error.errors.map(err => err.message)
            });
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(status.CONFLICT).json({ error: 'Um produto com este nome já existe.' });
        }

        // Retorna um erro genérico
        res.status(status.BAD_REQUEST).json({ error: 'Erro ao cadastrar produto.', details: error.message });
    }
};

// Buscar todos os produtos
exports.SearchAll = (req, res, next) => {
    Produto.findAll()
        .then(produtos => {
            // Garante que ativo e cardapio sejam booleanos na resposta
            const produtosFormatados = produtos.map(produto => ({
                ...produto.toJSON(),
                ativo: !!produto.ativo,
                cardapio: !!produto.cardapio
            }));
            res.status(status.OK).send(produtosFormatados);
        })
        .catch(error => next(error));
};

// Buscar um produto por ID
exports.SearchOne = (req, res, next) => {
    const id = req.params.id;
    Produto.findByPk(id)
        .then(produto => {
            if (produto) {
                const prod = produto.toJSON();
                prod.ativo = !!prod.ativo;
                prod.cardapio = !!prod.cardapio;
                res.status(status.OK).send(prod);
            }
            else res.status(status.NOT_FOUND).send();
        })
        .catch(error => next(error));
};

// Atualizar produto
exports.Update = (req, res, next) => {
    const id = req.params.id;
    Produto.findByPk(id)
        .then(produto => {
            if (produto) {
                // Converte os campos para booleano se estiverem presentes na requisição
                if (req.body.cardapio !== undefined) {
                    req.body.cardapio =
                        req.body.cardapio === true ||
                        req.body.cardapio === "true" ||
                        req.body.cardapio === "on" ||
                        req.body.cardapio === 1 ||
                        req.body.cardapio === "1";
                }
                // Garante que 'ativo' seja booleano e trate undefined como false
                if (req.body.ativo !== undefined) {
                    req.body.ativo =
                        req.body.ativo === true ||
                        req.body.ativo === "true" ||
                        req.body.ativo === "on" ||
                        req.body.ativo === 1 ||
                        req.body.ativo === "1";
                } else {
                    req.body.ativo = false;
                }
                produto.update(req.body)
                    .then(() => res.status(status.OK).send())
                    .catch(error => next(error));
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .catch(error => next(error));
};

// Deletar produto
exports.Delete = (req, res, next) => {
    const id = req.params.id;
    Produto.findByPk(id)
        .then(produto => {
            if (produto) {
                produto.destroy()
                    .then(() => res.status(status.OK).send())
                    .catch(error => next(error));
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .catch(error => next(error));
};