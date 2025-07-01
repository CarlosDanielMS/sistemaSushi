import React from "react";
import { useNavigate } from "react-router-dom";

import "./Start.css";

// Componente da página inicial do restaurante
const StartSushi: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegação

  // Função para ir para o cardápio ao clicar no botão (pode ser usada futuramente)
  const goToCardapio = () => {
    navigate("/cardapio");
  };

  return (
    <div className="start-container">
      {/* Seção superior com logo */}
      <div className="top-section">
        <img
          src="/logo-sushi.png"
          alt="Logo do Restaurante de Sushi"
          className="sushi-logo"
        />
      </div>
      {/* Título e subtítulo de boas-vindas */}
      <h1 className="title">Sushi Perfeito</h1>
      <h2 className="subtitle">Descubra uma experiência única com nossos sushis frescos e deliciosos.
            Navegue pelo nosso cardápio e faça seu pedido agora mesmo!</h2>
      {/* Botão para acessar o cardápio usando goToCardapio */}
      <button className="cardapio-button" onClick={goToCardapio}>
        Ver Cardápio
      </button>
    </div>
  );
};

export default StartSushi;
