// src/pages/login.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(response.data.token, response.data.role);
      alert('Connexion réussie !');
      router.push('/'); // Redirige vers la page d'accueil
    } catch (error) {
      alert('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className='login-container'>
      <h1 style={{ marginBottom : '20px' }}>Connexion</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Se connecter</button>
      </form>
      <h6 style={{ margin: '20px' }}>Vous n&apos;avez pas de compte ? Inscrivez-vous en tant que <Link href="/register" style={{ color: 'blue' }}>Prestataire</Link> ou <Link href="/register-client" style={{ color: 'blue' }}>Client</Link></h6>
    </div>
  );
};

export default Login;