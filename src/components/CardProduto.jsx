import { Link } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';

export default function CardProduto({ produto }) {
  // Obtém os itens e as funções de manipulação do contexto global
  const { itens, adicionarAoCarrinho, atualizarQuantidade } = useCarrinho();

  // Verifica se este produto específico já está inserido no carrinho
  const itemNoCarrinho = itens.find((item) => item.id === produto.id);
  const quantidadeAtual = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;

  // Função auxiliar para gerar dinamicamente as 5 estrelas de avaliação com base na nota
  const renderizarEstrelas = (rating = 0) => {
    const estrelasPreenchidas = Math.round(rating);
    const totalEstrelas = 5;

    return Array.from({ length: totalEstrelas }, (_, index) => (
      <span
        key={index}
        className={index < estrelasPreenchidas ? 'estrela-preenchida' : 'estrela-vazia'}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="card-produto">
      {/* Envolve a imagem e os textos em um Link para a página de detalhes dinâmica */}
      <Link to={`/produto/${produto.id}`} className="card-link-wrapper">
        <div className="card-imagem-container">
          {/* Exibe o selo de desconto apenas se houver desconto maior que zero */}
          {produto.discountPercentage > 0 && (
            <span className="selo-desconto">
              -{Math.round(produto.discountPercentage)}%
            </span>
          )}
          {/* Exibe a miniatura principal ou a primeira imagem disponível do produto */}
          <img
            src={produto.thumbnail || produto.images?.[0]}
            alt={produto.title}
            className="card-imagem"
          />
        </div>

        <div className="card-conteudo">
          {/* Categoria do produto em caixa alta */}
          <span className="card-categoria">{produto.category}</span>
          {/* Título do produto */}
          <h3 className="card-titulo">{produto.title}</h3>

          {/* Seção contendo as estrelas de avaliação e a nota numérica formatada */}
          <div className="card-avaliacao">
            <div className="grupo-estrelas">
              {renderizarEstrelas(produto.rating)}
            </div>
            <span className="nota-numero">
              {produto.rating?.toString().replace('.', ',')}
            </span>
          </div>

          {/* Seção de preços do produto */}
          <div className="card-precos">
            {/* Exibe o preço antigo riscado caso o produto esteja com desconto */}
            {produto.discountPercentage > 0 && (
              <span className="preco-antigo">
                R$ {(produto.price * 1.15).toFixed(2).replace('.', ',')}
              </span>
            )}
            {/* Preço atual formatado para o padrão monetário brasileiro */}
            <span className="preco-atual">
              R$ {produto.price?.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </Link>

      {/* Rodapé do cartão contendo o aviso de quantidade e o botão para adicionar mais */}
      <div className="card-footer-acao" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Mostra quantas unidades já estão no carrinho, se houver */}
        {quantidadeAtual > 0 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--cor-sucesso, #15803D)', fontWeight: '600', textAlign: 'center' }}>
            {quantidadeAtual} {quantidadeAtual === 1 ? 'unidade no carrinho' : 'unidades no carrinho'}
          </span>
        )}

        {/* Botão padrão para adicionar mais */}
        <button 
          className="btn-adicionar" 
          onClick={(e) => {
            e.preventDefault();
            adicionarAoCarrinho(produto);
          }}
        >
          {quantidadeAtual > 0 ? 'Adicionar mais' : 'Adicionar'}
        </button>
      </div>
    </div>
  );
}