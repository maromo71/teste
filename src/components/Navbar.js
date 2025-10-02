import Link from 'next/link';
    import { useAuth } from '../context/AuthContext';
    import { useRouter } from 'next/router';

    // Este componente será nossa barra de navegação, presente em várias páginas.
    export default function Navbar() {
      const { user, signOut } = useAuth();
      const router = useRouter();

      const handleSignOut = async () => {
        await signOut();
        router.push('/'); // Redireciona para a home após o logout
      };

      return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee', background: '#f8f8f8' }}>
          {/* Lado Esquerdo: Links Principais */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/">
              <a style={{ fontWeight: 'bold' }}>Cidadão Alerta</a>
            </Link>
            {user && (
              <Link href="/new-report">
                <a>Criar Reporte</a>
              </Link>
            )}
          </div>

          {/* Lado Direito: Links de Usuário */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user ? (
              <>
                <Link href="/my-reports">
                  <a>Meus Reportes</a>
                </Link>
                <span>{user.email}</span>
                <button onClick={handleSignOut}>Sair</button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <a>Login</a>
                </Link>
                <Link href="/signup">
                  <a>Cadastre-se</a>
                </Link>
              </>
            )}
          </div>
        </nav>
      );
    }