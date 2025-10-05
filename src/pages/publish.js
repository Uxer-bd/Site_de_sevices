// src/pages/publish.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Image from 'next/image';

const Publish = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('jardinage');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const router = useRouter();
  const { isLoggedIn, userRole } = useAuth(); // Nous allons ajouter userRole au contexte

  useEffect(() => {
    // Redirige si l&apos;utilisateur n&apos;est pas connecté ou n&apos;est pas un prestataire
    if (!isLoggedIn) {
      router.push('/login');
    } else if (!isLoggedIn || userRole !== 'prestataire') {
      router.push('/');
    }
  }, [isLoggedIn, userRole, router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('location', location);
      if (image) {
        formData.append('image', image);
      }

      await axios.post('http://localhost:5000/api/services', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
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
        <div>
          <label>Image du service:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: '10px' }}
          />
          {previewUrl && (
            <div style={{ marginTop: '10px' }}>
              <p>Aperçu de l&apos;image:</p>
              <Image
                src={previewUrl}
                alt="Aperçu"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Publier l&apos;annonce
        </button>
      </form>
    </div>
  );
};

export default Publish;