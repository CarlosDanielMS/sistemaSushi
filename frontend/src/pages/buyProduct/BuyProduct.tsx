import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import styles from './BuyProduct.module.css';

// Tipo que representa um combo promocional
type Combo = {
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
  precoOriginal: string;
  precoPromocional: string;
  itens: {
    tipo: string;
    quantidade: number;
    descricao: string;
  }[];
  disponivel: boolean;
};

// Lista de combos disponíveis para compra
const combos: Combo[] = [
  {
    id: 1,
    nome: "Combo Família Feliz",
    descricao: "Perfeito para 4 pessoas! Uma seleção especial dos nossos melhores sushis",
    imagem: "/combo-familia.jpg",
    precoOriginal: "R$ 159,90",
    precoPromocional: "R$ 129,90",
    itens: [
      { tipo: "Hot Roll", quantidade: 16, descricao: "Salmão empanado" },
      { tipo: "Uramaki", quantidade: 12, descricao: "Philadelphia com cream cheese" },
      { tipo: "Niguiri", quantidade: 8, descricao: "Salmão maçaricado" },
      { tipo: "Sashimi", quantidade: 12, descricao: "Fatias de salmão" }
    ],
    disponivel: true
  },
  {
    id: 2,
    nome: "Combo Romântico",
    descricao: "Ideal para um jantar a dois! Combinação perfeita de sabores",
    imagem: "/combo-romantico.jpg",
    precoOriginal: "R$ 99,90",
    precoPromocional: "R$ 79,90",
    itens: [
      { tipo: "Uramaki", quantidade: 8, descricao: "Salmão com cream cheese" },
      { tipo: "Hossomaki", quantidade: 8, descricao: "Kani" },
      { tipo: "Niguiri", quantidade: 6, descricao: "Salmão" },
      { tipo: "Hot Roll", quantidade: 8, descricao: "Camarão empanado" }
    ],
    disponivel: true
  },
  {
    id: 3,
    nome: "Combo Festival",
    descricao: "Uma explosão de sabores! Perfeito para festas e reuniões",
    imagem: "/combo-festival.jpg",
    precoOriginal: "R$ 199,90",
    precoPromocional: "R$ 169,90",
    itens: [
      { tipo: "Hot Roll", quantidade: 20, descricao: "Variados" },
      { tipo: "Uramaki", quantidade: 16, descricao: "Salmão e atum" },
      { tipo: "Niguiri", quantidade: 12, descricao: "Variados" },
      { tipo: "Sashimi", quantidade: 15, descricao: "Mix de peixes" },
      { tipo: "Temaki", quantidade: 2, descricao: "Especial da casa" }
    ],
    disponivel: true
  }
];


const BuyProduct: React.FC = () => {
  const { addToCart } = useContext(CartContext); // Hook para manipular o carrinho global
  const navigate = useNavigate(); // Hook para navegação
  const [mensagem, setMensagem] = useState<string>(''); // Estado para mensagem de sucesso

  // Função chamada ao clicar em um combo
  const handleComboClick = (combo: Combo) => {
    if (!combo.disponivel) return;

    // Monta o produto para adicionar ao carrinho
    const produtoCarrinho = {
      id: combo.id,
      nome: combo.nome,
      preco: combo.precoPromocional,
      imagem: combo.imagem,
      descricao: combo.descricao,
      detalhes: combo.itens
    };

    addToCart(produtoCarrinho); // Adiciona ao carrinho

    // Mostra mensagem de sucesso
    setMensagem(`${combo.nome} adicionado ao carrinho!`);
    setTimeout(() => setMensagem(''), 3000);

    // Redireciona para o carrinho
    navigate('/cart');
  };

  return (
    <div className={styles.promocoesContainer}>
      {/* Mensagem de sucesso ao adicionar ao carrinho */}
      {mensagem && <div className={styles.mensagemSucesso}>{mensagem}</div>}
      <h1 className={styles.titulo}>Promoções do Dia</h1>
      <p className={styles.subtitulo}>Aproveite nossos combos especiais!</p>

      {/* Grid de combos promocionais */}
      <div className={styles.combosGrid}>
        {combos.map(combo => (
          <div 
            key={combo.id} 
            className={`${styles.comboCard} ${!combo.disponivel ? styles.indisponivel : ''}`}
          >
            <div className={styles.comboImageContainer}>
              <img src={combo.imagem} alt={combo.nome} />
              {/* Tag de desconto calculada dinamicamente */}
              <div className={styles.descontoTag}>
                {Math.round(
                  ((parseFloat(combo.precoOriginal.replace('R$ ', '').replace(',', '.')) -
                    parseFloat(combo.precoPromocional.replace('R$ ', '').replace(',', '.'))) /
                    parseFloat(combo.precoOriginal.replace('R$ ', '').replace(',', '.'))) * 100
                )}% OFF
              </div>
            </div>

            <div className={styles.comboInfo}>
              {/* ...existing combo info... */}

              {/* Preços do combo */}
              <div className={styles.precosContainer}>
                <span className={styles.precoOriginal}>{combo.precoOriginal}</span>
                <span className={styles.precoPromocional}>{combo.precoPromocional}</span>
              </div>

              {/* Botão para adicionar ao carrinho */}
              <button 
                className={styles.botaoComprar}
                onClick={() => handleComboClick(combo)}
                disabled={!combo.disponivel}
              >
                {combo.disponivel ? 'Adicionar ao Carrinho' : 'Indisponível'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyProduct;