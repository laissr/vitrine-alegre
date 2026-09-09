
## Etapa 1 — Início do Projeto e Estruturação Inicial
* **O que fiz**: Comecei enviando o PDF da atividade (*FE2_Atividade-Vitrine-Alegre*) para a IA e pedi para construirmos o passo a passo da aplicação "Vitrine Alegre" em React e Vite, exigindo que ela me explicasse cada parte para que eu pudesse entender.
* **Resultado**: Organizamos o plano de ação e a base inicial de diretórios e dependências.

## Etapa 2 — Criação do Sistema de Rotas e Layout (App.jsx)
* **O que fiz**: Pedi para a IA gerar a estrutura de rotas integrando o `React Router DOM`, o `CarrinhoProvider`, o `Header`, o `Rodape`, as páginas principais e a rota 404.
* **Resultado**: Ela gerou o componente `App.jsx`, mas tive que revisar e ajustar manualmente os caminhos de importação para encaixar na estrutura exata das minhas pastas.

## Etapa 3 — Desenvolvimento do Contexto do Carrinho (CarrinhoContext.jsx)
* **O que fiz**: Solicitei a criação do contexto global de gerenciamento do carrinho usando a Context API, com funções para adicionar itens, atualizar quantidades, remover, limpar e calcular os totais dinamicamente.
* **Resultado**: A IA criou o hook e o provider, e precisei ajustar a lógica de manipulação do array de itens para evitar bugs de duplicação.

## Etapa 4 — Construção da Vitrine e Filtros por URL (Vitrine.jsx)
* **O que fiz**: Pedi para desenvolver a página principal da vitrine consumindo a API DummyJSON, fazendo a leitura dos parâmetros de URL (`searchParams`) para paginação, busca, categorias e ordenação, além de tratar os estados de carregamento.
* **Resultado**: Essa foi a etapa que mais exigiu correções da minha parte. Tive que mandar a IA refazer e ajustar várias vezes o mapeamento dos dados paginados da API e o controle do `useEffect` para evitar comportamentos indesejados.

## Etapa 5 — Criação da Página de Detalhes do Produto (DetalheProduto.jsx)
* **O que fiz**: Solicitei a criação da página de detalhes buscando o ID do produto via `useParams`, implementando a galeria interativa de miniaturas de imagens, avaliações, seletor de quantidade e o botão de compra.
* **Resultado**: A IA montou a base, mas precisei corrigir a lógica de troca de imagem principal ao clicar nas miniaturas para garantir que a interface respondesse perfeitamente.

## Etapa 6 — Desenvolvimento dos Componentes de Apoio e Rodapé
* **O que fiz**: Fui pedindo a criação dos demais componentes e páginas do projeto (`Carrinho.jsx`, `NotFound.jsx`, `Rodape.jsx`, `CardProduto.jsx`, `Filtros.jsx`, `Paginacao.jsx`, `api.js`) um a um.
* **Resultado**: A IA gerava os códigos e eu ia testando, batendo cabeça com alguns erros e mandando ela corrigir os detalhes visuais e lógicos até funcionarem.