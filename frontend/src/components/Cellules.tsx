import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Incidents.css'; 

interface Prisonnier {
  numeroIdentification: number;
  nom: string;
  prenom: string;
}

interface Cellule {
  numeroIdentification: number;
  nom: string;
  prisonniers: Prisonnier[];
}

export default function Cellules() {
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();

  const [cellules, setCellules] = useState<Cellule[]>([]);
  const [erreur, setErreur] = useState('');

  let isGarde = false;
  if (user !== null && user.profile === 1) {
    isGarde = true;
  }

  let isDirecteur = false;
  if (user !== null && user.profile === 2) {
    isDirecteur = true;
  }

  useEffect(() => {
    chargerCellules();
  }, []);

  async function chargerCellules() {
    try {
      const res = await axios.get('http://localhost:3000/cellules');
      setCellules(res.data);
    } catch (e: any) {
      setErreur('Erreur lors du chargement des cellules');
    }
  }

  function allerAuxIncidents() { navigate('/incidents'); }
  function allerAuxPrisonniers() { navigate('/prisonniers'); }
  function allerAuxCellules() { navigate('/cellules'); }
  function allerAuxVisites() { navigate('/visites'); }
  function allerAuxComptes() { navigate('/comptes'); }
  function deconnexion() { navigate('/'); }

  let userName = '';
  if (user !== null && user.name) {
    userName = user.name;
  }

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
          <p className="dash-user-name">{userName}</p>
          <p className="dash-user-role">{roleTexte}</p>
        </div>
        <nav className="dash-nav">
          <button onClick={allerAuxIncidents}>Incidents</button>
          <button onClick={allerAuxPrisonniers}>Prisonniers</button>
          <button className="active" onClick={allerAuxCellules}>Cellules</button>
          <button onClick={allerAuxVisites}>Visites</button>
          {isDirecteur && <button onClick={allerAuxComptes}>Comptes</button>}
        </nav>
        <button className="dash-logout" onClick={deconnexion}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <div className="page-header">
          <h1>Gestion des Cellules</h1>
        </div>

        {erreur !== '' && <p className="status err">[ ERREUR ] {erreur}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom de la cellule</th>
                <th>Nombre de détenus</th>
                <th>Liste des détenus</th>
              </tr>
            </thead>
            <tbody>
              {cellules.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888780' }}>Aucune cellule trouvée</td></tr>
              )}
              {cellules.map(function(c) {
                let listeNoms = '';
                if (c.prisonniers && c.prisonniers.length > 0) {
                  for (let i = 0; i < c.prisonniers.length; i++) {
                    listeNoms += c.prisonniers[i].prenom + ' ' + c.prisonniers[i].nom;
                    if (i < c.prisonniers.length - 1) {
                      listeNoms += ', ';
                    }
                  }
                } else {
                  listeNoms = 'Aucun prisonnier';
                }

                let nombreDetenus = 0;
                if (c.prisonniers) {
                  nombreDetenus = c.prisonniers.length;
                }

                return (
                  <tr key={c.numeroIdentification}>
                    <td>{c.numeroIdentification}</td>
                    <td><span className="tag">{c.nom}</span></td>
                    <td>{nombreDetenus}</td>
                    <td>{listeNoms}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
