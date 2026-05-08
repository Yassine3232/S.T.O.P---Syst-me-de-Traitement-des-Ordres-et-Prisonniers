import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Incidents.css';

interface Compte {
  id: number;
  name: string;
  email: string;
  profile: number;
  dateNaissance: string;
}

interface CompteForm {
  name: string;
  email: string;
  password: string;
  profile: string;
  dateNaissance: string;
}

interface ModifForm {
  name: string;
  email: string;
  dateNaissance: string;
}

function profileLabel(profile: number) {
  if (profile === 0) {
    return 'Visiteur';
  } else if (profile === 1) {
    return 'Garde';
  } else if (profile === 2) {
    return 'Directeur';
  } else {
    return 'Inconnu';
  }
}

export default function Comptes() {
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();

  const [comptes, setComptes] = useState<Compte[]>([]);
  const [vue, setVue] = useState<'liste' | 'creer' | 'modifier'>('liste');
  const [compteSelectionne, setCompteSelectionne] = useState<Compte | null>(null);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const [creerForm, setCruerForm] = useState<CompteForm>({
    name: '', 
    email: '', 
    password: '', 
    profile: '', 
    dateNaissance: '',
  });

  const [modifForm, setModifForm] = useState<ModifForm>({
    name: '', 
    email: '', 
    dateNaissance: '',
  });

  useEffect(() => {
    chargerComptes();
  }, []);

  async function chargerComptes() {
    try {
      const res = await axios.get('http://localhost:3000/auth');
      setComptes(res.data);
    } catch (e: any) {
      setErreur('Erreur lors du chargement des comptes');
    }
  }

  function handleCreerChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const newForm = { ...creerForm };
    const name = e.target.name;
    const value = e.target.value;
    
    if (name === 'name') newForm.name = value;
    else if (name === 'email') newForm.email = value;
    else if (name === 'password') newForm.password = value;
    else if (name === 'profile') newForm.profile = value;
    else if (name === 'dateNaissance') newForm.dateNaissance = value;
    
    setCruerForm(newForm);
  }

  function handleModifChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newForm = { ...modifForm };
    const name = e.target.name;
    const value = e.target.value;
    
    if (name === 'name') newForm.name = value;
    else if (name === 'email') newForm.email = value;
    else if (name === 'dateNaissance') newForm.dateNaissance = value;
    
    setModifForm(newForm);
  }

  async function creerCompte() {
    if (creerForm.name === '' || creerForm.email === '' || creerForm.password === '' || creerForm.profile === '' || creerForm.dateNaissance === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      await axios.post('http://localhost:3000/auth/signup', {
        name: creerForm.name,
        email: creerForm.email,
        password: creerForm.password,
        profile: Number(creerForm.profile),
        dateNaissance: creerForm.dateNaissance
      });

      setMessage('Compte créé avec succès');
      setErreur('');
      setCruerForm({ name: '', email: '', password: '', profile: '', dateNaissance: '' });
      setVue('liste');
      chargerComptes();
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        setErreur(e.response.data.message);
      } else {
        setErreur('Erreur lors de la création');
      }
    }
  }

  function ouvrirModification(c: Compte) {
    setCompteSelectionne(c);
    setModifForm({ 
      name: c.name, 
      email: c.email, 
      dateNaissance: c.dateNaissance 
    });
    setVue('modifier');
  }

  async function modifierCompte() {
    if (compteSelectionne === null) {
      return;
    }
    
    try {
      await axios.patch('http://localhost:3000/auth/' + compteSelectionne.id, modifForm);
      setMessage('Compte modifié avec succès');
      setErreur('');
      setVue('liste');
      chargerComptes();
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        setErreur(e.response.data.message);
      } else {
        setErreur('Erreur lors de la modification');
      }
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

  function changerVueListe() {
    setVue('liste');
    setErreur('');
    setMessage('');
  }

  function changerVueCreer() {
    setVue('creer');
    setCruerForm({ name: '', email: '', password: '', profile: '', dateNaissance: '' });
    setErreur('');
    setMessage('');
  }

  const isGarde = user?.profile === 1;
  let roleTexte = 'Directeur';
  if (isGarde) {
    roleTexte = 'Garde';
  }

  let classVueListe = 'tab-btn';
  if (vue === 'liste') {
    classVueListe = 'tab-btn active';
  }

  let classVueCreer = 'tab-btn';
  if (vue === 'creer') {
    classVueCreer = 'tab-btn active';
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
          <button onClick={allerAuxCellules}>Cellules</button>
          <button onClick={allerAuxVisites}>Visites</button>
          <button className="active" onClick={allerAuxComptes}>Comptes</button>
        </nav>
        <button className="dash-logout" onClick={deconnexion}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <div className="page-header">
          <h1>Comptes</h1>
          <div className="header-actions">
            <button className={classVueListe} onClick={changerVueListe}>
              Liste
            </button>
            <button className={classVueCreer} onClick={changerVueCreer}>
              + Créer
            </button>
          </div>
        </div>

        {message !== '' && <p className="status ok">{message}</p>}
        {erreur !== '' && <p className="status err">[ ERREUR ] {erreur}</p>}

        {vue === 'liste' && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>Courriel</th>
                  <th>Profil</th>
                  <th>Date de naissance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comptes.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888780' }}>Aucun compte</td></tr>
                )}
                {comptes.map(function(c) {
                  return (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                      <td><span className="tag">{profileLabel(c.profile)}</span></td>
                      <td>{c.dateNaissance}</td>
                      <td>
                        <button className="action-btn edit" onClick={function() { ouvrirModification(c); }}>
                          Modifier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {vue === 'creer' && (
          <div className="form-card">
            <div className="row">
              <div className="field-group">
                <label>Nom</label>
                <input
                  name="name"
                  type="text"
                  placeholder="ex: Dupont"
                  value={creerForm.name}
                  onChange={handleCreerChange}
                />
              </div>
              <div className="field-group">
                <label>Courriel</label>
                <input
                  name="email"
                  type="email"
                  placeholder="ex: dupont@prison.ca"
                  value={creerForm.email}
                  onChange={handleCreerChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="field-group">
                <label>Mot de passe</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={creerForm.password}
                  onChange={handleCreerChange}
                />
              </div>
              <div className="field-group">
                <label>Profil</label>
                <select
                  name="profile"
                  value={creerForm.profile}
                  onChange={handleCreerChange}
                >
                  <option value="">-- Choisir --</option>
                  <option value={1}>Garde</option>
                  <option value={2}>Directeur</option>
                </select>
              </div>
            </div>
            <div className="field-group">
              <label>Date de naissance</label>
              <input
                name="dateNaissance"
                type="date"
                value={creerForm.dateNaissance}
                onChange={handleCreerChange}
              />
            </div>
            <button className="btn" onClick={creerCompte}>Créer le compte</button>
          </div>
        )}

        {vue === 'modifier' && compteSelectionne !== null && (
          <div className="form-card">
            <div className="row">
              <div className="field-group">
                <label>Nom</label>
                <input
                  name="name"
                  type="text"
                  value={modifForm.name}
                  onChange={handleModifChange}
                />
              </div>
              <div className="field-group">
                <label>Courriel</label>
                <input
                  name="email"
                  type="email"
                  value={modifForm.email}
                  onChange={handleModifChange}
                />
              </div>
            </div>
            <div className="field-group">
              <label>Date de naissance</label>
              <input
                name="dateNaissance"
                type="date"
                value={modifForm.dateNaissance}
                onChange={handleModifChange}
              />
            </div>
            <button className="btn" onClick={modifierCompte}>Sauvegarder</button>
          </div>
        )}
      </div>
    </div>
  );
}