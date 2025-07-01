import React, { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart: React.FC = () => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext); // Hooks do contexto do carrinho
  const navigate = useNavigate(); // Hook para navegação

  // Calcula o valor total do carrinho
  const calcularTotal = () => {
    return cart.reduce((total, item) => {
      const preco = parseFloat(item.produto.preco.replace('R$ ', '').replace(',', '.'));
      return total + (preco * item.quantidade);
    }, 0);
  };

  // Função chamada ao clicar em "Ir para Pagamento"
  const handleFinalizarCompra = () => {
    if (cart.length > 0) {
      navigate('/payment');
    } else {
      alert('Adicione itens ao carrinho antes de finalizar a compra');
    }
  };

  return (
    <div className="cartContainer">
      <h1>Carrinho de Compras</h1>
      {/* Exibe mensagem se o carrinho estiver vazio */}
      {cart.length === 0 ? (
        <p>Seu carrinho está vazio</p>
      ) : (
        <>
          {/* Lista de itens do carrinho */}
          <div className="cartItems">
            {cart.map(({ produto, quantidade }) => (
              <div key={produto.id} className="cartItem">
                <img src={produto.imagem} alt={produto.nome} />
                <div className="itemInfo">
                  <h3>{produto.nome}</h3>
                  <div className="itemDetails">
                    <p className="preco">{produto.preco}</p>
                    <p className="quantidade">Quantidade: {quantidade}</p>
                  </div>
                  {/* Botões para alterar quantidade */}
                  <div className="quantidade">
                    <button onClick={() => removeFromCart(produto)}>−</button>
                    <span>{quantidade}</span>
                    <button onClick={() => addToCart(produto)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Total e botão de finalizar compra */}
          <div className="cartTotal">
            <h2>Total: R$ {calcularTotal().toFixed(2)}</h2>
            <button 
              className="finalizarButton"
              onClick={handleFinalizarCompra}
            >
              Ir para Pagamento
            </button>
          </div>
        </>
      )}
      {/* Botão para voltar ao cardápio */}
      <button 
        className="voltarButton"
        onClick={() => navigate('/cardapio')}
      >
        Voltar ao Cardápio
      </button>
    </div>
  );
};

export default Cart;