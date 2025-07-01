import React, { createContext, useState } from 'react';

// Tipo do produto que pode ser adicionado ao carrinho
type Produto = {
  id: number;
  nome: string;
  imagem: string;
  preco: string;
};

// Tipo de um item do carrinho
type CartItem = {
  produto: Produto;
  quantidade: number;
};

// Interface do contexto do carrinho, define as funções e dados disponíveis globalmente
export interface CartContextData {
  cart: CartItem[];
  clearCart: () => void;
  addToCart: (produto: Produto) => void;
  removeFromCart: (produto: Produto) => void;
  getTotalItems: () => number;
};

// Criação do contexto do carrinho
export const CartContext = createContext<CartContextData>({} as CartContextData);

// Provedor do contexto do carrinho, engloba a aplicação
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]); // Estado do carrinho

  // Adiciona um produto ao carrinho (ou incrementa a quantidade se já existir)
  const addToCart = (produto: Produto) => {
    setCart(prev => {
      const index = prev.findIndex(item => item.produto.id === produto.id);
      if (index !== -1) {
        return prev.map((item, i) =>
          i === index ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      } else {
        return [...prev, { produto, quantidade: 1 }];
      }
    });
  };

  // Remove um produto do carrinho (ou decrementa a quantidade)
  const removeFromCart = (produto: Produto) => {
    setCart(prev => {
      const index = prev.findIndex(item => item.produto.id === produto.id);
      if (index !== -1) {
        const item = prev[index];
        if (item.quantidade > 1) {
          return prev.map((item, i) =>
            i === index ? { ...item, quantidade: item.quantidade - 1 } : item
          );
        } else {
          return prev.filter((_, i) => i !== index);
        }
      }
      return prev;
    });
  };

  // Limpa todo o carrinho
  const clearCart = () => {
    setCart([]);
  };

  // Retorna o total de itens no carrinho
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantidade, 0);
  };

  // Provedor do contexto, disponibiliza funções e dados para toda a aplicação
  return (
    <CartContext.Provider value={{ cart, clearCart, addToCart, removeFromCart, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};