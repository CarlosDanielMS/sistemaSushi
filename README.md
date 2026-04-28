# Sistema de Sushi

Sistema web para gerenciamento e venda de produtos de um cardápio de sushi, com frontend em **React + TypeScript** e backend em **Node.js + Express**.

O projeto possui autenticação de usuários, controle de perfil, carrinho de compras, fluxo de pagamento, cadastro de produtos e área administrativa protegida para usuários com perfil `admin`.

---

## Visão geral

O sistema foi dividido em duas partes principais:

```txt
sistema-sushi/
│
├── backend/
│   └── API de autenticação, usuários e controle de acesso
│
└── frontend/
    └── Interface web com cardápio, carrinho, login, cadastro e administração
```

---

## Tecnologias utilizadas

### Frontend

- React
- TypeScript
- React Router DOM
- Axios
- Context API
- CSS

### Backend

- Node.js
- Express
- JWT
- Bcrypt
- Sequelize
- Banco de dados configurado via Sequelize

---

## Funcionalidades do sistema

### Usuário comum

- Visualizar página inicial.
- Acessar cardápio.
- Visualizar produtos.
- Adicionar produtos ao carrinho.
- Acessar carrinho.
- Realizar fluxo de pagamento.
- Visualizar pedido concluído.
- Criar conta.
- Fazer login.
- Acessar perfil.

### Administrador

- Acessar dashboard administrativo.
- Visualizar link de administração no menu.
- Acessar rota protegida `/admin`.
- Cadastrar produtos.
- Utilizar permissões baseadas na role `admin`.

### Backend

- Cadastro de usuários.
- Criptografia de senha com Bcrypt.
- Login com validação de credenciais.
- Geração de token JWT.
- Middleware de autenticação.
- Rota protegida para usuários autenticados.
- Rota protegida exclusiva para administradores.
- Sincronização do banco de dados com Sequelize.

---

## Estrutura recomendada do projeto

```txt
sistema-sushi/
│
├── backend/
│   ├── index.js
│   ├── database/
│   │   └── database.js
│   ├── models/
│   │   └── usuario.js
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── UserMenu/
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── buyProduct/
│   │   │   ├── cadastroProduto/
│   │   │   ├── cardapio/
│   │   │   ├── cart/
│   │   │   ├── orderCompleted/
│   │   │   ├── payment/
│   │   │   ├── profile/
│   │   │   └── start/
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── App.css
│   ├── package.json
│   └── README.md
│
└── README.md
```

---

## Como executar o projeto

Para rodar o sistema completo, é necessário iniciar primeiro o backend e depois o frontend.

---

# Backend

## 1. Acessar a pasta do backend

```bash
cd backend
```

## 2. Instalar dependências

```bash
npm install
```

Caso esteja configurando o backend do zero:

```bash
npm install express jsonwebtoken bcrypt sequelize
```

Instale também o driver do banco usado.

### SQLite

```bash
npm install sqlite3
```

### MySQL

```bash
npm install mysql2
```

### PostgreSQL

```bash
npm install pg pg-hstore
```

---

## 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do backend:

```env
PORT=3000
SECRET_KEY=sua_chave_secreta_aqui
```

No código atual, a chave JWT está fixa no arquivo:

```js
const SECRET_KEY = 'ca7d10e9f937ce3ac4f57a7158db675682150f3f';
```

Para projetos reais, recomenda-se mover essa chave para o `.env`.

---

## 4. Executar backend

```bash
node index.js
```

Ou com nodemon:

```bash
npx nodemon index.js
```

O backend será iniciado em:

```txt
http://localhost:3000
```

---

## Rotas principais do backend

### Cadastro de usuário

```http
POST /register
```

Body:

```json
{
  "username": "carlos",
  "password": "123456",
  "role": "user"
}
```

Resposta esperada:

```json
{
  "message": "User created successfully",
  "userId": 1
}
```

---

### Login

```http
POST /login
```

Body:

```json
{
  "username": "carlos",
  "password": "123456"
}
```

Resposta esperada:

```json
{
  "token": "token_jwt_gerado"
}
```

---

### Rota protegida

```http
GET /protected
```

Header:

```txt
Authorization: Bearer <token>
```

---

### Rota administrativa

```http
GET /admin
```

Header:

```txt
Authorization: Bearer <token>
```

Apenas usuários com role `admin` conseguem acessar essa rota.

---

# Frontend

## 1. Acessar a pasta do frontend

```bash
cd frontend
```

## 2. Instalar dependências

```bash
npm install
```

Caso esteja configurando do zero:

```bash
npm install react-router-dom axios
```

---

## 3. Configurar URL da API

O frontend utiliza Axios no arquivo:

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

Se o backend estiver rodando na porta `3000`, altere para:

```ts
export const api = axios.create({
  baseURL: 'http://localhost:3000',
});
```

---

## 4. Executar frontend

```bash
npm run dev
```

ou:

```bash
npm start
```

O frontend geralmente ficará disponível em:

```txt
http://localhost:5173
```

ou:

```txt
http://localhost:3000
```

---

## Rotas do frontend

| Rota | Página | Descrição |
|---|---|---|
| `/` | Start | Página inicial |
| `/cardapio` | Cardapio | Cardápio de produtos |
| `/cart` | Cart | Carrinho de compras |
| `/payment` | Payment | Pagamento |
| `/order-completed` | OrderCompleted | Pedido concluído |
| `/login` | Login | Login do usuário |
| `/register` | Register | Cadastro de usuário |
| `/profile` | Profile | Perfil do usuário |
| `/buy` | BuyProduct | Compra de produto |
| `/cadastrar-produto` | CadastrarProduto | Cadastro de produto |
| `/admin` | AdminDashboard | Área administrativa |
| `*` | Navigate | Redireciona para `/` |

---

## Controle de autenticação no frontend

O sistema utiliza `AuthProvider` para controlar o usuário logado:

```tsx
<AuthProvider>
  <CartProvider>
    <BrowserRouter>
      ...
    </BrowserRouter>
  </CartProvider>
</AuthProvider>
```

A proteção de rotas é feita pela função `PrivateRoute`.

```tsx
function PrivateRoute({ children, adminOnly = false }) {
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

---

## Controle de acesso administrativo

A rota `/admin` só pode ser acessada por usuários com:

```txt
role = admin
```

Configuração:

```tsx
<Route path="/admin" element={
  <PrivateRoute adminOnly>
    <AdminDashboard />
  </PrivateRoute>
} />
```

O link de administração só aparece no menu se o usuário for administrador:

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

## Fluxo de uso do sistema

```txt
1. Usuário acessa a página inicial
2. Usuário visualiza o cardápio
3. Usuário adiciona produtos ao carrinho
4. Usuário acessa o carrinho
5. Usuário segue para pagamento
6. Sistema finaliza o pedido
7. Usuário pode acessar o perfil
8. Administrador pode acessar o dashboard admin
9. Administrador pode cadastrar produtos
```

---

## Fluxo de autenticação

```txt
1. Usuário se cadastra em /register
2. Backend criptografa a senha com bcrypt
3. Usuário faz login em /login
4. Backend valida a senha
5. Backend gera token JWT
6. Frontend armazena/usa os dados do usuário via AuthContext
7. Rotas protegidas verificam se existe usuário autenticado
8. Rotas administrativas verificam se user.role é igual a admin
```

---

## Exemplos de teste do backend

### Criar usuário comum

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"carlos\",\"password\":\"123456\"}"
```

### Criar usuário administrador

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"123456\",\"role\":\"admin\"}"
```

### Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"carlos\",\"password\":\"123456\"}"
```

### Acessar rota admin

```bash
curl http://localhost:3000/admin \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## Variáveis e configurações importantes

### Backend

| Variável | Descrição |
|---|---|
| `PORT` | Porta onde o backend será executado |
| `SECRET_KEY` | Chave usada para assinar tokens JWT |

### Frontend

| Configuração | Descrição |
|---|---|
| `baseURL` | URL base do backend usada pelo Axios |

---

## Segurança

Recomendações importantes:

- Não deixar `SECRET_KEY` fixa no código.
- Utilizar `.env` para informações sensíveis.
- Não versionar arquivos `.env`.
- Criptografar todas as senhas com Bcrypt.
- Validar os campos recebidos no backend.
- Implementar tratamento de erros mais completo.
- Utilizar HTTPS em produção.
- Implementar refresh token, se necessário.
- Proteger rotas administrativas no backend e no frontend.

---

## Melhorias futuras

- Integrar produtos reais com banco de dados.
- Criar CRUD completo de produtos.
- Criar CRUD completo de pedidos.
- Criar painel administrativo com métricas.
- Implementar pagamento real.
- Criar histórico de pedidos do usuário.
- Adicionar upload de imagem dos produtos.
- Criar categorias de produtos.
- Implementar busca e filtros no cardápio.
- Adicionar responsividade mobile.
- Criar interceptors do Axios para enviar token automaticamente.
- Criar documentação Swagger para o backend.
- Criar testes automatizados.
- Adicionar Docker e Docker Compose.
- Implementar deploy do frontend e backend.

---

## Observações

Este sistema é um projeto acadêmico/didático para demonstrar integração entre frontend e backend, autenticação com JWT, controle de rotas, carrinho de compras e área administrativa.

Para uso em produção, é necessário reforçar validações, segurança, persistência dos produtos, controle de pedidos e integração real de pagamento.

---

## Autor

Desenvolvido para fins acadêmicos e de estudo.
