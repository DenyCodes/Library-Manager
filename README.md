# 📚 Library Manager — Gerenciador de Empréstimos de Livros

Sistema completo de gerenciamento de empréstimos de livros com autenticação, controle de estoque e histórico de empréstimos.

---

## Stack Técnica

| Camada     | Tecnologia                            |
|------------|---------------------------------------|
| Backend    | PHP 8.3 + Laravel 12                  |
| Frontend   | React 18 + TypeScript + Vite          |
| UI         | Material UI (MUI) v6                  |
| HTTP       | SWR + fetch nativo                    |
| Auth       | Laravel Sanctum (token-based)         |
| Database   | MySQL 8.0                             |
| Ambiente   | Docker + Docker Compose               |

---

## Como Iniciar

### Pré-requisitos
- Docker e Docker Compose instalados
- Portas 3000, 8000 e 3306 disponíveis

### Início rápido

```bash
# Clone o repositório
git clone <repositorio>
cd library-manager

# Execute o script de inicialização
chmod +x start.sh
./start.sh
```

Ou manualmente:

```bash
# 1. Copiar o .env do backend
cp backend/.env

# 2. Subir os containers
docker-compose up -d --build

# 3. Aguardar o MySQL iniciar (~15s) e executar:
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed
```

### URLs

| Serviço  | URL                     |
|----------|-------------------------|
| Frontend | http://localhost:3000   |
| API      | http://localhost:8000   |
| MySQL    | localhost:3306          |

---

## Arquitetura do Projeto

```
library-manager/
├── docker-compose.yml
├── start.sh
├── docker/
│   └── nginx/
│       └── default.conf
├── backend/                        # Laravel 12
│   ├── app/
│   │   ├── Actions/
│   │   │   └── CreateLoanAction.php   ← Action Pattern
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── BookController.php
│   │   │   └── LoanController.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Book.php
│   │       └── Loan.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │       └── BookSeeder.php         ← 12 livros de teste
│   └── routes/
│       └── api.php
└── frontend/                       # React + TypeScript
    └── src/
        ├── components/
        │   └── Layout.tsx
        ├── hooks/
        │   └── useAuth.tsx            ← Context de autenticação
        ├── pages/
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── BooksPage.tsx          ← MUI Table obrigatória
        │   └── LoansPage.tsx          ← Meus Empréstimos
        ├── services/
        │   └── api.ts
        └── types/
            └── index.ts
```

---

## Requisitos Implementados

### ✅ Autenticação
- Registro e Login com Laravel Sanctum (token-based)
- Proteção de rotas no frontend via React Router
- Contexto de autenticação com persistência em localStorage

### ✅ Modelagem de Dados
- Tabela `users` — usuários do sistema
- Tabela `books` — acervo com título, autor, ISBN e cópias disponíveis
- Tabela `loans` — empréstimos com relação user/book e `loaned_at`
- **BookSeeder** com 12 livros da literatura brasileira

### ✅ Regras de Negócio
- Listagem de todos os livros com status de disponibilidade
- Solicitação de empréstimo por usuário autenticado
- **Validação**: livro com 0 cópias não pode ser emprestado
- **Integridade**: uso de `DB::transaction` + `lockForUpdate` para evitar race conditions

### ✅ Action Pattern
```php
// app/Actions/CreateLoanAction.php
class CreateLoanAction {
    public function execute(User $user, Book $book): Loan {
        return DB::transaction(function() use ($user, $book) {
            $book = Book::lockForUpdate()->findOrFail($book->id);
            // Validação + decremento + criação do loan
        });
    }
}
```

### ✅ SQL Raw com JOIN (obrigatório)
```php
// app/Http/Controllers/LoanController.php
$loans = DB::select("
    SELECT l.id AS loan_id, l.loaned_at,
           b.id AS book_id, b.title, b.author, b.isbn
    FROM loans l
    INNER JOIN books b ON b.id = l.book_id
    WHERE l.user_id = :userId
    ORDER BY l.loaned_at DESC
", ['userId' => $userId]);
```

### ✅ Frontend
- SPA com React Router (sem recarregar página)
- **MUI Table** obrigatória na listagem de livros
- Interface responsiva com drawer para mobile
- SWR para fetching e revalidação automática
- Feedback visual com Snackbars e estados de loading

---

## API Endpoints

| Método | Rota               | Autenticação | Descrição                     |
|--------|--------------------|--------------|-------------------------------|
| POST   | /api/auth/register | Não          | Registrar novo usuário        |
| POST   | /api/auth/login    | Não          | Login e obter token           |
| POST   | /api/auth/logout   | Sim          | Logout (revoga token)         |
| GET    | /api/auth/me       | Sim          | Dados do usuário logado       |
| GET    | /api/books         | Sim          | Listar todos os livros        |
| POST   | /api/loans/{book}  | Sim          | Solicitar empréstimo          |
| GET    | /api/loans/my      | Sim          | Meus empréstimos (SQL Raw)    |

---

## Comandos Úteis

```bash
# Ver logs
docker-compose logs -f app
docker-compose logs -f frontend

# Resetar banco
docker-compose exec app php artisan migrate:fresh --seed

# Acessar container PHP
docker-compose exec app bash

# Parar tudo
docker-compose down

# Parar e remover volumes (apaga banco)
docker-compose down -v
```
