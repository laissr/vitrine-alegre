import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Rodape from './components/Rodape';
import Vitrine from './pages/Vitrine';
import DetalheProduto from './pages/DetalheProduto';
import Carrinho from './pages/Carrinho';
import Login from './pages/Login'; 
import MeusPedidos from './pages/MeusPedidos';
import MinhaConta from './pages/MinhaConta';
import NotFound from './pages/NotFound';
import { CarrinhoProvider } from './context/CarrinhoContext';

export default function App() {
  return (
    <CarrinhoProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Header />
          
          <div className="conteudo-principal">
            <Routes>
              <Route path="/" element={<Vitrine />} />
              <Route path="/produto/:id" element={<DetalheProduto />} />
              <Route path="/carrinho" element={<Carrinho />} />
              <Route path="/entrar" element={<Login />} />
              
              {/* Nova rota cadastrada para o histórico de compras */}
              <Route path="/meus-pedidos" element={<MeusPedidos />} />

              <Route path="/minha-conta" element={<MinhaConta />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          <Rodape />
        </div>
      </BrowserRouter>
    </CarrinhoProvider>
  );
}