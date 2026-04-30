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

interface Visite {
  id: number;
  nomMembreFamille: string;
  lienFamilial: string;
  statut: string;
  dateVisite?: string;
  motifRefus?: string;
  prisonnier: Prisonnier;
}

export default function Visites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visites, setVisites] = useState<Visite[]>([]);
  const [vue, setVue] = useState<'toutes' | 'attente'>('toutes');
  const [erreur, setErreur] = useState('');
  const [message, setMessage] = useState('');
  const [reponseForm, setReponseForm] = useState<{ statut: string; dateVisite: string; motifRefus: string }>({ statut: '', dateVisite: '', motifRefus: '' });
  const [visiteSelectionnee, setVisiteSelectionnee] = useState<Visite | null>(null);

  useEffect(() => { chargerVisites(); }, [vue]);

  const chargerVisites = async () => {
    try {
      const url = vue === 'attente'
        ? 'http://localhost:3000/visites/en-attente'
        : 'http://localhost:3000/visites';
      const res = await axios.get(url);
      setVisites(res.data);
    } catch {
      setErreur('Erreur lors du chargement des visites');
    }
  };

  const ouvrirReponse = (v: Visite) => {
    setVisiteSelectionnee(v);
    setReponseForm({ statut: '', dateVisite: '', motifRefus: '' });
  };

  const envoyerReponse = async () => {
    if (!visiteSelectionnee || !reponseForm.statut) return;
    try {
      await axios.patch(`http://localhost:3000/visites/${visiteSelectionnee.id}/repondre`, reponseForm);
      setMessage('Réponse envoyée avec succès');
      setVisiteSelectionnee(null);
      chargerVisites();
    } catch (e: any) {
      setErreur(e.response?.data?.message || 'Erreur lors de la réponse');
    }
  };

  const statutTag = (statut: string) => {
    const couleurs: Record<string, string> = {
      en_attente: '#b35c2a',
      approuve: '#3B6D11',
      refuse: '#993C1D',
    };
    return (
      <span style={{
        background: couleurs[statut] || '#2c2c28',
        color: '#f5f0e8',
        fontSize: '10px',
        padding: '2px 8px',
        letterSpacing: '0.08em',
      }}>
        {statut.replace('_', ' ').toUpperCase()}
      </span>
    );
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
          <button className="active" onClick={() => navigate('/visites')}>Visites</button>
          <button onClick={() => navigate('/comptes')}>Comptes</button>
        </nav>
        <button className="dash-logout" onClick={() => navigate('/')}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <div className="page-header">
          <h1>Visites</h1>
          <div className="header-actions">
            <button className={`tab-btn ${vue === 'toutes' ? 'active' : ''}`} onClick={() => setVue('toutes')}>
              Toutes
            </button>
            <button className={`tab-btn ${vue === 'attente' ? 'active' : ''}`} onClick={() => setVue('attente')}>
              En attente
            </button>
          </div>
        </div>

        {message && <p className="status ok">{message}</p>}
        {erreur && <p className="status err">[ ERREUR ] {erreur}</p>}

        {visiteSelectionnee && (
          <div className="form-card" style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '13px', marginBottom: '1rem', color: '#2c2c28' }}>
              Répondre à la demande de <strong>{visiteSelectionnee.nomMembreFamille}</strong> pour le prisonnier <strong>{visiteSelectionnee.prisonnier.nom} {visiteSelectionnee.prisonnier.prenom}</strong>
            </p>
            <div className="field-group">
              <label>Décision</label>
              <select value={reponseForm.statut} onChange={e => setReponseForm({ ...reponseForm, statut: e.target.value })}>
                <option value="">-- Choisir --</option>
                <option value="approuve">Approuver</option>
                <option value="refuse">Refuser</option>
              </select>
            </div>
            {reponseForm.statut === 'approuve' && (
              <div className="field-group">
                <label>Date de visite</label>
                <input type="datetime-local" value={reponseForm.dateVisite} onChange={e => setReponseForm({ ...reponseForm, dateVisite: e.target.value })} />
              </div>
            )}
            {reponseForm.statut === 'refuse' && (
              <div className="field-group">
                <label>Motif de refus</label>
                <input type="text" placeholder="ex: Dossier incomplet" value={reponseForm.motifRefus} onChange={e => setReponseForm({ ...reponseForm, motifRefus: e.target.value })} />
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="btn" onClick={envoyerReponse}>Confirmer</button>
              <button className="btn" style={{ background: 'transparent', color: '#2c2c28', border: '2px solid #2c2c28' }} onClick={() => setVisiteSelectionnee(null)}>Annuler</button>
            </div>
          </div>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Membre de la famille</th>
                <th>Lien</th>
                <th>Prisonnier</th>
                <th>Statut</th>
                <th>Date de visite</th>
                <th>Motif de refus</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visites.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#888780' }}>Aucune visite</td></tr>
              )}
              {visites.map(v => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.nomMembreFamille}</td>
                  <td>{v.lienFamilial}</td>
                  <td>{v.prisonnier.nom} {v.prisonnier.prenom}</td>
                  <td>{statutTag(v.statut)}</td>
                  <td>{v.dateVisite || '—'}</td>
                  <td>{v.motifRefus || '—'}</td>
                  <td>
                    {v.statut === 'en_attente' && (
                      <button className="action-btn edit" onClick={() => ouvrirReponse(v)}>
                        Répondre
                      </button>
                    )}
                    <button className="action-btn delete" onClick={async () => {
                      if (!confirm('Supprimer cette visite ?')) return;
                      await axios.delete(`http://localhost:3000/visites/${v.id}`);
                      chargerVisites();
                    }}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}