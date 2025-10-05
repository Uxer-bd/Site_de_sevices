// src/pages/register.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { email, password, role });
      alert(response.data);
      router.push('/login');
    } catch (error) {
      alert('Erreur lors de l&apos;inscription.');
    }
  };

  return (
    <div className='register-container'>
      <h1 style={{ marginBottom : '20px' }}>Inscription</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Rôle:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="client">Client</option>
            <option value="prestataire">Prestataire</option>
          </select>
        </div>
        <button type="submit">S&apos;inscrire</button>
      </form>
    </div>
  );
};

export default Register;