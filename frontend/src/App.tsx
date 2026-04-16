import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incidents" element={<div>Incidents — à venir</div>} />
          <Route path="/prisonniers" element={<div>Prisonniers — à venir</div>} />
          <Route path="/visites" element={<div>Visites — à venir</div>} />
          <Route path="/comptes" element={<div>Comptes — à venir</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;