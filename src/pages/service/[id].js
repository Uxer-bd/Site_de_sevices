import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const ServiceDetail = () => {
  const router = useRouter();
  const { id } = router.query; // Récupère l'ID depuis l'URL
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // S'il n'y a pas d'ID, on arrête

    const fetchService = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/services/${id}`);
        setService(response.data);
      } catch (err) {
        setError('Impossible de charger les détails de l\'annonce.');
        console.error('Erreur de chargement des services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return <div>Chargement des détails de l'annonce...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!service) {
    return <div>Annonce non trouvée.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{service.title}</h1>
      <p><strong>Description:</strong> {service.description}</p>
      <p><strong>Catégorie:</strong> {service.category}</p>
      <p><strong>Prix:</strong> {service.price} XOF</p>
      <p><strong>Localisation:</strong> {service.location}</p>
      <p><strong>Prestataire:</strong> {service.prestataire?.email  || 'N/A'} | (ID: {service.prestataire?._id})</p>
      <Link href="/" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 15px', backgroundColor: '#555', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
        Retour à la liste
      </Link>
      {/* Ici, tu pourrais ajouter un bouton "Contacter le prestataire" */}
    </div>
  );
};

export default ServiceDetail;