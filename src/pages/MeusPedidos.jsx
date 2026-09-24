import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const usuarioSalvo = localStorage.getItem("usuario_logado");
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }

    const pedidosSalvos = JSON.parse(
      localStorage.getItem("meus_pedidos") || "[]",
    );
    setPedidos(pedidosSalvos);
  }, []);

  return (
    <main className="container-principal">
      <div className="carrinho-topo-header" style={{ marginBottom: "24px" }}>
        <div className="carrinho-titulo-container">
          <h1 className="carrinho-titulo-principal">Meus Pedidos</h1>
          <span className="carrinho-subcontador">
            {usuario
              ? `Histórico de compras de ${usuario.nome}`
              : "Acompanhe seus pedidos"}
          </span>
        </div>
        <Link to="/" className="link-continuar-comprando">
          Voltar para a vitrine ›
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <div className="busca-vazia-container" style={{ marginTop: "32px" }}>
          <div className="busca-vazia-icone-circulo carrinho-vazio-icone">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h3 className="busca-vazia-titulo">Nenhum pedido encontrado</h3>
          <p className="busca-vazia-texto">
            Você ainda não finalizou nenhuma compra na vitrine.
          </p>
          <Link
            to="/"
            className="btn-ir-vitrine-vazio"
            style={{ marginTop: "16px" }}
          >
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {pedidos.map((pedido) => {
            const isAguardando = pedido.status === "Aguardando pagamento";

            return (
              <div
                key={pedido.id}
                style={{
                  backgroundColor: "var(--cor-superficie, #ffffff)",
                  border: "1px solid var(--cor-borda, #e2e8f0)",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Cabeçalho do Card do Pedido */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--cor-borda, #e2e8f0)",
                    paddingBottom: "16px",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--cor-texto-secundario, #64748b)",
                        fontWeight: "500",
                      }}
                    >
                      Pedido{" "}
                      <strong style={{ color: "var(--cor-primaria)" }}>
                        #{pedido.id}
                      </strong>
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "#334155",
                        fontWeight: "600",
                      }}
                    >
                      Realizado em {pedido.data}
                    </span>
                  </div>

                  <div>
                    <span
                      style={{
                        backgroundColor: isAguardando ? "#fef3c7" : "#dcfce7",
                        color: isAguardando ? "#d97706" : "#15803d",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "0.78rem",
                        fontWeight: "700",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: isAguardando ? "#d97706" : "#15803d",
                        }}
                      ></span>
                      {pedido.status || "Concluído"}
                    </span>
                  </div>
                </div>

                {/* Lista de Itens do Pedido */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {pedido.itens.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                        backgroundColor: "var(--cor-fundo, #f8fafc)",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "1px solid var(--cor-borda, #e2e8f0)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                        }}
                      >
                        {item.thumbnail && (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "contain",
                              background: "#fff",
                              borderRadius: "8px",
                              padding: "4px",
                              border: "1px solid var(--cor-borda)",
                            }}
                          />
                        )}
                        <div>
                          <p
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              color: "var(--cor-texto, #1e293b)",
                            }}
                          >
                            {item.title}
                          </p>
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--cor-texto-secundario, #64748b)",
                            }}
                          >
                            Quantidade: <strong>{item.quantidade}x</strong> · R${" "}
                            {item.price?.toFixed(2).replace(".", ",")} cada
                          </span>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: "0.9375rem",
                          fontWeight: "700",
                          color: "var(--cor-primaria, #232A60)",
                        }}
                      >
                        R${" "}
                        {(item.price * item.quantidade)
                          .toFixed(2)
                          .replace(".", ",")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Rodapé do Card: Total Geral */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "4px",
                    paddingTop: "16px",
                    borderTop: "1px dashed var(--cor-borda, #e2e8f0)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--cor-texto-secundario, #64748b)",
                      fontWeight: "600",
                    }}
                  >
                    Valor Total do Pedido:
                  </span>
                  <span
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "800",
                      color: "var(--cor-primaria, #232A60)",
                    }}
                  >
                    R$ {pedido.total.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
