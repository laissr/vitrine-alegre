import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { listarProdutos, listarCategorias } from '../services/api';
import CardProduto from '../components/CardProduto';
import Filtros from '../components/Filtros';
import Paginacao from '../components/Paginacao';

export default function Vitrine() {
  // Hooks do React Router para rastrear a localização atual da URL e navegar programaticamente
  const location = useLocation();
  const navigate = useNavigate();

  // Estados locais da vitrine para controlar carregamento, listas de dados, paginação e erros
  const [carregando, setCarregando] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [erro, setErro] = useState(null);

  // Extrai os parâmetros de busca, página, categoria e ordenação direto da URL (query parameters)
  const params = new URLSearchParams(location.search);
  const pagina = Number(params.get('pagina')) || 1;
  const busca = params.get('busca') || '';
  const categoria = params.get('categoria') || '';
  const ordenacao = params.get('ordenacao') || '';

  // Função memorizada para atualizar os parâmetros na URL sem perder os filtros existentes
  const atualizarUrl = useCallback((novosFiltros) => {
    const searchParams = new URLSearchParams(location.search);

    Object.entries(novosFiltros).forEach(([chave, valor]) => {
      if (valor) {
        searchParams.set(chave, valor);
      } else {
        searchParams.delete(chave);
      }
    });

    navigate(`/?${searchParams.toString()}`);
  }, [location.search, navigate]);

  // Efeito colateral executado na montagem para carregar a lista de categorias da API
  useEffect(() => {
    async function carregarCats() {
      try {
        const dadosCats = await listarCategorias();
        setCategorias(dadosCats);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
      }
    }
    carregarCats();
  }, []);

  // Efeito colateral principal para buscar os produtos da API sempre que os filtros ou a URL mudarem
  useEffect(() => {
     window.scrollTo(0, 0);
    // AbortController para cancelar requisições pendentes se o usuário trocar de filtro rapidamente
    const controller = new AbortController();

    async function carregar() {
      try {
        setCarregando(true);
        setProdutos([]);
        setErro(null);

        // Faz a chamada assíncrona ao serviço de listagem de produtos com o sinal de cancelamento
        const dados = await listarProdutos({
          pagina,
          busca,
          categoria,
          ordenacao,
          signal: controller.signal,
        });

        setProdutos(dados.produtos || []);
        setTotalPaginas(dados.paginas || 1);
        setTotalProdutos(dados.total || dados.totalProdutos || (dados.produtos ? dados.produtos.length : 0));
      } catch (err) {
        // Ignora erros causados pelo cancelamento proposital da requisição (AbortError)
        if (err.name !== 'AbortError') {
          setErro(err.message || 'Erro ao carregar produtos.');
        }
      } finally {
        // Desativa o estado de carregamento se a requisição não foi abortada
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregar();

    // Função de limpeza para abortar requisições ativas ao desmontar ou atualizar o efeito
    return () => {
      controller.abort();
    };
  }, [pagina, busca, categoria, ordenacao, location.key]);

  return (
    <>
      {/* Faixa superior de filtros contendo as categorias e o seletor de ordenação */}
      <div className="faixa-filtros">
        <div className="container-filtros">
          <Filtros
            categoriaUrl={categoria}
            ordenacaoUrl={ordenacao}
            categorias={categorias}
            aoMudarFiltro={atualizarUrl}
          />
        </div>
      </div>

      <main className="container-principal">
        {/* Renderização Condicional 1: Estado de Carregamento (Exibe cartões esqueletos - skeletons) */}
        {carregando ? (
          <div className="grade-produtos">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="card-produto-skeleton">
                <div className="skeleton-bloco-imagem"></div>
                <div className="skeleton-linha-curta"></div>
                <div className="skeleton-linha-longa"></div>
                <div className="skeleton-linha-media"></div>
                <div className="skeleton-botao"></div>
              </div>
            ))}
          </div>
        ) : erro ? (
          /* Renderização Condicional 2: Tela de Erro de Conexão ou Servidor */
          <div className="busca-vazia-container">
            <div className="busca-vazia-icone-circulo vitrine-erro-icone">
              <span className="vitrine-erro-exclamacao">!</span>
            </div>
            <h3 className="busca-vazia-titulo">Não foi possível carregar os produtos</h3>
            <p className="busca-vazia-texto">Verifique sua conexão e tente de novo.</p>
            <button
              type="button"
              className="btn-limpar-busca vitrine-btn-tentar-novamente"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        ) : produtos.length === 0 ? (
          /* Renderização Condicional 3: Nenhum Produto Encontrado na Busca ou Filtro */
          <div className="busca-vazia-container">
            <div className="busca-vazia-icone-circulo">
              <svg className="icone-lupa-vazia" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="busca-vazia-titulo">Nenhum produto encontrado</h3>
            <p className="busca-vazia-texto">Tente outro termo ou limpe os filtros.</p>
            <button
              type="button"
              className="btn-limpar-busca"
              onClick={() => navigate('/')}
            >
              Limpar busca
            </button>
          </div>
        ) : (
          /* Renderização Padrão: Exibição da contagem, grade de produtos e componentes de paginação */
          <>
            <div className="info-resultado-busca">
              <span className="total-produtos">{totalProdutos} produtos</span>
              <span className="separador-ponto">•</span>
              <span className="pagina-atual">página {pagina} de {totalPaginas}</span>
            </div>

            <div className="grade-produtos">
              {produtos.map((produto) => (
                <CardProduto key={produto.id} produto={produto} />
              ))}
            </div>

            <Paginacao
              paginaAtual={pagina}
              totalPaginas={totalPaginas}
              aoMudarPagina={(novaPagina) => atualizarUrl({ pagina: novaPagina })}
            />
          </>
        )}
      </main>
    </>
  );
}