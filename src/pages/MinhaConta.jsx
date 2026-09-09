import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function MinhaConta() {
  const [usuario, setUsuario] = useState(null);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Recupera os dados do usuário logado
    const usuarioSalvo = localStorage.getItem('usuario_logado');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    } else {
      // Se não estiver logado, redireciona para a tela de login
      navigate('/entrar');
    }

    // Calcula a quantidade de pedidos salvos
    const pedidosSalvos = JSON.parse(localStorage.getItem('meus_pedidos') || '[]');
    setTotalPedidos(pedidosSalvos.length);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('usuario_logado');
    navigate('/');
    window.location.reload(); // Atualiza o header
  };

  if (!usuario) return null;

  return (
    <main className="container-principal">
      <div className="carrinho-topo-header">
        <div className="carrinho-titulo-container">
          <h1 className="carrinho-titulo-principal">Minha Conta</h1>
          <span className="carrinho-subcontador">
            Gerencie suas informações pessoais e preferências
          </span>
        </div>
        <Link to="/" className="link-continuar-comprando">
          Voltar para a vitrine ›
        </Link>
      </div>

      <div className="carrinho-grid-layout" style={{ marginTop: '24px' }}>
        {/* Bloco de Informações do Perfil */}
        <div className="carrinho-caixa-lista" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--cor-primaria, #232A60)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              {usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '4px' }}>{usuario.nome}</h2>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{usuario.email}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Pedidos Realizados</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--cor-primaria, #232A60)', marginTop: '4px' }}>{totalPedidos}</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Status da Conta</span>
              <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#16a34a', marginTop: '8px' }}>● Ativa / Simulada</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <Link
              to="/meus-pedidos"
              style={{
                background: 'var(--cor-primaria, #232A60)',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              Ver meus pedidos
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Sair da conta
            </button>
          </div>
        </div>

        {/* Card de Atalhos / Informações Adicionais */}
        <aside className="carrinho-resumo-card">
          <h2 className="resumo-titulo">Segurança e Dados</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5', marginBottom: '16px' }}>
            Como esta é uma aplicação simulada para estudos e portfólio, seus dados de acesso estão armazenados de forma segura localmente no navegador.
          </p>
          <div className="resumo-divisor"></div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Vitrine Alegre · Ambiente Seguro v1.0
          </span>
        </aside>
      </div>
    </main>
  );
}