// src/components/Header.js
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext'; // Importe le hook useAuth

const Header = () => {
  const { isLoggedIn,userRole, logout } = useAuth(); // Utilise le contexte
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Utilise la fonction logout du contexte
    router.push('/login');
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#0070f3',
          textDecoration: 'none',
          marginRight: '2rem'
        }}>
          ServicesBF
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/" style={{
            color: '#333',
            textDecoration: 'none',
            padding: '0.5rem 0',
            position: 'relative',
            ':hover': {
              color: '#0070f3'
            }
          }}>Accueil</Link>
          {isLoggedIn && (
            <Link href="/profile" style={{
              color: '#333',
              textDecoration: 'none',
              padding: '0.5rem 0',
              position: 'relative',
              ':hover': {
                color: '#0070f3'
              }
            }}>Mon Profil</Link>
          )}
          {isLoggedIn && userRole === 'prestataire' && (
            <>
              <Link href="/publish" style={{
                color: '#333',
                textDecoration: 'none',
                padding: '0.5rem 0',
                position: 'relative',
                ':hover': {
                  color: '#0070f3'
                }
              }}>Publier une annonce</Link>
              <Link href="/my-services" style={{
                color: '#333',
                textDecoration: 'none',
                padding: '0.5rem 0',
                position: 'relative',
                ':hover': {
                  color: '#0070f3'
                }
              }}>Mes Annonces</Link>
            </>
          )}
        </nav>
      </div>
      <nav>
        {!isLoggedIn ? (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/login" style={{
              padding: '0.5rem 1rem',
              color: '#0070f3',
              textDecoration: 'none',
              borderRadius: '5px',
              border: '1px solid #0070f3',
              transition: 'all 0.2s ease',
              ':hover': {
                backgroundColor: '#0070f3',
                color: '#fff'
              }
            }}>Connexion</Link>
            <Link href="/register" style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0070f3',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '5px',
              transition: 'all 0.2s ease',
              ':hover': {
                backgroundColor: '#0052cc'
              }
            }}>Inscription</Link>
          </div>
        ) : (
          <button 
            onClick={handleLogout} 
            style={{
              padding: '0.5rem 1rem',
              color: '#dc3545',
              backgroundColor: 'transparent',
              border: '1px solid #dc3545',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              ':hover': {
                backgroundColor: '#dc3545',
                color: '#fff'
              }
            }}
          >
            Déconnexion
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;