import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Incidents.css';

interface Incident {
  id: number;
  type: string;
  description: string;
  dateHeure: string;
  rapportePar: string;
  prisonniers: any[];
}

interface IncidentForm {
  type: string;
  description: string;
  dateHeure: string;
  rapportePar: string;
  prisonniersIds: string;
}

export default function Incidents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [form, setForm] = useState<IncidentForm>({ 
  type: '', 
  description: '', 
  dateHeure: '', 
  rapportePar: '',
  prisonniersIds: '',
});
  const [vue, setVue] = useState<'liste' | 'creer'>('liste');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const isGarde = user?.profile === 1;
  const isDirecteur = user?.profile === 2;

  useEffect(() => {
    chargerIncidents();
  }, []);

  const chargerIncidents = async () => {
    try {
      const res = await axios.get('http://localhost:3000/incidents');
      setIncidents(res.data);
    } catch (e: any) {
      setErreur('Erreur lors du chargement des incidents');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const creerIncident = async () => {
    if (!form.type || !form.description || !form.dateHeure || !form.rapportePar || !form.prisonniersIds) {
        setErreur('Veuillez remplir tous les champs');
        return;
    }
    try {
        await axios.post('http://localhost:3000/incidents', {
        ...form,
        prisonniersIds: form.prisonniersIds.split(',').map(id => Number(id.trim())),
        });
        setMessage('Incident créé avec succès');
        setErreur('');
        setForm({ type: '', description: '', dateHeure: '', rapportePar: '', prisonniersIds: '' });
        setVue('liste');
        chargerIncidents();
    } catch (e: any) {
        setErreur(e.response?.data?.message || 'Erreur lors de la création');
    }
    };

  const supprimerIncident = async (id: number) => {
    if (!confirm('Confirmer la suppression ?')) return;
    try {
      await axios.delete(`http://localhost:3000/incidents/${id}`);
      chargerIncidents();
    } catch (e: any) {
      setErreur('Erreur lors de la suppression');
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
          <p className="dash-user-role">{isGarde ? 'Garde' : 'Directeur'}</p>
        </div>
        <nav className="dash-nav">
          <button onClick={() => navigate('/incidents')} className="active">Incidents</button>
          <button onClick={() => navigate('/prisonniers')}>Prisonniers</button>
          {isDirecteur && <button onClick={() => navigate('/visites')}>Visites</button>}
          {isDirecteur && <button onClick={() => navigate('/comptes')}>Comptes</button>}
        </nav>
        <button className="dash-logout" onClick={() => navigate('/')}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <div className="page-header">
          <h1>Incidents</h1>
          <div className="header-actions">
            <button className={`tab-btn ${vue === 'liste' ? 'active' : ''}`} onClick={() => setVue('liste')}>
              Liste
            </button>
            {isGarde && (
              <button className={`tab-btn ${vue === 'creer' ? 'active' : ''}`} onClick={() => setVue('creer')}>
                + Créer
              </button>
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
                  <th>Type</th>
                  <th>Description</th>
                  <th>Date / Heure</th>
                  <th>Rapporté par</th>
                  {isDirecteur && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {incidents.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888780' }}>Aucun incident</td></tr>
                )}
                {incidents.map(inc => (
                  <tr key={inc.id}>
                    <td>{inc.id}</td>
                    <td><span className="tag">{inc.type}</span></td>
                    <td>{inc.description}</td>
                    <td>{inc.dateHeure}</td>
                    <td>{inc.rapportePar}</td>
                    {isDirecteur && (
                      <td>
                        <button className="action-btn edit" onClick={() => navigate(`/incidents/${inc.id}/modifier`)}>
                          Modifier
                        </button>
                        <button className="action-btn delete" onClick={() => supprimerIncident(inc.id)}>
                          Supprimer
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {vue === 'creer' && isGarde && (
          <div className="form-card">
            <div className="field-group">
              <label>Type d'incident</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="">-- Choisir --</option>
                <option value="Bagarre">Bagarre</option>
                <option value="Évasion">Évasion</option>
                <option value="Contrebande">Contrabande</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="field-group">
              <label>Description</label>
              <textarea name="description" placeholder="Décrivez l'incident..." value={form.description} onChange={handleChange} rows={4} />
            </div>
            <div className="row">
                <div className="field-group">
                    <label>Date et heure</label>
                    <input name="dateHeure" type="datetime-local" value={form.dateHeure} onChange={handleChange} />
                </div>
                <div className="field-group">
                    <label>Rapporté par</label>
                    <input name="rapportePar" type="text" placeholder="Nom du garde..." value={form.rapportePar} onChange={handleChange} />
                </div>
                </div>
                <div className="field-group">
                <label>IDs des prisonniers impliqués</label>
                <input name="prisonniersIds" type="text" placeholder="ex: 1, 2, 3" value={form.prisonniersIds} onChange={handleChange} />
                </div>
                <button className="btn" onClick={creerIncident}>Créer l'incident</button>
          </div>
        )}
      </div>
    </div>
  );
}