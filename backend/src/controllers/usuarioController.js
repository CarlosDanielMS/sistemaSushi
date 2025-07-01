const status = require('http-status');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ca7d10e9f937ce3ac4f57a7158db675682150f3';
const SALT_ROUNDS = 10;

exports.Insert = async (req, res, next) => {
    const { nome, email, password } = req.body;
    const ativo = true;

    try {
        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // 2. Create the user with the hashed password
        const usuario = await Usuario.create({
            nome,
            email,
            password: hashedPassword, // Store the hashed password
            ativo
        });

        if (usuario) {
            // 3. Generate a JWT
            const token = jwt.sign(
                { id: usuario.id, email: usuario.email },
                JWT_SECRET,
                { expiresIn: '1h' } // Token expires in 1 hour
            );

            res.status(status.CREATED).json({
                message: 'Usuário registrado com sucesso!',
                token: token,
                user: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                }
            });
        } else {
            // This case should ideally not be reached if creation fails,
            // as the await would throw an error that's caught below.
            res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'Erro ao registrar.' });
        }
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);

        // Check for specific error types (e.g., duplicate email)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(status.CONFLICT).json({ error: 'Este e-mail já está em uso.' });
        }

        res.status(status.BAD_REQUEST).json({ error: 'Erro ao registrar usuário.' });
    }
};

exports.Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(status.UNAUTHORIZED).json({ error: 'Usuário não encontrado.' });
        }

        // Compare password
        const verifyPassword = await bcrypt.compare(password, usuario.password);
        if (!verifyPassword) {
            return res.status(status.UNAUTHORIZED).json({ error: 'Senha incorreta.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: usuario.id}, process.env.JWT_PASS ?? '', {
                expiresIn: '8h',
             }
        );

        res.status(status.OK).json({
            message: 'Login realizado com sucesso!',
            token: token,
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'Erro ao realizar login.' });
    }
};


exports.SearchAll = (req, res, next) => {
    Usuario.findAll()
        .then(usuario => {
            if (usuario) {
                res.status(status.OK).send(usuario);
            }
        })
        .catch(error => next(error));
};

exports.SearchOne = (req, res, next) => {
    const id = req.params.id;

    Usuario.findByPk(id)
        .then(usuario => {
            if (usuario) {
                res.status(status.OK).send(usuario);
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .catch(error => next(error));
};

exports.Update = async (req, res, next) => {
    const id = req.params.id;
    const { nome, email, password, ativo } = req.body;

    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(status.NOT_FOUND).send();
        }

        const updateData = {
            nome,
            email,
            ativo
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
        }

        await usuario.update(updateData);
        res.status(status.OK).send();
    } catch (error) {
        next(error);
    }
};

exports.Delete = (req, res, next) => {
    const id = req.params.id;

    Usuario.findByPk(id)
        .then(usuario => {
            if (usuario) {
                usuario.destroy()
                    .then(() => {
                        res.status(status.OK).send();
                    })
                    .catch(error => next(error));
            }
            else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .catch(error => next(error));
};
