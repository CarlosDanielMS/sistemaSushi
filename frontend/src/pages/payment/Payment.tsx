import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import styles from './Payment.module.css';

// Interface para o endereço de entrega
interface Address {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

const Payment: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegação
  const { cart } = useContext(CartContext); // Hook do contexto do carrinho
  const [paymentMethod, setPaymentMethod] = useState(''); // Estado do método de pagamento
  const [userName, setUserName] = useState<string>(''); // Estado do nome do usuário
  const [address, setAddress] = useState<Address>({
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  });
  const [cardData, setCardData] = useState({
    nome: '',
    numero: '',
    validade: '',
    cvv: ''
  });
  const [pixKey] = useState('chavepix@exemplo.com'); // Chave Pix simulada
  const [troco, setTroco] = useState(''); // Valor de troco para dinheiro
  const [precisaTroco, setPrecisaTroco] = useState(false); // Se precisa de troco

  useEffect(() => {
    // Busca o usuário logado no localStorage
    const currentUserData = localStorage.getItem('currentUser');
    if (!currentUserData) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(currentUserData);
    setUserName(userData.name);
  }, [navigate]);

  // Verifica se o endereço está completo e se o pagamento foi selecionado
  const isAddressComplete = Object.values(address).every((value) => value.trim() !== '');
  const isPaymentSelected = paymentMethod !== '';

  // Atualiza o endereço conforme o usuário digita
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Atualiza o método de pagamento selecionado
  const handlePaymentChange = (method: string) => {
    setPaymentMethod(method);
  };

  // Função chamada ao finalizar o pedido
  const handleFinishOrder = () => {
    // Validação do pagamento
    if (paymentMethod === 'creditCard') {
      if (!cardData.nome || !cardData.numero || !cardData.validade || !cardData.cvv) {
        alert('Preencha todos os dados do cartão!');
        return;
      }
    }
    if (paymentMethod === 'money' && precisaTroco && !troco) {
      alert('Informe o valor para o troco!');
      return;
    }
    // Gerar número de pedido aleatório
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    // Calcular total
    const total = calcularTotal().toFixed(2);
    // Montar dados do pedido
    const orderData = {
      address,
      orderNumber,
      total
    };
    // Salvar no localStorage para fallback
    localStorage.setItem('orderData', JSON.stringify(orderData));
    // Navegar para order-completed com state
    navigate('/order-completed', { state: orderData });
  };

  // Calcula o valor total do pedido
  const calcularTotal = () => {
    return cart.reduce((total, item) => {
      const preco = parseFloat(item.produto.preco.replace('R$ ', '').replace(',', '.'));
      return total + preco * item.quantidade;
    }, 0);
  };

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.paymentCard}>
        <h1>Finalizar Pedido</h1>
        {/* Mensagem de boas-vindas com nome do usuário */}
        {userName && (
          <div className={styles.welcomeMessage}>
            Olá, {userName}! Complete seu pedido abaixo.
          </div>
        )}

        {/* Resumo do pedido com itens do carrinho */}
        <div className={styles.orderSummary}>
          <h2>Resumo do Pedido</h2>
          {cart.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <>
              {cart.map(({ produto, quantidade }) => (
                <div key={produto.id} className={styles.orderItem}>
                  <span>{produto.nome} x{quantidade}</span>
                  <span>
                    R$ {parseFloat(produto.preco.replace('R$ ', '').replace(',', '.')).toFixed(2)}
                  </span>
                  <span>
                    Subtotal: R$ {(parseFloat(produto.preco.replace('R$ ', '').replace(',', '.')) * quantidade).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className={styles.summaryTotal}>
                <span>Total:</span>
                <span>R$ {calcularTotal().toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Formulário de endereço de entrega */}
        <div className={styles.addressSection}>
          <h2>Endereço de Entrega</h2>
          <div className={styles.addressForm}>
            <div className={styles.formRow}>
              <input
                type="text"
                name="rua"
                placeholder="Rua"
                value={address.rua}
                onChange={handleAddressChange}
              />
              <input
                type="text"
                name="numero"
                placeholder="Número"
                value={address.numero}
                onChange={handleAddressChange}
              />
            </div>
            <div className={styles.formRow}>
              <input
                type="text"
                name="complemento"
                placeholder="Complemento"
                value={address.complemento}
                onChange={handleAddressChange}
              />
              <input
                type="text"
                name="bairro"
                placeholder="Bairro"
                value={address.bairro}
                onChange={handleAddressChange}
              />
            </div>
            <div className={styles.formRow}>
              <input
                type="text"
                name="cidade"
                placeholder="Cidade"
                value={address.cidade}
                onChange={handleAddressChange}
              />
              <input
                type="text"
                name="estado"
                placeholder="Estado"
                value={address.estado}
                onChange={handleAddressChange}
              />
              <input
                type="text"
                name="cep"
                placeholder="CEP"
                value={address.cep}
                onChange={handleAddressChange}
              />
            </div>
          </div>
        </div>

        {/* Seção de escolha do método de pagamento */}
        <div className={styles.paymentSection}>
          <h2>Forma de Pagamento</h2>
          <div className={styles.methodsGrid}>
            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === 'creditCard' ? styles.active : ''}`}
              onClick={() => handlePaymentChange('creditCard')}
            >
              Cartão de Crédito
            </button>
            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === 'money' ? styles.active : ''}`}
              onClick={() => handlePaymentChange('money')}
            >
              Dinheiro
            </button>
            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === 'pix' ? styles.active : ''}`}
              onClick={() => handlePaymentChange('pix')}
            >
              Pix
            </button>
          </div>
          {/* Formulário Cartão de Crédito */}
          {paymentMethod === 'creditCard' && (
            <div className={styles.paymentFields}>
              <input
                type="text"
                placeholder="Nome impresso no cartão"
                value={cardData.nome}
                onChange={e => setCardData({ ...cardData, nome: e.target.value })}
              />
              <input
                type="text"
                placeholder="Número do cartão"
                value={cardData.numero}
                maxLength={19}
                onChange={e => setCardData({ ...cardData, numero: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Validade (MM/AA)"
                  value={cardData.validade}
                  maxLength={5}
                  onChange={e => setCardData({ ...cardData, validade: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardData.cvv}
                  maxLength={4}
                  onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                />
              </div>
            </div>
          )}
          {/* Pix */}
          {paymentMethod === 'pix' && (
            <div className={styles.pixSection}>
              <div className={styles.qrCodeContainer}>
                {/* Simulação de QRCode */}
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" alt="QR Code Pix" onError={e => (e.currentTarget.style.display='none')} />
              </div>
              <div className={styles.pixCode}>
                <strong>Chave Pix:</strong> {pixKey}
              </div>
              <div>Escaneie o QR Code ou copie a chave Pix para pagamento.</div>
            </div>
          )}
          {/* Dinheiro */}
          {paymentMethod === 'money' && (
            <div className={styles.paymentFields}>
              <label style={{marginBottom: '0.5rem'}}>
                <input
                  type="checkbox"
                  checked={precisaTroco}
                  onChange={e => setPrecisaTroco(e.target.checked)}
                />
                Precisa de troco?
              </label>
              {precisaTroco && (
                <input
                  type="text"
                  placeholder="Troco para quanto?"
                  value={troco}
                  onChange={e => setTroco(e.target.value)}
                />
              )}
            </div>
          )}
        </div>

        {/* Botão para finalizar o pedido */}
        <button
          className={styles.confirmButton}
          disabled={!isAddressComplete || !isPaymentSelected}
          onClick={handleFinishOrder}
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
};

export default Payment;