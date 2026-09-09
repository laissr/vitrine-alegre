import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { buscarProduto } from '../services/api';
import { useCarrinho } from '../context/CarrinhoContext';
import CardProduto from '../components/CardProduto'; // Importação do card para renderizar os relacionados

export default function DetalheProduto() {
  // Extrai o ID do produto da URL usando useParams
  const { id } = useParams();
  const navigate = useNavigate();
  // Obtém a função global de adicionar itens ao carrinho
  const { adicionarAoCarrinho } = useCarrinho();

  // Estados locais para gerenciar dados do produto, imagem selecionada, quantidade, carregamento, erros e relacionados
  const [produto, setProduto] = useState(null);
  const [imagemSelecionada, setImagemSelecionada] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [produtosRelacionados, setProdutosRelacionados] = useState([]);

  // Efeito colateral para buscar os detalhes do produto e os relacionados na API sempre que o ID mudar
  useEffect(() => {
    // Comando que joga a página direto para o topo ao abrir o produto
    window.scrollTo(0, 0);
    
    // AbortController para cancelar requisições pendentes se o usuário sair da página abruptamente
    const controller = new AbortController();

    async function carregarDetalhes() {
      try {
        setCarregando(true);
        setErro(null);
        setProduto(null);
        setProdutosRelacionados([]);

        // Faz a requisição assíncrona passando o sinal de controle
        const dados = await buscarProduto(id, { signal: controller.signal });
        
        if (!dados || Object.keys(dados).length === 0) {
          setErro('O produto que você está procurando não existe ou foi removido.');
        } else {
          setProduto(dados);
          setQuantidade(1);

          // Define a imagem inicial exibida (prioriza a galeria de imagens ou a miniatura)
          if (dados?.images?.length > 0) {
            setImagemSelecionada(dados.images[0]);
          } else if (dados?.thumbnail) {
            setImagemSelecionada(dados.thumbnail);
          }

          // Busca produtos relacionados baseados na mesma categoria
          if (dados?.category) {
            fetch(`https://dummyjson.com/products/category/${dados.category}`, { signal: controller.signal })
              .then((res) => res.json())
              .then((dadosCategoria) => {
                if (dadosCategoria && dadosCategoria.products) {
                  // Filtra para remover o produto atual e pega apenas os 4 primeiros
                  const filtrados = dadosCategoria.products.filter(
                    (p) => p.id !== Number(id)
                  );
                  setProdutosRelacionados(filtrados.slice(0, 4));
                }
              })
              .catch((err) => {
                if (err.name !== 'AbortError') {
                  console.error('Erro ao buscar produtos relacionados:', err);
                }
              });
          }
        }
      } catch (err) {
        // Ignora erros gerados pelo cancelamento proposital da requisição (AbortError)
        if (err.name !== 'AbortError') {
          setErro('O produto que você está procurando não existe ou foi removido.');
        }
      } finally {
        // Garante que o estado de carregamento só será desativado se a requisição não foi abortada
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarDetalhes();

    // Função de limpeza do useEffect para abortar requisições ativas ao desmontar o componente
    return () => controller.abort();
  }, [id]);

  // Manipulador para adicionar o produto atual com a quantidade selecionada ao carrinho
  const handleAdicionar = () => {
    if (produto) {
      adicionarAoCarrinho(produto, quantidade);
    }
  };

  // Renderização condicional: Exibe estado de carregamento limpo enquanto os dados são buscados
  if (carregando) {
    return (
      <main className="container-principal">
        <div className="estado-container detalhe-estado-carregando">
          <p className="detalhe-texto-carregando">Carregando produto...</p>
        </div>
      </main>
    );
  }

  // Renderização condicional: Exibe tela de erro amigável se o produto não for encontrado ou falhar
  if ((erro || !produto) && !carregando) {
    return (
      <main className="container-principal">
        <div className="busca-vazia-container">
          <div className="busca-vazia-icone-circulo">
            <svg className="icone-lupa-vazia" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="busca-vazia-titulo">Produto não encontrado</h3>
          <p className="busca-vazia-texto">{erro || 'O produto que você está procurando não existe ou foi removido.'}</p>
          <button
            type="button"
            className="btn-limpar-busca"
            onClick={() => navigate('/')}
          >
            Voltar para a vitrine
          </button>
        </div>
      </main>
    );
  }

  // Cálculos derivados para preços antigos simulados, valor economizado e parcelamento em 12x
  const precoOriginal = produto ? produto.price * 1.15 : 0;
  const valorDescontoReais = produto ? precoOriginal - produto.price : 0;
  const precoParcela = produto ? (produto.price / 12).toFixed(2).replace('.', ',') : '0,00';

  if (!produto) {
    return null;
  }

  return (
    <main className="container-principal">
      {/* Barra de navegação breadcrumb indicando a rota atual */}
      <nav className="breadcrumb">
        <Link to="/">Início</Link>
        <span>›</span>
        <Link to={`/?categoria=${produto.category}`}>
          {produto.category}
        </Link>
        <span>›</span>
        <span className="breadcrumb-ativo">{produto.title}</span>
      </nav>

      {/* Cartão principal dividindo a galeria de imagens e as informações detalhadas */}
      <div className="detalhe-produto-card">
        <div className="detalhe-produto-grid">
          {/* Coluna da Esquerda: Galeria e Miniaturas de Imagem */}
          <div className="galeria-container">
            <div className="imagem-principal-box">
              {(imagemSelecionada || produto.thumbnail) ? (
                <img
                  src={imagemSelecionada || produto.thumbnail}
                  alt={produto.title}
                  className="imagem-principal"
                />
              ) : (
                <div className="detalhe-aviso-imagem">Carregando imagem...</div>
              )}
            </div>

            {/* Renderiza a lista de miniaturas caso o produto possua mais de uma foto */}
            {produto.images && produto.images.length > 1 && (
              <div className="miniaturas-lista">
                {produto.images.map((imgUrl, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setImagemSelecionada(imgUrl)}
                    className={`btn-miniatura ${imagemSelecionada === imgUrl ? 'ativa' : ''}`}
                  >
                    <img src={imgUrl} alt={`${produto.title} - ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Coluna da Direita: Informações, Avaliações, Preços e Botão de Compra */}
          <div className="detalhes-info">
            <span className="categoria-tag">{produto.category}</span>
            <h1 className="titulo-detalhe">{produto.title}</h1>
            
            <p className="meta-dados-produto">
              Marca: {produto.brand || 'Apple'} · SKU: SMA-APP-{produto.id || '...'}
            </p>

            {/* Bloco de avaliação com estrelas dinâmicas e nota numérica */}
            <div className="avaliacao-box">
              <div className="grupo-estrelas">
                {Array.from({ length: 5 }, (_, index) => {
                  const notaArredondada = Math.round(produto.rating || 0);
                  return (
                    <span
                      key={index}
                      className={index < notaArredondada ? 'estrela-preenchida' : 'estrela-vazia'}
                    >
                      ★
                    </span>
                  );
                })}
              </div>
              <span className="nota-texto">
                {produto.rating?.toFixed(2).replace('.', ',') || '0,00'}
              </span>
              <span className="total-reviews">· 3 avaliações</span>
            </div>

            {/* Seção financeira contendo preços, descontos e opções de parcelamento */}
            <div className="precos-box">
              <div className="preco-antigo-linha">
                <span className="preco-riscado">R$ {precoOriginal.toFixed(2).replace('.', ',')}</span>
                <span className="tag-economize">economize R$ {valorDescontoReais.toFixed(2).replace('.', ',')}</span>
              </div>

              <div className="preco-atual-linha">
                <span className="preco-desconto">R$ {produto.price.toFixed(2).replace('.', ',')}</span>
                {produto.discountPercentage > 0 && (
                  <span className="selo-desconto-detalhe">
                    -{Math.round(produto.discountPercentage)}%
                  </span>
                )}
              </div>

              <span className="texto-parcelamento">
                em até 12x de R$ {precoParcela} sem juros
              </span>
            </div>

            {/* Status de estoque do produto */}
            <div className="estoque-status-detalhe">
              <span className="ponto-verde">●</span>
              <span>{produto.stock || 0} em estoque</span>
              <span className="estoque-texto-cinza">· In Stock</span>
            </div>

            {/* Seletor de quantidade e botão de adicionar ao carrinho */}
            <div className="acoes-compra-box">
              <div className="controle-qtd">
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span>{quantidade}</span>
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn-adicionar-grande"
                onClick={handleAdicionar}
              >
                <span className="texto-desktop-completo">Adicionar ao carrinho</span>
                <span className="texto-mobile-curto">Adicionar</span>
              </button>
            </div>

            {/* Vantagens e políticas de entrega/garantia */}
            <div className="vantagens-grid">
              <div className="vantagem-item">
                <span className="vantagem-titulo">ENVIO</span>
                <span className="vantagem-desc">Ships in 1 month</span>
              </div>
              <div className="vantagem-item">
                <span className="vantagem-titulo">GARANTIA</span>
                <span className="vantagem-desc">Lifetime warranty</span>
              </div>
              <div className="vantagem-item">
                <span className="vantagem-titulo">DEVOLUÇÃO</span>
                <span className="vantagem-desc">60 days return policy</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Seção Inferior: Descrição detalhada do produto e tabela de especificações */}
      <div className="inferior-grid">
        <div className="coluna-inferior">
          <h2 className="titulo-secao-fora">Descrição</h2>
          <div className="caixa-bloco">
            <p className="descricao-texto">
              {produto.description || 'Carregando descrição do produto...'}
            </p>
            <div className="tags-container">
              <span className="tag-hash">#{produto.category || 'geral'}</span>
              <span className="tag-hash">#{produto.brand?.toLowerCase() || 'apple'}</span>
            </div>
          </div>
        </div>

        <div className="coluna-inferior">
          <h2 className="titulo-secao-fora">Especificações</h2>
          <div className="caixa-bloco">
            <table className="tabela-especificacoes">
              <tbody>
                <tr>
                  <td>Peso</td>
                  <td><strong>2 kg</strong></td>
                </tr>
                <tr>
                  <td>Dimensões</td>
                  <td><strong>5.29 x 18.38 x 17.72 cm</strong></td>
                </tr>
                <tr>
                  <td>Estoque</td>
                  <td><strong>25 unidades</strong></td>
                </tr>
                <tr>
                  <td>Pedido mínimo</td>
                  <td><strong>3 unidades</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Seção de Produtos Relacionados */}
      {produtosRelacionados.length > 0 && (
        <section style={{ marginTop: '48px', marginBottom: '40px' }}>
          <h2 className="titulo-secao-fora">Produtos Relacionados</h2>
          <div className="grade-produtos">
            {produtosRelacionados.map((prodRelacionado) => (
              <CardProduto key={prodRelacionado.id} produto={prodRelacionado} />
            ))}
          </div>
        </section>
      )}

      {/* Seção de avaliações de usuários simuladas */}
      <div className="avaliacoes-container-externo">
        <h2 className="titulo-secao-fora">Avaliações (3)</h2>
        <div className="cards-avaliacoes-grid">
          <div className="card-avaliacao-usuario">
            <div className="review-header">
              <div className="review-autor-wrapper">
                <div className="avatar-circulo">J</div>
                <div className="review-info-usuario">
                  <strong>Jace Smith</strong>
                </div>
              </div>
              <span className="review-data">30/04/2025</span>
            </div>
            <div className="estrelas-amarelas">★★★★★</div>
            <p className="review-comentario">Highly recommended!</p>
          </div>

          <div className="card-avaliacao-usuario">
            <div className="review-header">
              <div className="review-autor-wrapper">
                <div className="avatar-circulo">L</div>
                <div className="review-info-usuario">
                  <strong>Logan Torres</strong>
                </div>
              </div>
              <span className="review-data">30/04/2025</span>
            </div>
            <div className="estrelas-amarelas">
              ★<span className="estrela-vazia-cinza">☆☆☆☆</span>
            </div>
            <p className="review-comentario">Not as described!</p>
          </div>

          <div className="card-avaliacao-usuario">
            <div className="review-header">
              <div className="review-autor-wrapper">
                <div className="avatar-circulo">H</div>
                <div className="review-info-usuario">
                  <strong>Harper Kelly</strong>
                </div>
              </div>
              <span className="review-data">30/04/2025</span>
            </div>
            <div className="estrelas-amarelas">★★★★★</div>
            <p className="review-comentario">Very satisfied!</p>
          </div>
        </div>
      </div>
    </main>
  );
}