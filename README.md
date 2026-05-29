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

---

# UML Architecture & System Design

Antes de iniciar a implementação do backend, foi conduzido um processo formal de modelagem UML utilizando **Astah UML**, com o objetivo de transformar o enunciado do teste técnico da LBC em uma arquitetura orientada a domínio antes da escrita de qualquer linha de código.

Essa etapa de design garantiu que as entidades, relacionamentos e regras de negócio estivessem claramente definidos e validados previamente, reduzindo retrabalho e orientando uma separação de responsabilidades consistente entre as camadas da aplicação.

O modelo UML foi utilizado para:

- **Modelar antes de codificar** — o diagrama foi criado antes da implementação, servindo como contrato visual da solução.
- **Identificar as entidades principais** — `Employee` e `VacationRequest`, com seus atributos e enums.
- **Validar as regras de negócio** — unicidade de e-mail, hierarquia de manager, validação de datas inclusivas e regra global de sobreposição (overlap).
- **Definir responsabilidades entre camadas** — Controller, Service, Repository, Mapper e Domain, evitando vazamento de lógica entre camadas.
- **Documentar o sistema profissionalmente** — produzindo artefatos de arquitetura reutilizáveis para onboarding e revisão técnica.

## Domain Model

O núcleo do sistema é composto por duas entidades de domínio principais.

### Employee

Representa um colaborador do sistema.

**Atributos:**

| Atributo    | Descrição                                  |
|-------------|--------------------------------------------|
| `id`        | Identificador único (UUID)                 |
| `name`      | Nome do colaborador                        |
| `email`     | E-mail corporativo                         |
| `role`      | Papel do colaborador no sistema            |
| `manager`   | Manager direto (também um `Employee`)      |
| `createdAt` | Data de criação                            |
| `updatedAt` | Data da última atualização                 |

**Regras:**

- O e-mail deve ser único.
- Um colaborador pode possuir um manager.
- O manager também é um `Employee` (auto-relacionamento).

**Roles:**

- `ADMIN`
- `MANAGER`
- `COLLABORATOR`

### VacationRequest

Representa um pedido de férias.

**Atributos:**

| Atributo          | Descrição                                  |
|-------------------|--------------------------------------------|
| `id`              | Identificador único (UUID)                 |
| `employee`        | Colaborador solicitante                    |
| `startDate`       | Data de início (inclusiva)                 |
| `endDate`         | Data de fim (inclusiva)                    |
| `status`          | Situação atual do pedido                   |
| `reason`          | Justificativa do pedido                    |
| `rejectionReason` | Motivo da rejeição (quando aplicável)      |
| `createdAt`       | Data de criação                            |
| `updatedAt`       | Data da última atualização                 |

**Status:**

- `PENDING`
- `APPROVED`
- `REJECTED`
- `CANCELLED`

**Regras:**

- Deve possuir um colaborador associado.
- A data inicial deve ser menor ou igual à data final (`startDate <= endDate`).
- Não permite sobreposição com pedidos ativos (`PENDING` ou `APPROVED`).
- Pode ser aprovado.
- Pode ser rejeitado.
- Pode ser cancelado.

## Main Relationship

### Employee (1) — (\*) VacationRequest

```
Employee (1) -------- (*) VacationRequest
```

- Um colaborador pode possuir vários pedidos de férias.
- Um pedido de férias pertence a apenas um colaborador.

### Employee como Manager (1) — (\*) Employee

```
Employee (Manager) (1) -------- (*) Employee
```

- Um manager pode gerir vários colaboradores.
- Um colaborador possui apenas um manager.

## Architecture Layers

A aplicação adota uma arquitetura em camadas com responsabilidades bem definidas.

### Controller Layer

Responsável por:

- Receber requisições HTTP.
- Validar a entrada.
- Delegar o processamento para os Services.
- Retornar respostas REST.

**Classes:**

- `EmployeeController`
- `VacationRequestController`

### Service Layer

Responsável por:

- Regras de negócio.
- Validações.
- Controle de permissões.
- Aprovação/rejeição de férias.
- Verificação de conflitos (overlap global).

**Classes:**

- `EmployeeService`
- `VacationRequestService`
- `CurrentUserService`

### Repository Layer

Responsável por:

- Persistência.
- Consultas.
- Acesso ao banco de dados.

**Classes:**

- `EmployeeRepository`
- `VacationRequestRepository`

### Mapper Layer

Responsável por:

- Conversão Entity ⇄ DTO.

**Classes:**

- `EmployeeMapper`
- `VacationRequestMapper`

## UML Diagrams

Os diagramas a seguir foram gerados no **Astah UML** e representam fielmente a arquitetura implementada no backend.

### 1. Complete Backend Architecture

![Complete Backend Architecture](docs/uml/complete-backend-architecture.png)

Visão geral da arquitetura do sistema, evidenciando a colaboração entre as camadas. O `EmployeeController` delega ao `EmployeeService`, que coordena `EmployeeRepository`, `EmployeeMapper` e `CurrentUserService` para aplicar regras de negócio e autorização. Os mappers (`EmployeeMapper` e `VacationRequestMapper`) isolam a conversão entre entidades de domínio e DTOs, enquanto o `CurrentUserService` centraliza a resolução do usuário autenticado via header `X-User-Id`. O diagrama consolida Controllers, Services, Repositories, Mappers, Domain Model, Enums e seus relacionamentos em uma única visão.

### 2. Employee Module

![Employee Module](docs/uml/employee-module.png)

Módulo responsável pela gestão de colaboradores e pela hierarquia de managers. As classes envolvidas são:

- **`EmployeeController`** — expõe os endpoints REST de colaboradores (`POST`, `GET`, `PUT`, `DELETE`).
- **`EmployeeService`** — concentra as regras administrativas: restrição de escrita a `ADMIN` (`requireAdmin`), unicidade de e-mail (`validateEmailUnique`), resolução e validação de manager (`resolveManager`) e bloqueio de remoção quando há pedidos associados.
- **`EmployeeRepository`** — interface `JpaRepository<Employee, UUID>` com consultas por e-mail e por manager.
- **`EmployeeMapper`** — converte `Employee` em `EmployeeResponse`/`EmployeeSummaryResponse` e aplica os dados dos DTOs de entrada.
- **`CurrentUserService`** — fornece o colaborador autenticado e sua `Role` para as decisões de permissão.

### 3. Vacation Request Module

![Vacation Request Module](docs/uml/vacation-request-module.png)

Módulo responsável pelo ciclo de vida dos pedidos de férias. As classes envolvidas são:

- **`VacationRequestController`** — expõe os endpoints de criação, listagem, edição e as transições de status (`approve`, `reject`, `cancel`).
- **`VacationRequestService`** — implementa as regras de negócio: criação conforme a role, validação de datas inclusivas, aprovação/rejeição por `ADMIN` ou pelo manager direto, cancelamento de pedidos `PENDING` ou `APPROVED` e a verificação de sobreposição global.
- **`VacationRequestRepository`** — interface `JpaRepository<VacationRequest, UUID>` cuja query `existsOverlapping` / `existsActiveOverlap` valida a regra principal do sistema: **não permitir férias sobrepostas em pedidos com status `PENDING` ou `APPROVED`**.
- **`VacationRequestMapper`** — converte entre `VacationRequest` e os DTOs correspondentes.

### 4. Domain Model

![Domain Model](docs/uml/domain-model.png)

Modelo de domínio do sistema, com as entidades, enums e relacionamentos:

- **`Employee`** — colaborador do sistema (e-mail único, possível manager que também é um `Employee`).
- **`VacationRequest`** — pedido de férias vinculado a um colaborador, com datas inclusivas e proteção contra sobreposição.
- **`Role`** — enum com `ADMIN`, `MANAGER` e `COLLABORATOR`.
- **`VacationStatus`** — enum com `PENDING`, `APPROVED`, `REJECTED` e `CANCELLED`.

**Relacionamentos:** `Employee (1) — (*) VacationRequest` (um colaborador possui vários pedidos; cada pedido pertence a um único colaborador) e o auto-relacionamento `Employee (Manager) (1) — (*) Employee` (um manager gere vários colaboradores; cada colaborador possui no máximo um manager).

## Astah UML Source File

O diagrama UML completo encontra-se disponível para consulta:

[Astah UML — Complete Diagram (Google Drive)](https://drive.google.com/file/d/1pKdnrIwN7XbSfTA4OpBkPPr-CldUPdyD/view?usp=sharing)

> The UML diagrams were created before implementation as part of the software architecture and domain modeling process.

---

## UX/UI Design

Antes de iniciar a implementação do frontend, foi conduzida uma etapa de **UX/UI Design** no **Figma**, com a criação de um protótipo interativo e de um arquivo de design que serve como referência visual para a construção das telas.

Essa fase teve como objetivo definir o **design system** (cores, tipografia, componentes e espaçamentos), validar os fluxos de navegação e alinhar a experiência do utilizador antes da escrita do código, garantindo consistência visual e reduzindo retrabalho durante o desenvolvimento.

### Interactive Prototype

Protótipo navegável que simula a experiência final da aplicação:

[https://upper-pure-41012202.figma.site/](https://upper-pure-41012202.figma.site/)

### Figma Design File

Arquivo de design com telas, componentes e especificações visuais:

[https://www.figma.com/design/MziEDJuxHJBGJm0fzJ6BpF/Untitled?node-id=1-1432&t=WiT40MWARHQSK7vi-1](https://www.figma.com/design/MziEDJuxHJBGJm0fzJ6BpF/Untitled?node-id=1-1432&t=WiT40MWARHQSK7vi-1)

O frontend será implementado em **React + Vite** seguindo fielmente este design system, com a interface em **Português de Portugal**. O protótipo e o arquivo de design orientam a estrutura de componentes, a hierarquia visual e os padrões de interação adotados nas telas de gestão de colaboradores e de pedidos de férias.
