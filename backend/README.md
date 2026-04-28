# Backend de Autenticação com JWT, Bcrypt e Sequelize

API backend desenvolvida em **Node.js** com **Express**, utilizando autenticação com **JWT**, criptografia de senha com **Bcrypt** e persistência de usuários em banco de dados com **Sequelize**.

O projeto permite cadastrar usuários, realizar login, gerar token JWT e acessar rotas protegidas conforme o papel do usuário, como `user` ou `admin`.

---

## Tecnologias utilizadas

- Node.js
- Express
- JSON Web Token - JWT
- Bcrypt
- Sequelize
- Banco de dados configurado no arquivo `database.js`

---

## Funcionalidades

- Cadastro de usuário.
- Criptografia de senha antes de salvar no banco.
- Login com validação de usuário e senha.
- Geração de token JWT com expiração de 1 hora.
- Middleware de autenticação via Bearer Token.
- Rota protegida para usuários autenticados.
- Rota exclusiva para administradores.
- Sincronização automática do banco de dados com Sequelize.

---

## Estrutura esperada do projeto

```txt
backend/
│
├── index.js
├── database/
│   └── database.js
├── models/
│   └── usuario.js
├── package.json
└── README.md
```

---

## Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd <nome-do-projeto>
```

### 2. Instale as dependências

```bash
npm install
```

Caso esteja criando o projeto do zero, instale:

```bash
npm install express jsonwebtoken bcrypt sequelize
```

Dependendo do banco utilizado, instale também o driver correspondente.

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

## Configuração do projeto

O arquivo principal da aplicação é o:

```txt
index.js
```

Nele estão as rotas de cadastro, login, autenticação e autorização.

O projeto importa a conexão com o banco a partir de:

```js
import db from './database/database.js';
```

E importa o model de usuário a partir de:

```js
import User from './models/usuario';
```

> Atenção: dependendo da configuração do seu projeto com ES Modules, talvez seja necessário usar a extensão `.js` no import:

```js
import User from './models/usuario.js';
```

---

## Configuração da chave JWT

No código atual, a chave secreta está definida diretamente no arquivo:

```js
const SECRET_KEY = 'ca7d10e9f937ce3ac4f57a7158db675682150f3f';
```

Para ambiente de produção, o ideal é mover essa chave para variáveis de ambiente.

Exemplo com `.env`:

```env
PORT=3000
SECRET_KEY=sua_chave_secreta_aqui
```

E no código:

```js
const SECRET_KEY = process.env.SECRET_KEY;
```

---

## Executando o projeto

Para iniciar o servidor:

```bash
node index.js
```

Se estiver usando `nodemon`:

```bash
npx nodemon index.js
```

O servidor será iniciado em:

```txt
http://localhost:3000
```

---

## Rotas da API

## Cadastro de usuário

Cria um novo usuário no banco de dados.

```http
POST /register
```

### Body JSON

```json
{
  "username": "carlos",
  "password": "123456",
  "role": "user"
}
```

O campo `role` é opcional.  
Se não for informado, o usuário será criado com o papel padrão:

```txt
user
```

### Resposta de sucesso

```json
{
  "message": "User created successfully",
  "userId": 1
}
```

### Possíveis erros

#### Username ou password ausente

```json
{
  "message": "Username and password are required"
}
```

Status HTTP:

```txt
400 Bad Request
```

#### Usuário já existe

```json
{
  "message": "Username already exists"
}
```

Status HTTP:

```txt
409 Conflict
```

---

## Login

Realiza login do usuário e retorna um token JWT.

```http
POST /login
```

### Body JSON

```json
{
  "username": "carlos",
  "password": "123456"
}
```

### Resposta de sucesso

```json
{
  "token": "token_jwt_gerado"
}
```

Status HTTP:

```txt
200 OK
```

### Erro de credenciais inválidas

```json
{
  "message": "Invalid credentials"
}
```

Status HTTP:

```txt
401 Unauthorized
```

---

## Rota protegida

Rota acessível apenas para usuários autenticados.

```http
GET /protected
```

### Header obrigatório

```txt
Authorization: Bearer <token>
```

### Resposta de sucesso

```json
{
  "message": "Hello carlos, you have access to this protected route!",
  "role": "user"
}
```

---

## Rota de administrador

Rota acessível apenas para usuários com papel `admin`.

```http
GET /admin
```

### Header obrigatório

```txt
Authorization: Bearer <token>
```

### Resposta de sucesso

```json
{
  "message": "Hello carlos, you have access to this admin route!",
  "role": "admin"
}
```

### Erro caso o usuário não seja admin

```json
{
  "message": "Access denied"
}
```

Status HTTP:

```txt
403 Forbidden
```

---

## Middleware de autenticação

O middleware `authenticateTOKEN` verifica se a requisição possui um token JWT válido.

O token deve ser enviado no cabeçalho:

```txt
Authorization: Bearer <token>
```

Se o token não for enviado, a API retorna:

```json
{
  "message": "Access token is missing"
}
```

Se o token for inválido ou expirado, a API retorna:

```json
{
  "message": "Invalid token"
}
```

---

## Fluxo de uso

```txt
1. Usuário realiza cadastro em POST /register
2. A senha é criptografada com bcrypt
3. Usuário realiza login em POST /login
4. API valida a senha com bcrypt.compare
5. API gera um token JWT
6. Cliente envia o token nas próximas requisições
7. Middleware valida o token
8. Usuário acessa rotas protegidas conforme sua role
```

---

## Exemplos de teste com curl

### Cadastro de usuário comum

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"carlos\",\"password\":\"123456\"}"
```

### Cadastro de administrador

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

### Acessar rota protegida

```bash
curl http://localhost:3000/protected \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Acessar rota admin

```bash
curl http://localhost:3000/admin \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## Exemplo de model `usuario.js`

Um exemplo básico de model Sequelize para este projeto seria:

```js
import { DataTypes } from 'sequelize';
import db from '../database/database.js';

const User = db.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  }
});

export default User;
```

---

## Exemplo de conexão `database.js`

Exemplo usando SQLite:

```js
import { Sequelize } from 'sequelize';

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

export default db;
```

---

## Observações importantes

- As senhas são criptografadas com `bcrypt.hash`.
- O login compara a senha enviada com a senha criptografada usando `bcrypt.compare`.
- O token JWT expira em 1 hora.
- A rota `/protected` exige apenas autenticação.
- A rota `/admin` exige autenticação e papel `admin`.
- A chave secreta JWT deve ser movida para variável de ambiente em projetos reais.
- O método `db.sync()` cria a tabela automaticamente caso ela ainda não exista.

---

## Melhorias futuras

- Mover `SECRET_KEY` para `.env`.
- Criar validação mais robusta dos campos.
- Separar rotas em arquivos próprios.
- Criar controllers e services.
- Implementar refresh token.
- Criar middleware específico de autorização por role.
- Adicionar Swagger/OpenAPI.
- Criar testes automatizados.
- Adicionar Docker e Docker Compose.
- Criar logs estruturados.
- Implementar rate limit nas rotas de login.

---

## Autor

Desenvolvido para fins acadêmicos e de estudo.
