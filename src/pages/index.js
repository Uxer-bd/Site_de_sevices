// src/pages/index.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // États pour les filtres
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Construis l'URL avec les paramètres de requête
        const params = {
          category: categoryFilter,
          search: searchQuery,
          location: locationFilter,
        };
        const response = await axios.get('http://localhost:5000/api/services', { params });
        setServices(response.data);
      } catch (err) {
        setError('Impossible de charger les annonces. Veuillez réessayer plus tard.');
        console.error('Erreur de chargement des services:', err);
      } finally {
        setLoading(false);
      }
    };
    // Appelle la fonction de récupération des données à chaque changement de filtre
    fetchServices();
  }, [categoryFilter, searchQuery, locationFilter]); // Déclenche à chaque changement de filtre

  if (loading) {
    return <div>Chargement des annonces...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Découvrez nos services</h1>
      {/* FORMULAIRE DE RECHERCHE ET DE FILTRAGE */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Rechercher par titre ou description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <input
          type="text"
          placeholder="Filtrer par localisation..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '8px' }}>
          <option value="">Toutes les catégories</option>
          <option value="jardinage">Jardinage</option>
          <option value="maintenance auto">Maintenance auto</option>
          <option value="froid et climatisation">Froid et Climatisation</option>
          <option value="ordinateur">Ordinateur</option>
          <option value="autres">Autres</option>
        </select>
      </div>

      {services.length === 0 ? (
        <p>Aucune annonce de service disponible pour le moment.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {services.map((service) => (
            <div key={service._id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', boxShadow: '2px 2px 8px rgba(0,0,0,0.1)' }}>
              <h2>{service.title}</h2>
              <p>Description: {service.description}</p>
              <p>Catégorie: {service.category}</p>
              <p>Prix: {service.price} XOF</p>
              <p>Localisation: {service.location}</p>
              <p>Prestataire: {service.prestataire?.email || 'N/A'}</p>
              <Link href={`/service/${service._id}`} style={{ display: 'inline-block', marginTop: '10px', padding: '8px 15px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                Voir les détails
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;