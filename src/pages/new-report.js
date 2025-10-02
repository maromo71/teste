import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
    import { useRouter } from 'next/router';
    import { useAuth } from '../context/AuthContext';
    import { supabase } from '../lib/supabaseClient';
    import dynamic from 'next/dynamic';

    // --- Componente do Mapa (MapPicker) ---
    // Este componente encapsula a lógica do mapa Leaflet.
    const MapPicker = ({ position, setPosition }) => {
      const { MapContainer, TileLayer, Marker, useMapEvents } = require('react-leaflet');
      const markerRef = useRef(null);

      // Hook para centralizar o mapa na posição atual
      const LocationFinder = () => {
        const map = useMapEvents({
          click() {
            map.locate();
          },
          locationfound(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
          },
        });
        return null;
      };

      // Hook para atualizar a posição quando o marcador é arrastado
      const eventHandlers = useMemo(
        () => ({
          dragend() {
            const marker = markerRef.current;
            if (marker != null) {
              setPosition(marker.getLatLng());
            }
          },
        }),
        [setPosition],
      );

      return (
        <MapContainer center={[position.lat, position.lng]} zoom={15} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={[position.lat, position.lng]}
            ref={markerRef}
          >
          </Marker>
          <LocationFinder />
        </MapContainer>
      );
    };


    // --- Página Principal (NewReport) ---
    export default function NewReport() {
      const { user } = useAuth();
      const router = useRouter();

      const [title, setTitle] = useState('');
      const [description, setDescription] = useState('');
      const [photo, setPhoto] = useState(null);
      const [position, setPosition] = useState({ lat: -23.55052, lng: -46.633308 }); // Posição padrão (São Paulo)
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      // Carrega o mapa dinamicamente para evitar problemas com SSR (Server-Side Rendering)
      const MapWithNoSSR = useMemo(() => dynamic(() => Promise.resolve(MapPicker), {
        ssr: false,
        loading: () => <p>Carregando mapa...</p>
      }), []);

      // Efeito para obter a localização do usuário ao carregar a página
      useEffect(() => {
        if (!user) {
          router.push('/login'); // Se não estiver logado, redireciona para o login
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (geoPosition) => {
            setPosition({
              lat: geoPosition.coords.latitude,
              lng: geoPosition.coords.longitude,
            });
          },
          (error) => {
            console.error('Erro ao obter geolocalização:', error);
            // Mantém a posição padrão se o usuário negar a permissão
          }
        );
      }, [user, router]);

      const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
          setPhoto(e.target.files[0]);
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !photo) {
          setError('Título e Foto são obrigatórios.');
          return;
        }

        setLoading(true);
        setError(null);

        try {
          // 1. Fazer upload da foto para o Supabase Storage
          const fileExt = photo.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('report-photos')
            .upload(filePath, photo);

          if (uploadError) {
            throw uploadError;
          }

          // 2. Obter a URL pública da foto
          const { data: { publicUrl } } = supabase.storage
            .from('report-photos')
            .getPublicUrl(filePath);

          if (!publicUrl) {
            throw new Error('Não foi possível obter a URL da foto.');
          }

          // 3. Inserir os dados do reporte no banco de dados
          const reportData = {
            title,
            description,
            photo_url: publicUrl,
            latitude: position.lat,
            longitude: position.lng,
            user_id: user.id,
          };

          const { error: insertError } = await supabase
            .from('reports')
            .insert(reportData);

          if (insertError) {
            throw insertError;
          }

          // 4. Redirecionar para a página inicial
          alert('Reporte criado com sucesso!');
          router.push('/');

        } catch (error) {
          setError(error.message);
          console.error('Erro ao criar reporte:', error);
        } finally {
          setLoading(false);
        }
      };

      if (!user) {
        return <p>Redirecionando...</p>;
      }

      return (
        <div>
          <h1>Criar Novo Reporte</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Título:</label><br/>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="description">Descrição:</label><br/>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="photo">Foto do Problema:</label><br/>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                required
              />
            </div>

            <div>
              <label>Localização (clique e arraste o marcador):</label>
              <MapWithNoSSR position={position} setPosition={setPosition} />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Criar Reporte'}
            </button>
          </form>
        </div>
      );
    }