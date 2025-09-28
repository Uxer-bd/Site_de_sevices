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
    <div style={{ padding: '5px' }}>
      <div className='banner'>
        <h1 style={{ fontSize : '50px', marginBottom : '10px', color : 'white' }}>Trouvez un contact pour un services</h1>
        {/* FORMULAIRE DE RECHERCHE ET DE FILTRAGE */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', width: '70%' }}>
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
      </div>

      {services.length === 0 ? (
        <p>Aucune Contace disponible pour le moment</p>
      ) : (
        <div style={{ margin : '0px 30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {services.map((service) => (
            <div key={service._id} className="card" style={{ 
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden',
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
              ':hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <div style={{ 
                position: 'relative',
                width: '100%',
                height: '200px',
                overflow: 'hidden'
              }}>
                {service.imageUrl ? (
                  <img
                    src={`http://localhost:5000${service.imageUrl}`}
                    alt={service.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px 8px 0 0'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px 8px 0 0'
                  }}>
                    <span style={{ color: '#666' }}>Aucune image</span>
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {service.price} XOF
                </div>
              </div>

              <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '10px', color: '#333' }}>{service.title}</h2>
                <p style={{ 
                  color: '#666',
                  marginBottom: '10px',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>{service.description}</p>
                
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: '#666' }}>📍</span>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>{service.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: '#666' }}>🏷️</span>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>{service.category}</span>
                  </div>
                  {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                    <span style={{ color: '#666' }}>👤</span>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>{service.prestataire?.email || 'N/A'}</span>
                  </div> */}

                  <Link 
                    href={`/service/${service._id}`}
                    className="btn btn-primary"
                    style={{
                      display: 'inline-block',
                      width: '100%',
                      textAlign: 'center',
                      padding: '10px',
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '5px',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    Contacter le service
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
};

export default Home;