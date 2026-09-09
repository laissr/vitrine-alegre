import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Recupera o usuário logado
    const usuarioSalvo = localStorage.getItem('usuario_logado');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }

    // Recupera os pedidos salvos no navegador
    const pedidosSalvos = JSON.parse(localStorage.getItem('meus_pedidos') || '[]');
    setPedidos(pedidosSalvos);
  }, []);

  return (
    <main className="container-principal">
      <div className="carrinho-topo-header">
        <div className="carrinho-titulo-container">
          <h1 className="carrinho-titulo-principal">Meus Pedidos</h1>
          <span className="carrinho-subcontador">
          </span>
        </div>
        <Link to="/" className="link-continuar-comprando">
          Voltar para a vitrine ›
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <div className="busca-vazia-container" style={{ marginTop: '32px' }}>
          <div className="busca-vazia-icone-circulo carrinho-vazio-icone">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h3 className="busca-vazia-titulo">Nenhum pedido encontrado</h3>
          <p className="busca-vazia-texto">Você ainda não finalizou nenhuma compra na vitrine.</p>
          <Link to="/" className="btn-ir-vitrine-vazio" style={{ marginTop: '16px' }}>
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="lista-carrinho" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="carrinho-item-linha" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-width', width: '100%', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Pedido #{pedido.id}</span>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>Data: {pedido.data}</p>
                </div>
                <div>
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>
                    {pedido.status || 'Concluído'}
                  </span>
                </div>
              </div>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pedido.itens.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                    <span>{item.quantidade}x {item.title}</span>
                    <span style={{ fontWeight: '600' }}>R$ {(item.price * item.quantidade).toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0', fontWeight: 'bold' }}>
                <span>Total do Pedido:</span>
                <span style={{ color: 'var(--cor-primaria, #232A60)' }}>R$ {pedido.total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}