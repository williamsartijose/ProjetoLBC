import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import PainelPage from '../pages/PainelPage';
import ColaboradoresPage from '../pages/ColaboradoresPage';
import PedidosFeriasPage from '../pages/PedidosFeriasPage';
import RelatoriosPage from '../pages/RelatoriosPage';
import ConfiguracoesPage from '../pages/ConfiguracoesPage';
import NaoEncontradaPage from '../pages/NaoEncontradaPage';
import { ROUTES } from './paths';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.painel} element={<PainelPage />} />
        <Route path={ROUTES.colaboradores} element={<ColaboradoresPage />} />
        <Route path={ROUTES.pedidosFerias} element={<PedidosFeriasPage />} />
        <Route path={ROUTES.relatorios} element={<RelatoriosPage />} />
        <Route path={ROUTES.configuracoes} element={<ConfiguracoesPage />} />
        <Route path="*" element={<NaoEncontradaPage />} />
      </Route>
    </Routes>
  );
}
