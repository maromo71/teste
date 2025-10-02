import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import 'leaflet/dist/leaflet.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}

export default MyApp;