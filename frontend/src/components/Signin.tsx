import { useState } from 'react';
import axios from 'axios';
import './Signup.css';

export default function Signin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [erreur, setErreur] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const envoyerSignin = async () => {
    if (!form.email || !form.password) {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3000/auth/signin', {
        email: form.email,
        password: form.password,
      });
      setErreur('');
      console.log('Connecté :', res.data);
      // TODO: rediriger vers le dashboard
    } catch (e: any) {
      setErreur(e.response?.data?.message || 'Erreur de communication avec NestJS');
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
          <h1>Accès<br />Sécurisé</h1>
        </div>

        <div className="field-group">
          <label>Adresse courriel</label>
          <input name="email" type="email" placeholder="ex: garde@prison.ca" value={form.email} onChange={handleChange} />
        </div>

        <div className="field-group">
          <label>Mot de passe</label>
          <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
        </div>

        <button className="btn" onClick={envoyerSignin}>Entrer</button>

        {erreur && <p className="status err">[ ERREUR ] {erreur}</p>}

        <div className="card-footer">
          <span>SYSTÈME v2.4</span>
          <span>{new Date().toLocaleDateString('fr-CA')}</span>
        </div>
      </div>
    </div>
  );
}