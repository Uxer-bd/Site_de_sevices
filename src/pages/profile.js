// src/pages/profile.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login'); // Redirige si l'utilisateur n'est pas connecté
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        alert('Impossible de charger le profil.');
        router.push('/login');
      }
    };

    fetchProfile();
  }, [isLoggedIn, router]);

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Page de profil</h1>
      <p>Email : {user.email}</p>
      <p>Rôle : {user.role}</p>
      <p>id : {user.id}</p>
      {/* Ici, tu peux ajouter des informations spécifiques au rôle */}
    </div>
  );
};

export default Profile;