import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserMenu.module.css';

// Componente do menu do usuário no topo da aplicação
const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false); // Controla se o menu está aberto
  const navigate = useNavigate(); // Hook para navegação

  // Função para navegar para uma rota e fechar o menu
  const handleNavigation = (route: string) => {
    navigate(route);
    setIsOpen(false);
  };

  return (
    <div className={styles.userMenu}>
      {/* Botão do usuário (ícone) que abre/fecha o menu */}
      <button 
        className={styles.userButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.userIcon}>👤</span>
      </button>

      {/* Dropdown com opções de login/cadastro */}
      {isOpen && (
        <div className={styles.dropdown}>
          <button 
            className={styles.dropdownButton}
            onClick={() => handleNavigation('/login')}
          >
            Login
          </button>
          <button 
            className={styles.dropdownButton}
            onClick={() => handleNavigation('/register')}
          >
            Cadastrar
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;