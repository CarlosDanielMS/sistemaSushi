# Frontend do Sistema de Cardápio, Carrinho e Administração

Frontend desenvolvido com **React**, **TypeScript**, **React Router DOM** e **Axios** para consumir uma API backend.  
O projeto possui navegação entre páginas públicas, autenticação de usuários, controle de carrinho, área de perfil, fluxo de compra/pagamento e uma área administrativa protegida para usuários com perfil `admin`.

---

## Tecnologias utilizadas

- React
- TypeScript
- React Router DOM
- Axios
- Context API
- CSS

---

## Funcionalidades principais

- Página inicial do sistema.
- Exibição de cardápio.
- Carrinho de compras.
- Fluxo de pagamento.
- Tela de pedido concluído.
- Login de usuário.
- Cadastro de usuário.
- Perfil do usuário.
- Compra de produto.
- Cadastro de produto.
- Área administrativa.
- Controle de acesso por autenticação.
- Controle de rota exclusiva para administrador.
- Integração com backend via Axios.

---

## Estrutura esperada do projeto

```txt
frontend/
│
├── src/
│   ├── components/
│   │   └── UserMenu/
│   │       └── UserMenu.tsx
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── buyProduct/
│   │   │   └── BuyProduct.tsx
│   │   ├── cadastroProduto/
│   │   │   └── CadastrarProduto.tsx
│   │   ├── cardapio/
│   │   │   └── Cardapio.tsx
│   │   ├── cart/
│   │   │   └── Cart.tsx
│   │   ├── orderCompleted/
│   │   │   └── OrderCompleted.tsx
│   │   ├── payment/
│   │   │   └── Payment.tsx
│   │   ├── profile/
│   │   │   └── Profile.tsx
│   │   └── start/
│   │       └── Start.tsx
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── App.tsx
│   └── App.css
│
├── package.json
└── README.md
```

---

## Instalação

Clone o repositório e acesse a pasta do frontend:

```bash
git clone <url-do-repositorio>
cd <nome-do-projeto>
```

Instale as dependências:

```bash
npm install
```

Caso esteja configurando do zero, instale as principais dependências:

```bash
npm install react-router-dom axios
```

---

## Executando o projeto

Para iniciar o frontend em ambiente de desenvolvimento:

```bash
npm run dev
```

ou, dependendo da configuração do projeto:

```bash
npm start
```

Após iniciar, o projeto normalmente ficará disponível em:

```txt
http://localhost:5173
```

ou:

```txt
http://localhost:3000
```

---

## Configuração da API

O frontend utiliza o Axios para se comunicar com o backend.

Arquivo:

```txt
src/services/api.ts
```

Configuração atual:

```ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3003',
});

export class UsuarioService {
  listaUsuarios() {
    return api.get('/sistema/usuarios');
  }
}
```

A URL base da API está configurada como:

```txt
http://localhost:3003
```

Se o backend estiver rodando em outra porta ou em outro servidor, altere o valor de `baseURL`.

Exemplo:

```ts
export const api = axios.create({
  baseURL: 'http://localhost:3000',
});
```

ou:

```ts
export const api = axios.create({
  baseURL: 'https://minha-api.com',
});
```

---

## Rotas do frontend

As rotas são configuradas no arquivo:

```txt
src/App.tsx
```

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `Start` | Página inicial |
| `/cardapio` | `Cardapio` | Lista de produtos/cardápio |
| `/cart` | `Cart` | Carrinho de compras |
| `/payment` | `Payment` | Tela de pagamento |
| `/order-completed` | `OrderCompleted` | Pedido concluído |
| `/login` | `Login` | Login do usuário |
| `/register` | `Register` | Cadastro de usuário |
| `/profile` | `Profile` | Perfil do usuário |
| `/buy` | `BuyProduct` | Compra de produto |
| `/cadastrar-produto` | `CadastrarProduto` | Cadastro de produto |
| `/admin` | `AdminDashboard` | Área administrativa |
| `*` | `Navigate` | Redireciona para `/` |

---

## Navegação principal

A barra de navegação possui links para:

```txt
Início
Cardápio
Carrinho
Menu do usuário
Admin, caso o usuário seja administrador
```

Exemplo do menu:

```tsx
<nav className="navbar">
  <ul>
    <li><Link to="/">Início</Link></li>
    <li><Link to="/cardapio">Cardápio</Link></li>
    <li><Link to="/cart">Carrinho</Link></li>
    <li><UserMenu /></li>
    <AdminLink />
  </ul>
</nav>
```

---

## Contextos utilizados

O projeto utiliza dois providers principais:

```tsx
<AuthProvider>
  <CartProvider>
    <BrowserRouter>
      ...
    </BrowserRouter>
  </CartProvider>
</AuthProvider>
```

### AuthProvider

Responsável por controlar os dados de autenticação do usuário.

É usado para verificar se existe usuário logado e qual é sua `role`.

### CartProvider

Responsável por controlar os dados do carrinho de compras.

---

## Controle de rotas privadas

A função `PrivateRoute` protege rotas que exigem autenticação.

```tsx
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
```

Funcionamento:

- Se o usuário não estiver logado, ele será redirecionado para `/login`.
- Se a rota for exclusiva para administrador e o usuário não for `admin`, ele será redirecionado para `/`.
- Se o usuário estiver autorizado, o componente é renderizado normalmente.

---

## Rota administrativa

A rota `/admin` é protegida e só pode ser acessada por usuários com papel:

```txt
admin
```

Configuração:

```tsx
<Route path="/admin" element={
  <PrivateRoute adminOnly>
    <AdminDashboard />
  </PrivateRoute>
} />
```

---

## Link administrativo condicional

O link para a área administrativa só aparece se o usuário logado tiver a role `admin`.

```tsx
function AdminLink() {
  const { user } = useAuth();

  if (user && user.role === 'admin') {
    return <li><Link to="/admin">Admin</Link></li>;
  }

  return null;
}
```

---

## Integração com backend

A classe `UsuarioService` possui um método para listar usuários:

```ts
export class UsuarioService {
  listaUsuarios() {
    return api.get('/sistema/usuarios');
  }
}
```

Esse método faz uma requisição GET para:

```txt
GET /sistema/usuarios
```

Considerando a `baseURL` atual, a URL completa será:

```txt
http://localhost:3003/sistema/usuarios
```

---

## Fluxo básico da aplicação

```txt
1. Usuário acessa a página inicial
2. Usuário navega pelo cardápio
3. Usuário adiciona produtos ao carrinho
4. Usuário acessa o carrinho
5. Usuário segue para pagamento
6. Pedido é finalizado
7. Usuário pode acessar perfil
8. Administrador pode acessar dashboard admin
9. Administrador pode cadastrar produtos
```

---

## Observações importantes

- O projeto depende de um backend rodando na URL configurada em `src/services/api.ts`.
- A rota `/admin` depende do usuário autenticado possuir `role` igual a `admin`.
- O menu administrativo só aparece para usuários administradores.
- O controle de autenticação depende da implementação do `AuthContext`.
- O controle do carrinho depende da implementação do `CartContext`.

---

## Melhorias futuras

- Criar arquivo `.env` para armazenar a URL da API.
- Implementar interceptors do Axios para adicionar token JWT automaticamente.
- Proteger também a rota `/cadastrar-produto`.
- Criar loading global para requisições.
- Criar tratamento padronizado de erros.
- Adicionar responsividade mobile.
- Criar testes automatizados.
- Melhorar feedback visual para login, cadastro e pagamento.
- Criar dashboard administrativo com métricas.
- Integrar produtos reais vindos do backend.

---

## Exemplo de configuração com variável de ambiente

Uma melhoria recomendada é usar variável de ambiente para a URL da API.

Exemplo em projeto Vite:

```env
VITE_API_URL=http://localhost:3003
```

Arquivo `api.ts`:

```ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

---

## Autor

Desenvolvido para fins acadêmicos e de estudo.
