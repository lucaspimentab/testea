import { useState, useEffect } from 'react';
import { Eye, Phone, MessageSquare, BarChart3, Upload, TrendingUp, Users, Calendar, Check, X, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type Tab = 'metricas' | 'atualizar' | 'verificar' | 'publicar' | 'responder';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7a062fc7`;

const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4'];

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('metricas');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [ongData, setOngData] = useState<any>(null);
  const [metricsData, setMetricsData] = useState<any>(null);
  const [perguntasPendentes, setPerguntasPendentes] = useState<any[]>([]);
  const [perguntasRespondidas, setPerguntasRespondidas] = useState<any[]>([]);
  const [vagas, setVagas] = useState<any[]>([]);

  const [updateFormData, setUpdateFormData] = useState({
    nome: '',
    descricao: '',
    telefone: '',
    email: '',
    endereco: '',
    horarios: [],
    site: ''
  });

  const [vagaFormData, setVagaFormData] = useState({
    titulo: '',
    descricao: '',
    requisitos: '',
    horario: '',
    duracao: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      console.log('🔄 Loading dashboard data...');
      
      const token = localStorage.getItem('auth_token');
      console.log('🔑 Token from localStorage:', token);
      
      if (!token) {
        console.log('❌ No token found');
        toast.error('Sessão expirada. Faça login novamente.');
        if (onLogout) onLogout();
        return;
      }

      setUserEmail(token);
      console.log('✅ User email set:', token);

      // Buscar dados do usuário para pegar a ONG relacionada
      console.log('📡 Fetching user data from /me');
      const meResponse = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (meResponse.ok) {
        const { user } = await meResponse.json();
        console.log('👤 User data loaded:', user);
        
        if (user.ongId) {
          // Buscar a ONG do usuário
          console.log('📡 Fetching user ONG:', user.ongId);
          const ongResponse = await fetch(`${API_BASE_URL}/ongs/${user.ongId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (ongResponse.ok) {
            const { ong } = await ongResponse.json();
            console.log('🏢 User ONG loaded:', ong.nome);
            
            setOngData(ong);
            setUpdateFormData({
              nome: ong.nome || '',
              descricao: ong.descricao || '',
              telefone: ong.telefone || '',
              email: ong.email || '',
              endereco: ong.endereco || '',
              horarios: ong.horarios || [],
              site: ong.site || ''
            });

            // Buscar métricas da ONG
            await loadMetrics(ong.id, token);
            await loadPerguntas(ong.id, token);
            await loadVagas(ong.id);
          }
        }
      } else {
        console.log('❌ Failed to load user data');
        toast.error('Erro ao carregar dados do usuário');
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error(error.message || 'Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  }

  async function loadMetrics(ongId: string, token: string) {
    try {
      console.log('📊 Loading metrics for ONG:', ongId);
      const response = await fetch(`${API_BASE_URL}/metricas/${ongId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📥 Metrics response status:', response.status);

      if (response.ok) {
        const { metricas } = await response.json();
        console.log('✅ Metrics loaded:', metricas);
        setMetricsData(metricas);
      } else {
        // Se não houver métricas, usar dados padrão
        console.log('ℹ️ No metrics found, using default');
        setMetricsData({
          visualizacoes: 0,
          cliques: 0,
          interessados: 0,
          historico: []
        });
      }
    } catch (error) {
      console.error('❌ Error loading metrics:', error);
      // Usar dados padrão em caso de erro
      setMetricsData({
        visualizacoes: 0,
        cliques: 0,
        interessados: 0,
        historico: []
      });
    }
  }

  async function loadVagas(ongId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/vagas?ongId=${ongId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const { vagas } = await response.json();
        setVagas(vagas || []);
      }
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
    }
  }

  async function loadPerguntas(ongId: string, token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/perguntas?ongId=${ongId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { perguntas } = await response.json();
        const pendentes = (perguntas || []).filter((p: any) => !p.respondida);
        const respondidas = (perguntas || []).filter((p: any) => p.respondida);
        setPerguntasPendentes(pendentes);
        setPerguntasRespondidas(respondidas);
      }
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
    }
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!updateFormData.nome || !updateFormData.descricao || !updateFormData.telefone) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('auth_token');
      console.log('=== UPDATING ONG ===');
      console.log('ONG ID:', ongData.id);
      console.log('Token:', token);
      console.log('Update form data:', updateFormData);
      
      const response = await fetch(`${API_BASE_URL}/ongs/${ongData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateFormData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.error('Error response:', error);
        throw new Error(error.error || 'Erro ao atualizar dados');
      }

      const { ong } = await response.json();
      console.log('✅ ONG updated:', ong);
      setOngData(ong);
      
      toast.success('✅ Dados da ONG atualizados com sucesso!', { duration: 5000 });
    } catch (error: any) {
      console.error('❌ Error updating ONG:', error);
      toast.error(`❌ Erro: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePublishVaga = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vagaFormData.titulo || !vagaFormData.descricao) {
      toast.error('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('auth_token');
      console.log('=== PUBLISHING VAGA ===');
      console.log('ONG ID:', ongData?.id);
      console.log('Token:', token);
      console.log('Vaga form data:', vagaFormData);
      
      const response = await fetch(`${API_BASE_URL}/vagas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...vagaFormData,
          ongId: ongData.id,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.error('Error response:', error);
        throw new Error(error.error || 'Erro ao publicar vaga');
      }

      const { vaga } = await response.json();
      console.log('✅ Vaga published:', vaga);
      
      setVagas([...vagas, vaga]);
      setVagaFormData({
        titulo: '',
        descricao: '',
        requisitos: '',
        horario: '',
        duracao: ''
      });
      
      toast.success('✅ Vaga publicada com sucesso!', { duration: 5000 });
    } catch (error: any) {
      console.error('❌ Error publishing vaga:', error);
      toast.error(`❌ Erro ao publicar vaga: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAnswerSubmit = async (perguntaId: string, resposta: string) => {
    if (!resposta.trim()) {
      toast.error('Por favor, digite uma resposta.');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/perguntas/${perguntaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ resposta }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao enviar resposta');
      }

      const { pergunta } = await response.json().catch(() => ({ pergunta: null }));

      // Remover pergunta da lista
      const pendentesAtualizadas = perguntasPendentes.filter(p => p.id !== perguntaId);
      const respondida = perguntasPendentes.find(p => p.id === perguntaId);
      const novaRespondida = respondida
        ? { ...respondida, resposta, respondida: true }
        : { ...(pergunta || {}), id: perguntaId, resposta, respondida: true };
      setPerguntasPendentes(pendentesAtualizadas);
      setPerguntasRespondidas([novaRespondida, ...perguntasRespondidas]);
      
      toast.success('✅ Resposta enviada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao enviar resposta:', error);
      toast.error(`❌ Erro: ${error.message}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('ongId', ongData.id);
    formData.append('tipo', 'verificacao');

    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/documentos/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload');
      }

      const { documento } = await response.json();
      setUploadedFiles([...uploadedFiles, documento.nome]);
      
      toast.success('✅ Arquivo enviado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error(`❌ Erro: ${error.message}`);
    }
  };

  const handleVerificationSubmit = () => {
    if (uploadedFiles.length === 0) {
      toast.error('Por favor, envie pelo menos um documento.');
      return;
    }

    toast.success('✅ Documentos enviados para análise! Nossa equipe irá revisar em até 5 dias úteis.');
    setUploadedFiles([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  if (!ongData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Nenhuma ONG associada a este usuário.</p>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  // Preparar dados para os gráficos
  const viewsData = metricsData?.historico?.slice(-6).map((h: any, i: number) => ({
    mes: new Date(h.data).toLocaleDateString('pt-BR', { month: 'short' }),
    visualizacoes: metricsData.visualizacoes,
    contatos: metricsData.cliques
  })) || [];

  const trafficSourceData = [
    { name: 'Busca Direta', value: 45 },
    { name: 'Redes Sociais', value: 30 },
    { name: 'Indicação', value: 15 },
    { name: 'Outros', value: 10 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-gray-900 mb-1">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">{ongData.nome}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-teal-100 text-sm mb-1">Visualizações</div>
              <div className="text-3xl mb-1">{metricsData?.visualizacoes || 0}</div>
              <div className="flex items-center gap-1 text-teal-100 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Total</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Eye className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-blue-100 text-sm mb-1">Cliques</div>
              <div className="text-3xl mb-1">{metricsData?.cliques || 0}</div>
              <div className="flex items-center gap-1 text-blue-100 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Total</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Phone className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-purple-100 text-sm mb-1">Perguntas</div>
              <div className="text-3xl mb-1">{perguntasPendentes.length}</div>
              <div className="text-purple-100 text-sm">
                Aguardando resposta
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex gap-1 px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('metricas')}
              className={`px-4 py-3 text-sm transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'metricas'
                  ? 'border-teal-600 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Métricas de Alcance
            </button>
            <button
              onClick={() => setActiveTab('atualizar')}
              className={`px-4 py-3 text-sm transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'atualizar'
                  ? 'border-teal-600 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Atualizar Dados
            </button>
            <button
              onClick={() => setActiveTab('verificar')}
              className={`px-4 py-3 text-sm transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'verificar'
                  ? 'border-teal-600 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Verificar ONG
            </button>
            <button
              onClick={() => setActiveTab('publicar')}
              className={`px-4 py-3 text-sm transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'publicar'
                  ? 'border-teal-600 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Publicar Vagas
            </button>
            <button
              onClick={() => setActiveTab('responder')}
              className={`px-4 py-3 text-sm transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'responder'
                  ? 'border-teal-600 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Responder Perguntas {perguntasPendentes.length > 0 && `(${perguntasPendentes.length})`}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'metricas' && (
            <div>
              <h3 className="text-gray-900 mb-2">Análise de Alcance</h3>
              <p className="text-gray-600 text-sm mb-8">
                Acompanhe o desempenho e engajamento do seu perfil
              </p>

              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-600 text-sm">Taxa de Conversão</span>
                  </div>
                  <div className="text-2xl text-gray-900">
                    {metricsData?.visualizacoes > 0 
                      ? ((metricsData.cliques / metricsData.visualizacoes) * 100).toFixed(1) 
                      : '0'}%
                  </div>
                  <div className="text-gray-500 text-xs mt-1">De visualizações para cliques</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-600 text-sm">Interessados</span>
                  </div>
                  <div className="text-2xl text-gray-900">{metricsData?.interessados || 0}</div>
                  <div className="text-gray-500 text-xs mt-1">Pessoas demonstraram interesse</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-600 text-sm">Vagas Publicadas</span>
                  </div>
                  <div className="text-2xl text-gray-900">{vagas.length}</div>
                  <div className="text-gray-500 text-xs mt-1">Vagas de voluntariado ativas</div>
                </div>
              </div>

              {metricsData?.visualizacoes === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <p className="text-blue-900 mb-2">Ainda não há métricas para exibir</p>
                  <p className="text-blue-700 text-sm">As métricas começarão a aparecer quando usuários visualizarem seu perfil.</p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-gray-900 mb-4">Histórico de Atividades</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Total de Visualizações</span>
                      <span className="text-gray-900 font-semibold">{metricsData.visualizacoes}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Total de Cliques</span>
                      <span className="text-gray-900 font-semibold">{metricsData.cliques}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Pessoas Interessadas</span>
                      <span className="text-gray-900 font-semibold">{metricsData.interessados}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'atualizar' && (
            <div>
              <h3 className="text-gray-900 mb-2">Atualizar Dados da ONG</h3>
              <p className="text-gray-600 text-sm mb-6">
                Mantenha as informações da sua organização sempre atualizadas
              </p>

              <form className="space-y-6" onSubmit={handleUpdateSubmit}>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Nome da ONG <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={updateFormData.nome}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, nome: e.target.value })}
                    required
                    disabled={saving}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="descricao"
                    value={updateFormData.descricao}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, descricao: e.target.value })}
                    required
                    rows={5}
                    disabled={saving}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <div className="text-gray-500 text-sm mt-1">{updateFormData.descricao.length} caracteres</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Telefone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={updateFormData.telefone}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, telefone: e.target.value })}
                      required
                      disabled={saving}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={updateFormData.email}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, email: e.target.value })}
                      required
                      disabled={saving}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={updateFormData.endereco}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, endereco: e.target.value })}
                    disabled={saving}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Website</label>
                  <input
                    type="text"
                    name="site"
                    value={updateFormData.site}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, site: e.target.value })}
                    disabled={saving}
                    placeholder="www.suaong.org.br"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'verificar' && (
            <div>
              <h3 className="text-gray-900 mb-2">Verificar ONG</h3>
              <p className="text-gray-600 text-sm mb-6">
                Envie documentos para verificação oficial da sua organização
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="text-blue-900 mb-2">Por que verificar sua ONG?</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>✓ Ganhe um selo de verificação no seu perfil</li>
                  <li>✓ Aumente a confiança dos doadores e voluntários</li>
                  <li>✓ Apareça em destaque nas buscas</li>
                  <li>✓ Acesse recursos exclusivos da plataforma</li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-gray-900 mb-3">Documentos Necessários:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span>CNPJ da Organização</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span>Estatuto Social</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span>Ata de Eleição da Diretoria</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span>Comprovante de Endereço</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Upload de Documentos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Clique para fazer upload
                    </p>
                    <p className="text-gray-500 text-sm">
                      PDF, JPG, PNG (máx. 10MB por arquivo)
                    </p>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-gray-700">Arquivos enviados:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{file}</span>
                        </div>
                        <button
                          onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerificationSubmit}
                className="mt-6 bg-teal-600 hover:bg-teal-700 text-white px-8 py-2.5 rounded-lg transition-colors"
              >
                Enviar para Análise
              </button>
            </div>
          )}

          {activeTab === 'publicar' && (
            <div>
              <h3 className="text-gray-900 mb-2">Publicar Vaga de Voluntariado</h3>
              <p className="text-gray-600 text-sm mb-6">
                Atraia voluntários para ajudar sua causa
              </p>

              {/* Vagas Publicadas */}
              {vagas.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-gray-900 mb-4">Vagas Publicadas ({vagas.length})</h4>
                  <div className="space-y-3">
                    {vagas.map((vaga) => (
                      <div key={vaga.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-gray-900 mb-1">{vaga.titulo}</h5>
                            <p className="text-gray-600 text-sm line-clamp-2">{vaga.descricao}</p>
                            {vaga.horario && (
                              <p className="text-gray-500 text-xs mt-2">Horário: {vaga.horario}</p>
                            )}
                          </div>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                            Ativa
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h4 className="text-gray-900 mb-4">Nova Vaga</h4>

              <form className="space-y-6" onSubmit={handlePublishVaga}>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Título da Vaga <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    placeholder="Ex: Professor Voluntário de Matemática"
                    value={vagaFormData.titulo}
                    onChange={(e) => setVagaFormData({ ...vagaFormData, titulo: e.target.value })}
                    required
                    disabled={saving}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="descricao"
                    placeholder="Descreva as atividades e responsabilidades..."
                    rows={4}
                    value={vagaFormData.descricao}
                    onChange={(e) => setVagaFormData({ ...vagaFormData, descricao: e.target.value })}
                    required
                    disabled={saving}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Requisitos</label>
                  <textarea
                    name="requisitos"
                    placeholder="Conhecimentos, habilidades ou disponibilidade necessária..."
                    rows={3}
                    value={vagaFormData.requisitos}
                    onChange={(e) => setVagaFormData({ ...vagaFormData, requisitos: e.target.value })}
                    disabled={saving}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Horário</label>
                    <input
                      type="text"
                      name="horario"
                      placeholder="Ex: Terças e quintas, 14h-16h"
                      value={vagaFormData.horario}
                      onChange={(e) => setVagaFormData({ ...vagaFormData, horario: e.target.value })}
                      disabled={saving}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Duração</label>
                    <input
                      type="text"
                      name="duracao"
                      placeholder="Ex: Mínimo 6 meses"
                      value={vagaFormData.duracao}
                      onChange={(e) => setVagaFormData({ ...vagaFormData, duracao: e.target.value })}
                      disabled={saving}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Publicando...' : 'Publicar Vaga'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'responder' && (
            <div className="space-y-10">
              <div>
                <h3 className="text-gray-900 mb-2">Perguntas pendentes</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Responda as dúvidas dos interessados em sua ONG
                </p>
                {perguntasPendentes.length > 0 ? (
                  <div className="space-y-4">
                    {perguntasPendentes.map((pergunta) => (
                      <div key={pergunta.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="mb-4">
                          <p className="text-gray-900 mb-2">
                            {pergunta.mensagem || pergunta.pergunta}
                          </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{pergunta.nome || pergunta.nomeUsuario || 'Usuário'}</span>
                          <span>•</span>
                          <span>{new Date(pergunta.criadoEm || pergunta.createdAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2 text-sm">Sua Resposta</label>
                          <textarea
                            placeholder="Digite uma resposta clara e objetiva..."
                            rows={3}
                            value={pergunta.resposta || ''}
                            onChange={(e) => {
                              const updated = perguntasPendentes.map(p => 
                                p.id === pergunta.id ? { ...p, resposta: e.target.value } : p
                              );
                              setPerguntasPendentes(updated);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                          />
                        </div>

                        <button 
                          onClick={() => handleAnswerSubmit(pergunta.id, pergunta.resposta || '')}
                          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Enviar Resposta
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Nenhuma pergunta pendente</p>
                    <p className="text-gray-500 text-sm">As novas perguntas dos usuários aparecerão aqui.</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-gray-900 mb-2">Perguntas respondidas</h3>
                {perguntasRespondidas.length > 0 ? (
                  <div className="space-y-3">
                    {perguntasRespondidas.map((pergunta) => (
                      <div key={pergunta.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <span>{pergunta.nome || pergunta.nomeUsuario || 'Usuário'}</span>
                            <span>•</span>
                            <span>{new Date(pergunta.criadoEm || pergunta.createdAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">Respondida</span>
                        </div>
                        <p className="text-gray-900 mb-2 font-medium">{pergunta.mensagem || pergunta.pergunta || 'Pergunta'}</p>
                        <p className="text-gray-700 text-sm">
                          <span className="font-semibold">Resposta:</span> {pergunta.resposta || '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Nenhuma pergunta respondida ainda.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
