-- ProjetoLBC — Sistema de Gestão de Férias
-- Migration inicial: schema de domínio

CREATE TABLE employees (
    id          UUID PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL,
    manager_id  UUID,
    created_at  TIMESTAMPTZ  NOT NULL,
    updated_at  TIMESTAMPTZ  NOT NULL,
    CONSTRAINT uk_employees_email UNIQUE (email),
    CONSTRAINT fk_employees_manager FOREIGN KEY (manager_id) REFERENCES employees (id)
);

CREATE INDEX idx_employees_manager_id ON employees (manager_id);

CREATE TABLE vacation_requests (
    id                UUID PRIMARY KEY,
    employee_id       UUID        NOT NULL,
    start_date        DATE        NOT NULL,
    end_date          DATE        NOT NULL,
    status            VARCHAR(20) NOT NULL,
    reason            TEXT        NOT NULL,
    rejection_reason  TEXT,
    created_at        TIMESTAMPTZ NOT NULL,
    updated_at        TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_vacation_requests_employee FOREIGN KEY (employee_id) REFERENCES employees (id),
    CONSTRAINT chk_vacation_requests_dates CHECK (start_date <= end_date)
);

CREATE INDEX idx_vacation_requests_status_dates ON vacation_requests (status, start_date, end_date);
CREATE INDEX idx_vacation_requests_employee_id ON vacation_requests (employee_id);
