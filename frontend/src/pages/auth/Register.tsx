import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Auth.module.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmarSenha: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmarSenha) {
      setMessage('As senhas não coincidem.');
      return;
    }

    try {
      const { nome, email, password } = formData;
      const response = await axios.post<{ message?: string }>('http://localhost:3003/usuarios', {
        nome,
        email,
        password
      });

      setMessage(response.data.message || 'Usuário registrado com sucesso!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else if (error.response?.status === 404) {
        setMessage('Endpoint não encontrado. Verifique se o backend está rodando e se a rota /usuarios existe.');
      } else if (error.response?.data) {
        setMessage(JSON.stringify(error.response.data));
      } else {
        setMessage('Erro ao registrar usuário. Verifique se o backend está rodando e se o endpoint /usuarios aceita POST.');
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Cadastro de Usuário</h2>
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              name="confirmarSenha"
              placeholder="Confirmar senha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.authButton}>
            Cadastrar
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
