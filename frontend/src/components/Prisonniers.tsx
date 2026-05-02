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
  dureePeine: string;
  dateArrivee: string;
  dateSortiePrevue: string;
  celluleNom: string;
}

export default function Prisonniers() {
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();

  const [prisonniers, setPrisonniers] = useState<Prisonnier[]>([]);
  const [form, setForm] = useState<PrisonnierForm>({
    nom: '', 
    prenom: '', 
    dateNaissance: '', 
    accusation: '',
    dureePeine: '', 
    dateArrivee: '', 
    dateSortiePrevue: '', 
    celluleNom: '',
  });

  const [prisonnierModif, setPrisonnierModif] = useState<Prisonnier | null>(null);
  const [vue, setVue] = useState<'liste' | 'creer' | 'modifier'>('liste');
  const [message, setMessage] = useState('');
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
    chargerPrisonniers();
  }, []);

  async function chargerPrisonniers() {
    try {
      const res = await axios.get('http://localhost:3000/prisonniers');
      setPrisonniers(res.data);
    } catch (e: any) {
      setErreur('Erreur lors du chargement des prisonniers');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newForm = { ...form };
    const name = e.target.name;
    const value = e.target.value;
    
    if (name === 'nom') newForm.nom = value;
    else if (name === 'prenom') newForm.prenom = value;
    else if (name === 'dateNaissance') newForm.dateNaissance = value;
    else if (name === 'accusation') newForm.accusation = value;
    else if (name === 'dureePeine') newForm.dureePeine = value;
    else if (name === 'dateArrivee') newForm.dateArrivee = value;
    else if (name === 'dateSortiePrevue') newForm.dateSortiePrevue = value;
    else if (name === 'celluleNom') newForm.celluleNom = value;
    
    setForm(newForm);
  }

  async function creerPrisonnier() {
    if (form.nom === '' || form.prenom === '' || form.dateNaissance === '' || form.accusation === '' || form.dureePeine === '' || form.dateArrivee === '' || form.dateSortiePrevue === '' || form.celluleNom === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }

    try {
      await axios.post('http://localhost:3000/prisonniers', {
        nom: form.nom,
        prenom: form.prenom,
        dateNaissance: form.dateNaissance,
        accusation: form.accusation,
        dureePeine: Number(form.dureePeine),
        dateArrivee: form.dateArrivee,
        dateSortiePrevue: form.dateSortiePrevue,
        celluleNom: form.celluleNom
      });

      setMessage('Prisonnier créé avec succès');
      setErreur('');
      setForm({ nom: '', prenom: '', dateNaissance: '', accusation: '', dureePeine: '', dateArrivee: '', dateSortiePrevue: '', celluleNom: '' });
      setVue('liste');
      chargerPrisonniers();
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        setErreur(e.response.data.message);
      } else {
        setErreur('Erreur lors de la création');
      }
    }
  }

  function ouvrirModification(p: Prisonnier) {
    setPrisonnierModif(p);
    
    let cellName = '';
    if (p.cellule && p.cellule.nom) {
      cellName = p.cellule.nom;
    }

    setForm({
      nom: p.nom,
      prenom: p.prenom,
      dateNaissance: p.dateNaissance,
      accusation: p.accusation,
      dureePeine: p.dureePeine.toString(),
      dateArrivee: p.dateArrivee,
      dateSortiePrevue: p.dateSortiePrevue,
      celluleNom: cellName,
    });
    setVue('modifier');
  }

  async function modifierPrisonnier() {
    if (prisonnierModif === null) {
      return;
    }

    try {
      await axios.patch('http://localhost:3000/prisonniers/' + prisonnierModif.numeroIdentification, {
        nom: form.nom,
        prenom: form.prenom,
        dateNaissance: form.dateNaissance,
        accusation: form.accusation,
        dureePeine: Number(form.dureePeine),
        dateArrivee: form.dateArrivee,
        dateSortiePrevue: form.dateSortiePrevue,
        celluleNom: form.celluleNom
      });

      setMessage('Prisonnier modifié avec succès');
      setErreur('');
      setVue('liste');
      chargerPrisonniers();
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

  function changerVueListe() { setVue('liste'); }
  function changerVueCreer() { setVue('creer'); }

  let userName = '';
  if (user !== null && user.name) {
    userName = user.name;
  }

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

  let actionsHeader = null;
  if (isGarde) {
    actionsHeader = (
      <button className={classVueCreer} onClick={changerVueCreer}>+ Créer</button>
    );
  }

  let contenuPrincipal: any = null;

  if (vue === 'liste') {
    const lignesTableau: any[] = [];
    
    if (prisonniers.length === 0) {
      lignesTableau.push(
        <tr key="vide"><td colSpan={7} style={{ textAlign: 'center', color: '#888780' }}>Aucun prisonnier</td></tr>
      );
    } else {
      for (let i = 0; i < prisonniers.length; i++) {
        const p = prisonniers[i];
        let celluleNom = '—';
        if (p.cellule && p.cellule.nom) {
          celluleNom = p.cellule.nom;
        }

        let actionCell = null;
        if (isDirecteur) {
          actionCell = (
            <td>
              <button className="action-btn edit" onClick={function() { ouvrirModification(p); }}>Modifier</button>
            </td>
          );
        }

        lignesTableau.push(
          <tr key={p.numeroIdentification}>
            <td>{p.numeroIdentification}</td>
            <td>{p.nom}</td>
            <td>{p.prenom}</td>
            <td><span className="tag">{p.accusation}</span></td>
            <td>{celluleNom}</td>
            <td>{p.dateSortiePrevue}</td>
            {actionCell}
          </tr>
        );
      }
    }

    let enteteActions = null;
    if (isDirecteur) {
      enteteActions = <th>Actions</th>;
    }

    contenuPrincipal = (
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
              {enteteActions}
            </tr>
          </thead>
          <tbody>
            {lignesTableau}
          </tbody>
        </table>
      </div>
    );
  } else if (vue === 'creer' || vue === 'modifier') {
    let boutonPrincipal = null;
    if (vue === 'creer') {
      boutonPrincipal = <button className="btn" onClick={creerPrisonnier}>Enregistrer le prisonnier</button>;
    } else if (vue === 'modifier') {
      boutonPrincipal = <button className="btn" onClick={modifierPrisonnier}>Sauvegarder les modifications</button>;
    }

    contenuPrincipal = (
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
        <div style={{ display: 'flex', gap: '10px' }}>
          {boutonPrincipal}
          <button className="btn" style={{ backgroundColor: '#444' }} onClick={changerVueListe}>Annuler</button>
        </div>
      </div>
    );
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
          <button className="active" onClick={allerAuxPrisonniers}>Prisonniers</button>
          <button onClick={allerAuxCellules}>Cellules</button>
          <button onClick={allerAuxVisites}>Visites</button>
          {isDirecteur && <button onClick={allerAuxComptes}>Comptes</button>}
        </nav>
        <button className="dash-logout" onClick={deconnexion}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <div className="page-header">
          <h1>Prisonniers</h1>
          <div className="header-actions">
            {actionsHeader}
          </div>
        </div>

        {message !== '' && <p className="status ok">{message}</p>}
        {erreur !== '' && <p className="status err">[ ERREUR ] {erreur}</p>}

        {contenuPrincipal}
      </div>
    </div>
  );
}