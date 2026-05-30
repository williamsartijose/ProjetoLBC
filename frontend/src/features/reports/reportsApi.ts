/**
 * Os relatórios são construídos a partir dos endpoints já existentes, sem novos
 * contratos de API. Reexportamos as funções de acesso a dados para manter uma
 * única fonte de verdade e respeitar o scoping por role feito no backend
 * através do header `X-User-Id`.
 */
export { fetchVacationRequests } from '../vacationRequests/vacationRequestsApi';
export { fetchEmployees } from '../employees/employeesApi';
