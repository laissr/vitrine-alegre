# Diário da IA — Vitrine Alegre

Este documento registra os principais desvios, erros ou ajustes de comportamento cometidos pela inteligência artificial durante o desenvolvimento do front-end da aplicação, bem como a forma como foram identificados e corrigidos.

## 1. Falha na renderização do estado de "Busca sem resultados"

- **Onde:** Vitrine.jsx
- **O que a IA fez:** A IA inicialmente manteve a listagem normal e a contagem de "0 produtos" na vitrine quando uma pesquisa não retornava dados, sem exibir o componente centralizado de aviso.
- **Como percebi:** Ao testar termos inválidos (como "rtt"), a tela exibia apenas o cabeçalho de contagem vazia em vez do layout esperado com a lupa e o botão de limpar.
- **Correção:** Reorganizamos a ordem das condições lógicas no bloco de renderização do `return` na `Vitrine.jsx`, inserindo a verificação de lista vazia (`produtos.length === 0`) antes de montar a grade de produtos.
- **O que aprendi:** A ordem das avaliações condicionais (_short-circuit evaluation_) no JSX define a prioridade de renderização da interface; validações de listas vazias devem vir antes do mapeamento dos dados.

## 2. Flash de erro na transição de rotas (Detalhes para Home)

- **Onde:** `DetalheProduto.jsx`
- **O que a IA fez:** Ao clicar no botão de voltar ou na logo para retornar à vitrine a partir da página de detalhes, a IA permitia que o componente disparasse um aviso rápido de "Produto não encontrado".
- **Como percebi:** A tela piscava uma mensagem de erro indesejada por um milésimo de segundo durante a troca de rota (`react-router-dom`).
- **Correção:** Ajustamos o fluxo de desmontagem e o ciclo de vida do componente de detalhes para evitar o disparo prematuro do estado de erro durante a transição de navegação.
- **O que aprendi:** É fundamental gerenciar os estados assíncronos e de carregamento ao trocar de rotas dinâmicas para evitar que mensagens de erro residuais apareçam enquanto a nova requisição não é concluída.

## 3. Perda de responsividade no texto do botão de compra

- **Onde:** `DetalheProduto.jsx` e `index.css`
- **O que a IA fez:** Durante a refatoração do código de detalhes, a IA sobrescreveu o texto do botão de compra, fixando-o como "Adicionar ao carrinho" e removendo a regra de encurtar para "Adicionar" no celular.
- **Como percebi:** Em telas menores (mobile), o botão quebrava o layout por conter um texto longo demais.
- **Correção:** Reestruturamos os elementos internos do botão utilizando classes específicas (`span`) combinadas com as regras de visibilidade do `@media` query no CSS.
- **O que aprendi:** A adaptação mobile vai além do grid geral da página; elementos interativos como botões exigem tratamentos visuais dedicados (com classes utilitárias e escondendo textos longos via CSS) para caberem em telas estreitas.

## 4. Falha na rolagem inicial ao navegar para os detalhes do produto e estouro de layout mobile

- **Onde:** `DetalheProduto.jsx` e `index.css`
- **O que a IA fez:** A IA inicialmente gerou o componente de detalhes de produto e o CSS responsivo sem o comando de redimensionamento do scroll e com regras que permitiam o transbordamento lateral de elementos largos (como imagens de veículos) em telas de celular.
- **Como percebi:** Ao clicar em um produto no mobile, a página abria na mesma posição de rolagem da tela anterior (muitas vezes no meio ou embaixo) e o conteúdo estourava para as laterais, gerando uma barra de rolagem horizontal indesejada e desalinhamentos.
- **Correção:** Adicionamos o comando `window.scrollTo(0, 0)` no gancho `useEffect` do componente `DetalheProduto.jsx` para forçar o início no topo a cada mudança de ID, e blindamos o arquivo `index.css` no bloco `@media (max-width: 768px)` com travas estritas de largura (`max-width: 100%`, `overflow-x: hidden`) e o ajuste do `padding-top` do corpo para evitar espaços em branco desnecessários.
- **O que aprendi:** O Single Page Application (SPA) mantém a posição da barra de rolagem ao mudar de rota por padrão, exigindo chamadas manuais de `scrollTo`, e o layout mobile sempre precisa de travas explícitas de overflow horizontal para evitar estouros de tela.

## 5. Falha no acionamento do esqueleto (Skeleton Loading) inicial

- **Onde:** `Vitrine.jsx`
- **O que a IA fez:** A IA construiu o componente de carregamento, mas em alguns cenários de navegação o esqueleto de carregamento deixava de aparecer ao retornar para a página principal.
- **Como percebi:** Ao voltar para a home por meio de links internos, a transição acontecia de forma seca sem exibir os cartões-fantasma.
- **Correção:** Adicionamos o `location.key` como dependência no gancho `useEffect` da vitrine, garantindo que o React reconheça o redirecionamento e dispare o estado de carregamento corretamente.
- **O que aprendi:** O `useEffect` só dispara novamente se suas dependências mudarem; ao reutilizar o mesmo componente de página em rotas parecidas, o objeto de localização (`location.key`) é o gatilho ideal para forçar o ciclo de carregamento a cada nova entrada.
