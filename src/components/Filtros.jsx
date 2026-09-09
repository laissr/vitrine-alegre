import { useState, useRef, useEffect } from 'react';

export default function Filtros({
  categoriaUrl,
  ordenacaoUrl,
  categorias = [],
  aoMudarFiltro,
}) {
  // Estados e referências locais
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const scrollRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fecha o menu suspenso se o usuário clicar fora dele
  useEffect(() => {
    function handleClickFora(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  // Separa as primeiras 7 categorias visíveis e o restante para o dropdown
  const categoriasVisiveis = categorias.slice(0, 7);
  const categoriasOcultas = categorias.slice(7);
  const quantidadeRestante = categoriasOcultas.length;

  // Manipulador de clique para selecionar ou desmarcar uma categoria de filtro
  const tratarSelecaoCategoria = (slug) => {
    const novaCategoria = categoriaUrl === slug ? '' : slug;
    aoMudarFiltro({ categoria: novaCategoria, pagina: 1 });
    setMostrarDropdown(false); // Fecha o menu ao escolher
  };

  // Manipulador para alterar o critério de ordenação dos produtos
  const tratarSelecaoOrdenacao = (e) => {
    aoMudarFiltro({ ordenacao: e.target.value, pagina: 1 });
  };

  // Função disparada pelo botão de seta para rolar o carrossel de pílulas para a direita (mobile)
  const rolarParaDireita = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 140, behavior: 'smooth' });
    }
  };

  // Verifica se alguma das categorias ocultas está ativa atualmente
  const temCategoriaOcultaAtiva = categoriasOcultas.includes(categoriaUrl);

  return (
    <div className="barra-filtros-container">
      <div className="pilulas-scroll-wrapper">
        {/* Contêiner das pílulas de categoria vinculado à referência de scroll */}
        <div className="pilulas-categorias" ref={scrollRef}>
          {/* Botão padrão "Todas" para remover o filtro de categoria */}
          <button
            type="button"
            className={`btn-pilula ${!categoriaUrl ? 'ativa' : ''}`}
            onClick={() => tratarSelecaoCategoria('')}
          >
            Todas
          </button>

          {/* Mapeia e renderiza dinamicamente os botões de pílula para cada categoria vinda da API */}
          {categoriasVisiveis.map((slug) => {
            const estaAtivo = categoriaUrl === slug;

            return (
              <button
                key={slug}
                type="button"
                className={`btn-pilula ${estaAtivo ? 'ativa' : ''}`}
                onClick={() => tratarSelecaoCategoria(slug)}
              >
                {slug}
              </button>
            );
          })}

          {/* Botão interativo "+17" (ou o restante) com menu dropdown flutuante */}
          {quantidadeRestante > 0 && (
            <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                className={`btn-pilula ${temCategoriaOcultaAtiva ? 'ativa' : ''}`}
                onClick={() => setMostrarDropdown(!mostrarDropdown)}
              >
                +{quantidadeRestante}
              </button>

              {mostrarDropdown && (
                <div className="dropdown-categorias-ocultas">
                  {categoriasOcultas.map((slug) => {
                    const estaAtivo = categoriaUrl === slug;
                    return (
                      <button
                        key={slug}
                        type="button"
                        className={`dropdown-item-categoria ${estaAtivo ? 'ativo' : ''}`}
                        onClick={() => tratarSelecaoCategoria(slug)}
                      >
                        {slug}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botão de seta interativa para rolar o carrossel (visível apenas em dispositivos móveis via CSS) */}
        <button
          type="button"
          className="btn-seta-carrossel"
          onClick={rolarParaDireita}
          aria-label="Mais categorias"
        >
          ›
        </button>
      </div>

      {/* Caixa de seleção (select) para gerenciar a ordenação dos produtos */}
      <div className="ordenacao-container">
        <select
          value={ordenacaoUrl || ''}
          onChange={tratarSelecaoOrdenacao}
          className="select-ordenacao"
        >
          <option value="">Ordenar: Relevância</option>
          <option value="price-asc">Menor Preço</option>
          <option value="price-desc">Maior Preço</option>
          <option value="rating-desc">Melhor Avaliação</option>
        </select>
      </div>
    </div>
  );
}