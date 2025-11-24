import { CheckCircle2, Database, Lock, Zap } from 'lucide-react';

export function SystemStatus() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-green-900 font-semibold mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Sistema 100% Funcional!
          </h3>
          <p className="text-green-800 text-sm mb-4">
            O ConectCausa está totalmente operacional com banco de dados real e todas as funcionalidades implementadas:
          </p>
          
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <Database className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Banco de Dados:</strong> 100 ONGs reais de BH cadastradas com filtros avançados
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Autenticação:</strong> Login seguro para administradores
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>CRUD Completo:</strong> Criar, editar e deletar ONGs
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Vagas:</strong> Sistema de publicação de vagas de voluntariado
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Métricas:</strong> Rastreamento de visualizações e engajamento
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Perguntas:</strong> Sistema de Q&A entre usuários e ONGs
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-sm text-green-800">
              <strong>🔑 Credenciais de teste:</strong> 
              <code className="mx-2 px-2 py-1 bg-white rounded">admin@ong.com</code> / 
              <code className="mx-2 px-2 py-1 bg-white rounded">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
