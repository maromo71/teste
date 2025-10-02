import { supabase } from '../lib/supabaseClient';
    import dynamic from 'next/dynamic';
    import { useMemo } from 'react';
    import Link from 'next/link';

    // Este é o componente que renderiza o mapa e os marcadores.
    // Ele recebe os reportes como uma propriedade.
    const ReportsMap = ({ reports }) => {
      const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');

      // Posição central inicial do mapa
      const initialPosition = [-15.793889, -47.882778]; // Centro do Brasil

      return (
        <MapContainer center={initialPosition} zoom={4} style={{ height: '80vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {reports.map((report) => (
            <Marker key={report.id} position={[report.latitude, report.longitude]}>
              <Popup>
                <strong>{report.title}</strong>
                <br />
                <Link href={`/report/${report.id}`}>
                  <a>Ver detalhes</a>
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      );
    };

    // --- Página Principal (Home) ---
    export default function Home({ reports }) {

      // Carrega o mapa dinamicamente
      const MapWithNoSSR = useMemo(() => dynamic(() => Promise.resolve(ReportsMap), {
        ssr: false,
        loading: () => <p>Carregando mapa de reportes...</p>
      }), []);

      return (
        <div>
          <h1>Mapa de Reportes</h1>
          <p>Clique em um marcador para ver os detalhes de um problema.</p>
          <MapWithNoSSR reports={reports} />
        </div>
      );
    }

    // --- Busca de Dados (getStaticProps) ---
    // Esta função roda no servidor antes da página ser renderizada.
    // Ela busca os dados dos reportes e os passa para o componente Home como 'props'.
    export async function getStaticProps() {
      const { data: reports, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false }); // Pega os mais recentes primeiro

      if (error) {
        console.error('Erro ao buscar reportes:', error);
        return {
          props: {
            reports: [],
          },
        };
      }

      return {
        props: {
          reports,
        },
        revalidate: 60, // O Next.js vai tentar recriar a página a cada 60 segundos (Incremental Static Regeneration)
      };
    }