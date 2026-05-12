import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const auth = useAuth();
  const user = auth.user;
  const logout = auth.logout;
  const navigate = useNavigate();

  if (user === null || user === undefined) {
    navigate('/signin');
    return null;
  }

  let isGarde = false;
  if (user.profile === 1) {
    isGarde = true;
  }

  let isDirecteur = false;
  if (user.profile === 2) {
    isDirecteur = true;
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  function allerAuxIncidents() { navigate('/incidents'); }
  function allerAuxPrisonniers() { navigate('/prisonniers'); }
  function allerAuxCellules() { navigate('/cellules'); }
  function allerAuxVisites() { navigate('/visites'); }
  function allerAuxComptes() { navigate('/comptes'); }

  let roleTexte = 'Directeur';
  if (isGarde) {
    roleTexte = 'Garde';
  }

  return (
    <div className="dash-wrap">
      <div className="dash-sidebar">
        <div className="dash-logo">
          <div className="badge">S.T.O.P</div>
          <h2>Tableau<br />de bord</h2>
        </div>

        <div className="dash-user">
          <p className="dash-user-name">{user.name}</p>
          <p className="dash-user-role">{roleTexte}</p>
        </div>

        <nav className="dash-nav">
          <button onClick={allerAuxIncidents}>Incidents</button>
          <button onClick={allerAuxPrisonniers}>Prisonniers</button>
          <button onClick={allerAuxCellules}>Cellules</button>
          <button onClick={allerAuxVisites}>Visites</button>
          {isDirecteur && <button onClick={allerAuxComptes}>Comptes</button>}
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