// src/pages/my-services.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Link from 'next/link';

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isLoggedIn, userRole } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || userRole !== 'prestataire') {
      router.push('/');
      return;
    }

    const fetchMyServices = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Affiche le token
        const response = await axios.get('http://localhost:5000/api/services/my-services', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Réponse du serveur:', response.data); // Affiche les données reçues
        setServices(response.data);
      } catch (error) {
        alert('Erreur lors du chargement de vos annonces.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyServices();
  }, [isLoggedIn, userRole, router]);

  const handleDelete = async (serviceId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/services/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Met à jour la liste après la suppression
        setServices(services.filter(service => service._id !== serviceId));
        alert('Annonce supprimée avec succès.');
      } catch (error) {
        alert('Erreur lors de la suppression de l\'annonce.');
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div>Chargement de vos annonces...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mes annonces</h1>
      {services.length === 0 ? (
        <p>Vous n'avez pas encore publié d'annonces. (ID: {services.prestataire?._id}) <Link href="/publish">Publier une annonce</Link></p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {services.map((service) => (
            <div key={service._id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', boxShadow: '2px 2px 8px rgba(0,0,0,0.1)' }}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <p>Prix: {service.price} XOF</p>
              <button onClick={() => handleDelete(service._id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '5px' }}>
                Supprimer
              </button>
              {/* Le bouton pour modifier*/}
              <Link href={`/edit-service/${service._id}`}>
                <button style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '5px', marginLeft: '10px' }}>
                  Modifier
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyServices;