export default function Rodape() {
  return (
    /* Tag semântica de rodapé do HTML5 estilizada com a classe global */
    <footer className="rodape">
      <div className="rodape-conteudo">
        {/* Bloco esquerdo: logomarca e informações institucionais/acadêmicas do projeto */}
        <div className="rodape-info-esquerda">
          <div className="logo-container">
            <div className="logo-icone">V</div>
            <span className="logo-texto-branco">Vitrine</span>
            <span className="logo-texto-verde">Alegre</span>
          </div>
          <p className="rodape-projeto">
            Projeto acadêmico · Ifes Campus de Alegre · TADS
          </p>
        </div>

        {/* Bloco direito: avisos legais sobre a origem dos dados da API e fito fictional dos produtos */}
        <div className="rodape-info-direita">
          <p>Dados: dummyjson.com</p>
          <p>Imagens e produtos são fictícios</p>
        </div>
      </div>
    </footer>
  );
}
