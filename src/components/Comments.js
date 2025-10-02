import { useState, useEffect } from 'react';
    import { useAuth } from '../context/AuthContext';
    import { supabase } from '../lib/supabaseClient';

    // Este componente recebe o ID do reporte como propriedade.
    export default function Comments({ reportId }) {
      const { user } = useAuth();
      const [comments, setComments] = useState([]);
      const [newComment, setNewComment] = useState('');
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      // Função para buscar os comentários do Supabase
      const fetchComments = async () => {
        const { data, error } = await supabase
          .from('comments')
          .select('*, user:users(email)') // Pega os comentários e o email do usuário relacionado
          .eq('report_id', reportId)
          .order('created_at', { ascending: true });

        if (error) {
          setError(error.message);
        } else {
          setComments(data);
        }
        setLoading(false);
      };

      // O useEffect vai rodar a função de busca quando o componente for montado
      useEffect(() => {
        if (reportId) {
          fetchComments();
        }
      }, [reportId]);

      // Função para lidar com o envio de um novo comentário
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return; // Não envia comentários vazios

        const { error } = await supabase
          .from('comments')
          .insert({
            content: newComment,
            report_id: reportId,
            user_id: user.id,
          });

        if (error) {
          setError(error.message);
        } else {
          setNewComment('');
          fetchComments(); // Re-busca os comentários para mostrar o novo
        }
      };

      if (loading) return <p>Carregando comentários...</p>;

      return (
        <div style={{ marginTop: '2rem' }}>
          <h2>Comentários e Observações</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Lista de Comentários */}
          <div style={{ marginBottom: '1.5rem' }}>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} style={{ border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '5px', marginBottom: '0.5rem' }}>
                  <p>{comment.content}</p>
                  <small>
                    Por: {comment.user ? comment.user.email : 'Usuário anônimo'} em {new Date(comment.created_at).toLocaleString('pt-BR')}
                  </small>
                </div>
              ))
            ) : (
              <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
            )}
          </div>

          {/* Formulário para Novo Comentário */}
          {user ? (
            <form onSubmit={handleSubmit}>
              <textarea
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário..."
                style={{ width: '100%', padding: '0.5rem' }}
                required
              />
              <button type="submit" style={{ marginTop: '0.5rem' }}>
                Enviar Comentário
              </button>
            </form>
          ) : (
            <p>Você precisa estar <a href="/login">logado</a> para comentar.</p>
          )}
        </div>
      );
    }