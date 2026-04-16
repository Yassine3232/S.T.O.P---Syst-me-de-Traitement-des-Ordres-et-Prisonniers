import { useState } from 'react';
import axios from 'axios';
import './Signup.css';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  profile: number | '';
  dateNaissance: string;
}

export default function Signup() {
  const [form, setForm] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    profile: '',
    dateNaissance: '',
  });
  const [reponse, setReponse] = useState('');
  const [erreur, setErreur] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const envoyerSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      setErreur('Veuillez remplir tous les champs obligatoires');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3000/auth/signup', {
        ...form,
        profile: Number(form.profile),
      });
      setReponse(res.data.message);
      setErreur('');
    } catch (e: any) {
      setErreur(e.response?.data?.message || 'Erreur de communication avec NestJS');
      setReponse('');
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
          <h1>Inscription<br />Détenu</h1>
        </div>

        <div className="field-group">
          <label>Nom complet</label>
          <input name="name" type="text" placeholder="ex: Dupont" value={form.name} onChange={handleChange} />
        </div>

        <div className="field-group">
          <label>Adresse courriel</label>
          <input name="email" type="email" placeholder="ex: dupont@prison.ca" value={form.email} onChange={handleChange} />
        </div>

        <div className="row">
          <div className="field-group">
            <label>Mot de passe</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label>Profil</label>
            <select name="profile" value={form.profile} onChange={handleChange}>
                <option value="">-- Choisir --</option>
                <option value={1}>Garde</option>
                <option value={2}>Directeur</option>
            </select>
          </div>
        </div>

        <div className="field-group">
          <label>Date de naissance</label>
          <input name="dateNaissance" type="date" value={form.dateNaissance} onChange={handleChange} />
        </div>

        <button className="btn" onClick={envoyerSignup}>Enregistrer le détenu</button>

        {reponse && <p className="status ok">[ OK ] {reponse}</p>}
        {erreur && <p className="status err">[ ERREUR ] {erreur}</p>}

        <div className="card-footer">
          <span>SYSTÈME v2.4</span>
          <span>{new Date().toLocaleDateString('fr-CA')}</span>
        </div>
      </div>
    </div>
  );
}