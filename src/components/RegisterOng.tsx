import { Building2, Mail, Phone, MapPin, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type Page = 'search' | 'admin' | 'register' | 'dashboard';

interface RegisterOngProps {
  onNavigate: (page: Page) => void;
}

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7a062fc7`;

export function RegisterOng({ onNavigate }: RegisterOngProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [loading, setLoading] = useState(false);
  
  // Formulário de Cadastro
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    category: '',
    neighborhood: '',
    region: '',
    description: '',
    publicServed: '',
    phone: '',
    hours: '',
    accessibility: 'none'
  });

  // Formulário de Login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!registerData.name || !registerData.email || !registerData.password || 
        !registerData.category || !registerData.description || 
        !registerData.neighborhood || !registerData.region) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!registerData.email.includes('@')) {
      toast.error('Por favor, insira um e-mail válido.');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Criar usuário admin no backend
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          name: registerData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar usuário');
      }

      // Mostrar mensagem de sucesso
      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      
      // Resetar formulário e mudar para aba de login
      setTimeout(() => {
        setRegisterData({
          name: '',
          email: '',
          password: '',
          category: '',
          neighborhood: '',
          region: '',
          description: '',
          publicServed: '',
          phone: '',
          hours: '',
          accessibility: 'none'
        });
        setActiveTab('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    } catch (error: any) {
      console.error('Register error:', error);
      toast.error(error.message || 'Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!loginData.email || !loginData.password) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    if (!loginData.email.includes('@')) {
      toast.error('Por favor, insira um e-mail válido.');
      return;
    }

    // Simulação de login - você pode adicionar lógica real aqui
    toast.success('Login realizado com sucesso!');
    
    // Navegar para o painel administrativo após 1 segundo
    setTimeout(() => {
      onNavigate('dashboard');
    }, 1000);
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 px-6 py-3 text-center transition-colors ${
              activeTab === 'login'
                ? 'bg-gray-100 text-gray-900 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 px-6 py-3 text-center transition-colors ${
              activeTab === 'register'
                ? 'bg-gray-100 text-gray-900 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Cadastro
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="p-8">
            <h2 className="text-gray-900 mb-2">
              Entrar como ONG
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Acesse o painel administrativo da sua organização
            </p>

            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-gray-700 mb-2">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="contato@ong.org.br"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Senha <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg transition-colors"
              >
                Entrar
              </button>

              <p className="text-center text-sm text-gray-600">
                Ainda não tem conta?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Cadastre sua ONG
                </button>
              </p>
            </form>
          </div>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <div className="p-8">
            <h2 className="text-gray-900 mb-2">
              Cadastrar Nova ONG
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Preencha os dados da sua organização
            </p>

            <form className="space-y-6" onSubmit={handleRegisterSubmit}>
              <div>
                <label className="block text-gray-700 mb-2">
                  Nome da ONG <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nome da organização"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="contato@ong.org.br"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Senha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Mínimo 6 caracteres"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Área de Atuação <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    name="category"
                    value={registerData.category}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  >
                    <option value="">Selecione a área</option>
                    <option value="Educação">Educação</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Meio Ambiente">Meio Ambiente</option>
                    <option value="Assistência Social">Assistência Social</option>
                    <option value="Animais">Animais</option>
                    <option value="Cultura">Cultura</option>
                    <option value="Esportes">Esportes</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Idosos">Idosos</option>
                    <option value="Outro">Outro</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Bairro <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="neighborhood"
                    placeholder="Bairro"
                    value={registerData.neighborhood}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Região <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      name="region"
                      value={registerData.region}
                      onChange={handleRegisterChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    >
                      <option value="">Selecione a região</option>
                      <option value="Centro-Sul">Centro-Sul</option>
                      <option value="Barreiro">Barreiro</option>
                      <option value="Pampulha">Pampulha</option>
                      <option value="Venda Nova">Venda Nova</option>
                      <option value="Norte">Norte</option>
                      <option value="Nordeste">Nordeste</option>
                      <option value="Noroeste">Noroeste</option>
                      <option value="Oeste">Oeste</option>
                      <option value="Leste">Leste</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Descrição <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Descreva a missão e atividades da ONG"
                  rows={4}
                  value={registerData.description}
                  onChange={handleRegisterChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Público Atendido
                </label>
                <input
                  type="text"
                  name="publicServed"
                  placeholder="Ex: Crianças de 6 a 12 anos"
                  value={registerData.publicServed}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(31) 3333-4444"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Horário de Atendimento
                  </label>
                  <input
                    type="text"
                    name="hours"
                    placeholder="Ex: Seg-Sex, 8h-17h"
                    value={registerData.hours}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="accessibility" 
                    value="accessibility"
                    checked={registerData.accessibility === 'accessibility'}
                    onChange={handleRegisterChange}
                    className="w-4 h-4 text-teal-600" 
                  />
                  <span className="text-gray-700">Possui acessibilidade para pessoas com deficiência</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="accessibility" 
                    value="remote"
                    checked={registerData.accessibility === 'remote'}
                    onChange={handleRegisterChange}
                    className="w-4 h-4 text-teal-600" 
                  />
                  <span className="text-gray-700">Oferece atendimento remoto</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="accessibility" 
                    value="none"
                    checked={registerData.accessibility === 'none'}
                    onChange={handleRegisterChange}
                    className="w-4 h-4 text-teal-600" 
                  />
                  <span className="text-gray-700">Nenhuma das opções</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar ONG'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Já tem conta?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Fazer login
                </button>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}