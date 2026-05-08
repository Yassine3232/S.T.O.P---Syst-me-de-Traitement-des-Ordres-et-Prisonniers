import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

export default function Signin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [erreur, setErreur] = useState('');
  
  const navigate = useNavigate();
  const auth = useAuth();
  const login = auth.login;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newForm = { ...form };
    const name = e.target.name;
    const value = e.target.value;
    
    if (name === 'email') {
      newForm.email = value;
    } else if (name === 'password') {
      newForm.password = value;
    }
    
    setForm(newForm);
  }

  async function envoyerSignin() {
    if (form.email === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    if (form.password === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      const res = await axios.post('http://localhost:3000/auth/signin', form);
      login(res.data);
      navigate('/dashboard');
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        let msg = e.response.data.message;
        if (Array.isArray(msg)) {
          msg = msg[0];
        }
        setErreur(msg);
      } else {
        setErreur('Erreur de communication avec NestJS');
      }
    }
  }

  const barresArray = [];
  for (let i = 0; i < 8; i++) {
    barresArray.push(i);
  }

  let dateTexte = new Date().toLocaleDateString('fr-CA');

  return (
    <div className="prison-wrap">
      <div className="bars">
        {barresArray.map(function(i) {
          return <div className="bar" key={i} />;
        })}
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
        {erreur !== '' && <p className="status err">[ ERREUR ] {erreur}</p>}
        <div className="card-footer">
          <span>SYSTÈME v2.4</span>
          <span>{dateTexte}</span>
        </div>
      </div>
    </div>
  );
}