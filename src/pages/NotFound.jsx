import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    /* Contêiner principal com classes utilitárias para centralização e espaçamento do erro 404 */
    <div className="container-principal not-found-wrapper">
      {/* Cartão centralizado mimetizando o layout de busca vazia para manter a consistência visual */}
      <div className="busca-vazia-container not-found-card">
        {/* Círculo do ícone contendo o destaque em vermelho e o código numérico do erro */}
        <div className="busca-vazia-icone-circulo not-found-icone-bg">
          <span className="not-found-codigo">404</span>
        </div>
        {/* Título e descrição informando amigavelmente que a rota não existe */}
        <h3 className="busca-vazia-titulo">Página não encontrada</h3>
        <p className="busca-vazia-texto">A página que você está procurando não existe ou foi removida.</p>
        {/* Link de retorno direto para a página inicial da vitrine */}
        <Link to="/" className="btn-limpar-busca not-found-link">
          Voltar para a vitrine
        </Link>
      </div>
    </div>
  );
}