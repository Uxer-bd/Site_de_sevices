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
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <nav>
        <Link href="/">Accueil</Link>
        {isLoggedIn && <Link href="/profile" style={{ marginLeft: '1rem' }}>Mon Profil</Link>}
        {isLoggedIn && userRole === 'prestataire' && (
          <Link href="/publish" style={{ marginLeft: '1rem' }}> Publier une annonce </Link>
        )}
      </nav>
      <nav>
        {!isLoggedIn ? (
          <>
            <Link href="/login" style={{ marginRight: '1rem' }}>Connexion</Link>
            <Link href="/register">Inscription</Link>
          </>
        ) : (
          <>
            <button onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>Déconnexion</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;