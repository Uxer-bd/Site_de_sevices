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
        console.log('Tentative de récupération du service avec ID:', id);
        const response = await axios.get(`http://localhost:5000/api/services/${id}`);
        console.log('Réponse du serveur:', response.data);
        setService(response.data);
      } catch (err) {
        console.error('Détails de l\'erreur:', {
          message: err.message,
          status: err.response?.status,
          responseData: err.response?.data
        });
        setError(`Erreur: ${err.response?.data?.message || err.message}`);
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
      <p><strong>Prestataire:</strong> {service.prestataire?.email  || 'N/A'}</p>
      {service.prestataire?.numeroTelephone && (
        <div style={{ marginTop: '20px' }}>
          <h3>Contacter ce prestataire :</h3>
          <a href={`tel:${service.prestataire.numeroTelephone}`} style={{ marginRight: '10px' }}>
            <button style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Appeler</button>
          </a>
          <a href={`sms:${service.prestataire.numeroTelephone}`} style={{ marginRight: '10px' }}>
            <button style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Envoyer un SMS</button>
          </a>
          <a href={`https://wa.me/${service.prestataire.numeroTelephone}`} target="_blank" rel="noopener noreferrer">
            <button style={{ backgroundColor: '#25D366', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>WhatsApp</button>
          </a>
        </div>
      )}
      <Link href="/" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 15px', backgroundColor: '#555', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
        Retour à la liste
      </Link>
      {/* Ici, tu pourrais ajouter un bouton "Contacter le prestataire" */}
    </div>
  );
};

export default ServiceDetail;