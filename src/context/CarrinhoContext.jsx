import { createContext, useContext, useState } from 'react';

// Criação do contexto global do carrinho de compras
const CarrinhoContext = createContext();

// Componente Provedor que engloba a aplicação e fornece o estado global do carrinho
export function CarrinhoProvider({ children }) {
  // Estado que armazena a lista de itens adicionados ao carrinho
  const [itens, setItens] = useState([]);
  
  // Estado para controlar a mensagem de sucesso ao adicionar um produto
  const [mensagemSucesso, setMensagemSucesso] = useState(null);

  // Função para adicionar um produto ao carrinho ou incrementar sua quantidade caso já exista
  function adicionarAoCarrinho(produto, quantidade = 1) {
    setItens((itensAtuais) => {
      // Procura se o produto já está presente no carrinho pelo ID
      const idx = itensAtuais.findIndex((item) => item.id === produto.id);

      // Se o produto já existe, cria uma cópia do array e atualiza apenas a quantidade
      if (idx >= 0) {
        const novosItens = [...itensAtuais];
        novosItens[idx] = {
          ...novosItens[idx],
          quantidade: novosItens[idx].quantidade + quantidade,
        };
        return novosItens;
      }

      // Se o produto não existe no carrinho, adiciona ele com a quantidade inicial
      return [...itensAtuais, { ...produto, quantidade }];
    });

    // Dispara a mensagem de sucesso com o nome do produto
    setMensagemSucesso(produto.title);
    
    // Remove a mensagem após 3 segundos
    setTimeout(() => {
      setMensagemSucesso(null);
    }, 3000);
  }

  // Função para alterar diretamente a quantidade de um item (+ ou -)
  function atualizarQuantidade(id, novaQuantidade) {
    // Se a nova quantidade for menor ou igual a zero, remove o item automaticamente
    if (novaQuantidade <= 0) {
      removerDoCarrinho(id);
      return;
    }

    // Mapeia os itens atualizando a quantidade do produto correspondente ao ID
    setItens((itensAtuais) =>
      itensAtuais.map((item) =>
        item.id === id ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  }

  // Função para remover um produto específico do carrinho com base no ID
  function removerDoCarrinho(id) {
    setItens((itensAtuais) => itensAtuais.filter((item) => item.id !== id));
  }

  // Função para limpar completamente todos os itens do carrinho
  function limparCarrinho() {
    setItens([]);
  }

  // =========================================================================
  // CÁLCULOS DERIVADOS (Calculados dinamicamente sem o uso de estados extras!)
  // =========================================================================

  // Calcula a quantidade total de unidades de itens no carrinho
  const quantidadeTotal = itens.reduce((acc, item) => acc + item.quantidade, 0);

  // Calcula o valor bruto (subtotal) somando o preço unitário multiplicado pela quantidade
  const subtotal = itens.reduce(
    (acc, item) => acc + item.price * item.quantidade,
    0
  );

  // Calcula o valor total dos descontos aplicados nos produtos
  const descontoTotal = itens.reduce((acc, item) => {
    const descontoItem =
      (item.price * (item.discountPercentage || 0)) / 100;
    return acc + descontoItem * item.quantidade;
  }, 0);

  // Calcula o valor final a pagar (subtotal menos os descontos)
  const total = subtotal - descontoTotal;

  return (
    /* Disponibiliza o estado e todas as funções manipuladoras para os componentes filhos */
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarAoCarrinho,
        atualizarQuantidade,
        removerDoCarrinho,
        limparCarrinho,
        quantidadeTotal,
        subtotal,
        descontoTotal,
        total,
        mensagemSucesso, // <- Disponibilizado para consumo global
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

// Hook personalizado para facilitar o consumo do contexto do carrinho nos componentes
export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  // Trava de segurança: lança um erro caso o hook seja usado fora do escopo do Provedor
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
}