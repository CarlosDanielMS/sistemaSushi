// src/models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const bcrypt = require('bcrypt'); // Importe o bcrypt aqui

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: { // Se o seu campo é 'nome' e não 'username'
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Garante que o email seja único
    validate: {
      isEmail: true, // Valida se é um formato de e-mail
    }
  },
  password: { // O nome do campo de senha
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: { // Adicione um campo 'role' para diferenciar 'admin' e 'client'
    type: DataTypes.ENUM('admin', 'client'),
    defaultValue: 'client', // Valor padrão para novos usuários (clientes)
    allowNull: false,
  },
  ativo: { // Seu campo 'ativo'
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
}, {
  // Hooks para criptografar a senha antes de criar/atualizar
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.password) {
        const salt = await bcrypt.genSalt(10); // Gera um salt (custo 10)
        usuario.password = await bcrypt.hash(usuario.password, salt); // Criptografa a senha
      }
    },
    beforeUpdate: async (usuario) => {
      // Verifica se a senha foi modificada antes de criptografar novamente
      if (usuario.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    },
  },
  timestamps: true, // Adiciona campos createdAt e updatedAt
});

// Adiciona um método de instância para comparar a senha (texto puro) com o hash
Usuario.prototype.validPassword = async function(password) {
  // Compara a senha fornecida com a senha (hash) armazenada no banco de dados
  return await bcrypt.compare(password, this.password);
};

module.exports = Usuario;
// O model já está correto, apenas garanta que a coluna 'role' existe no banco de dados.