import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7a062fc7`;

const regions = [
  'Centro-Sul',
  'Barreiro',
  'Pampulha',
  'Venda Nova',
  'Norte',
  'Nordeste',
  'Noroeste',
  'Leste',
  'Oeste',
];

const neighborhoodsByRegion: Record<string, string[]> = {
  'Centro-Sul': [
    'Barro Preto', 'Centro', 'Funcionários', 'Jardim América', 'Lourdes', 'Luxemburgo',
    'Mangabeiras', 'Morro das Pedras', 'Santa Efigênia', 'Santa Lúcia', 'Santo Agostinho',
    'Santo Antônio', 'São Bento', 'São Pedro', 'Savassi', 'Serra', 'Sion', 'Cabana',
  ],
  Barreiro: ['Barreiro', 'Cardoso', 'Industrial', 'Jardim Montanhês', 'Lindéia', 'Petrópolis'],
  Pampulha: ['Castelo', 'Céu Azul', 'Copacabana', 'Dona Clara', 'Itapoã', 'Ouro Preto', 'Pampulha', 'Planalto', 'Santa Mônica', 'Trevo'],
  'Venda Nova': ['Jardim Europa', 'Nacional', 'Piratininga', 'Venda Nova'],
  Norte: ['Aarão Reis', 'Conjunto Felicidade', 'Guarani', 'Jardim Felicidade', 'Jardim Guanabara', 'Mantiqueira', 'Primeiro de Maio', 'São Bernardo', 'Tupi', 'Várzea', 'Zilah Spósito'],
  Nordeste: ['Cachoeirinha', 'Caiçara', 'Cidade Nova', 'Concórdia', 'Goiânia', 'Ipiranga', 'Ribeiro de Abreu', 'São Gabriel', 'União'],
  Noroeste: ['Bonfim', 'Coração Eucarístico', 'Dom Cabral', 'Lagoinha', 'Aparecida', 'Carlos Prates', 'Padre Eustáquio'],
  Leste: ['Floresta', 'Santa Tereza', 'Granja de Freitas', 'Santa Inês', 'Horto', 'Taquaril', 'Sagrada Família'],
  Oeste: ['Buritis', 'Camargos', 'Gameleira', 'Eldorado', 'Prado', 'Minas Caixa', 'Nova Suíça', 'Estoril', 'Betânia', 'Santa Maria', 'Nova Granada', 'Cabana Pai Tomás', 'Camargos', 'Gutierrez'],
};

// Mesmas opções da SearchPage
const hoursOptions = ['Manhã', 'Tarde', 'Noite'];
const areasOptions = [
  'Assistência Social',
  'Animais',
  'Cultura',
  'Esportes',
  'Alimentação',
  'Idosos',
  'Outro',
];
const languageOptions = ['Português', 'Inglês', 'Espanhol'];
const featureOptions = ['Acessibilidade', 'Atendimento remoto'];

interface AdminLoginProps {
  onLogin: () => void;
}

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    ongNome: '',
    ongDescricao: '',
    telefone: '',
    endereco: '',
    bairro: '',
    regiao: '',
    site: '',
    horarios: [] as string[],
    areasAtuacao: [] as string[],
    idiomas: [] as string[],
    caracteristicas: [] as string[],
    cep: '',
    numero: '',
  });
  const [cepStatus, setCepStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const isLoginMode = mode === 'login';
  const isSignupMode = mode === 'signup';

  const availableNeighborhoods = useMemo(
    () => (signupData.regiao ? neighborhoodsByRegion[signupData.regiao] || [] : []),
    [signupData.regiao]
  );

  const findRegionFromBairro = (bairro: string) => {
    const entry = Object.entries(neighborhoodsByRegion).find(([, bairros]) =>
      bairros.some((b) => b.toLowerCase() === bairro.toLowerCase())
    );
    return entry ? entry[0] : '';
  };

  const handleCepLookup = async () => {
    const cepDigits = signupData.cep.replace(/\D/g, '');
    if (cepDigits.length !== 8) {
      setCepStatus('CEP inválido');
      return;
    }

    setCepStatus('Buscando endereço...');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepStatus('CEP não encontrado');
        return;
      }

      const bairro = data.bairro || '';
      const logradouro = data.logradouro || 'Logradouro não informado';
      const regiao = findRegionFromBairro(bairro);

      setSignupData((prev) => ({
        ...prev,
        endereco: `${logradouro}, ${prev.numero || ''}`.trim(),
        bairro,
        regiao,
      }));
      setCepStatus(regiao ? 'Endereço preenchido automaticamente' : 'Endereço preenchido (região não localizada)');
    } catch (error) {
      console.error('Erro ao buscar CEP', error);
      setCepStatus('Erro ao buscar CEP');
    }
  };

  const handleMultiSelect = (field: 'horarios' | 'areasAtuacao' | 'idiomas' | 'caracteristicas', values: string[]) => {
    setSignupData((prev) => ({ ...prev, [field]: values }));
  };

  const handleCheckboxToggle = (field: 'horarios' | 'areasAtuacao' | 'idiomas' | 'caracteristicas', value: string) => {
    setSignupData((prev) => {
      const current = prev[field];
      const exists = current.includes(value);
      const next = exists ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const loginRequest = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer login');
    }

    localStorage.setItem('auth_token', data.token);
    return data;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error('Por favor, insira um e-mail válido (ex: exemplo@dominio.com).');
      return;
    }

    setLoading(true);
    try {
      await loginRequest(formData.email, formData.password);
      toast.success('Login realizado com sucesso!');
      setTimeout(() => onLogin(), 600);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'E-mail ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      'name',
      'email',
      'password',
      'ongNome',
      'ongDescricao',
      'telefone',
      'cep',
      'numero',
    ] as const;

    const fieldLabels: Record<typeof requiredFields[number], string> = {
      name: 'Seu nome',
      email: 'E-mail',
      password: 'Senha',
      ongNome: 'Nome da ONG',
      ongDescricao: 'Descrição da ONG',
      telefone: 'Telefone',
      cep: 'CEP',
      numero: 'Número',
    };

    const missing = requiredFields.filter((field) => !(signupData as any)[field]);
    if (missing.length > 0) {
      const missingLabels = missing.map((field) => fieldLabels[field]);
      toast.error(`Falta preencher: ${missingLabels.join(', ')}`);
      return;
    }

    if (!isValidEmail(signupData.email)) {
      toast.error('E-mail deve estar no formato exemplo@dominio.com');
      return;
    }

    if (!signupData.endereco || !signupData.bairro || !signupData.regiao) {
      toast.error('Busque o endereço pelo CEP para preencher bairro e região.');
      return;
    }

    if (!signupData.horarios.length) {
      toast.error('Selecione ao menos 1 horário.');
      return;
    }
    if (!signupData.areasAtuacao.length) {
      toast.error('Selecione ao menos 1 área de atuação.');
      return;
    }
    if (!signupData.idiomas.length) {
      toast.error('Selecione ao menos 1 idioma.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...signupData,
        ongEmail: signupData.email,
        acessibilidade: signupData.caracteristicas.includes('Acessibilidade'),
        atendimentoRemoto: signupData.caracteristicas.includes('Atendimento remoto'),
      };

      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }

      // Login automático logo após criar
      try {
        await loginRequest(signupData.email, signupData.password);
        toast.success('Conta criada com sucesso! Você já está logado.');
        onLogin();
      } catch (loginErr: any) {
        console.error('Auto-login error:', loginErr);
        toast.success('Conta criada com sucesso! Faça login para continuar.');
        setMode('login');
        setFormData({ email: signupData.email, password: signupData.password });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const renderMultiSelect = (
    label: string,
    field: 'horarios' | 'areasAtuacao' | 'idiomas' | 'caracteristicas',
    options: string[],
    requiredMarker = true
  ) => (
    <div>
      <label className="block text-gray-800 mb-2 font-medium">
        {label}
        {requiredMarker && ' *'}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
        {options.map((option) => (
          <label key={option} className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              checked={signupData[field].includes(option)}
              onChange={() => handleCheckboxToggle(field, option)}
              disabled={loading}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1">Marque as opções desejadas.</p>
    </div>
  );

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(circle at 18% 20%, rgba(14,165,233,0.08), transparent 32%), radial-gradient(circle at 82% 0%, rgba(99,102,241,0.08), transparent 28%), #f8fafc',
      }}
    >
      <div className={`mx-auto px-4 py-12 ${isLoginMode ? 'max-w-4xl' : 'max-w-5xl'}`}>
        <div className={`mb-8 flex flex-col gap-3 items-center text-center`}>
          <span className="inline-flex items-center w-fit gap-2 px-3 py-1 rounded-full bg-white/80 text-teal-700 border border-teal-100 text-xs font-semibold shadow-sm">
            Plataforma para ONGs em BH
          </span>
          <h1 className="text-3xl font-semibold text-gray-900">Acesso do Administrador</h1>
          <p className="text-gray-600">
            Cadastre sua conta e sua ONG com os dados obrigatórios, ou entre se já possui acesso.
          </p>
        </div>

        <div className={`bg-white/90 backdrop-blur rounded-2xl border border-gray-100 shadow-xl overflow-hidden ${isLoginMode ? 'max-w-3xl mx-auto' : ''}`}>
          <div className="flex flex-col items-center gap-3 p-6 border-b border-gray-100 bg-gradient-to-r from-white to-sky-50">
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  mode === 'signup'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setMode('signup')}
                disabled={loading}
              >
                Criar conta
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  mode === 'login'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setMode('login')}
                disabled={loading}
              >
                Já possuo acesso
              </button>
            </div>
            <span className={`text-sm ${mode === 'signup' ? 'text-teal-700 font-medium' : 'text-gray-600'}`}>
              {mode === 'signup'
                ? 'Novo por aqui? Crie sua conta primeiro.'
                : 'Já tem cadastro? Faça login para continuar.'}
            </span>
          </div>

          <div className="p-8">
            {mode === 'login' && (
              <form
                className="space-y-5 mx-auto w-full"
                style={{ maxWidth: '520px' }}
                onSubmit={handleLogin}
              >
                <div>
                  <label className="block text-gray-800 mb-2 font-medium">E-mail *</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-800 mb-2 font-medium">Senha *</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
                <p className="text-xs text-gray-600 text-center">
                  Conta de teste: admin@ong.com / admin1234
                </p>
              </form>
            )}

            {mode === 'signup' && (
              <form
                className="space-y-6 mx-auto"
                style={{ maxWidth: '1040px' }}
                onSubmit={handleSignup}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-800 mb-2 font-medium">Seu nome *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-800 mb-2 font-medium">E-mail *</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-800 mb-2 font-medium">Senha *</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-800 mb-2 font-medium">Telefone *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                      value={signupData.telefone}
                      onChange={(e) => setSignupData({ ...signupData, telefone: formatPhone(e.target.value) })}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <label className="block text-gray-800 mb-2 font-medium">Nome da ONG *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                      value={signupData.ongNome}
                      onChange={(e) => setSignupData({ ...signupData, ongNome: e.target.value })}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-800 mb-2 font-medium">Descrição da ONG *</label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                    rows={3}
                    value={signupData.ongDescricao}
                    onChange={(e) => setSignupData({ ...signupData, ongDescricao: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-800 mb-2 font-medium">CEP *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                        value={signupData.cep}
                        onChange={(e) => setSignupData({ ...signupData, cep: formatCep(e.target.value) })}
                        onBlur={handleCepLookup}
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        onClick={handleCepLookup}
                        className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors shadow-sm"
                        disabled={loading}
                      >
                        Buscar
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-800 mb-2 font-medium">Número *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                      value={signupData.numero}
                      onChange={(e) => setSignupData({ ...signupData, numero: e.target.value })}
                      onBlur={handleCepLookup}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-800 mb-1 font-medium">Endereço (auto) *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 shadow-inner"
                      value={signupData.endereco}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-gray-800 mb-1 font-medium">Bairro (auto) *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 shadow-inner"
                      value={signupData.bairro}
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-800 mb-1 font-medium">Região (auto) *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 shadow-inner"
                      value={signupData.regiao}
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">{cepStatus || 'Informe CEP e número para preencher.'}</p>
                  </div>
                  <div>
                    <label className="block text-gray-800 mb-2 font-medium">Site</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                      value={signupData.site}
                      onChange={(e) => setSignupData({ ...signupData, site: e.target.value })}
                      disabled={loading}
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderMultiSelect('Horários', 'horarios', hoursOptions)}
                  {renderMultiSelect('Áreas de atuação', 'areasAtuacao', areasOptions)}
                  {renderMultiSelect('Idiomas', 'idiomas', languageOptions)}
                </div>

                <div>
                  <label className="block text-gray-800 mb-2 font-medium">Recursos e facilidades (opcional)</label>
                  {renderMultiSelect('Selecione os recursos oferecidos pela ONG', 'caracteristicas', featureOptions, false)}
                </div>

                <div className="mt-6 sticky bottom-0 bg-white/95 backdrop-blur px-4 py-3 border border-gray-100 rounded-xl shadow-md">
                  <button
                    type="submit"
                className="w-full text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg border border-sky-600"
                style={{
                  background: 'linear-gradient(90deg, #0ea5e9, #2563eb)',
                }}
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Criando...' : 'Criar conta'}
              </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

