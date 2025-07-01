import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './OrderCompleted.module.css';

// Interface para os dados recebidos via state ou localStorage
interface LocationState {
  address: {
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  orderNumber: number;
  total: string;
}

const OrderCompleted: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegação
  const location = useLocation(); // Hook para acessar dados passados via state

  // Recupera os dados do pedido do state ou do localStorage
  let orderData = location.state as LocationState | null;
  if (!orderData) {
    const local = localStorage.getItem('orderData');
    if (local) {
      orderData = JSON.parse(local);
    }
  }

  // Redireciona para a home se não houver dados do pedido
  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  // Exibe mensagem se não encontrar dados do pedido
  if (!orderData) {
    return (
      <div className={styles.orderContainer}>
        <div className={styles.orderCard}>
          <h1>Pedido não encontrado</h1>
          <button className={styles.backButton} onClick={() => navigate('/')}>
            Voltar para Início
          </button>
        </div>
      </div>
    );
  }

  const { address, orderNumber, total } = orderData;

  const [currentStatus, setCurrentStatus] = useState(0); // Status atual do pedido
  const [timeRemaining, setTimeRemaining] = useState(45); // Tempo estimado de entrega

  // Lista de status do pedido
  const orderStatuses = [
    { id: 0, title: 'Pedido Confirmado', icon: '✅' },
    { id: 1, title: 'Em Preparação', icon: '👨‍🍳' },
    { id: 2, title: 'Finalizado', icon: '🍱' },
    { id: 3, title: 'A Caminho', icon: '🛵' },
  ];

  // Atualiza o status do pedido a cada 15 segundos
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setCurrentStatus(prev => {
        if (prev < orderStatuses.length - 1) return prev + 1;
        clearInterval(statusInterval);
        return prev;
      });
    }, 15000);

    return () => clearInterval(statusInterval);
  }, []);

  // Atualiza o tempo restante a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev > 0) return prev - 1;
        clearInterval(timer);
        return 0;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.orderContainer}>
      <div className={styles.orderCard}>
        <h1>Acompanhe seu Pedido</h1>
        <p className={styles.orderNumber}>Pedido #{orderNumber}</p>
        <p className={styles.orderTotal}>Valor Total: R$ {total}</p>

        {/* Tempo estimado de entrega */}
        <div className={styles.timeEstimate}>
          <h2>Tempo Estimado</h2>
          <div className={styles.timer}>
            <span className={styles.time}>{timeRemaining}</span>
            <span className={styles.unit}>min</span>
          </div>
        </div>

        {/* Barra de status do pedido */}
        <div className={styles.statusTracker}>
          {orderStatuses.map((status, index) => (
            <div
              key={status.id}
              className={`${styles.statusItem} ${index <= currentStatus ? styles.active : ''}`}
            >
              <div className={styles.statusIcon}>{status.icon}</div>
              <div className={styles.statusLine}></div>
              <div className={styles.statusTitle}>{status.title}</div>
            </div>
          ))}
        </div>

        {/* Detalhes do endereço de entrega */}
        <div className={styles.orderDetails}>
          <h3>Detalhes da Entrega</h3>
          <div className={styles.addressInfo}>
            <p>📍 Endereço de Entrega:</p>
            <p>{address.rua}, {address.numero}</p>
            {address.complemento && <p>Complemento: {address.complemento}</p>}
            <p>{address.bairro}</p>
            <p>{address.cidade} - {address.estado}</p>
            <p>CEP: {address.cep}</p>
          </div>
        </div>

        {/* Botão para voltar para a página inicial */}
        <button
          className={styles.backButton}
          onClick={() => navigate('/')}
        >
          Voltar para Início
        </button>
      </div>
    </div>
  );
};

export default OrderCompleted;