import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      // Faz POST para o backend, que consulta o banco de dados
      const response = await fetch('http://localhost:3003/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        let errorMsg = `Erro ${response.status}: ${response.statusText}`;
        try {
          const errorResult = await response.json();
          errorMsg = errorResult.error || errorMsg;
        } catch {
          // resposta não é JSON
        }
        throw new Error(errorMsg);
      }

      // O backend retorna { message, token, user }
      const result = await response.json();
      setMessage(result.message || 'Login realizado com sucesso!');
      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      // Redireciona para dashboard admin se for admin, senão para profile
      if (result.user && result.user.role === 'admin') {
        setTimeout(() => navigate('/admin'), 1000);
      } else {
        setTimeout(() => navigate('/profile'), 1000);
      }
    } catch (error: any) {
      setMessage(error.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Entrar</h1>
          <p className="text-gray-500">Bem-vindo de volta!</p>
        </div>
        {message && (
          <div className={`p-4 rounded-md text-sm text-center ${message.includes('sucesso') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="seu.email@exemplo.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center text-gray-600">
          Não tem uma conta?
          <a href="/register" className="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
            Cadastre-se
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
