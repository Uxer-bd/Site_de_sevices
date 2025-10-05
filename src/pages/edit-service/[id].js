// src/pages/edit-service/[id].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const EditService = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isLoggedIn, userRole } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !isLoggedIn || userRole !== 'prestataire') {
      router.push('/');
      return;
    }

    const fetchService = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(response.data);
      } catch (error) {
        alert('Erreur lors du chargement des données de l\'annonce.');
        router.push('/my-services');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, isLoggedIn, userRole, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/services/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Annonce modifiée avec succès !');
      router.push('/my-services');
    } catch (error) {
      alert('Erreur lors de la modification de l\'annonce.');
      console.error(error);
    }
  };

  if (loading) {
    return <div>Chargement du formulaire...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Modifier une annonce</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Catégorie:</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="jardinage">Jardinage</option>
            <option value="maintenance auto">Maintenance auto</option>
            <option value="froid et climatisation">Froid et Climatisation</option>
            <option value="ordinateur">Ordinateur</option>
            <option value="autres">Autres</option>
          </select>
        </div>
        <div>
          <label>Prix:</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div>
          <label>Localisation:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <button type="submit">Modifier l&apos;annonce</button>
      </form>
    </div>
  );
};

export default EditService;