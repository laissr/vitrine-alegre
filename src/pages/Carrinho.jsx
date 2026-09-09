import { Link } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';

export default function Carrinho() {
  // Extrai estados e funções manipuladoras fornecidos pelo contexto global do carrinho
  const {
    itens,
    quantidadeTotal,
    atualizarQuantidade,
    removerDoCarrinho,
    limparCarrinho,
    subtotal,
    descontoTotal,
    total,
  } = useCarrinho();

  // Condicional: Se o carrinho estiver vazio, exibe uma tela de alerta amigável com link para a vitrine
  if (itens.length === 0) {
    return (
      <main className="container-principal">
        <h2 className="titulo-secao-fora">Seu carrinho</h2>
        <div className="busca-vazia-container">
          <div className="busca-vazia-icone-circulo carrinho-vazio-icone">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h3 className="busca-vazia-titulo">Seu carrinho está vazio</h3>
          <p className="busca-vazia-texto">Escolha um produto na vitrine para começar.</p>
          <Link to="/" className="btn-ir-vitrine-vazio">
            Ir para a vitrine
          </Link>
        </div>
      </main>
    );
  }

  // Cálculos auxiliares para exibição de contadores e parcelamento
  const tiposProdutos = itens.length;
  const precoParcela = (total / 12).toFixed(2).replace('.', ',');

  const handleFinalizarWhatsApp = () => {
    // Substitua pelo número da loja com DDI e DDD (ex: 5527999999999)
    const numeroWhatsApp = "5527999999999"; 

    // Monta a lista de produtos formatada
    let mensagem = "*Olá! Gostaria de finalizar o meu pedido:*%0A%0A";

    itens.forEach((item) => {
      const subtotalItem = item.price * item.quantidade;
      mensagem += `• ${item.quantidade}x *${item.title}* - R$ ${subtotalItem.toFixed(2).replace('.', ',')}%0A`;
    });

    // Adiciona o valor total do pedido
    mensagem += `%0A*Total do Pedido:* R$ ${total.toFixed(2).replace('.', ',')}`;

    // Codifica a mensagem para o formato de URL e abre o WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
    window.open(urlWhatsApp, '_blank');
  };

  return (
    <main className="container-principal">
      {/* Cabeçalho superior do carrinho contendo o título, subtitulação e link para continuar comprando */}
      <div className="carrinho-topo-header">
        <div className="carrinho-titulo-container">
          <h1 className="carrinho-titulo-principal">Seu carrinho</h1>
          <span className="carrinho-subcontador">
            {tiposProdutos} {tiposProdutos === 1 ? 'produto' : 'produtos'} · {quantidadeTotal} {quantidadeTotal === 1 ? 'unidade' : 'unidades'}
          </span>
        </div>
        <Link to="/" className="link-continuar-comprando">
          Continuar comprando ›
        </Link>
      </div>

      {/* Layout principal em grade dividindo a lista de produtos (esquerda) e o resumo financeiro (direita) */}
      <div className="carrinho-grid-layout">
        {/* Caixa contendo a listagem de todos os itens adicionados */}
        <div className="carrinho-caixa-lista">
          {itens.map((item, index) => {
            const precoUnitario = item.price;
            const subtotalItem = precoUnitario * item.quantidade;

            return (
              <div 
                key={item.id} 
                className={`carrinho-item-linha ${index !== itens.length - 1 ? 'com-borda' : ''}`}
              >
                {/* Miniatura da imagem do produto com link para os detalhes */}
                <Link to={`/produto/${item.id}`} className="carrinho-item-miniatura-box">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="carrinho-item-img"
                  />
                </Link>

                {/* Informações detalhadas do item (categoria, título e preço unitário) */}
                <div className="carrinho-item-infos">
                  <span className="carrinho-item-categoria">
                    {item.category || 'SMARTPHONES'}
                  </span>
                  
                  {/* Título do produto com link para os detalhes */}
                  <Link to={`/produto/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="carrinho-item-nome">{item.title}</h3>
                  </Link>

                  <span className="carrinho-item-preco-unidade">
                    R$ {precoUnitario.toFixed(2).replace('.', ',')} cada
                  </span>
                </div>

                {/* Seletor numérico de quantidade com botões de decrementar (-) e incrementar (+) */}
                <div className="controle-qtd carrinho-qtd-ajuste">
                  <button
                    type="button"
                    onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantidade}</span>
                  <button
                    type="button"
                    onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Valor total acumulado para este item específico */}
                <div className="carrinho-item-valor-total">
                  <span>R$ {subtotalItem.toFixed(2).replace('.', ',')}</span>
                </div>

                {/* Botão de remoção rápida do item do carrinho */}
                <button
                  type="button"
                  className="btn-remover-item"
                  onClick={() => removerDoCarrinho(item.id)}
                  title="Remover item"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* Cartão lateral de resumo financeiro do pedido */}
        <aside className="carrinho-resumo-card">
          <h2 className="resumo-titulo">Resumo do pedido</h2>
          
          <div className="resumo-linha">
            <span>Subtotal ({quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'})</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="resumo-linha desconto">
            <span>Descontos</span>
            <span className="valor-desconto-verde">- R$ {descontoTotal.toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="resumo-linha">
            <span>Frete</span>
            <span className="frete-gratis-texto">Grátis</span>
          </div>

          <div className="resumo-divisor"></div>

          {/* Versão completa para Desktop */}
          <div className="resumo-linha total-geral desktop-only">
            <span>Total</span>
            <div className="total-valores-coluna">
              <span className="total-preco-principal">R$ {total.toFixed(2).replace('.', ',')}</span>
              <span className="total-parcelamento-texto">em até 12x de R$ {precoParcela}</span>
            </div>
          </div>

          {/* Versão simplificada exclusiva para o Mobile */}
          <div className="resumo-linha total-geral mobile-resumo-visivel">
            <span className="total-itens-texto">Total ({quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'})</span>
            <span className="total-preco-principal">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>

          <button
            type="button"
            className="btn-finalizar-compra"
            onClick={handleFinalizarWhatsApp}
          >
            Finalizar compra
          </button>

          {/* Botão para limpar tudo */}
          <button
            type="button"
            className="btn-limpar-carrinho"
            onClick={limparCarrinho}
          >
            Esvaziar carrinho
          </button>
        </aside>
      </div>
    </main>
  );
}