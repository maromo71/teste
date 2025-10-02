import { useState, useEffect } from 'react';
    import { useAuth } from '../context/AuthContext';
    import { supabase } from '../lib/supabaseClient';
    import { useRouter } from 'next/router';
    import Link from 'next/link';

    export default function MyReports() {
      const { user } = useAuth();
      const router = useRouter();
      const [reports, setReports] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        // Se não há usuário, redireciona para o login.
        if (!user) {
          router.push('/login');
          return;
        }

        // Função para buscar os reportes do usuário logado.
        const fetchUserReports = async () => {
          setLoading(true);
          const { data, error } = await supabase
            .from('reports')
            .select('*')
            .eq('user_id', user.id) // A mágica acontece aqui: filtra pelo ID do usuário.
            .order('created_at', { ascending: false });

          if (error) {
            setError(error.message);
            console.error('Erro ao buscar meus reportes:', error);
          } else {
            setReports(data);
          }
          setLoading(false);
        };

        fetchUserReports();
      }, [user, router]);

      // Enquanto o usuário é verificado ou os dados são carregados.
      if (loading) {
        return <p>Carregando seus reportes...</p>;
      }

      // Se o usuário não estiver logado (após a verificação inicial).
      if (!user) {
        return <p>Redirecionando para o login...</p>;
      }

      return (
        <div>
          <h1>Meus Reportes</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {reports.length > 0 ? (
            <ul>
              {reports.map((report) => (
                <li key={report.id}>
                  <Link href={`/report/${report.id}`}>
                    <a>{report.title}</a>
                  </Link>
                  <span> - {new Date(report.created_at).toLocaleDateString('pt-BR')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Você ainda não criou nenhum reporte. <Link href="/new-report"><a>Crie o seu primeiro!</a></Link></p>
          )}
        </div>
      );
    }