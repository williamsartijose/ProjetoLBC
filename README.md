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
├── backend/          # API Spring Boot (a implementar)
├── frontend/         # SPA React + Vite (a implementar)
└── docs/             # Documentação técnica
    ├── ARCHITECTURE.md
    ├── DATABASE.md
    ├── CLASS_DIAGRAM.md
    ├── FLOWS.md
    └── GIT_STRATEGY.md
```

## Estado atual do projeto

**Fase 1 — concluída:** estrutura inicial do monorepo e documentação técnica.

| Componente   | Status        |
|--------------|---------------|
| Documentação | ✅ Completa   |
| Backend      | ⏳ Pendente   |
| Frontend     | ⏳ Pendente   |
| Docker       | ⏳ Pendente   |

## Fases de implementação

| Fase | Descrição                                              | Status     |
|------|--------------------------------------------------------|------------|
| 1    | Estrutura inicial e documentação                       | ✅ Atual   |
| 2    | Backend: entidades, migrations Flyway, repositories    | ⏳ Próxima |
| 3    | Backend: services, controllers, validações, Swagger    | ⏳         |
| 4    | Frontend: setup React/Vite, integração com API         | ⏳         |
| 5    | Docker e docker-compose (app + PostgreSQL)             | ⏳         |
| 6    | Testes, refinamentos e documentação final              | ⏳         |

## Como será executado (futuro)

Após a implementação completa, o projeto será executado via Docker Compose:

```bash
docker-compose up --build
```

Serviços previstos:

| Serviço    | Porta  | Descrição                    |
|------------|--------|------------------------------|
| backend    | 8080   | API REST Spring Boot         |
| frontend   | 5173   | SPA React (Vite dev server)  |
| postgres   | 5432   | Banco de dados PostgreSQL    |

- **API:** `http://localhost:8080`
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **Frontend:** `http://localhost:5173`

As migrations Flyway serão aplicadas automaticamente na inicialização do backend.

## Documentação adicional

Consulte a pasta `docs/` para detalhes de arquitetura, modelo de dados, diagramas e estratégia Git.
