// URL base oficial da API DummyJSON utilizada para simular o e-commerce
const BASE_URL = 'https://dummyjson.com';

/**
 * Busca a lista de produtos com suporte a paginação, busca por texto,
 * filtro por categoria e ordenação.
 */
export async function listarProdutos({ pagina = 1, busca = '', categoria = '', ordenacao = '', signal } = {}) {
  // Define o limite padrão de 12 produtos por página e calcula quantos itens devem ser ignorados (skip)
  const limite = 12;
  const skip = (pagina - 1) * limite;

  // URL inicial padrão para listagem geral de produtos
  let url = `${BASE_URL}/products`;

  // Define dinamicamente o endpoint correto dependendo se o usuário está buscando por texto ou filtrando por categoria
  if (busca.trim()) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(busca)}&limit=${limite}&skip=${skip}`;
  } else if (categoria) {
    url = `${BASE_URL}/products/category/${encodeURIComponent(categoria)}?limit=${limite}&skip=${skip}`;
  } else {
    url = `${BASE_URL}/products?limit=${limite}&skip=${skip}`;
  }

  // Se houver uma regra de ordenação selecionada, separa o campo e a direção (ex: price-asc) e anexa à URL
  if (ordenacao) {
    const [sortBy, order] = ordenacao.split('-');
    const separador = url.includes('?') ? '&' : '?';
    url += `${separador}sortBy=${sortBy}&order=${order}`;
  }

  // Realiza a requisição HTTP assíncrona utilizando fetch com suporte a sinal de cancelamento (AbortController)
  const response = await fetch(url, { signal });

  // Se a resposta da API falhar, lança um erro descritivo para ser tratado na interface
  if (!response.ok) {
    throw new Error('Não foi possível carregar os produtos. Verifique sua conexão e tente de novo.');
  }

  // Converte a resposta recebida para o formato JSON
  const data = await response.json();

  // Retorna um objeto estruturado contendo a lista de produtos, o total geral e o total de páginas calculadas
  return {
    produtos: data.products,
    total: data.total,
    paginas: Math.ceil(data.total / limite),
  };
}

/**
 * Busca os dados de um único produto pelo seu ID (Nome ajustado conforme o PDF).
 */
export async function buscarProduto(id, { signal } = {}) {
  // Faz a requisição para buscar os detalhes específicos de um produto utilizando o ID na URL
  const response = await fetch(`${BASE_URL}/products/${id}`, { signal });

  // Se o produto não for encontrado ou ocorrer erro na resposta, lança uma exceção
  if (!response.ok) {
    throw new Error('Produto não encontrado.');
  }

  // Retorna os dados detalhados do produto em formato JSON
  return await response.json();
}

/**
 * Busca a lista simples de nomes de categorias para preencher o filtro.
 */
export async function listarCategorias({ signal } = {}) {
  // Faz a requisição para buscar a lista de categorias disponíveis na API
  const response = await fetch(`${BASE_URL}/products/category-list`, { signal });

  // Se a requisição falhar, lança um erro amigável
  if (!response.ok) {
    throw new Error('Não foi possível carregar as categorias.');
  }

  // Retorna o array contendo os nomes/slugs das categorias
  return await response.json();
}