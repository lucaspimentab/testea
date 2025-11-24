import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7a062fc7`;

export function DatabaseInitializer() {
  const [status, setStatus] = useState<'checking' | 'seeding' | 'ready' | 'error'>('checking');
  const [message, setMessage] = useState('Verificando banco de dados...');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    initializeDatabase();
  }, []);

  async function initializeDatabase() {
    setAttempts((prev) => prev + 1);
    try {
      setStatus('checking');
      setMessage('Verificando banco de dados...');

      // Verifica se já existem ONGs
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const checkResponse = await fetch(`${API_BASE_URL}/ongs`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (checkResponse.ok) {
        const { ongs } = await checkResponse.json();
        if (ongs && ongs.length > 0) {
          setStatus('ready');
          setMessage('');
          return;
        }
      }

      // Se vazio, roda seed
      setStatus('seeding');
      setMessage('Inicializando banco de dados pela primeira vez...');
      const seedController = new AbortController();
      const seedTimeout = setTimeout(() => seedController.abort(), 20000);
      const seedResponse = await fetch(`${API_BASE_URL}/seed`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        signal: seedController.signal,
      });
      clearTimeout(seedTimeout);

      if (seedResponse.ok) {
        setStatus('ready');
        setMessage('');
      } else {
        throw new Error('Falha ao fazer seed do banco de dados');
      }
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
      setStatus('error');
      setMessage('Erro ao inicializar banco. Tente novamente ou continue sem seed.');
    }
  }

  const skipInitialization = () => {
    setStatus('ready');
    setMessage('');
  };

  if (status === 'ready') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-4">
          {status === 'error' ? (
            <div className="text-red-600 text-6xl">⚠️</div>
          ) : (
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00D1A3] mx-auto"></div>
          )}
        </div>
        <p className="text-gray-700">{message}</p>
        {status === 'error' && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <button
              onClick={initializeDatabase}
              className="px-4 py-2 bg-[#00D1A3] text-white rounded hover:bg-[#00B88F]"
            >
              Tentar novamente
            </button>
            <button
              onClick={skipInitialization}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              Continuar sem seed
            </button>
            <p className="text-xs text-gray-500">
              Tentativa #{attempts}. Verifique conexão ou funções do Supabase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
