// src/pages/profile.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const { isLoggedIn, userRole } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login'); // Redirige si l&apos;utilisateur n&apos;est pas connecté
      return;
    }
    if (userRole !== 'prestataire') {
      router.push('/');
      return;
    }

    // Charger les informations du profil
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé');
          router.push('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Réponse du profil:', response.data);
        setUser(response.data);
        setPhoneNumber(response.data.numeroTelephone || '');
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    };

    fetchProfile();
  }, [isLoggedIn, userRole, router]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/profile', { numeroTelephone: phoneNumber }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Numéro de téléphone mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert('Erreur lors de la mise à jour du profil.');
    }
  };

  if (!isLoggedIn) {
    return null; // Le useEffect se chargera de la redirection
  }

  if (userRole !== 'prestataire') {
    return <div>Accès non autorisé. Cette page est réservée aux prestataires.</div>;
  }

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mon Profil de Prestataire</h1>
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label>Numéro de téléphone :</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Ex: 226 7X XX XX XX"
          />
        </div>
        <button type="submit">Enregistrer le numéro</button>
      </form>
    </div>
  );
};

export default Profile;