import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

export default function DemandeVisite() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    prisonnierId: '',
    nomMembreFamille: '',
    lienFamilial: '',
  });
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const envoyerDemande = async () => {
    if (!form.prisonnierId || !form.nomMembreFamille || !form.lienFamilial) {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    try {
      await axios.post('http://localhost:3000/visites', {
        prisonnierId: Number(form.prisonnierId),
        nomMembreFamille: form.nomMembreFamille,
        lienFamilial: form.lienFamilial,
      });
      setMessage('Demande envoyée avec succès. Vous serez contacté pour confirmation.');
      setErreur('');
      setForm({ prisonnierId: '', nomMembreFamille: '', lienFamilial: '' });
    } catch (e: any) {
      setErreur(e.response?.data?.message || 'Erreur lors de l\'envoi de la demande');
    }
  };

  return (
    <div className="prison-wrap">
      <div className="bars">
        {Array.from({ length: 8 }).map((_, i) => <div className="bar" key={i} />)}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="badge">ÉTABLISSEMENT PÉNITENTIAIRE</div>
          <h1>Demande<br />de Visite</h1>
        </div>

        <div className="field-group">
          <label>Numéro d'identification du prisonnier</label>
          <input
            name="prisonnierId"
            type="number"
            placeholder="ex: 1042"
            value={form.prisonnierId}
            onChange={handleChange}
          />
        </div>

        <div className="field-group">
          <label>Votre nom complet</label>
          <input
            name="nomMembreFamille"
            type="text"
            placeholder="ex: Marie Dupont"
            value={form.nomMembreFamille}
            onChange={handleChange}
          />
        </div>

        <div className="field-group">
          <label>Lien familial</label>
          <input
            name="lienFamilial"
            type="text"
            placeholder="ex: Mère, Frère, Conjoint..."
            value={form.lienFamilial}
            onChange={handleChange}
          />
        </div>

        <button className="btn" onClick={envoyerDemande}>Soumettre la demande</button>

        {message && <p className="status ok">{message}</p>}
        {erreur && <p className="status err">[ ERREUR ] {erreur}</p>}

        <div className="card-footer">
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: '#888780', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', cursor: 'pointer' }}
          >
            Retour à l'accueil
          </button>
          <span>{new Date().toLocaleDateString('fr-CA')}</span>
        </div>
      </div>
    </div>
  );
}