import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Start from './pages/start/Start';
import Cardapio from './pages/cardapio/Cardapio';
import Cart from './pages/cart/Cart';
import UserMenu from './components/UserMenu/UserMenu';
import Payment from './pages/payment/Payment';
import OrderCompleted from './pages/orderCompleted/OrderCompleted';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/profile/Profile';
import BuyProduct from './pages/buyProduct/BuyProduct';
import CadastrarProduto from './pages/cadastroProduto/CadastrarProduto';
import AdminDashboard from './pages/admin/AdminDashboard';
import './App.css';



function PrivateRoute({ children, adminOnly = false }: { children: JSX.Element, adminOnly?: boolean }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AdminLink() {
  const { user } = useAuth();
  if (user && user.role === 'admin') {
    return <li><Link to="/admin">Admin</Link></li>;
  }
  return null;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-container">
            <nav className="navbar">
              <ul>
                <li><Link to="/">Início</Link></li>
                <li><Link to="/cardapio">Cardápio</Link></li>
                <li><Link to="/cart">Carrinho</Link></li>
                <li><UserMenu /></li>
                <AdminLink />
              </ul>
            </nav>
            <main className="main-content">
              <Routes>
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/" element={<Start />} />
                <Route path="/cardapio" element={<Cardapio />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-completed" element={<OrderCompleted />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/buy" element={<BuyProduct />} />
                <Route path="/cadastrar-produto" element={<CadastrarProduto />} />
                <Route path="/admin" element={
                  <PrivateRoute adminOnly>
                    <AdminDashboard />
                  </PrivateRoute>
                } />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;