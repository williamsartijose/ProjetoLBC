# ProjetoLBC — Sistema de Gestão de Férias

Sistema full-stack para gerenciamento de colaboradores e pedidos de férias, desenvolvido como teste técnico. A aplicação garante que não haja sobreposição de férias entre colaboradores em dias em que existam pedidos ativos (PENDING ou APPROVED).

## Tecnologias utilizadas

| Camada        | Tecnologia                          |
|---------------|-------------------------------------|
| Backend       | Java 21, Spring Boot                |
| Frontend      | React, Vite                         |
| Banco de dados| PostgreSQL                          |
| API           | REST                                |
| Documentação  | Swagger / OpenAPI                   |
| Infraestrutura| Docker, docker-compose              |
| Migrations    | Flyway                              |

## Regras de negócio resumidas

### Roles

| Role          | Permissões principais                                                                 |
|---------------|---------------------------------------------------------------------------------------|
| ADMIN         | CRUD de colaboradores; gerenciar todas as férias; criar pedido para qualquer colaborador |
| MANAGER       | Aprovar/rejeitar férias dos colaboradores diretos; criar pedido apenas para si mesmo  |
| COLLABORATOR  | Criar e gerenciar apenas seus próprios pedidos de férias                              |

### Autenticação (fase atual)

Não há login real. O usuário logado é simulado via header HTTP:

```
X-User-Id: <employee-uuid>
```

No futuro, o frontend terá um dropdown para seleção do usuário ativo.

### Pedidos de férias

- **Status:** PENDING, APPROVED, REJECTED, CANCELLED
- **Datas:** inclusivas (início e fim contam como dias de férias)
- **Sobreposição global:** não pode existir outro pedido em PENDING ou APPROVED com datas sobrepostas, independentemente do colaborador
- REJECTED e CANCELLED não bloqueiam o calendário
- Pedidos APPROVED podem ser cancelados

## Estrutura do repositório

```
ProjetoLBC/
├── .gitignore
├── README.md
├── docker-compose.yml
├── backend/          # API Spring Boot
├── frontend/         # SPA React + Vite (a implementar)
└── docs/             # Documentação técnica
    ├── ARCHITECTURE.md
    ├── DATABASE.md
    ├── CLASS_DIAGRAM.md
    ├── FLOWS.md
    └── GIT_STRATEGY.md
```

## Estado atual do projeto

**Fase 4 (services, controllers e regras de negócio) — concluída:** API REST completa para colaboradores e pedidos de férias.

| Componente           | Status                                      |
|----------------------|---------------------------------------------|
| Documentação         | ✅ Completa                                 |
| Backend API REST     | ✅ Employees + Vacation Requests            |
| Regras de negócio    | ✅ Roles, overlap global, status            |
| Autenticação simulada| ✅ X-User-Id via CurrentUserService         |
| Tratamento de erros  | ✅ 400, 403, 404, 409                       |
| Frontend             | ⏳ Próxima fase                             |

## Fases de implementação

| Fase | Descrição                                              | Status     |
|------|--------------------------------------------------------|------------|
| 1    | Documentação + skeleton backend + PostgreSQL Docker    | ✅         |
| 2    | Backend: entidades, migrations Flyway, repositories    | ✅         |
| 3    | Backend: DTOs, mappers, erros e autenticação simulada  | ✅         |
| 4    | Backend: services, controllers CRUD e regras de negócio| ✅ Atual   |
| 5    | Frontend: setup React/Vite, integração com API         | ⏳ Próxima |
| 6    | Docker completo (backend + frontend + PostgreSQL)      | ⏳         |
| 7    | Testes, refinamentos e documentação final              | ⏳         |

## Autenticação simulada (X-User-Id)

Não há login real. O usuário autenticado é identificado pelo header HTTP:

```
X-User-Id: <employee-uuid>
```

Todos os endpoints abaixo **exigem** esse header, exceto `GET /api/health`.

O `CurrentUserService` busca o `Employee` correspondente e os services aplicam autorização por role.

| Cenário                         | HTTP Status | Exemplo de mensagem                    |
|---------------------------------|-------------|----------------------------------------|
| Header ausente                  | 400         | X-User-Id header is required           |
| UUID inválido                   | 400         | X-User-Id header must be a valid UUID  |
| Colaborador inexistente         | 404         | Employee not found                     |
| Sem permissão para a operação   | 403         | Access denied                          |

## Endpoints da API

### Health (público)

| Método | Endpoint        | Descrição              |
|--------|-----------------|------------------------|
| GET    | `/api/health`   | Status da aplicação    |

### Employees

| Método | Endpoint               | Descrição                    | Permissão de escrita |
|--------|------------------------|------------------------------|----------------------|
| POST   | `/api/employees`       | Criar colaborador            | ADMIN                |
| GET    | `/api/employees`       | Listar colaboradores         | Autenticado          |
| GET    | `/api/employees/{id}`  | Detalhes do colaborador      | Autenticado          |
| PUT    | `/api/employees/{id}`  | Atualizar colaborador        | ADMIN                |
| DELETE | `/api/employees/{id}`  | Remover colaborador          | ADMIN                |

### Vacation Requests

| Método | Endpoint                                  | Descrição                    |
|--------|-------------------------------------------|------------------------------|
| POST   | `/api/vacation-requests`                  | Criar pedido de férias       |
| GET    | `/api/vacation-requests`                  | Listar pedidos (escopo por role) |
| GET    | `/api/vacation-requests/{id}`             | Detalhes do pedido           |
| PUT    | `/api/vacation-requests/{id}`             | Editar pedido (somente PENDING) |
| POST   | `/api/vacation-requests/{id}/approve`     | Aprovar pedido               |
| POST   | `/api/vacation-requests/{id}/reject`      | Rejeitar pedido              |
| POST   | `/api/vacation-requests/{id}/cancel`      | Cancelar pedido              |

**Escopo de listagem de pedidos:**

| Role         | Vê                                                          |
|--------------|-------------------------------------------------------------|
| ADMIN        | Todos os pedidos                                            |
| MANAGER      | Próprios pedidos + pedidos dos colaboradores diretos        |
| COLLABORATOR | Apenas os próprios pedidos                                  |

## Padrão de erros da API

Erros são retornados em JSON padronizado via `GlobalExceptionHandler`:

```json
{
  "timestamp": "2026-05-28T12:00:00Z",
  "status": 409,
  "error": "Conflict",
  "message": "Vacation period overlaps with an existing request",
  "path": "/api/vacation-requests"
}
```

| HTTP Status | Quando ocorre                                      | Exemplos                                              |
|-------------|----------------------------------------------------|-------------------------------------------------------|
| 400         | Validação, regra de negócio, body inválido         | Email duplicado, datas inválidas, status inválido     |
| 403         | Usuário autenticado sem permissão                  | COLLABORATOR tentando criar employee ou aprovar       |
| 404         | Recurso não encontrado                             | Employee ou vacation request inexistente              |
| 409         | Conflito de overlap global                         | Pedido com datas sobrepostas a PENDING/APPROVED       |

## Exemplos curl

Substitua `<admin-uuid>`, `<manager-uuid>` e `<collaborator-uuid>` pelos IDs reais do banco.

### Criar colaborador (ADMIN)

```bash
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -H "X-User-Id: <admin-uuid>" \
  -d "{\"name\":\"Alice\",\"email\":\"alice@lbc.com\",\"role\":\"COLLABORATOR\",\"managerId\":\"<manager-uuid>\"}"
```

### Criar pedido de férias (COLLABORATOR — para si mesmo)

```bash
curl -X POST http://localhost:8080/api/vacation-requests \
  -H "Content-Type: application/json" \
  -H "X-User-Id: <collaborator-uuid>" \
  -d "{\"startDate\":\"2026-06-01\",\"endDate\":\"2026-06-10\",\"reason\":\"Annual leave\"}"
```

### Criar pedido para outro colaborador (ADMIN)

```bash
curl -X POST http://localhost:8080/api/vacation-requests \
  -H "Content-Type: application/json" \
  -H "X-User-Id: <admin-uuid>" \
  -d "{\"employeeId\":\"<collaborator-uuid>\",\"startDate\":\"2026-07-01\",\"endDate\":\"2026-07-05\",\"reason\":\"Vacation\"}"
```

### Aprovar pedido (MANAGER do colaborador)

```bash
curl -X POST http://localhost:8080/api/vacation-requests/<request-uuid>/approve \
  -H "X-User-Id: <manager-uuid>"
```

### Rejeitar pedido

```bash
curl -X POST http://localhost:8080/api/vacation-requests/<request-uuid>/reject \
  -H "Content-Type: application/json" \
  -H "X-User-Id: <manager-uuid>" \
  -d "{\"rejectionReason\":\"Team coverage required\"}"
```

### Cancelar pedido aprovado

```bash
curl -X POST http://localhost:8080/api/vacation-requests/<request-uuid>/cancel \
  -H "X-User-Id: <collaborator-uuid>"
```

### Listar pedidos visíveis para o usuário logado

```bash
curl http://localhost:8080/api/vacation-requests \
  -H "X-User-Id: <manager-uuid>"
```

## Como executar localmente

### Pré-requisitos

- Java 21
- Maven 3.9+
- Docker e Docker Compose

### 1. Subir o PostgreSQL

Na raiz do projeto:

```bash
docker compose up -d
```

Verificar se o container está saudável:

```bash
docker compose ps
```

Conexão para o DBeaver:

| Campo    | Valor          |
|----------|----------------|
| Host     | localhost      |
| Port     | 5432           |
| Database | vacation_db    |
| User     | vacation_user  |
| Password | vacation_pass  |

### 2. Rodar o backend

> **Importante:** se você já executou a Fase 1 com a migration antiga (`SELECT 1`), recrie o banco antes de subir o backend:
>
> ```bash
> docker compose down -v
> docker compose up -d
> ```
>
> Isso evita conflito de checksum do Flyway na `V1__init.sql`.

```bash
cd backend
mvn spring-boot:run
```

Na primeira execução após a Fase 2, o Flyway criará as tabelas:

| Tabela             | Descrição                          |
|--------------------|------------------------------------|
| `employees`        | Colaboradores e hierarquia (manager) |
| `vacation_requests`| Pedidos de férias                  |

### Verificar tabelas no DBeaver

1. Conecte ao banco `vacation_db` (credenciais na seção acima).
2. Expanda **Schemas → public → Tables**.
3. Confirme a presença de `employees` e `vacation_requests`.
4. Opcional — inspecionar estrutura:
   - `employees`: colunas `id`, `name`, `email`, `role`, `manager_id`, `created_at`, `updated_at`
   - `vacation_requests`: colunas `id`, `employee_id`, `start_date`, `end_date`, `status`, `reason`, `rejection_reason`, `created_at`, `updated_at`
5. Verificar índices em **Indexes**:
   - `idx_employees_manager_id`
   - `idx_vacation_requests_status_dates`
   - `idx_vacation_requests_employee_id`

Para parar o PostgreSQL:

```bash
docker compose down
```

Para remover também o volume de dados:

```bash
docker compose down -v
```

### 3. Endpoints disponíveis

| Recurso          | URL                                      |
|------------------|------------------------------------------|
| Health check     | http://localhost:8080/api/health         |
| Employees        | http://localhost:8080/api/employees      |
| Vacation Requests| http://localhost:8080/api/vacation-requests |
| Swagger UI       | http://localhost:8080/swagger-ui.html    |
| OpenAPI JSON     | http://localhost:8080/v3/api-docs        |

Resposta esperada do health check:

```json
{
  "status": "UP",
  "application": "Vacation Management System"
}
```

> Endpoints CRUD exigem o header `X-User-Id`. Veja exemplos curl na seção [Exemplos curl](#exemplos-curl).

### 4. Executar testes

```bash
cd backend
mvn test
```

Inclui testes de integração das regras de negócio (roles, overlap, aprovação, cancelamento).

### Profile Docker (futuro)

Quando o backend rodar dentro do Docker Compose, use o profile `docker`:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=docker
```

O profile `docker` aponta o datasource para o hostname `postgres` (rede interna do Compose).

## Como será executado (futuro)

Após a implementação completa, o projeto será executado via Docker Compose com todos os serviços:

```bash
docker compose up --build
```

Serviços previstos:

| Serviço    | Porta  | Descrição                    |
|------------|--------|------------------------------|
| backend    | 8080   | API REST Spring Boot         |
| frontend   | 5173   | SPA React (Vite dev server)  |
| postgres   | 5432   | Banco de dados PostgreSQL    |

As migrations Flyway são aplicadas automaticamente na inicialização do backend.

## Documentação adicional

Consulte a pasta `docs/` para detalhes de arquitetura, modelo de dados, diagramas e estratégia Git.
