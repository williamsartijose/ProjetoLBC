-- Usuários de teste para desenvolvimento e testes manuais via X-User-Id

INSERT INTO employees (id, name, email, role, manager_id, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Admin User',
    'admin@lbc.com',
    'ADMIN',
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO employees (id, name, email, role, manager_id, created_at, updated_at)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Manager User',
    'manager@lbc.com',
    'MANAGER',
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO employees (id, name, email, role, manager_id, created_at, updated_at)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    'Collaborator User',
    'collaborator@lbc.com',
    'COLLABORATOR',
    '22222222-2222-2222-2222-222222222222',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
