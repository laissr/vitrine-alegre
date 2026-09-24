import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function MinhaConta() {
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
  });
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [editando, setEditando] = useState(false);
  const [mensagemToast, setMensagemToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Recupera os dados do usuário logado
    const usuarioSalvo = localStorage.getItem('usuario_logado');
    if (usuarioSalvo) {
      const dados = JSON.parse(usuarioSalvo);
      setUsuario({
        nome: dados.nome || '',
        email: dados.email || '',
        telefone: dados.telefone || '(27) 99999-9999',
        endereco: dados.endereco || 'Rua Principal, 123 - Alegre, ES',
      });
    } else {
      // Se não estiver logado, redireciona para a tela de login
      navigate('/entrar');
    }

    // Calcula a quantidade de pedidos salvos
    const pedidosSalvos = JSON.parse(localStorage.getItem('meus_pedidos') || '[]');
    setTotalPedidos(pedidosSalvos.length);
  }, [navigate]);

  const handleSalvarAlteracoes = (e) => {
    e.preventDefault();
    
    // Atualiza o localStorage com os novos dados
    localStorage.setItem('usuario_logado', JSON.stringify(usuario));
    
    setEditando(false);
    setMensagemToast('Dados atualizados com sucesso!');

    setTimeout(() => {
      setMensagemToast(null);
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario_logado');
    navigate('/');
    window.location.reload(); // Atualiza o header
  };

  if (!usuario.email) return null;

  return (
    <main className="container-principal">
      <div className="carrinho-topo-header">
        <div className="carrinho-titulo-container">
          <h1 className="carrinho-titulo-principal">Minha Conta</h1>
          <span className="carrinho-subcontador">
            Gerencie suas informações pessoais e preferências de cadastro
          </span>
        </div>
        <Link to="/" className="link-continuar-comprando">
          Voltar para a vitrine ›
        </Link>
      </div>

      <div className="carrinho-grid-layout" style={{ marginTop: '24px' }}>
        {/* Bloco Principal: Informações e Formulário de Edição */}
        <div className="carrinho-caixa-lista" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

            <button
              type="button"
              onClick={() => setEditando(!editando)}
              style={{
                background: editando ? '#e2e8f0' : 'var(--cor-fundo)',
                color: 'var(--cor-primaria)',
                border: '1px solid var(--cor-borda)',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {editando ? 'Cancelar' : 'Editar Dados'}
            </button>
          </div>

          {/* Estatísticas Rápidas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Pedidos Realizados</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--cor-primaria, #232A60)', marginTop: '4px' }}>{totalPedidos}</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Status da Conta</span>
              <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#16a34a', marginTop: '8px' }}>● Verificada</p>
            </div>
          </div>

          {/* Exibição ou Edição dos Dados */}
          {editando ? (
            <form onSubmit={handleSalvarAlteracoes} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--cor-primaria)' }}>Editar Informações Pessoais</h3>
              
              <div className="auth-campo">
                <label>Nome Completo</label>
                <input
                  type="text"
                  value={usuario.nome}
                  onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
                  required
                />
              </div>

              <div className="auth-campo">
                <label>E-mail</label>
                <input
                  type="email"
                  value={usuario.email}
                  onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                  required
                />
              </div>

              <div className="auth-campo">
                <label>Telefone / Celular</label>
                <input
                  type="text"
                  value={usuario.telefone}
                  onChange={(e) => setUsuario({ ...usuario, telefone: e.target.value })}
                />
              </div>

              <div className="auth-campo">
                <label>Endereço de Entrega</label>
                <input
                  type="text"
                  value={usuario.endereco}
                  onChange={(e) => setUsuario({ ...usuario, endereco: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn-adicionar" style={{ width: 'auto', padding: '10px 20px' }}>
                  Salvar Alterações
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--cor-primaria)', marginBottom: '4px' }}>Detalhes do Cadastro</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>Nome completo:</span>
                <span style={{ fontWeight: '600', color: '#1e293b' }}>{usuario.nome}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>E-mail:</span>
                <span style={{ fontWeight: '600', color: '#1e293b' }}>{usuario.email}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>Telefone:</span>
                <span style={{ fontWeight: '600', color: '#1e293b' }}>{usuario.telefone || 'Não informado'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>Endereço principal:</span>
                <span style={{ fontWeight: '600', color: '#1e293b' }}>{usuario.endereco || 'Não informado'}</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
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

        {/* Card Lateral de Atalhos e Configurações */}
        <aside className="carrinho-resumo-card">
          <h2 className="resumo-titulo">Central do Cliente</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <Link to="/meus-pedidos" style={{ fontSize: '0.875rem', color: 'var(--cor-primaria)', textDecoration: 'none', fontWeight: '500' }}>
              📦 Acompanhar entregas e pedidos
            </Link>
            <Link to="/carrinho" style={{ fontSize: '0.875rem', color: 'var(--cor-primaria)', textDecoration: 'none', fontWeight: '500' }}>
              🛒 Ver carrinho de compras
            </Link>
            <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--cor-primaria)', textDecoration: 'none', fontWeight: '500' }}>
              🛍️ Continuar comprando na vitrine
            </Link>
          </div>
        </aside>
      </div>

      {/* Toast Flutuante de Sucesso */}
      {mensagemToast && (
        <div className="toast-sucesso">
          <span>✓ <strong>{mensagemToast}</strong></span>
        </div>
      )}
    </main>
  );
}