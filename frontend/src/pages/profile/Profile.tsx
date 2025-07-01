import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  // Estado para dados do usuário logado
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '/logo-sushi.png',
    memberSince: ''
  });

  const navigate = useNavigate(); // Hook para navegação entre páginas
  const { addToCart } = useContext(CartContext); // Hook para manipular o carrinho global

  useEffect(() => {
    // Busca os dados do usuário logado no localStorage
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser({
        name: parsed.name || '',
        email: parsed.email || '',
        avatar: parsed.avatar || '/logo-sushi.png',
        memberSince: parsed.memberSince || new Date().getFullYear().toString()
      });
    }
  }, []);

  // Lista de ofertas especiais exibidas no perfil
  const specialOffers = [
    {
      id: 1,
      title: 'Combo Especial VIP',
      description: 'Ganhe 20% de desconto em combinados premium',
      image: '/sushi1.jpg',
      discount: '20%'
    },
    {
      id: 2,
      title: 'Benefício de Aniversário',
      description: 'Ganhe um Temaki especial no seu aniversário',
      image: '/sushi3.jpg',
      discount: '100%'
    },
    {
      id: 3,
      title: 'Pontos em Dobro',
      description: 'Ganhe pontos em dobro nas terças e quartas',
      image: '/sushi2.jpg',
      special: 'x2'
    }
  ];

  // Função para tratar o clique nas ofertas especiais
  const handleOfferClick = (offer: any) => {
    if (offer.id === 2) {
      // Se for a oferta de aniversário, adiciona Temaki grátis ao carrinho e vai para o carrinho
      const temakiGratis = {
        id: 9999,
        nome: 'Temaki Especial (Aniversário)',
        imagem: '/sushi3.jpg',
        preco: 'R$ 0,00'
      };
      addToCart(temakiGratis);
      navigate('/cart');
    } else {
      // Outras ofertas levam para a página de compra
      navigate('/buy');
    }
  };

  return (
    <div className={styles.profileContainer}>
      {/* Cabeçalho do perfil com avatar e dados do usuário */}
      <div className={styles.profileHeader}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarContainer}>
            <img 
              src={user.avatar} 
              alt="Foto de perfil"
              className={styles.avatar}
            />
          </div>
          <div className={styles.userInfo}>
            <h1>{user.name}</h1>
            <p className={styles.memberStatus}>
              Membro desde {user.memberSince}
            </p>
            <p>{user.email}</p>
          </div>
        </div>
      </div>

      <div className={styles.profileContent}>
        {/* Seção de ofertas especiais */}
        <section className={styles.specialOffersSection}>
          <h2>Suas Ofertas Especiais</h2>
          <div className={styles.offersGrid}>
            {specialOffers.map(offer => (
              <div
                key={offer.id}
                className={styles.offerCard}
                style={{ cursor: 'pointer' }}
                onClick={() => handleOfferClick(offer)}
              >
                <img src={offer.image} alt={offer.title} />
                <div className={styles.offerContent}>
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  {offer.discount && (
                    <span className={styles.discount}>
                      {offer.discount} OFF
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção de pedidos recentes (a ser implementada) */}
        <section className={styles.recentOrders}>
          <h2>Pedidos Recentes</h2>
          {/* Adicione aqui a lista de pedidos recentes */}
        </section>
      </div>
    </div>
  );
};

export default Profile;