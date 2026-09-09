# Diário da IA — Vitrine Alegre

Este documento registra os principais desvios, erros ou ajustes de comportamento cometidos pela inteligência artificial durante o desenvolvimento do front-end da aplicação, bem como a forma como foram identificados e corrigidos.

## 1. Falha na renderização do estado de "Busca sem resultados"
* O que a IA fez: A IA inicialmente manteve a listagem normal e a contagem de "0 produtos" na vitrine quando uma pesquisa não retornava dados, sem exibir o componente centralizado de aviso.
* **Como percebemos:** Ao testar termos inválidos (como "rtt"), a tela exibia apenas o cabeçalho de contagem vazia em vez do layout esperado com a lupa e o botão de limpar.
* **Como corrigimos:** Reorganizamos a ordem das condições lógicas no bloco de renderização do `return` na `Vitrine.jsx`, inserindo a verificação de lista vazia (`produtos.length === 0`) antes de montar a grade de produtos.

## 2. Flash de erro na transição de rotas (Detalhes para Home)
* **O que a IA fez:** Ao clicar no botão de voltar ou na logo para retornar à vitrine a partir da página de detalhes, a IA permitia que o componente disparasse um aviso rápido de "Produto não encontrado".
* **Como percebemos:** A tela piscava uma mensagem de erro indesejada por um milésimo de segundo durante a troca de rota (`react-router-dom`).
* **Como corrigimos:** Ajustamos o fluxo de desmontagem e o ciclo de vida do componente de detalhes para evitar o disparo prematuro do estado de erro durante a transição de navegação.

## 3. Perda de responsividade no texto do botão de compra
* **O que a IA fez:** Durante a refatoração do código de detalhes, a IA sobrescreveu o texto do botão de compra, fixando-o como "Adicionar ao carrinho" e removendo a regra de encurtar para "Adicionar" no celular.
* **Como percebemos:** Em telas menores (mobile), o botão quebrava o layout por conter um texto longo demais.
* **Como corrigimos:** Reestruturamos os elementos internos do botão utilizando classes específicas (`span`) combinadas com as regras de visibilidade do `@media` query no CSS.

## 4. Falha na rolagem inicial ao navegar para os detalhes do produto e estouro de layout mobile
* **O que a IA fez:** A IA inicialmente gerou o componente de detalhes de produto e o CSS responsivo sem o comando de redimensionamento do scroll e com regras que permitiam o transbordamento lateral de elementos largos (como imagens de veículos) em telas de celular.
* **Como percebemos:** Ao clicar em um produto no mobile, a página abria na mesma posição de rolagem da tela anterior (muitas vezes no meio ou embaixo) e o conteúdo estourava para as laterais, gerando uma barra de rolagem horizontal indesejada e desalinhamentos.
* **Como corrigimos:** Adicionamos o comando `window.scrollTo(0, 0)` no gancho `useEffect` do componente `DetalheProduto.jsx` para forçar o início no topo a cada mudança de ID, e blindamos o arquivo `index.css` no bloco `@media (max-width: 768px)` com travas estritas de largura (`max-width: 100%`, `overflow-x: hidden`) e o ajuste do `padding-top` do corpo para evitar espaços em branco desnecessários.

## 5. Falha no acionamento do esqueleto (Skeleton Loading) inicial
* **O que a IA fez:** A IA construiu o componente de carregamento, mas em alguns cenários de navegação o esqueleto de carregamento deixava de aparecer ao retornar para a página principal.
* **Como percebemos:** Ao voltar para a home por meio de links internos, a transição acontecia de forma seca sem exibir os cartões-fantasma.
* **Como corrigimos:** Adicionamos o `location.key` como dependência no gancho `useEffect` da vitrine, garantindo que o React reconheça o redirecionamento e dispare o estado de carregamento corretamente.


