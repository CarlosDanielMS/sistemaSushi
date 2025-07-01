import type { FC } from 'react';
import styles from './AuthModal.module.css';

// Props esperadas pelo modal de autenticação
interface AuthModalProps {
  type: 'login' | 'register'; // Define se é login ou cadastro
  onClose: () => void; // Função para fechar o modal
}

// Componente funcional do modal de autenticação
const AuthModal: FC<AuthModalProps> = ({ type, onClose }) => {
  const isLogin = type === 'login'; // Verifica se é tela de login

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
        {/* Formulário de login/cadastro */}
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Campo nome só aparece no cadastro */}
          {!isLogin && (
            <input type="text" placeholder="Nome" />
          )}
          <input type="email" placeholder="Email" />a
          <input type="password" placeholder="Senha" />
          {/* Campo confirmar senha só aparece no cadastro */}
          {!isLogin && (
            <input type="password" placeholder="Confirmar Senha" />
          )}
          <button type="submit">
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>
        {/* Botão para fechar o modal */}
        <button className={styles.closeButton} onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default AuthModal;