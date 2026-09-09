import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [isCadastro, setIsCadastro] = useState(false);
  const [isEsqueceuSenha, setIsEsqueceuSenha] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [mensagemToast, setMensagemToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEsqueceuSenha) {
      // Simula o envio do e-mail de recuperação de senha
      if (!email) {
        setMensagemToast('Por favor, digite seu e-mail.');
      } else {
        setMensagemToast(`E-mail de recuperação enviado para ${email}! Verifique sua caixa de entrada.`);
      }

      setTimeout(() => {
        setMensagemToast(null);
        setIsEsqueceuSenha(false);
        setEmail('');
      }, 4000);
      return;
    }

    if (isCadastro) {
      localStorage.setItem('temp_email', email);
      localStorage.setItem('temp_senha', senha);
      localStorage.setItem('temp_nome', nome);

      setMensagemToast(`Conta criada com sucesso, ${nome}! Faça o login.`);
      
      setTimeout(() => {
        setMensagemToast(null);
        setIsCadastro(false);
        setSenha('');
      }, 2000);
    } else {
      const nomeUsuario = nome || localStorage.getItem('temp_nome') || email.split('@')[0];
      
      const dadosUsuario = { nome: nomeUsuario, email };
      localStorage.setItem('usuario_logado', JSON.stringify(dadosUsuario));

      setMensagemToast(`Bem-vindo(a) de volta, ${nomeUsuario}!`);
      
      setTimeout(() => {
        setMensagemToast(null);
        navigate('/');
      }, 1500);
    }
  };

  const preencherDadosCadastrados = () => {
    const emailSalvo = localStorage.getItem('temp_email');
    const senhaSalva = localStorage.getItem('temp_senha');
    if (emailSalvo && senhaSalva) {
      setEmail(emailSalvo);
      setSenha(senhaSalva);
    }
  };

  return (
    <main className="container-principal">
      <div className="auth-container">
        <div className="auth-card">
          {/* Abas para alternar entre Entrar e Cadastrar */}
          {!isEsqueceuSenha && (
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab-btn ${!isCadastro ? 'active' : ''}`}
                onClick={() => {
                  setIsCadastro(false);
                  preencherDadosCadastrados();
                }}
              >
                Entrar
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${isCadastro ? 'active' : ''}`}
                onClick={() => setIsCadastro(true)}
              >
                Cadastrar
              </button>
            </div>
          )}

          <h2 className="auth-titulo">
            {isEsqueceuSenha
              ? 'Recuperar senha'
              : isCadastro
              ? 'Criar sua conta'
              : 'Bem-vindo de volta!'}
          </h2>
          <p className="auth-subtitulo">
            {isEsqueceuSenha
              ? 'Digite seu e-mail para receber as instruções de recuperação.'
              : !isCadastro && 'Preencha os dados abaixo para acessar sua conta.'}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {isCadastro && (
              <div className="auth-campo">
                <label>Nome</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="auth-campo">
              <label>E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {!isEsqueceuSenha && (
              <div className="auth-campo">
                <label>Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Link de Esqueceu a Senha */}
            {!isCadastro && !isEsqueceuSenha && (
              <div style={{ textAlign: 'right', marginTop: '-8px' }}>
                <button
                  type="button"
                  onClick={() => setIsEsqueceuSenha(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--cor-primaria, #232A60)',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <button type="submit" className="btn-auth-submit">
              {isEsqueceuSenha ? 'Enviar E-mail de Recuperação' : isCadastro ? 'Cadastrar' : 'Entrar'}
            </button>
          </form>

          <div className="auth-footer-link" style={{ marginTop: '16px' }}>
            {isEsqueceuSenha ? (
              <button
                type="button"
                onClick={() => setIsEsqueceuSenha(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--cor-primaria, #232A60)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  textDecoration: 'underline',
                }}
              >
                ← Voltar para o login
              </button>
            ) : (
              <Link to="/">← Voltar para a vitrine</Link>
            )}
          </div>
        </div>
      </div>

      {/* Toast Flutuante de Notificação no Canto da Página */}
      {mensagemToast && (
        <div className="toast-sucesso">
          <span>✓ <strong>{mensagemToast}</strong></span>
        </div>
      )}
    </main>
  );
}