import { CheckCircle2, Database } from 'lucide-react';

export function DatabaseStatus() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
        <div>
          <h3 className="text-green-900 font-medium mb-1">
            Banco de dados conectado e funcionando!
          </h3>
          <p className="text-green-700 text-sm">
            Todas as funcionalidades do ConectCausa estão 100% operacionais:
          </p>
          <ul className="mt-2 text-sm text-green-700 space-y-1 ml-4 list-disc">
            <li>Busca de ONGs com filtros em tempo real</li>
            <li>Autenticação de administradores via Supabase</li>
            <li>Cadastro e atualização de dados das ONGs</li>
            <li>Publicação e gerenciamento de vagas de voluntariado</li>
            <li>Sistema de perguntas e respostas</li>
            <li>Métricas de alcance e visualizações</li>
            <li>Upload e armazenamento de documentos</li>
          </ul>
          <p className="text-green-700 text-sm mt-2">
            <strong>Credenciais de teste:</strong> admin@ong.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
