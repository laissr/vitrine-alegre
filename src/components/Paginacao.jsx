export default function Paginacao({ paginaAtual, totalPaginas, aoMudarPagina }) {
  // Se houver apenas 1 página ou nenhuma, não renderiza a paginação na tela
  if (totalPaginas <= 1) return null;

  // Função matemática inteligente para gerar a lista de números e reticências dos botões
  const gerarBotoesPaginas = () => {
    const paginas = [];
    const maxBotoesVisiveis = 5;

    // Se o total de páginas for pequeno, exibe todas sem precisar de reticências
    if (totalPaginas <= maxBotoesVisiveis + 2) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      // Sempre exibe a primeira página fixa
      paginas.push(1);
      
      // Define os limites dinâmicos ao redor da página atual
      let inicio = Math.max(2, paginaAtual - 1);
      let fim = Math.min(totalPaginas - 1, paginaAtual + 1);

      // Ajustes finos para o começo e o fim da paginação
      if (paginaAtual <= 3) {
        inicio = 2;
        fim = 4;
      } else if (paginaAtual >= totalPaginas - 2) {
        inicio = totalPaginas - 3;
        fim = totalPaginas - 1;
      }

      // Adiciona reticências à esquerda se necessário
      if (inicio > 2) {
        paginas.push('...-esq');
      }

      // Adiciona o intervalo numérico intermediário calculado
      for (let i = inicio; i <= fim; i++) {
        paginas.push(i);
      }

      // Adiciona reticências à direita se necessário
      if (fim < totalPaginas - 1) {
        paginas.push('...-dir');
      }

      // Sempre exibe a última página fixa
      paginas.push(totalPaginas);
    }

    return paginas;
  };

  return (
    <div className="paginacao-container">
      {/* Botão para voltar à página anterior (desabilitado se estiver na primeira página) */}
      <button
        type="button"
        className="btn-pagina-item"
        disabled={paginaAtual <= 1}
        onClick={() => aoMudarPagina(paginaAtual - 1)}
      >
        ‹
      </button>

      {/* Mapeia e renderiza dinamicamente os números de página ou as reticências */}
      {gerarBotoesPaginas().map((item, index) => {
        // Se o item for uma string (reticências), renderiza o span estático
        if (typeof item === 'string') {
          return (
            <span key={`reticencias-${index}`} className="paginacao-reticencias">
              ...
            </span>
          );
        }

        // Verifica se o número da página atual corresponde ao item iterado
        const eAtiva = item === paginaAtual;

        return (
          <button
            type="button"
            key={item}
            className={`btn-pagina-item ${eAtiva ? 'ativa' : ''}`}
            onClick={() => aoMudarPagina(item)}
          >
            {item}
          </button>
        );
      })}

      {/* Botão para avançar para a próxima página (desabilitado se estiver na última página) */}
      <button
        type="button"
        className="btn-pagina-item"
        disabled={paginaAtual >= totalPaginas}
        onClick={() => aoMudarPagina(paginaAtual + 1)}
      >
        ›
      </button>
    </div>
  );
}