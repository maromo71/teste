import { supabase } from '../../lib/supabaseClient';
    import dynamic from 'next/dynamic';
    import { useMemo } from 'react';
    import Head from 'next/head';
import Comments from '../../components/Comments'; // Importar o componente de comentários

    // --- Componente do Mapa Focado ---
    // Similar aos outros mapas, mas este não é interativo, apenas exibe a localização.
    const ReportMap = ({ position }) => {
      const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');

      if (!position || !position.lat || !position.lng) {
        return <p>Localização não disponível.</p>;
      }

      return (
        <MapContainer center={[position.lat, position.lng]} zoom={16} style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[position.lat, position.lng]}>
            <Popup>Local do problema</Popup>
          </Marker>
        </MapContainer>
      );
    };

    // --- Página de Detalhes do Reporte ---
    export default function ReportPage({ report }) {
      // Carrega o mapa dinamicamente
      const MapWithNoSSR = useMemo(() => dynamic(() => Promise.resolve(ReportMap), {
        ssr: false,
        loading: () => <p>Carregando mapa...</p>
      }), []);

      // Se o reporte não for encontrado (fallback do getStaticPaths), mostra uma mensagem.
      if (!report) {
        return <div>Carregando...</div>;
      }

      return (
        <>
          {/* O Head permite-nos definir o título da aba do navegador dinamicamente */}
          <Head>
            <title>{report.title} | Cidadão Alerta</title>
          </Head>

          <article>
            <h1>{report.title}</h1>
            <p>Reportado em: {new Date(report.created_at).toLocaleDateString('pt-BR')}</p>

            {report.photo_url && (
              <img src={report.photo_url} alt={report.title} style={{ maxWidth: '100%', height: 'auto', maxHeight: '500px', marginTop: '1rem' }} />
            )}

            {report.description && (
              <div style={{ marginTop: '1rem' }}>
                <h2>Descrição</h2>
                <p>{report.description}</p>
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              <h2>Localização</h2>
              <MapWithNoSSR position={{ lat: report.latitude, lng: report.longitude }} />
            </div>

            <Comments reportId={report.id} />
          </article>
        </>
      );
    }

    // --- Geração de Rotas (getStaticPaths) ---
    // Esta função diz ao Next.js quais páginas de reporte ele deve pré-renderizar no momento do build.
    export async function getStaticPaths() {
      const { data, error } = await supabase.from('reports').select('id');

      if (error) {
        console.error('Erro ao buscar IDs dos reportes:', error);
        return { paths: [], fallback: true };
      }

      const paths = data.map((report) => ({
        params: { id: report.id.toString() },
      }));

      // fallback: true significa que se alguém acessar uma página de um reporte
      // que não foi gerado no build (um novo reporte, por exemplo), o Next.js
      // tentará gerá-la "on-demand".
      return { paths, fallback: true };
    }

    // --- Busca de Dados para uma Página Específica (getStaticProps) ---
    // Esta função busca os dados de UM reporte específico, baseado no 'id' da URL.
    export async function getStaticProps({ params }) {
      const { id } = params;

      const { data: report, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single(); // .single() pega apenas um resultado em vez de um array

      if (error || !report) {
        console.error(`Erro ao buscar reporte ${id}:`, error);
        return {
          notFound: true, // Retorna uma página 404 se o reporte não for encontrado
        };
      }

      return {
        props: {
          report,
        },
        revalidate: 60, // Regenera a página a cada 60 segundos se houver novos dados
      };
    }