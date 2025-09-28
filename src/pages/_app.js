// src/pages/_app.js
import '@/styles/globals.css';
import '@/styles/components.css';
import Header from '@/Components/Header';
import { AuthProvider } from '@/context/AuthContext'; // Importe le Provider

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}