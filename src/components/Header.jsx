import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';

export default function Header() {
  const { quantidadeTotal, mensagemSucesso } = useCarrinho();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const buscaUrl = searchParams.get('busca') || '';

  const [termo, setTermo] = useState(buscaUrl);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  
  const menuUsuarioRef = useRef(null);

  useEffect(() => {
    setTermo(buscaUrl);
    const usuario = localStorage.getItem('usuario_logado');
    if (usuario) {
      setUsuarioLogado(JSON.parse(usuario));
    } else {
      setUsuarioLogado(null);
    }
  }, [location]);

  useEffect(() => {
    function handleClickFora(event) {
      if (menuUsuarioRef.current && !menuUsuarioRef.current.contains(event.target)) {
        setMostrarMenuUsuario(false);
      }
    }
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario_logado');
    setUsuarioLogado(null);
    setMostrarMenuUsuario(false);
    setMenuMobileAberto(false);
    navigate('/');
  };

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setTermo(valor);

    const params = new URLSearchParams(location.search);
    if (valor) {
      params.set('busca', valor);
    } else {
      params.delete('busca');
    }
    params.set('pagina', '1');

    navigate(`/?${params.toString()}`);
  };

  return (
    <>
      <header className="cabecalho">
        <div className="cabecalho-conteudo">
          <div className="logo-e-menu">
            {/* Botão Hambúrguer visível apenas no mobile via CSS */}
            <button
              type="button"
              className="btn-menu-hamburger"
              onClick={() => setMenuMobileAberto(!menuMobileAberto)}
              aria-label="Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <Link to="/" className="logo-container">
              <div className="logo-icone">V</div>
              <span className="logo-texto-branco">Vitrine</span>
              <span className="logo-texto-verde">Alegre</span>
            </Link>
          </div>

          <div className="busca-header-container desktop-busca">
            <svg
              className="icone-busca"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              placeholder="Buscar produtos..."
              value={termo}
              onChange={handleInputChange}
              className="input-busca-header"
            />
          </div>

          <div className="acoes-header">
            {/* Exibido no Desktop */}
            <div className="desktop-usuario-area">
              {usuarioLogado ? (
                <div ref={menuUsuarioRef} style={{ position: 'relative', display: 'inline-block' }}>
                  <button
                    type="button"
                    onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: '500'
                    }}
                  >
                    Olá, <strong>{usuarioLogado.nome}</strong> ▾
                  </button>

                  {mostrarMenuUsuario && (
                    <div className="dropdown-usuario-menu">
                      <button
                        type="button"
                        className="dropdown-item-usuario"
                        onClick={() => {
                          setMostrarMenuUsuario(false);
                          navigate('/meus-pedidos');
                        }}
                      >
                        Meus pedidos
                      </button>
                      <button
                        type="button"
                        className="dropdown-item-usuario"
                        onClick={() => {
                          setMostrarMenuUsuario(false);
                          navigate('/minha-conta');
                        }}
                      >
                        Minha conta
                      </button>
                      <div className="dropdown-divisor"></div>
                      <button
                        type="button"
                        className="dropdown-item-usuario sair"
                        onClick={handleLogout}
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/entrar" className="btn-entrar-header">
                  Entrar
                </Link>
              )}
            </div>

            {/* Carrinho sempre visível */}
            <Link to="/carrinho" className="btn-carrinho-header">
              <div className="icone-carrinho-wrapper">
                <svg
                  className="icone-carrinho-svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>

                {quantidadeTotal > 0 && (
                  <span className="badge-carrinho-header">
                    {quantidadeTotal}
                  </span>
                )}
              </div>
              <span className="texto-carrinho-desktop">Carrinho</span>
            </Link>
          </div>
        </div>

        {/* Menu Dropdown Mobile ativado pelo botão hambúrguer */}
        {menuMobileAberto && (
          <div className="mobile-menu-dropdown">
            {usuarioLogado ? (
              <>
                <div className="mobile-menu-user-info">
                  Olá, <strong>{usuarioLogado.nome}</strong>
                </div>
                <button
                  type="button"
                  className="mobile-menu-item"
                  onClick={() => {
                    setMenuMobileAberto(false);
                    navigate('/meus-pedidos');
                  }}
                >
                  📦 Meus pedidos
                </button>
                <button
                  type="button"
                  className="mobile-menu-item"
                  onClick={() => {
                    setMenuMobileAberto(false);
                    navigate('/minha-conta');
                  }}
                >
                  ⚙️ Minha conta
                </button>
                <div className="dropdown-divisor"></div>
                <button
                  type="button"
                  className="mobile-menu-item sair"
                  onClick={handleLogout}
                >
                  🚪 Sair
                </button>
              </>
            ) : (
              <Link
                to="/entrar"
                className="mobile-menu-item"
                onClick={() => setMenuMobileAberto(false)}
              >
                🔐 Entrar / Cadastrar
              </Link>
            )}
          </div>
        )}

        <div className="busca-header-container mobile-busca">
          <svg
            className="icone-busca"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            placeholder="Buscar produtos..."
            value={termo}
            onChange={handleInputChange}
            className="input-busca-header"
          />
        </div>
      </header>

      {mensagemSucesso && (
        <div className="toast-sucesso">
          <span>✓ <strong>{mensagemSucesso}</strong> foi adicionado ao carrinho!</span>
        </div>
      )}
    </>
  );
}