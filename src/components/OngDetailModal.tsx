import { MapPin, Clock, Users, Heart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

interface Ong {
  id: number;
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