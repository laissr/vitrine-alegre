# Vitrine Alegre — Projeto Front-End React

Aplicação web de e-commerce desenvolvida em React (utilizando Vite) como parte de um projeto acadêmico do Ifes Campus de Alegre (TADS). A loja simula uma vitrine virtual completa com listagem de produtos, paginação, filtros por categoria e ordenação, página de detalhes do produto com galeria de imagens e especificações, além de um carrinho de compras com layout totalmente responsivo (mobile-first).

---

## Tecnologias Utilizadas

* React & React Router DOM (Gerenciamento de componentes e rotas)
* JavaScript (ES6+)
* CSS3 (Com `@media queries` para responsividade e design adaptado para mobile)
* API Externa: [DummyJSON Products API](https://dummyjson.com/)

---

## Funcionalidades Principais

1. **Vitrine de Produtos:**
   * Listagem dinâmica integrada à API.
   * Filtros por categorias (com carrossel responsivo no mobile).
   * Ordenação de produtos.
   * Paginação controlada via parâmetros de URL (`searchParams`).
   * Estados de interface tratados: Esqueleto de carregamento (Skeleton Loading), Erro de rede com botão de "Tentar novamente" e Busca sem resultados (com ícone de lupa e botão de limpar).

2. **Página de Detalhes:**
   * Galeria interativa de imagens e miniaturas.
   * Avaliações de usuários (reviews), estoque e seletor de quantidade.
   * Botão de compra responsivo ("Adicionar ao carrinho" no desktop e apenas "Adicionar" no mobile).

3. **Carrinho de Compras:**
   * Gerenciamento de quantidade e remoção de itens.
   * Resumo de valores com frete e desconto.
   * Layout Responsivo Avançado: Resumo do pedido adaptado para dispositivos móveis.

---

## Resumo da Arquitetura do Projeto

### 1. Ponto de Entrada e Inicialização
* **`main.jsx`**: Ponto de entrada da aplicação, responsável por selecionar o elemento raiz (`#root`) no HTML e inicializar o React com o `StrictMode`.
* **`App.jsx`**: Componente raiz e central de roteamento. Envolve a aplicação com o provedor global do carrinho (`CarrinhoProvider`), gerencia o histórico de navegação (`BrowserRouter`) e define as rotas principais (`/`, `/produto/:id`, `/carrinho` e a rota 404).

### 2. Serviços de API
* **`api.js`**: Gerencia toda a comunicação assíncrona com o serviço externo DummyJSON. Contém funções para listagem paginada de produtos, busca textual, filtros por categoria, ordenação dinâmica por parâmetros de URL, busca de produto específico por ID e listagem de categorias, com suporte a cancelamento de requisições (`AbortController`).

### 3. Gerenciamento de Estado Global
* **`CarrinhoContext.jsx`**: Implementa a Context API do React para gerenciar o estado global do carrinho. Disponibiliza funções para adicionar itens, atualizar quantidades, remover produtos e limpar o carrinho, além de calcular automaticamente valores derivados (subtotal, descontos, frete e quantidade total) sem poluir o estado.

### 4. Componentes e Interface
* **`Header.jsx`**: Cabeçalho responsivo com logotipo, menu mobile, barra de busca sincronizada com a URL e acesso rápido ao carrinho com contador dinâmico.
* **`Filtros.jsx`**: Barra superior de categorias em formato de pílulas interativas e seletor de ordenação de produtos.
* **`CardProduto.jsx`**: Cartão de exibição de produtos na vitrine contendo selo de desconto, imagem, título, avaliação em estrelas, preços formatados e botão de adição rápida.
* **`Paginacao.jsx`**: Componente lógico para navegação adaptativa entre as páginas da vitrine.
* **`Rodape.jsx`**: Rodapé semântico com informações acadêmicas e avisos legais.

### 5. Páginas da Aplicação
* **`Vitrine.jsx`**: Página principal com listagem dinâmica, carregamento via esqueletos visuais (*skeletons*), tratamento de erros e filtros.
* **`DetalheProduto.jsx`**: Página de detalhes com galeria de miniaturas, seletor de quantidade, especificações e avaliações simuladas.
* **`Carrinho.jsx`**: Listagem de itens adicionados com ajuste de quantidades, resumo financeiro completo e estado de carrinho vazio.
* **`NotFound.jsx`**: Página de erro 404 para rotas inválidas.

### 6. Estilização
* **`index.css`**: Arquivo CSS limpo e organizado por blocos lógicos, utilizando um sistema centralizado de design tokens e variáveis de cores (`:root`) para garantir total responsividade.

---

## ⚙️ Como Rodar o Projeto do Zero

Certifique-se de ter o Node.js instalado na sua máquina antes de prosseguir.

1. Baixe ou clone o repositório do projeto para o seu computador.

2. Abra a pasta do projeto no seu terminal de preferência (como o VS Code, Prompt de Comando ou Git Bash).

3. Instale todas as dependências necessárias executando este comando:
   
   npm install
   npm install react-router-dom

4. Inicie o servidor de desenvolvimento local digitando:

   npm run dev

5. Por fim, abra o link que aparecerá no seu terminal (geralmente http://localhost:5173) diretamente no seu navegador para ver a aplicação funcionando.