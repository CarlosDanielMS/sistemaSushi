import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Administração do Sistema</h2>
      <p>Bem-vindo, {user?.username} (admin)</p>
      <ul>
        <li><Link to="/cadastrar-produto">Cadastrar Produto</Link></li>
        <li><Link to="/buy">Gerenciar Pedidos</Link></li>
        <li><Link to="/profile">Perfil</Link></li>
        {/* Adicione mais links de administração conforme necessário */}
      </ul>
      <button onClick={logout}>Sair</button>
    </div>
  );
};

export default AdminDashboard;
