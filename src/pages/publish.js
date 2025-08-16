// src/pages/publish.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const Publish = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('jardinage');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');

  const router = useRouter();
  const { isLoggedIn, userRole } = useAuth(); // Nous allons ajouter userRole au contexte

  useEffect(() => {
    // Redirige si l'utilisateur n'est pas connecté ou n'est pas un prestataire
    if (!isLoggedIn) {
      router.push('/login');
    } else if (!isLoggedIn || userRole !== 'prestataire') {
      router.push('/');
    }
  }, [isLoggedIn, userRole, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const serviceData = { title, description, category, price, location };

      await axios.post('http://localhost:5000/api/services', serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Annonce publiée avec succès !');
      router.push('/');
    } catch (error) {
      alert('Erreur lors de la publication de l\'annonce.');
      console.log(error);
    }
  };

  if (!isLoggedIn || userRole !== 'prestataire') {
    return <div>Redirection...</div>;
  }

  return (
    <div>
      <h1>Publier une annonce</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Catégorie:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="jardinage">Jardinage</option>
            <option value="maintenance auto">Maintenance auto</option>
            <option value="froid et climatisation">Froid et climatisation</option>
            <option value="ordinateur">Ordinateur</option>
            <option value="autres">Autres</option>
          </select>
        </div>
        <div>
          <label>Prix:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Localisation:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <button type="submit">Publier l'annonce</button>
      </form>
    </div>
  );
};

export default Publish;