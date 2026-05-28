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

**Fase 3 (DTOs, erros e autenticação simulada) — concluída:** contratos da API, mappers manuais, `GlobalExceptionHandler` e `CurrentUserService`.

| Componente           | Status                                      |
|----------------------|---------------------------------------------|
| Documentação         | ✅ Completa                                 |
| Backend skeleton     | ✅ Spring Boot + health check               |
| PostgreSQL Docker    | ✅ docker-compose configurado               |
| Entidades JPA        | ✅ Employee, VacationRequest                |
| Flyway               | ✅ Tabelas `employees` e `vacation_requests`|
| Repositories         | ✅ Com query global de overlap              |
| DTOs e mappers       | ✅ Employee e VacationRequest               |
| Tratamento de erros  | ✅ ErrorResponse + GlobalExceptionHandler   |
| Autenticação simulada| ✅ CurrentUserService (X-User-Id)           |
| Controllers CRUD     | ⏳ Próxima fase                             |
| Frontend             | ⏳ Pendente                                 |

## Fases de implementação

| Fase | Descrição                                              | Status     |
|------|--------------------------------------------------------|------------|
| 1    | Documentação + skeleton backend + PostgreSQL Docker    | ✅         |
| 2    | Backend: entidades, migrations Flyway, repositories    | ✅         |
| 3    | Backend: DTOs, mappers, erros e autenticação simulada  | ✅ Atual   |
| 4    | Backend: services, controllers CRUD e regras de negócio| ⏳ Próxima |
| 5    | Frontend: setup React/Vite, integração com API         | ⏳         |
| 6    | Docker completo (backend + frontend + PostgreSQL)      | ⏳         |
| 7    | Testes, refinamentos e documentação final              | ⏳         |

## Autenticação simulada (X-User-Id)

Não há login real nesta fase. O usuário autenticado é identificado pelo header HTTP:

```
X-User-Id: <employee-uuid>
```

O `CurrentUserService` lê esse header em cada requisição que exigir autenticação (controllers CRUD na próxima fase), busca o `Employee` correspondente e disponibiliza role e identidade para autorização.

| Cenário                         | HTTP Status | Exemplo de mensagem                    |
|---------------------------------|-------------|----------------------------------------|
| Header ausente                  | 400         | X-User-Id header is required           |
| UUID inválido                   | 400         | X-User-Id header must be a valid UUID  |
| Colaborador inexistente         | 404         | Employee not found                     |

O endpoint `GET /api/health` **não exige** o header — serve apenas para verificar se a aplicação está no ar.

Exemplo (quando os endpoints CRUD existirem):

```bash
curl -H "X-User-Id: <employee-uuid>" http://localhost:8080/api/employees
```

## Padrão de erros da API

Erros são retornados em JSON padronizado via `GlobalExceptionHandler`:

```json
{
  "timestamp": "2026-05-28T12:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Employee not found",
  "path": "/api/employees/00000000-0000-0000-0000-000000000000"
}
```

| HTTP Status | Quando ocorre                                      | Exceções principais              |
|-------------|----------------------------------------------------|----------------------------------|
| 400         | Validação, regra de negócio, body inválido         | `ValidationException`, `BusinessException`, Bean Validation |
| 403         | Usuário autenticado sem permissão                  | `ForbiddenException`             |
| 404         | Recurso não encontrado                             | `ResourceNotFoundException`      |
| 409         | Conflito (ex.: overlap de férias)                  | `OverlapConflictException`       |

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

| Recurso     | URL                                      |
|-------------|------------------------------------------|
| Health check| http://localhost:8080/api/health         |
| Swagger UI  | http://localhost:8080/swagger-ui.html    |
| OpenAPI JSON| http://localhost:8080/v3/api-docs        |

Resposta esperada do health check:

```json
{
  "status": "UP",
  "application": "Vacation Management System"
}
```

### 4. Executar testes

```bash
cd backend
mvn test
```

Inclui `contextLoads` e teste de overlap global no `VacationRequestRepository` (H2 em memória).

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
