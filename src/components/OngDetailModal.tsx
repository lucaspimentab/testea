import { MapPin, Clock, Users, Heart, ArrowLeft, Briefcase, MessageSquare } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Ong {
  id: string | number;
  name: string;
  description: string;
  category: string;
  location: string;
  hours: string;
  categoryColor: string;
  hasAccessibility: boolean;
  hasRemoteService: boolean;
}

interface OngDetailModalProps {
  ong: Ong;
  onClose: () => void;
}

export function OngDetailModal({ ong, onClose }: OngDetailModalProps) {
  const [question, setQuestion] = useState('');
  const [perguntasRespondidas, setPerguntasRespondidas] = useState<any[]>([]);
  const [vagas, setVagas] = useState<any[]>([]);
  const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7a062fc7`;

  useEffect(() => {
    const loadExtras = async () => {
      try {
        const [pergResp, vagasResp] = await Promise.all([
          fetch(`${API_BASE_URL}/perguntas?ongId=${ong.id}`, {
            headers: { 'Authorization': `Bearer ${publicAnonKey}` }
          }).then(r => r.ok ? r.json() : { perguntas: [] }).catch(() => ({ perguntas: [] })),
          fetch(`${API_BASE_URL}/vagas?ongId=${ong.id}`).then(r => r.ok ? r.json() : { vagas: [] }).catch(() => ({ vagas: [] })),
        ]);
        setPerguntasRespondidas(pergResp.perguntas || []);
        setVagas(vagasResp.vagas || []);
      } catch (err) {
        console.error('Erro ao carregar perguntas/vagas', err);
        setPerguntasRespondidas([]);
        setVagas([]);
      }
    };
    loadExtras();
  }, [ong.id]);

  const handleSendQuestion = () => {
    if (!question.trim()) {
      toast.error('Por favor, digite sua pergunta antes de enviar.');
      return;
    }
    toast.success('Pergunta enviada com sucesso! A ONG responderá em breve.');
    setQuestion('');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Botão Voltar */}
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Voltar para resultados</span>
      </button>

      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-gray-900 mb-2">{ong.name}</h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${ong.categoryColor}`}>
            {ong.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Sobre */}
          <div>
            <h3 className="text-gray-900 mb-3">Sobre a Organização</h3>
            <p className="text-gray-700 leading-relaxed">{ong.description}</p>
          </div>

          {/* Localização e Horário */}
          <div>
            <h3 className="text-gray-900 mb-3">Localização e Horário</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Endereço</div>
                  <div className="text-gray-900">{ong.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Horário de Atendimento</div>
                  <div className="text-gray-900">{ong.hours}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Acessibilidade */}
          <div>
            <h3 className="text-gray-900 mb-3">Recursos e Acessibilidade</h3>
            <div className="space-y-2">
              {ong.hasAccessibility && (
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  <span>Possui acessibilidade para pessoas com deficiência</span>
                </div>
              )}
              {ong.hasRemoteService && (
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  <span>Oferece atendimento remoto</span>
                </div>
              )}
              {!ong.hasAccessibility && !ong.hasRemoteService && (
                <p className="text-gray-500">Informações não disponíveis</p>
              )}
            </div>
          </div>

          {/* Como Ajudar */}
          <div>
            <h3 className="text-gray-900 mb-3">Como Você Pode Ajudar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <Users className="w-6 h-6 text-teal-600 mb-2" />
                <h4 className="text-gray-900 mb-1">Seja Voluntário</h4>
                <p className="text-gray-600 text-sm">Doe seu tempo e habilidades para fazer a diferença</p>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <Heart className="w-6 h-6 text-teal-600 mb-2" />
                <h4 className="text-gray-900 mb-1">Faça uma Doação</h4>
                <p className="text-gray-600 text-sm">Contribua financeiramente com nossos projetos</p>
              </div>
            </div>
          </div>

          {/* Vagas */}
          <div>
            <h3 className="text-gray-900 mb-3">Vagas de Voluntariado</h3>
            {vagas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vagas.map((vaga) => (
                  <div key={vaga.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-2 text-sm text-teal-700 mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Ativa</span>
                    </div>
                    <p className="text-gray-900 font-medium mb-1">{vaga.titulo || 'Vaga'}</p>
                    <p className="text-gray-700 text-sm mb-2">{vaga.descricao || 'Descrição não informada.'}</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      {vaga.horario && <p><span className="font-semibold">Horário:</span> {vaga.horario}</p>}
                      {vaga.duracao && <p><span className="font-semibold">Duração:</span> {vaga.duracao}</p>}
                      {vaga.requisitos && <p><span className="font-semibold">Requisitos:</span> {vaga.requisitos}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhuma vaga publicada.</p>
            )}
          </div>

          {/* Perguntas e respostas */}
          <div>
            <h3 className="text-gray-900 mb-3">Perguntas Respondidas</h3>
            {perguntasRespondidas.length > 0 ? (
              <div className="space-y-3">
                {perguntasRespondidas.map((p) => (
                  <div key={p.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>{p.nome || p.nomeUsuario || 'Usuário'}</span>
                        <span>•</span>
                        <span>{new Date(p.criadoEm).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">Respondida</span>
                    </div>
                    <p className="text-gray-900 font-medium mb-1">{p.mensagem || p.pergunta}</p>
                    {p.resposta && (
                      <p className="text-gray-700 text-sm">
                        <span className="font-semibold">Resposta:</span> {p.resposta}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhuma pergunta respondida ainda.</p>
            )}
          </div>

          {/* Perguntas Frequentes */}
          <div>
            <h3 className="text-gray-900 mb-3">Faça uma Pergunta</h3>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Digite sua pergunta para a organização..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
            <button
              className="mt-3 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
              onClick={handleSendQuestion}
            >
              Enviar Pergunta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
