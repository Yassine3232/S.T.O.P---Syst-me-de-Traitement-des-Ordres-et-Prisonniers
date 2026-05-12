import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  const barresArray = [];
  for (let i = 0; i < 8; i++) {
    barresArray.push(i);
  }

  function allerAuSignin() {
    navigate('/signin');
  }

  function allerADemandeVisite() {
    navigate('/visite');
  }

  let dateTexte = new Date().toLocaleDateString('fr-CA');

  return (
    <div className="prison-wrap">
      <div className="bars">
        {barresArray.map(function(i) {
          return <div className="bar" key={i} />;
        })}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="badge">ÉTABLISSEMENT PÉNITENTIAIRE</div>
          <h1>Système<br />S.T.O.P</h1>
        </div>

        <p className="subtitle">Système de Traitement des Ordres et Prisonniers</p>

        <div className="btn-group">
          <button className="btn" onClick={allerAuSignin}>
            Se connecter en tant qu'employé
          </button>
          <button className="btn btn-secondary" onClick={allerADemandeVisite}>
            Faire une demande de visite
          </button>
        </div>

        <div className="card-footer">
          <span>SYSTÈME v2.4</span>
          <span>{dateTexte}</span>
        </div>
      </div>
    </div>
  );
}