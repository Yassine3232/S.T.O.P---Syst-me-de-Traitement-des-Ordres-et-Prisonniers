import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Incidents.css'; // même CSS

interface Prisonnier {
  numeroIdentification: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  accusation: string;
  dureePeine: number;
  dateArrivee: string;
  dateSortiePrevue: string;
  photoProfil?: string;
  cellule?: { nom: string };
}

interface PrisonnierForm {
  nom: string;
  prenom: string;
  dateNaissance: string;
  accusation: string;
  dureePeine: number | '';
  dateArrivee: string;
  dateSortiePrevue: string;
  celluleNom: string;
}

export default function Prisonniers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prisonniers, setPrisonniers] = useState<Prisonnier[]>([]);
  const [form, setForm] = useState<PrisonnierForm>({
    nom: '', prenom: '', dateNaissance: '', accusation: '',
    dureePeine: '', dateArrivee: '', dateSortiePrevue: '', celluleNom: '',
  });
  const [prisonnierModif, setPrisonnierModif] = useState<Prisonnier | null>(null);
  const [vue, setVue] = useState<'liste' | 'creer' | 'modifier'>('liste');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const isGarde = user?.profile === 1;
  const isDirecteur = user?.profile === 2;

  useEffect(() => { chargerPrisonniers(); }, []);

  const chargerPrisonniers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/prisonniers');
      setPrisonniers(res.data);
    } catch {
      setErreur('Erreur lors du chargement des prisonniers');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const creerPrisonnier = async () => {
    if (!form.nom || !form.prenom || !form.dateNaissance || !form.accusation || !form.dureePeine || !form.dateArrivee || !form.dateSortiePrevue || !form.celluleNom) {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    try {
      await axios.post('http://localhost:3000/prisonniers', { ...form, dureePeine: Number(form.dureePeine) });
      setMessage('Prisonnier créé avec succès');
      setErreur('');
      setForm({ nom: '', prenom: '', dateNaissance: '', accusation: '', dureePeine: '', dateArrivee: '', dateSortiePrevue: '', celluleNom: '' });
      setVue('liste');
      chargerPrisonniers();
    } catch (e: any) {
      setErreur(e.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const ouvrirModification = (p: Prisonnier) => {
    setPrisonnierModif(p);
    setForm({
      nom: p.nom, prenom: p.prenom, dateNaissance: p.dateNaissance,
      accusation: p.accusation, dureePeine: p.dureePeine,
      dateArrivee: p.dateArrivee, dateSortiePrevue: p.dateSortiePrevue,
      celluleNom: p.cellule?.nom || '',
    });
    setVue('modifier');
  };

  const modifierPrisonnier = async () => {
    if (!prisonnierModif) return;
    try {
      await axios.patch(`http://localhost:3000/prisonniers/${prisonnierModif.numeroIdentification}`, {
        ...form, dureePeine: Number(form.dureePeine),
      });
      setMessage('Prisonnier modifié avec succès');
      setErreur('');
      setVue('liste');
      chargerPrisonniers();
    } catch (e: any) {
      setErreur(e.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  const formulaire = (onSubmit: () => void, label: string) => (
    <div className="form-card">
      <div className="row">
        <div className="field-group">
          <label>Nom</label>
          <input name="nom" type="text" placeholder="ex: Dupont" value={form.nom} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Prénom</label>
          <input name="prenom" type="text" placeholder="ex: Jean" value={form.prenom} onChange={handleChange} />
        </div>
      </div>
      <div className="row">
        <div className="field-group">
          <label>Date de naissance</label>
          <input name="dateNaissance" type="date" value={form.dateNaissance} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Cellule</label>
          <input name="celluleNom" type="text" placeholder="ex: A1" value={form.celluleNom} onChange={handleChange} />
        </div>
      </div>
      <div className="field-group">
        <label>Accusation</label>
        <input name="accusation" type="text" placeholder="ex: Vol à main armée" value={form.accusation} onChange={handleChange} />
      </div>
      <div className="row">
        <div className="field-group">
          <label>Durée de peine (ans)</label>
          <input name="dureePeine" type="number" placeholder="ex: 5" value={form.dureePeine} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Date d'arrivée</label>
          <input name="dateArrivee" type="date" value={form.dateArrivee} onChange={handleChange} />
        </div>
      </div>
      <div className="field-group">
        <label>Date de sortie prévue</label>
        <input name="dateSortiePrevue" type="date" value={form.dateSortiePrevue} onChange={handleChange} />
      </div>
      <button className="btn" onClick={onSubmit}>{label}</button>
    </div>
  );

  return (
    <div className="dash-wrap">
      <div className="dash-sidebar">
        <div className="dash-logo">
          <div className="badge">S.T.O.P</div>
          <h2>Tableau<br />de bord</h2>
        </div>
        <div className="dash-user">
          <p className="dash-user-name">{user?.name}</p>
          <p className="dash-user-role">{isGarde ? 'Garde' : 'Directeur'}</p>
        </div>
        <nav className="dash-nav">
          <button onClick={() => navigate('/incidents')}>Incidents</button>
          <button className="active" onClick={() => navigate('/prisonniers')}>Prisonniers</button>
          {isDirecteur && <button onClick={() => navigate('/visites')}>Visites</button>}
          {isDirecteur && <button onClick={() => navigate('/comptes')}>Comptes</button>}
        </nav>
        <button className="dash-logout" onClick={() => navigate('/')}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <div className="page-header">
          <h1>Prisonniers</h1>
          <div className="header-actions">
            <button className={`tab-btn ${vue === 'liste' ? 'active' : ''}`} onClick={() => setVue('liste')}>Liste</button>
            {isGarde && (
              <button className={`tab-btn ${vue === 'creer' ? 'active' : ''}`} onClick={() => setVue('creer')}>+ Créer</button>
            )}
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
                  <th>Prénom</th>
                  <th>Accusation</th>
                  <th>Cellule</th>
                  <th>Sortie prévue</th>
                  {isDirecteur && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {prisonniers.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: '#888780' }}>Aucun prisonnier</td></tr>
                )}
                {prisonniers.map(p => (
                  <tr key={p.numeroIdentification}>
                    <td>{p.numeroIdentification}</td>
                    <td>{p.nom}</td>
                    <td>{p.prenom}</td>
                    <td><span className="tag">{p.accusation}</span></td>
                    <td>{p.cellule?.nom || '—'}</td>
                    <td>{p.dateSortiePrevue}</td>
                    {isDirecteur && (
                      <td>
                        <button className="action-btn edit" onClick={() => ouvrirModification(p)}>Modifier</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {vue === 'creer' && isGarde && formulaire(creerPrisonnier, 'Enregistrer le prisonnier')}

        {vue === 'modifier' && isDirecteur && formulaire(modifierPrisonnier, 'Sauvegarder les modifications')}
      </div>
    </div>
  );
}