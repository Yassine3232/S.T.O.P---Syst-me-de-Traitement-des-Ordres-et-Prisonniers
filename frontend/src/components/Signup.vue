<template>
  <div class="prison-wrap">
    <div class="bars">
      <div class="bar" v-for="n in 8" :key="n"></div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="badge">S.T.O.P</div>
        <h1>Connexion</h1>
      </div>

      <div class="field-group">
        <label>Nom complet</label>
        <input v-model="form.name" type="text" placeholder="ex: Dupont" />
      </div>

      <div class="field-group">
        <label>Adresse courriel</label>
        <input v-model="form.email" type="email" placeholder="ex: dupont@prison.ca" />
      </div>

      <div class="row">
        <div class="field-group">
          <label>Mot de passe</label>
          <input v-model="form.password" type="password" placeholder="••••••••" />
        </div>
        <div class="field-group">
          <label>Profil</label>
          <input v-model="form.profile" type="number" placeholder="ex: 2" />
        </div>
      </div>

      <div class="field-group">
        <label>Date de naissance</label>
        <input v-model="form.dateNaissance" type="date" />
      </div>

      <button class="btn" @click="envoyerSignup">Se connecter</button>

      <p v-if="reponse" class="status ok">[ OK ] {{ reponse }}</p>
      <p v-if="erreur" class="status err">[ ERREUR ] {{ erreur }}</p>

      <div class="card-footer">
        <span>SYSTÈME v2.4</span>
        <span>{{ new Date().toLocaleDateString('fr-CA') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const form = ref({
  name: '', email: '', password: '',
  profile: null as number | null,
  dateNaissance: '',
});
const reponse = ref('');
const erreur = ref('');

const envoyerSignup = async () => {
  if (!form.value.name || !form.value.email || !form.value.password) {
    erreur.value = 'Veuillez remplir tous les champs obligatoires';
    return;
  }
  try {
    const res = await axios.post('http://localhost:3000/auth/signup', { ...form.value });
    reponse.value = res.data.message;
    erreur.value = '';
  } catch (e: any) {
    erreur.value = e.response?.data?.message || 'Erreur de communication avec NestJS';
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; }

.prison-wrap {
  min-height: 100vh;
  background: #1a1a18;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'IBM Plex Mono', monospace;
  position: relative;
  overflow: hidden;
}
.bars {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  gap: 60px;
  padding: 0 20px;
  pointer-events: none;
}
.bar {
  width: 6px;
  height: 100%;
  background: #2c2c28;
  opacity: 0.6;
}
.card {
  position: relative;
  z-index: 1;
  background: #f5f0e8;
  border: 3px solid #2c2c28;
  width: 100%;
  max-width: 440px;
  padding: 2.5rem;
}
.card-header {
  border-bottom: 3px solid #2c2c28;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}
.badge {
  display: inline-block;
  background: #2c2c28;
  color: #f5f0e8;
  font-size: 50px;
  letter-spacing: 0.15em;
  padding: 3px 8px;
  margin-bottom: 0.5rem;
}
h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 42px;
  color: #2c2c28;
  line-height: 1;
}
.field-group { margin-bottom: 1rem; }
label {
  display: block;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: #888780;
  margin-bottom: 4px;
  text-transform: uppercase;
}
input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 2px solid #2c2c28;
  padding: 6px 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  color: #2c2c28;
  outline: none;
}
input:focus { border-bottom-color: #b35c2a; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.btn {
  width: 100%;
  margin-top: 1.5rem;
  background: #2c2c28;
  color: #f5f0e8;
  border: none;
  padding: 14px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 20px;
  letter-spacing: 0.1em;
  cursor: pointer;
}
.btn:hover { background: #b35c2a; }
.status { margin-top: 1rem; font-size: 12px; text-align: center; }
.ok { color: #3B6D11; }
.err { color: #993C1D; }
.card-footer {
  border-top: 1px solid #b4b2a9;
  margin-top: 1.5rem;
  padding-top: 0.75rem;
  font-size: 10px;
  color: #888780;
  display: flex;
  justify-content: space-between;
}
</style>