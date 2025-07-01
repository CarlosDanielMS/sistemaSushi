import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import styles from './Cardapio.module.css';

type Produto = {
  id: number;
  nome: string;
  imagem: string;
  preco: number;
};

const Cardapio: React.FC = () => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [quantidades, setQuantidades] = useState<{ [key: number]: number }>({});
  const [mensagem, setMensagem] = useState<string>('');
  const [form, setForm] = useState<Partial<Produto>>({});
  const [editId, setEditId] = useState<number | null>(null);

  // Buscar produtos do backend
  useEffect(() => {
    fetch('http://localhost:3000/produtos')
      .then(res => res.json())
      .then(data => setProdutos(data));
  }, []);

  // Adicionar ou editar produto
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.preco) return;

    if (editId) {
      // Editar produto
      fetch(`http://localhost:3000/produtos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then(() => {
          setMensagem('Produto editado com sucesso!');
          setEditId(null);
          setForm({});
          atualizarProdutos();
        });
    } else {
      // Adicionar produto
      fetch('http://localhost:3000/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then(() => {
          setMensagem('Produto adicionado com sucesso!');
          setForm({});
          atualizarProdutos();
        });
    }
  };

  // Remover produto
  const removerProduto = (id: number) => {
    fetch(`http://localhost:3000/produtos/${id}`, { method: 'DELETE' })
      .then(() => {
        setMensagem('Produto removido!');
        atualizarProdutos();
      });
  };

  // Preencher formulário para edição
  const editarProduto = (produto: Produto) => {
    setForm(produto);
    setEditId(produto.id);
  };

  // Atualizar lista de produtos
  const atualizarProdutos = () => {
    fetch('http://localhost:3000/produtos')
      .then(res => res.json())
      .then(data => setProdutos(data));
  };

  // Funções do carrinho (mantidas)
  const handleImageClick = (produto: Produto) => {
    navigate('/buy-product', { state: { produto } });
  };
  const handleIncrement = (produtoId: number) => {
    setQuantidades(prev => ({
      ...prev,
      [produtoId]: (prev[produtoId] || 0) + 1
    }));
  };
  const handleDecrement = (produtoId: number) => {
    setQuantidades(prev => ({
      ...prev,
      [produtoId]: Math.max((prev[produtoId] || 0) - 1, 0)
    }));
  };
  const adicionarAoCarrinho = (produto: Produto) => {
    const quantidade = quantidades[produto.id] || 0;
    if (quantidade > 0) {
      for (let i = 0; i < quantidade; i++) {
        addToCart({ ...produto, preco: produto.preco.toString() });
      }
      setMensagem(`${quantidade}x ${produto.nome} adicionado ao carrinho!`);
      setTimeout(() => setMensagem(''), 3000);
      setQuantidades(prev => ({
        ...prev,
        [produto.id]: 0
      }));
    }
  };

  return (
    <div className={styles.cardapioContainer}>
      {mensagem && <div className={styles.mensagemSucesso}>{mensagem}</div>}
      <h1 className={styles.titulo}>Nosso Cardápio</h1>

      {/* Formulário para adicionar/editar produto */}
      <form onSubmit={handleSubmit} className={styles.formProduto}>
        <input
          type="text"
          placeholder="Nome"
          value={form.nome || ''}
          onChange={e => setForm({ ...form, nome: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Preço"
          value={form.preco || ''}
          onChange={e => setForm({ ...form, preco: Number(e.target.value) })}
          required
        />
        <input
          type="text"
          placeholder="URL da imagem"
          value={form.imagem || ''}
          onChange={e => setForm({ ...form, imagem: e.target.value })}
        />
        <button type="submit">{editId ? 'Salvar Edição' : 'Adicionar Produto'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({}); }}>Cancelar</button>}
      </form>

      <div className={styles.produtosGrid}>
        {produtos.map((produto) => (
          <div key={produto.id} className={styles.cardProduto}>
            <div
              className={styles.imageContainer}
              onClick={() => handleImageClick(produto)}
            >
              <img src={produto.imagem} alt={produto.nome} />
              <div className={styles.overlay}>
                <span>Ver Detalhes</span>
              </div>
            </div>
            <div className={styles.produtoInfo}>
              <h3 className={styles.produtoNome}>{produto.nome}</h3>
              <span className={styles.produtoPreco}>
                {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <div className={styles.controleQuantidade}>
                {quantidades[produto.id] > 0 && (
                  <div className={styles.contador}>
                    {quantidades[produto.id]}
                  </div>
                )}
                <button
                  onClick={() => handleDecrement(produto.id)}
                  disabled={!quantidades[produto.id]}
                >
                  -
                </button>
                <span>{quantidades[produto.id] || 0}</span>
                <button
                  onClick={() => handleIncrement(produto.id)}
                >
                  +
                </button>
              </div>
              <button
                className={styles.botaoCarrinho}
                onClick={() => adicionarAoCarrinho(produto)}
                disabled={!quantidades[produto.id]}
              >
                Adicionar ao Carrinho
              </button>
              {/* Botões de editar/remover */}
              <button onClick={() => editarProduto(produto)}>Editar</button>
              <button onClick={() => removerProduto(produto.id)}>Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cardapio;