import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="prison-wrap">
      <div className="bars">
        {Array.from({ length: 8 }).map((_, i) => <div className="bar" key={i} />)}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="badge">ÉTABLISSEMENT PÉNITENTIAIRE</div>
          <h1>Système<br />S.T.O.P</h1>
        </div>

        <p className="subtitle">Système de Traitement des Ordres et Prisonniers</p>

        <div className="btn-group">
          <button className="btn" onClick={() => navigate('/signin')}>
            Se connecter en tant qu'employé
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/visite')}>
            Faire une demande de visite
          </button>
        </div>

        <div className="card-footer">
          <span>SYSTÈME v2.4</span>
          <span>{new Date().toLocaleDateString('fr-CA')}</span>
        </div>
      </div>
    </div>
  );
}