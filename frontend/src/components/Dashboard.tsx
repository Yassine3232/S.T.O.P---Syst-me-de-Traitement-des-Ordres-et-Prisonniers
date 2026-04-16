import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/signin');
    return null;
  }

  const isGarde = user.profile === 1;
  const isDirecteur = user.profile === 2;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dash-wrap">
      <div className="dash-sidebar">
        <div className="dash-logo">
          <div className="badge">S.T.O.P</div>
          <h2>Tableau<br />de bord</h2>
        </div>

        <div className="dash-user">
          <p className="dash-user-name">{user.name}</p>
          <p className="dash-user-role">{isGarde ? 'Garde' : 'Directeur'}</p>
        </div>

        <nav className="dash-nav">
          <button onClick={() => navigate('/incidents')}>Incidents</button>
          <button onClick={() => navigate('/prisonniers')}>Prisonniers</button>
          {isDirecteur && <button onClick={() => navigate('/visites')}>Visites</button>}
          {isDirecteur && <button onClick={() => navigate('/comptes')}>Comptes</button>}
        </nav>

        <button className="dash-logout" onClick={handleLogout}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <h1>Bienvenue, {user.name}</h1>
        <p>Sélectionnez une section dans le menu.</p>
      </div>
    </div>
  );
}