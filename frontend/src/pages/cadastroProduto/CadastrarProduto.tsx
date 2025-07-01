import React, { useState } from 'react';
import axios from 'axios';

const CadastrarProduto: React.FC = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');
    setErro('');
    try {
      const response = await axios.post('http://localhost:3003/produtos', {
        nome,
        descricao,
        preco: parseFloat(preco),
        imagem
      });
      setMensagem('Produto cadastrado com sucesso!');
      setNome('');
      setDescricao('');
      setPreco('');
      setImagem('');
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao cadastrar produto.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Cadastrar Produto</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nome:</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Descrição:</label>
          <textarea value={descricao} onChange={e => setDescricao(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Preço:</label>
          <input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>URL da Imagem:</label>
          <input type="text" value={imagem} onChange={e => setImagem(e.target.value)} style={{ width: '100%' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#e63946', color: '#fff', border: 'none', borderRadius: 4 }}>Cadastrar</button>
      </form>
      {mensagem && <div style={{ color: 'green', marginTop: 16 }}>{mensagem}</div>}
      {erro && <div style={{ color: 'red', marginTop: 16 }}>{erro}</div>}
    </div>
  );
};

export default CadastrarProduto;
