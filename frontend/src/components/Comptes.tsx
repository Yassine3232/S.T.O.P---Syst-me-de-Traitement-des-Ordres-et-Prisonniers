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
  profile: number | '';
  dateNaissance: string;
}

interface ModifForm {
  name: string;
  email: string;
  dateNaissance: string;
}

const profileLabel = (profile: number) => {
  if (profile === 0) return 'Visiteur';
  if (profile === 1) return 'Garde';
  if (profile === 2) return 'Directeur';
  return 'Inconnu';
};

export default function Comptes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [vue, setVue] = useState<'liste' | 'creer' | 'modifier'>('liste');
  const [compteSelectionne, setCompteSelectionne] = useState<Compte | null>(null);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const [creerForm, setCruerForm] = useState<CompteForm>({
    name: '', email: '', password: '', profile: '', dateNaissance: '',
  });

  const [modifForm, setModifForm] = useState<ModifForm>({
    name: '', email: '', dateNaissance: '',
  });

  useEffect(() => { chargerComptes(); }, []);

  const chargerComptes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/auth');
      setComptes(res.data);
    } catch {
      setErreur('Erreur lors du chargement des comptes');
    }
  };

  const creerCompte = async () => {
    if (!creerForm.name || !creerForm.email || !creerForm.password || creerForm.profile === '' || !creerForm.dateNaissance) {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    try {
      await axios.post('http://localhost:3000/auth/signup', {
        ...creerForm,
        profile: Number(creerForm.profile),
      });
      setMessage('Compte créé avec succès');
      setErreur('');
      setCruerForm({ name: '', email: '', password: '', profile: '', dateNaissance: '' });
      setVue('liste');
      chargerComptes();
    } catch (e: any) {
      setErreur(e.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const ouvrirModification = (c: Compte) => {
    setCompteSelectionne(c);
    setModifForm({ name: c.name, email: c.email, dateNaissance: c.dateNaissance });
    setVue('modifier');
  };

  const modifierCompte = async () => {
    if (!compteSelectionne) return;
    try {
      await axios.patch(`http://localhost:3000/auth/${compteSelectionne.id}`, modifForm);
      setMessage('Compte modifié avec succès');
      setErreur('');
      setVue('liste');
      chargerComptes();
    } catch (e: any) {
      setErreur(e.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  return (
    <div className="dash-wrap">
      <div className="dash-sidebar">
        <div className="dash-logo">
          <div className="badge">S.T.O.P</div>
          <h2>Tableau<br />de bord</h2>
        </div>
        <div className="dash-user">
          <p className="dash-user-name">{user?.name}</p>
          <p className="dash-user-role">Directeur</p>
        </div>
        <nav className="dash-nav">
          <button onClick={() => navigate('/incidents')}>Incidents</button>
          <button onClick={() => navigate('/prisonniers')}>Prisonniers</button>
          <button onClick={() => navigate('/visites')}>Visites</button>
          <button className="active" onClick={() => navigate('/comptes')}>Comptes</button>
        </nav>
        <button className="dash-logout" onClick={() => navigate('/')}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <div className="page-header">
          <h1>Comptes</h1>
          <div className="header-actions">
            <button className={`tab-btn ${vue === 'liste' ? 'active' : ''}`} onClick={() => setVue('liste')}>
              Liste
            </button>
            <button className={`tab-btn ${vue === 'creer' ? 'active' : ''}`} onClick={() => setVue('creer')}>
              + Créer
            </button>
          </div>
        </div>

        {message && <p className="status ok">{message}</p>}
        {erreur && <p className="status err">[ ERREUR ] {erreur}</p>}

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
                {comptes.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td><span className="tag">{profileLabel(c.profile)}</span></td>
                    <td>{c.dateNaissance}</td>
                    <td>
                      <button className="action-btn edit" onClick={() => ouvrirModification(c)}>
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
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
                  type="text"
                  placeholder="ex: Dupont"
                  value={creerForm.name}
                  onChange={e => setCruerForm({ ...creerForm, name: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Courriel</label>
                <input
                  type="email"
                  placeholder="ex: dupont@prison.ca"
                  value={creerForm.email}
                  onChange={e => setCruerForm({ ...creerForm, email: e.target.value })}
                />
              </div>
            </div>
            <div className="row">
              <div className="field-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={creerForm.password}
                  onChange={e => setCruerForm({ ...creerForm, password: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Profil</label>
                <select
                  value={creerForm.profile}
                  onChange={e => setCruerForm({ ...creerForm, profile: Number(e.target.value) })}
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
                type="date"
                value={creerForm.dateNaissance}
                onChange={e => setCruerForm({ ...creerForm, dateNaissance: e.target.value })}
              />
            </div>
            <button className="btn" onClick={creerCompte}>Créer le compte</button>
          </div>
        )}

        {vue === 'modifier' && compteSelectionne && (
          <div className="form-card">
            <div className="row">
              <div className="field-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={modifForm.name}
                  onChange={e => setModifForm({ ...modifForm, name: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Courriel</label>
                <input
                  type="email"
                  value={modifForm.email}
                  onChange={e => setModifForm({ ...modifForm, email: e.target.value })}
                />
              </div>
            </div>
            <div className="field-group">
              <label>Date de naissance</label>
              <input
                type="date"
                value={modifForm.dateNaissance}
                onChange={e => setModifForm({ ...modifForm, dateNaissance: e.target.value })}
              />
            </div>
            <button className="btn" onClick={modifierCompte}>Sauvegarder</button>
          </div>
        )}
      </div>
    </div>
  );
}