const Sequelize = require('sequelize');

// Busca os dados de configuração do banco de dados
const sequelize = require('../database/database.js');

// Define o modelo Produto
const Produto = sequelize.define('produtos', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    nome: {
        allowNull: false,
        type: Sequelize.STRING(100),
        validate: {
            len: [3, 100]
        }
    },
    descricao: {
        allowNull: false,
        type: Sequelize.STRING(255),
        validate: {
            len: [3, 255]
        }
    },
    preco: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
        validate: {
            min: 0
        }
    },
    imagem: {
        allowNull: true,
        type: Sequelize.STRING(255)
    },
    ativo: {
        allowNull: false,
        type: Sequelize.BOOLEAN(),
        defaultValue: true
    },
    cardapio: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Produto;
