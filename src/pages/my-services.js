// src/pages/my-services.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

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
        <p>Vous n&apos;avez pas encore publié d&apos;annonces. (ID: {services.prestataire?._id}) <Link href="/publish">Publier une annonce</Link></p>
      ) : (
        // <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        //   {services.map((service) => (
        //     <div key={service._id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', boxShadow: '2px 2px 8px rgba(0,0,0,0.1)' }}>
        //       {service.imageUrl ? (
        //         <Image
        //         src={
        //           typeof service.imageUrl === 'string' && service.imageUrl.startsWith('http')
        //             ? service.imageUrl
        //             : service.imageUrl
        //               ? `http://localhost:5000${service.imageUrl}`
        //               : ''
        //         }
        //         alt={service.title}
        //         width={400}
        //         height={200}
        //         style={{
        //           maxWidth: '200px',
        //           maxHeight: '200px',
        //           objectFit: 'cover'
        //         }}
        //       />
        //       ) : (
        //          <div style={{
        //             width: '100%',
        //             height: '100%',
        //             backgroundColor: '#f0f0f0',
        //             display: 'flex',
        //             alignItems: 'center',
        //             justifyContent: 'center',
        //             borderRadius: '8px 8px 0 0'
        //           }}>
        //             <span style={{ color: '#666' }}>Aucune image</span>
        //           </div>
        //       )}              
        //       <h3>{service.title}</h3>
        //       <p>{service.description}</p>
        //       <p>Prix: {service.price} XOF</p>
        //       <button onClick={() => handleDelete(service._id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '5px' }}>
        //         Supprimer
        //       </button>
        //       {/* Le bouton pour modifier*/}
        //       <Link href={`/edit-service/${service._id}`}>
        //         <button style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '5px', marginLeft: '10px' }}>
        //           Modifier
        //         </button>
        //       </Link>
        //     </div>
        //   ))}
        // </div>
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
                  <Image
                    src={`http://localhost:5000${service.imageUrl}`}
                    alt={service.title}
                    width={400}
                    height={200}
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
                {/* <div style={{
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
                </div> */}
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
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default MyServices;