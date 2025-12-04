import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, List, Map, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { MapView } from './MapView';
import { OngDetailModal } from './OngDetailModal';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Ong {
  id: string | number;
  name: string;
  description: string;
  category: string;
  location: string;
  region: string;
  neighborhood: string;
  hours: string;
  hourPeriods?: ('manha' | 'tarde' | 'noite')[];
  categoryColor: string;
  languages: string[];
  hasAccessibility: boolean;
  hasRemoteService: boolean;
}

type HourPeriod = 'manha' | 'tarde' | 'noite';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7a062fc7`;

const categoryColorMap: Record<string, string> = {
  'Assistência Social': 'bg-blue-500',
  'Saúde': 'bg-red-500',
  'Meio Ambiente': 'bg-green-500',
  'Educação': 'bg-orange-500',
  'Animais': 'bg-purple-500',
  'Cultura e Arte': 'bg-pink-500',
  'Esportes': 'bg-yellow-600',
  'Idosos': 'bg-indigo-500',
  'Pessoas com Deficiência': 'bg-teal-500',
  'Outro': 'bg-gray-500',
};

const normalizeHourPeriods = (value: string | string[] | undefined | null): HourPeriod[] => {
  const parts = Array.isArray(value)
    ? value
    : (value || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

  const periods = new Set<HourPeriod>();
  parts.forEach((raw) => {
    const clean = raw
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    if (clean.includes('manha') || /6h|7h|8h|9h|10h|11h|12h/.test(clean)) {
      periods.add('manha');
    }
    if (clean.includes('tarde') || /12h|13h|14h|15h|16h|17h/.test(clean)) {
      periods.add('tarde');
    }
    if (clean.includes('noite') || /18h|19h|20h|21h|22h|23h/.test(clean)) {
      periods.add('noite');
    }
  });
  return Array.from(periods);
};

const formatHourLabel = (periods: HourPeriod[], fallback: string) => {
  if (!periods.length) return fallback;
  const label: Record<HourPeriod, string> = {
    manha: 'Manhã',
    tarde: 'Tarde',
    noite: 'Noite',
  };
  return periods.map((p) => label[p]).join(', ');
};

const allOngsBase: Omit<Ong, 'hourPeriods'>[] = [
  {
    id: 101,
    name: "Instituto Ação Solidária",
    description: "Atendimento social e educacional para famílias, com distribuição de alimentos, reforço escolar e cursos profissionalizantes.",
    category: "Assistência Social",
    location: "Rua Curitiba, 1234 - Centro",
    region: "Centro-Sul",
    neighborhood: "Centro",
    hours: "8h às 18h",
    categoryColor: categoryColorMap["Assistência Social"],
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 1,
    name: "Obra do Berço",
    description: "Fundada em 1922, a Obra do Berço acolhe crianças de 0 a 6 anos em situação de vulnerabilidade social, oferecendo educação, saúde e assistência social.",
    category: "Assistência Social",
    location: "Rua Padre Pedro Pinto, 750 - Sagrada Família",
    region: "Leste",
    neighborhood: "Sagrada Família",
    hours: "8h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 2,
    name: "Aldeias Infantis SOS Brasil - BH",
    description: "Organização que acolhe crianças e adolescentes em situação de vulnerabilidade, proporcionando ambiente familiar e desenvolvimento integral.",
    category: "Assistência Social",
    location: "Rua Vasco da Gama, 920 - Lindéia",
    region: "Barreiro",
    neighborhood: "Lindéia",
    hours: "8h às 18h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 3,
    name: "Instituto Ânima",
    description: "Promove educação ambiental, preservação da fauna e flora através de projetos educativos e ações de conscientização ecológica.",
    category: "Meio Ambiente",
    location: "Av. Otacílio Negrão de Lima, 5800 - Pampulha",
    region: "Pampulha",
    neighborhood: "Pampulha",
    hours: "9h às 17h",
    categoryColor: "bg-green-500",
    languages: ["Português", "Inglês"],
    hasAccessibility: false,
    hasRemoteService: true
  },
  {
    id: 4,
    name: "Associação Mineira de Defesa do Ambiente (AMDA)",
    description: "Atua na defesa do meio ambiente através de campanhas, ações judiciais e projetos de educação ambiental desde 1978.",
    category: "Meio Ambiente",
    location: "Rua dos Aimorés, 1451 - Funcionários",
    region: "Centro-Sul",
    neighborhood: "Funcionários",
    hours: "9h às 18h",
    categoryColor: "bg-green-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 5,
    name: "Grupo de Apoio à Prevenção à AIDS (GAPA)",
    description: "Organização pioneira na luta contra HIV/AIDS em Minas Gerais, oferecendo atendimento, prevenção e apoio psicossocial.",
    category: "Saúde",
    location: "Av. Augusto de Lima, 1646 - Centro",
    region: "Centro-Sul",
    neighborhood: "Centro",
    hours: "8h às 17h",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 6,
    name: "Projeto Providência",
    description: "Atende crianças, adolescentes e famílias em situação de vulnerabilidade social na região do Aglomerado da Serra com educação e cultura.",
    category: "Educação",
    location: "Rua Taquari, 290 - Serra",
    region: "Centro-Sul",
    neighborhood: "Serra",
    hours: "8h às 17h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 7,
    name: "Associação Beneficente Lar Fabiano de Cristo",
    description: "Atendimento a pessoas com deficiência intelectual através de programas de habilitação, reabilitação e inclusão social.",
    category: "Assistência Social",
    location: "Rua Padre Eustáquio, 1984 - Padre Eustáquio",
    region: "Noroeste",
    neighborhood: "Padre Eustáquio",
    hours: "7h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 8,
    name: "Rede Cidadã",
    description: "Promove inclusão digital, capacitação profissional e cidadania para jovens e adultos em comunidades vulneráveis de BH.",
    category: "Educação",
    location: "Av. Vilarinho, 2300 - Venda Nova",
    region: "Venda Nova",
    neighborhood: "Venda Nova",
    hours: "9h às 18h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 9,
    name: "Instituto Casarao",
    description: "Oferece atendimento psicossocial especializado para crianças e adolescentes vítimas de violência sexual e suas famílias.",
    category: "Assistência Social",
    location: "Rua Leopoldina, 56 - Santa Efigênia",
    region: "Centro-Sul",
    neighborhood: "Santa Efigênia",
    hours: "8h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 10,
    name: "SOS Animais de Rua BH",
    description: "Resgate, tratamento veterinário e promoção da adoção responsável de cães e gatos abandonados em Belo Horizonte.",
    category: "Animais",
    location: "Rua Conceição do Mato Dentro, 1745 - Cachoeirinha",
    region: "Nordeste",
    neighborhood: "Cachoeirinha",
    hours: "10h às 18h",
    categoryColor: "bg-purple-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: true
  },
  {
    id: 11,
    name: "Banco de Alimentos de Belo Horizonte",
    description: "Combate ao desperdício de alimentos e à fome, arrecadando e distribuindo alimentos para instituições sociais.",
    category: "Alimentação",
    location: "Av. Afonso Vaz de Melo, 1200 - Barreiro",
    region: "Oeste",
    neighborhood: "Barreiro",
    hours: "8h às 17h",
    categoryColor: "bg-orange-600",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 12,
    name: "Instituto Mães da Favela",
    description: "Apoio a mães em situação de vulnerabilidade através de cestas básicas, capacitação profissional e geração de renda.",
    category: "Assistência Social",
    location: "Rua Itacolomi, 230 - Santa Lúcia",
    region: "Centro-Sul",
    neighborhood: "Santa Lúcia",
    hours: "9h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: true
  },
  {
    id: 13,
    name: "Uai SóS - União de Auxílio aos Idosos",
    description: "Apoio a idosos em situação de abandono e vulnerabilidade, oferecendo acolhimento, saúde e atividades recreativas.",
    category: "Idosos",
    location: "Av. Tito Fulgêncio, 104 - Barreiro",
    region: "Barreiro",
    neighborhood: "Barreiro",
    hours: "8h às 17h",
    categoryColor: "bg-indigo-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 14,
    name: "Instituto Cultural Filarmônica",
    description: "Ensino gratuito de música para crianças e jovens, promovendo inclusão social através da educação musical.",
    category: "Cultura",
    location: "Rua Desembargador Viçoso Rodrigues, 58 - Lagoinha",
    region: "Noroeste",
    neighborhood: "Lagoinha",
    hours: "14h às 21h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 15,
    name: "Associação dos Amigos do Autista (AMA)",
    description: "Atendimento especializado a pessoas com Transtorno do Espectro Autista e apoio às suas famílias.",
    category: "Saúde",
    location: "Rua Gentios, 1658 - Sion",
    region: "Centro-Sul",
    neighborhood: "Sion",
    hours: "8h às 18h",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 16,
    name: "Centro de Defesa dos Direitos da Criança e do Adolescente (Cedeca)",
    description: "Defesa e promoção dos direitos de crianças e adolescentes através de atendimento jurídico e psicossocial.",
    category: "Assistência Social",
    region: "Centro-Sul",
    location: "Rua Curitiba, 881 - Funcionários",
    neighborhood: "Funcionários",
    hours: "8h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 17,
    name: "ONG Teto",
    description: "Combate à situação de pobreza em que vivem milhões de pessoas em assentamentos precários através de ação conjunta.",
    category: "Assistência Social",
    location: "Rua Várzea Central, 101 - Várzea - Norte",
    region: "Norte",
    neighborhood: "Várzea",
    hours: "9h às 18h",
    categoryColor: "bg-blue-500",
    languages: ["Português", "Espanhol"],
    hasAccessibility: false,
    hasRemoteService: true
  },
  {
    id: 18,
    name: "Gerando Falcões - Núcleo BH",
    description: "Rede de líderes de favelas que promove educação, esporte e cultura para transformação social de jovens.",
    category: "Educação",
    location: "Rua Cabana Central, 102 - Cabana - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Cabana",
    hours: "8h às 18h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 19,
    name: "Instituto Terra Brasilis",
    description: "Educação ambiental, reflorestamento e conservação da biodiversidade da Mata Atlântica em Belo Horizonte.",
    category: "Meio Ambiente",
    location: "Rua Mangabeiras Central, 103 - Mangabeiras - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Mangabeiras",
    hours: "9h às 17h",
    categoryColor: "bg-green-500",
    languages: ["Português", "Inglês"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 20,
    name: "Instituto Chapada",
    description: "Formação continuada de educadores e fortalecimento da gestão educacional em escolas públicas.",
    category: "Educação",
    location: "Rua Savassi Central, 104 - Savassi - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Savassi",
    hours: "9h às 18h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 21,
    name: "Movimento pela Cidadania Popular (MCP)",
    description: "Atua em comunidades populares promovendo direitos humanos, moradia digna e participação social.",
    category: "Assistência Social",
    location: "Rua Granja de Freitas Central, 105 - Granja de Freitas - Leste",
    region: "Leste",
    neighborhood: "Granja de Freitas",
    hours: "8h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 22,
    name: "AfroReggae Belo Horizonte",
    description: "Promoção da cultura afro-brasileira através de oficinas de música, dança, arte e atividades socioeducativas.",
    category: "Cultura",
    location: "Rua Ribeiro de Abreu Central, 106 - Ribeiro de Abreu - Nordeste",
    region: "Nordeste",
    neighborhood: "Ribeiro de Abreu",
    hours: "14h às 21h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 23,
    name: "Associação de Catadores de Papel (ASMARE)",
    description: "Cooperativa de catadores que promove inclusão social através da coleta seletiva e reciclagem de materiais.",
    category: "Meio Ambiente",
    location: "Rua Concórdia Central, 107 - Concórdia - Nordeste",
    region: "Nordeste",
    neighborhood: "Concórdia",
    hours: "7h às 16h",
    categoryColor: "bg-green-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 24,
    name: "Instituto Livres",
    description: "Resgate e reabilitação de animais silvestres vítimas de tráfico e maus-tratos, promovendo educação ambiental.",
    category: "Animais",
    location: "Rua Pampulha Central, 108 - Pampulha - Pampulha",
    region: "Pampulha",
    neighborhood: "Pampulha",
    hours: "9h às 17h",
    categoryColor: "bg-purple-500",
    languages: ["Português", "Inglês"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 25,
    name: "Esporte Clube Social Minas",
    description: "Inclusão social de crianças e jovens através do esporte, oferecendo modalidades como futebol, vôlei e atletismo.",
    category: "Esportes",
    location: "Rua Primeiro de Maio Central, 109 - Primeiro de Maio - Norte",
    region: "Norte",
    neighborhood: "Primeiro de Maio",
    hours: "8h às 18h",
    categoryColor: "bg-yellow-600",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 26,
    name: "Casa de Acolhida Irmã Dulce",
    description: "Acolhimento de pessoas em situação de rua, oferecendo alimentação, higiene, pernoite e reintegração social.",
    category: "Assistência Social",
    location: "Rua Lagoinha Central, 110 - Lagoinha - Noroeste",
    region: "Noroeste",
    neighborhood: "Lagoinha",
    hours: "24 horas",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 27,
    name: "Patas Dadas",
    description: "Proteção e bem-estar animal através de resgates, castrações, adoções e conscientização sobre posse responsável.",
    category: "Animais",
    location: "Rua Castelo Central, 111 - Castelo - Pampulha",
    region: "Pampulha",
    neighborhood: "Castelo",
    hours: "10h às 17h",
    categoryColor: "bg-purple-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: true
  },
  {
    id: 28,
    name: "Pastoral do Menor",
    description: "Proteção e defesa dos direitos de crianças e adolescentes em situação de risco e vulnerabilidade social.",
    category: "Assistência Social",
    location: "Rua Dom Cabral Central, 112 - Dom Cabral - Noroeste",
    region: "Noroeste",
    neighborhood: "Dom Cabral",
    hours: "8h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 29,
    name: "Centro Popular de Cultura (CPC)",
    description: "Produção cultural e artística nas periferias através de oficinas de teatro, cinema, música e artes visuais.",
    category: "Cultura",
    location: "Rua Morro das Pedras Central, 113 - Morro das Pedras - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Morro das Pedras",
    hours: "14h às 20h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 30,
    name: "Médicos Sem Fronteiras - Escritório BH",
    description: "Assistência médica humanitária a populações vulneráveis, incluindo refugiados e vítimas de conflitos.",
    category: "Saúde",
    location: "Rua Savassi Central, 114 - Savassi - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Savassi",
    hours: "9h às 18h",
    categoryColor: "bg-red-500",
    languages: ["Português", "Inglês", "Espanhol"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 31,
    name: "Associação Peter Pan",
    description: "Apoio a crianças e adolescentes com câncer e suas famílias, oferecendo hospedagem, transporte e suporte emocional.",
    category: "Saúde",
    location: "Rua Santa Efigênia Central, 115 - Santa Efigênia - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Santa Efigênia",
    hours: "24 horas",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 32,
    name: "Instituto Ayrton Senna - Núcleo BH",
    description: "Desenvolvimento integral de crianças e jovens através da educação, esporte e cultura.",
    category: "Educação",
    location: "Rua Lourdes Central, 116 - Lourdes - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Lourdes",
    hours: "8h às 18h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 33,
    name: "Projeto Manuelzão",
    description: "Revitalização da bacia do Rio das Velhas através de ações ambientais, educação e mobilização social.",
    category: "Meio Ambiente",
    location: "Rua Santo Antônio Central, 117 - Santo Antônio - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Santo Antônio",
    hours: "8h às 17h",
    categoryColor: "bg-green-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 34,
    name: "Associação Beneficente Lua Nova",
    description: "Assistência social a mulheres vítimas de violência doméstica, oferecendo acolhimento e orientação jurídica.",
    category: "Assistência Social",
    location: "Rua Carlos Prates Central, 118 - Carlos Prates - Noroeste",
    region: "Noroeste",
    neighborhood: "Carlos Prates",
    hours: "8h às 18h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 35,
    name: "Instituto Compartilhar",
    description: "Formação de jovens atletas através do vôlei, educação e valores para cidadania.",
    category: "Esportes",
    location: "Rua Cidade Nova Central, 119 - Cidade Nova - Nordeste",
    region: "Nordeste",
    neighborhood: "Cidade Nova",
    hours: "7h às 19h",
    categoryColor: "bg-yellow-600",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 36,
    name: "ONG Ruas e Praças",
    description: "Revitalização de espaços públicos e promoção de atividades culturais em praças e ruas de BH.",
    category: "Cultura",
    location: "Rua Floresta Central, 120 - Floresta - Leste",
    region: "Leste",
    neighborhood: "Floresta",
    hours: "9h às 18h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: true
  },
  {
    id: 37,
    name: "Associação Respire",
    description: "Apoio a pessoas com doenças respiratórias crônicas através de grupos de apoio e orientação médica.",
    category: "Saúde",
    location: "Rua Santa Tereza Central, 121 - Santa Tereza - Leste",
    region: "Leste",
    neighborhood: "Santa Tereza",
    hours: "8h às 17h",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 38,
    name: "Instituto Ramacrisna",
    description: "Atendimento a crianças, adolescentes e famílias em situação de vulnerabilidade social com atividades socioeducativas.",
    category: "Assistência Social",
    location: "Rua Aarão Reis Central, 122 - Aarão Reis - Norte",
    region: "Norte",
    neighborhood: "Aarão Reis",
    hours: "8h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 39,
    name: "Fundação Criança de Minas Gerais",
    description: "Proteção e defesa dos direitos de crianças e adolescentes através de programas socioeducativos.",
    category: "Assistência Social",
    location: "Rua Santa Mônica Central, 123 - Santa Mônica - Pampulha",
    region: "Pampulha",
    neighborhood: "Santa Mônica",
    hours: "8h às 18h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 40,
    name: "ONG Banco de Roupas BH",
    description: "Arrecadação e distribuição de roupas para pessoas em situação de vulnerabilidade social.",
    category: "Assistência Social",
    location: "Rua Barro Preto Central, 124 - Barro Preto - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Barro Preto",
    hours: "9h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 41,
    name: "Instituto de Cegos do Brasil Central",
    description: "Reabilitação e inclusão social de pessoas cegas ou com baixa visão através de cursos e atividades.",
    category: "Saúde",
    location: "Rua Bonfim Central, 125 - Bonfim - Noroeste",
    region: "Noroeste",
    neighborhood: "Bonfim",
    hours: "7h às 18h",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 42,
    name: "Associação Mineira de Apoio aos Pés Tortos",
    description: "Tratamento e acompanhamento de crianças com pé torto congênito, oferecendo suporte médico gratuito.",
    category: "Saúde",
    location: "Rua São Pedro Central, 126 - São Pedro - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "São Pedro",
    hours: "8h às 17h",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 43,
    name: "Instituição Lar São Francisco de Assis",
    description: "Acolhimento institucional para crianças e adolescentes em situação de risco social.",
    category: "Assistência Social",
    location: "Rua Jardim Montanhês Central, 127 - Jardim Montanhês - Barreiro",
    region: "Barreiro",
    neighborhood: "Jardim Montanhês",
    hours: "24 horas",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 44,
    name: "Associação Solidariedade é Vida",
    description: "Distribuição de alimentos, roupas e cobertores para pessoas em situação de rua.",
    category: "Assistência Social",
    location: "Rua Glória Central, 128 - Glória - Noroeste",
    region: "Noroeste",
    neighborhood: "Glória",
    hours: "9h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 45,
    name: "Instituto Cultural Vale Esperança",
    description: "Promoção da cultura através de oficinas de teatro, dança e música para crianças e jovens.",
    category: "Cultura",
    location: "Rua Tupi Central, 129 - Tupi - Norte",
    region: "Norte",
    neighborhood: "Tupi",
    hours: "14h às 21h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 46,
    name: "Associação Olho Vivo",
    description: "Prevenção da cegueira através de exames oftalmológicos gratuitos e distribuição de óculos.",
    category: "Saúde",
    location: "Rua Coração Eucarístico Central, 130 - Coração Eucarístico - Noroeste",
    region: "Noroeste",
    neighborhood: "Coração Eucarístico",
    hours: "8h às 17h",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 47,
    name: "Projeto Crescer",
    description: "Apoio educacional e profissionalização para jovens em situação de vulnerabilidade social.",
    category: "Educação",
    location: "Rua Itapoã Central, 131 - Itapoã - Pampulha",
    region: "Pampulha",
    neighborhood: "Itapoã",
    hours: "8h às 18h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 48,
    name: "Instituto Verde Vida",
    description: "Educação ambiental e promoção de práticas sustentáveis em escolas e comunidades.",
    category: "Meio Ambiente",
    location: "Rua Buritis Central, 132 - Buritis - Oeste",
    region: "Oeste",
    neighborhood: "Buritis",
    hours: "9h às 17h",
    categoryColor: "bg-green-500",
    languages: ["Português", "Inglês"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 49,
    name: "Associação Viva a Vida",
    description: "Apoio a pacientes com câncer e suas famílias através de grupos de apoio e orientação.",
    category: "Saúde",
    location: "Rua Santo Agostinho Central, 133 - Santo Agostinho - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Santo Agostinho",
    hours: "8h às 17h",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 50,
    name: "Instituto Ser Criança",
    description: "Desenvolvimento integral de crianças através de atividades educativas, culturais e esportivas.",
    category: "Educação",
    location: "Rua Betânia Central, 134 - Betânia - Oeste",
    region: "Oeste",
    neighborhood: "Betânia",
    hours: "8h às 18h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 51,
    name: "ONG Adote um Gatinho",
    description: "Resgate e adoção responsável de gatos abandonados, com foco em castração e cuidados veterinários.",
    category: "Animais",
    location: "Rua São Bento Central, 135 - São Bento - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "São Bento",
    hours: "10h às 18h",
    categoryColor: "bg-purple-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: true
  },
  {
    id: 52,
    name: "Associação de Moradores do Aglomerado Cabana",
    description: "Promoção de direitos comunitários, melhorias de infraestrutura e atividades sociais.",
    category: "Assistência Social",
    location: "Rua Cabana Pai Tomás Central, 136 - Cabana Pai Tomás - Oeste",
    region: "Oeste",
    neighborhood: "Cabana Pai Tomás",
    hours: "9h às 18h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 53,
    name: "Instituto Musical Carlos Gomes",
    description: "Ensino de música clássica e popular para crianças e jovens de comunidades carentes.",
    category: "Cultura",
    location: "Rua Camargos Central, 137 - Camargos - Oeste",
    region: "Oeste",
    neighborhood: "Camargos",
    hours: "14h às 21h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 54,
    name: "Fundação Escola Brasil Central",
    description: "Oferece ensino profissionalizante gratuito em diversas áreas para jovens e adultos.",
    category: "Educação",
    location: "Rua Gameleira Central, 138 - Gameleira - Oeste",
    region: "Oeste",
    neighborhood: "Gameleira",
    hours: "8h às 22h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 55,
    name: "Associação de Apoio aos Dependentes Químicos",
    description: "Tratamento e reabilitação de dependentes químicos através de grupos de apoio e acompanhamento.",
    category: "Saúde",
    location: "Rua Eldorado Central, 139 - Eldorado - Oeste",
    region: "Oeste",
    neighborhood: "Eldorado",
    hours: "24 horas",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 56,
    name: "Instituto Pró-Criança",
    description: "Atendimento psicossocial e jurídico para crianças vítimas de abuso e negligência.",
    category: "Assistência Social",
    location: "Rua União Central, 140 - União - Nordeste",
    region: "Nordeste",
    neighborhood: "União",
    hours: "8h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 57,
    name: "ONG Arte na Favela",
    description: "Oficinas de artes visuais, grafite e pintura para jovens de comunidades periféricas.",
    category: "Cultura",
    location: "Rua Aglomerado Morro das Pedras Central, 141 - Aglomerado Morro das Pedras - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Morro das Pedras",
    hours: "13h às 19h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 58,
    name: "Associação dos Surdos de Minas Gerais",
    description: "Promoção da cultura surda, ensino de Libras e defesa dos direitos das pessoas surdas.",
    category: "Saúde",
    location: "Rua Santa Tereza Central, 142 - Santa Tereza - Leste",
    region: "Leste",
    neighborhood: "Santa Tereza",
    hours: "8h às 18h",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 59,
    name: "Instituto Girassol",
    description: "Apoio educacional e alimentar para crianças em idade escolar de famílias de baixa renda.",
    category: "Educação",
    location: "Rua Nacional Central, 143 - Nacional - Venda Nova",
    region: "Venda Nova",
    neighborhood: "Nacional",
    hours: "7h às 18h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 60,
    name: "Projeto Cão Sem Dono",
    description: "Castração gratuita de cães e gatos, além de campanhas de adoção responsável.",
    category: "Animais",
    location: "Rua Minas Caixa Central, 144 - Minas Caixa - Oeste",
    region: "Oeste",
    neighborhood: "Minas Caixa",
    hours: "9h às 17h",
    categoryColor: "bg-purple-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: true
  },
  {
    id: 61,
    name: "Associação Mãos Unidas",
    description: "Apoio a famílias carentes com distribuição de cestas básicas e itens de higiene.",
    category: "Assistência Social",
    location: "Rua Céu Azul Central, 145 - Céu Azul - Pampulha",
    region: "Pampulha",
    neighborhood: "Céu Azul",
    hours: "9h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 62,
    name: "Instituto Dança e Vida",
    description: "Ensino de dança clássica e contemporânea para crianças e jovens de baixa renda.",
    category: "Cultura",
    location: "Rua Jardim América Central, 146 - Jardim América - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Jardim América",
    hours: "14h às 20h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 63,
    name: "Fundação Esportes para Todos",
    description: "Iniciação esportiva em várias modalidades para crianças e adolescentes.",
    category: "Esportes",
    location: "Rua Piratininga Central, 147 - Piratininga - Venda Nova",
    region: "Venda Nova",
    neighborhood: "Piratininga",
    hours: "8h às 18h",
    categoryColor: "bg-yellow-600",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 64,
    name: "ONG Esperança Verde",
    description: "Plantio de árvores e recuperação de áreas degradadas em Belo Horizonte.",
    category: "Meio Ambiente",
    location: "Rua Caiçara Central, 148 - Caiçara - Nordeste",
    region: "Nordeste",
    neighborhood: "Caiçara",
    hours: "8h às 17h",
    categoryColor: "bg-green-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: true
  },
  {
    id: 65,
    name: "Associação Renascer",
    description: "Apoio a ex-detentos na reintegração social através de capacitação profissional.",
    category: "Assistência Social",
    location: "Rua Santa Inês Central, 149 - Santa Inês - Leste",
    region: "Leste",
    neighborhood: "Santa Inês",
    hours: "8h às 18h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 66,
    name: "Instituto Música nas Escolas",
    description: "Leva aulas de música para escolas públicas, promovendo inclusão cultural.",
    category: "Cultura",
    location: "Rua Prado Central, 150 - Prado - Oeste",
    region: "Oeste",
    neighborhood: "Prado",
    hours: "9h às 18h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 67,
    name: "ONG Amigos do Bem BH",
    description: "Combate à fome e à miséria através da distribuição de alimentos e materiais de construção.",
    category: "Assistência Social",
    location: "Rua Cardoso Central, 151 - Cardoso - Barreiro",
    region: "Barreiro",
    neighborhood: "Cardoso",
    hours: "8h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 68,
    name: "Instituto Futebol de Rua",
    description: "Inclusão social de crianças e jovens através do futebol de rua e atividades educativas.",
    category: "Esportes",
    location: "Rua Zilah Spósito Central, 152 - Zilah Spósito - Norte",
    region: "Norte",
    neighborhood: "Zilah Spósito",
    hours: "8h às 18h",
    categoryColor: "bg-yellow-600",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 69,
    name: "Associação Vida Animal",
    description: "Proteção animal com foco em animais de grande porte como cavalos e bois.",
    category: "Animais",
    location: "Rua Trevo Central, 153 - Trevo - Pampulha",
    region: "Pampulha",
    neighborhood: "Trevo",
    hours: "9h às 17h",
    categoryColor: "bg-purple-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 70,
    name: "Instituto Educação para o Futuro",
    description: "Reforço escolar e preparação para vestibular para estudantes de escolas públicas.",
    category: "Educação",
    location: "Rua Dona Clara Central, 154 - Dona Clara - Pampulha",
    region: "Pampulha",
    neighborhood: "Dona Clara",
    hours: "14h às 21h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 71,
    name: "ONG Reciclando Vidas",
    description: "Capacitação de catadores de materiais recicláveis e promoção da economia solidária.",
    category: "Meio Ambiente",
    location: "Rua Jardim Felicidade Central, 155 - Jardim Felicidade - Norte",
    region: "Norte",
    neighborhood: "Jardim Felicidade",
    hours: "7h às 16h",
    categoryColor: "bg-green-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 72,
    name: "Associação Pró-Saúde Mental",
    description: "Apoio psicológico e psiquiátrico gratuito para pessoas com transtornos mentais.",
    category: "Saúde",
    location: "Rua Castelo Central, 156 - Castelo - Pampulha",
    region: "Pampulha",
    neighborhood: "Castelo",
    hours: "8h às 18h",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 73,
    name: "Instituto Artes e Ofícios",
    description: "Ensino de artesanato e ofícios tradicionais para geração de renda.",
    category: "Cultura",
    location: "Rua Horto Central, 157 - Horto - Leste",
    region: "Leste",
    neighborhood: "Horto",
    hours: "9h às 17h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 74,
    name: "Fundação Crianças Felizes",
    description: "Atividades recreativas e educativas para crianças hospitalizadas e em tratamento.",
    category: "Saúde",
    location: "Rua Santa Efigênia Central, 158 - Santa Efigênia - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Santa Efigênia",
    hours: "8h às 17h",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 75,
    name: "ONG Prato Cheio",
    description: "Distribuição de marmitas e sopas para pessoas em situação de rua.",
    category: "Alimentação",
    location: "Rua Bonfim Central, 159 - Bonfim - Noroeste",
    region: "Noroeste",
    neighborhood: "Bonfim",
    hours: "11h às 14h e 18h às 20h",
    categoryColor: "bg-orange-600",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 76,
    name: "Associação Crescer com Arte",
    description: "Oficinas de arte-educação para desenvolvimento cognitivo e emocional de crianças.",
    category: "Educação",
    location: "Rua Ipiranga Central, 160 - Ipiranga - Nordeste",
    region: "Nordeste",
    neighborhood: "Ipiranga",
    hours: "13h às 19h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 77,
    name: "Instituto Skate Livre",
    description: "Ensino de skate e valores como respeito e disciplina para jovens.",
    category: "Esportes",
    location: "Rua Estoril Central, 161 - Estoril - Oeste",
    region: "Oeste",
    neighborhood: "Estoril",
    hours: "14h às 20h",
    categoryColor: "bg-yellow-600",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 78,
    name: "ONG Leitura para Todos",
    description: "Promoção da leitura através de bibliotecas comunitárias e rodas de leitura.",
    category: "Educação",
    location: "Rua Jardim Europa Central, 162 - Jardim Europa - Venda Nova",
    region: "Venda Nova",
    neighborhood: "Jardim Europa",
    hours: "9h às 18h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 79,
    name: "Associação Amor aos Animais Silvestres",
    description: "Resgate e reabilitação de animais silvestres nativos de Belo Horizonte e Minas Gerais.",
    category: "Animais",
    location: "Rua Mantiqueira Central, 163 - Mantiqueira - Norte",
    region: "Norte",
    neighborhood: "Mantiqueira",
    hours: "8h às 17h",
    categoryColor: "bg-purple-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 80,
    name: "Instituto Empreenda Mais",
    description: "Capacitação em empreendedorismo e gestão de negócios para micro empreendedores.",
    category: "Educação",
    location: "Rua Luxemburgo Central, 164 - Luxemburgo - Centro-Sul",
    region: "Centro-Sul",
    neighborhood: "Luxemburgo",
    hours: "9h às 18h",
    categoryColor: "bg-orange-500",
    languages: ["Português", "Inglês"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 81,
    name: "ONG Cozinha Solidária",
    description: "Preparo e distribuição de refeições gratuitas para famílias em situação de insegurança alimentar.",
    category: "Alimentação",
    location: "Rua Goiânia Central, 165 - Goiânia - Nordeste",
    region: "Nordeste",
    neighborhood: "Goiânia",
    hours: "10h às 15h",
    categoryColor: "bg-orange-600",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 82,
    name: "Associação Mãos que Ajudam",
    description: "Apoio a idosos carentes com visitas, atividades e assistência médica.",
    category: "Idosos",
    location: "Rua Nova Suíça Central, 166 - Nova Suíça - Oeste",
    region: "Oeste",
    neighborhood: "Nova Suíça",
    hours: "8h às 17h",
    categoryColor: "bg-indigo-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 83,
    name: "Instituto Circo Social",
    description: "Ensino de artes circenses para crianças e jovens, promovendo inclusão social.",
    category: "Cultura",
    location: "Rua Industrial Central, 167 - Industrial - Barreiro",
    region: "Barreiro",
    neighborhood: "Industrial",
    hours: "14h às 20h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 84,
    name: "Fundação Água Limpa",
    description: "Projetos de saneamento básico e acesso à água potável em comunidades carentes.",
    category: "Meio Ambiente",
    location: "Rua Taquaril Central, 168 - Taquaril - Leste",
    region: "Leste",
    neighborhood: "Taquaril",
    hours: "8h às 17h",
    categoryColor: "bg-green-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: true
  },
  {
    id: 85,
    name: "ONG Novas Oportunidades",
    description: "Inserção de jovens no mercado de trabalho através de cursos profissionalizantes.",
    category: "Educação",
    location: "Rua Jardim Guanabara Central, 169 - Jardim Guanabara - Norte",
    region: "Norte",
    neighborhood: "Jardim Guanabara",
    hours: "8h às 18h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 86,
    name: "Associação Pró-Moradia",
    description: "Luta pelo direito à moradia digna e regularização fundiária em comunidades.",
    category: "Assistência Social",
    location: "Rua Ribeiro de Abreu Central, 170 - Ribeiro de Abreu - Nordeste",
    region: "Nordeste",
    neighborhood: "Ribeiro de Abreu",
    hours: "9h às 17h",
    categoryColor: "bg-blue-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 87,
    name: "Instituto Tênis Inclusivo",
    description: "Ensino de tênis para crianças e jovens com deficiência física e intelectual.",
    category: "Esportes",
    location: "Rua Planalto Central, 171 - Planalto - Pampulha",
    region: "Pampulha",
    neighborhood: "Planalto",
    hours: "7h às 19h",
    categoryColor: "bg-yellow-600",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 88,
    name: "ONG Sorrir é Viver",
    description: "Atendimento odontológico gratuito para crianças e famílias de baixa renda.",
    category: "Saúde",
    location: "Rua Copacabana Central, 172 - Copacabana - Pampulha",
    region: "Pampulha",
    neighborhood: "Copacabana",
    hours: "8h às 18h",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 89,
    name: "Associação Teatro na Comunidade",
    description: "Montagem de peças teatrais com jovens de comunidades, promovendo arte e cultura.",
    category: "Cultura",
    location: "Rua São Bernardo Central, 173 - São Bernardo - Norte",
    region: "Norte",
    neighborhood: "São Bernardo",
    hours: "14h às 21h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 90,
    name: "Instituto Viver Bem",
    description: "Promoção da qualidade de vida de idosos através de atividades físicas e sociais.",
    category: "Idosos",
    location: "Rua Gutierrez Central, 174 - Gutierrez - Oeste",
    region: "Oeste",
    neighborhood: "Gutierrez",
    hours: "8h às 17h",
    categoryColor: "bg-indigo-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 91,
    name: "ONG Abraço Fraterno",
    description: "Apoio a pessoas com HIV/AIDS através de acompanhamento psicológico e distribuição de medicamentos.",
    category: "Saúde",
    location: "Rua Sagrada Família Central, 175 - Sagrada Família - Leste",
    region: "Leste",
    neighborhood: "Sagrada Família",
    hours: "8h às 17h",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 92,
    name: "Associação Horta Comunitária BH",
    description: "Criação e manutenção de hortas comunitárias urbanas, promovendo alimentação saudável.",
    category: "Meio Ambiente",
    location: "Rua São Gabriel Central, 176 - São Gabriel - Nordeste",
    region: "Nordeste",
    neighborhood: "São Gabriel",
    hours: "7h às 17h",
    categoryColor: "bg-green-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 93,
    name: "Instituto Judô para Todos",
    description: "Ensino de judô para crianças e jovens, desenvolvendo disciplina e respeito.",
    category: "Esportes",
    location: "Rua Aparecida Central, 177 - Aparecida - Noroeste",
    region: "Noroeste",
    neighborhood: "Aparecida",
    hours: "8h às 20h",
    categoryColor: "bg-yellow-600",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 94,
    name: "ONG Mulheres Empreendedoras",
    description: "Capacitação e apoio a mulheres para criação de pequenos negócios.",
    category: "Educação",
    location: "Rua Santa Maria Central, 178 - Santa Maria - Oeste",
    region: "Oeste",
    neighborhood: "Santa Maria",
    hours: "9h às 18h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 95,
    name: "Associação Amigos da Biblioteca",
    description: "Promoção da leitura e manutenção de bibliotecas comunitárias em bairros periféricos.",
    category: "Cultura",
    location: "Rua Conjunto Felicidade Central, 179 - Conjunto Felicidade - Norte",
    region: "Norte",
    neighborhood: "Conjunto Felicidade",
    hours: "9h às 18h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: false
  },
  {
    id: 96,
    name: "Instituto Proteção Animal BH",
    description: "Defesa dos direitos dos animais e combate aos maus-tratos através de denúncias e resgate.",
    category: "Animais",
    location: "Rua Ouro Preto Central, 180 - Ouro Preto - Pampulha",
    region: "Pampulha",
    neighborhood: "Ouro Preto",
    hours: "24 horas",
    categoryColor: "bg-purple-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: true
  },
  {
    id: 97,
    name: "Fundação Autismo e Amor",
    description: "Atendimento especializado a pessoas com autismo e suporte às famílias.",
    category: "Saúde",
    location: "Rua Nova Granada Central, 181 - Nova Granada - Oeste",
    region: "Oeste",
    neighborhood: "Nova Granada",
    hours: "8h às 18h",
    categoryColor: "bg-red-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  },
  {
    id: 98,
    name: "ONG Combate à Fome",
    description: "Arrecadação e distribuição de alimentos não perecíveis para famílias carentes.",
    category: "Alimentação",
    location: "Rua Petropólis Central, 182 - Petropólis - Barreiro",
    region: "Barreiro",
    neighborhood: "Petropólis",
    hours: "9h às 17h",
    categoryColor: "bg-orange-600",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 99,
    name: "Associação Capoeira e Cultura",
    description: "Ensino de capoeira, música e cultura afro-brasileira para crianças e jovens.",
    category: "Cultura",
    location: "Rua Concórdia Central, 183 - Concórdia - Nordeste",
    region: "Nordeste",
    neighborhood: "Concórdia",
    hours: "14h às 20h",
    categoryColor: "bg-pink-500",
    languages: ["Português"],
    hasAccessibility: false,
    hasRemoteService: false
  },
  {
    id: 100,
    name: "Instituto Paz no Trânsito",
    description: "Educação para o trânsito e prevenção de acidentes através de palestras e campanhas.",
    category: "Educação",
    location: "Rua Guarani Central, 184 - Guarani - Norte",
    region: "Norte",
    neighborhood: "Guarani",
    hours: "8h às 17h",
    categoryColor: "bg-orange-500",
    languages: ["Português"],
    hasAccessibility: true,
    hasRemoteService: true
  }
];

const allOngs: Ong[] = allOngsBase.map((ong) => {
  const hourPeriods = normalizeHourPeriods(ong.hours);
  return {
    ...ong,
    hourPeriods,
    hours: formatHourLabel(hourPeriods, ong.hours),
  };
});

export function SearchPage() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedHours, setSelectedHours] = useState<'manha' | 'tarde' | 'noite' | ''>('');
  const [accessibilityFilter, setAccessibilityFilter] = useState<'all' | 'accessibility' | 'remote'>('all');
  const [selectedOng, setSelectedOng] = useState<Ong | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ongs, setOngs] = useState<Ong[]>(allOngs);
  const [showBigMessage, setShowBigMessage] = useState(false);
  const [bigMessageText, setBigMessageText] = useState('');
  const [bigMessageType, setBigMessageType] = useState<'success' | 'info'>('success');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [appliedRegion, setAppliedRegion] = useState('');
  const [appliedNeighborhood, setAppliedNeighborhood] = useState('');
  const [appliedCategory, setAppliedCategory] = useState('');
  const [appliedLanguage, setAppliedLanguage] = useState('');
  const [appliedHours, setAppliedHours] = useState<HourPeriod | ''>('');
  const [appliedAccessibility, setAppliedAccessibility] = useState<'all' | 'accessibility' | 'remote'>('all');
  const itemsPerPage = 12;

  useEffect(() => {
    const loadOngs = async () => {
      try {
        const regionPool = ['Centro-Sul', 'Barreiro', 'Pampulha', 'Venda Nova', 'Norte', 'Nordeste', 'Noroeste', 'Leste', 'Oeste'];
        const regionNeighborhoods: { [key: string]: string[] } = {
          "Centro-Sul": ["Centro", "Funcionários", "Savassi", "Lourdes", "Barro Preto", "Santo Agostinho"],
          "Barreiro": ["Barreiro", "Cardoso", "Industrial", "Jardim Montanhês", "Lindéia", "Petrópolis"],
          "Pampulha": ["Castelo", "Pampulha", "Ouro Preto", "Itapoã", "Planalto"],
          "Venda Nova": ["Venda Nova", "Piratininga", "Nacional", "Jardim Europa"],
          "Norte": ["Guarani", "Jardim Guanabara", "São Bernardo", "Tupi"],
          "Nordeste": ["Cidade Nova", "União", "São Gabriel", "Ribeiro de Abreu"],
          "Noroeste": ["Dom Cabral", "Coração Eucarístico", "Padre Eustáquio"],
          "Leste": ["Santa Tereza", "Horto", "Sagrada Família", "Floresta"],
          "Oeste": ["Buritis", "Prado", "Gutierrez", "Nova Suíça", "Gameleira"],
        };
        const resp = await fetch(`${API_BASE_URL}/ongs`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        if (!resp.ok) throw new Error('Falha ao buscar ONGs');
        const { ongs: apiOngs } = await resp.json();
        if (Array.isArray(apiOngs) && apiOngs.length) {
          const regionPool = ['Centro-Sul', 'Barreiro', 'Pampulha', 'Venda Nova', 'Norte', 'Nordeste', 'Noroeste', 'Leste', 'Oeste'];
          const mapped: Ong[] = apiOngs.map((ong: any, idx: number) => {
            const hourPeriods = normalizeHourPeriods(ong.horarios || ong.horario || ong.horas);
            const hoursLabel = formatHourLabel(
              hourPeriods,
              Array.isArray(ong.horarios) ? ong.horarios.join(', ') : (ong.horarios ?? '')
            );
            const rawRegion = ong.regiao ?? '';
            const region =
              rawRegion && rawRegion !== 'Centro-Sul'
                ? rawRegion
                : regionPool[idx % regionPool.length];
            const bairrosRegiao = regionNeighborhoods[region] || [];
            const bairroValido = ong.bairro && bairrosRegiao.includes(ong.bairro);
            const neighborhood = bairroValido ? ong.bairro : (bairrosRegiao[0] || ong.bairro || '');
            return {
              id: String(ong.id ?? idx),
              name: ong.nome ?? 'ONG',
              description: ong.descricao ?? '',
              category: ong.areasAtuacao?.[0] ?? 'Assistência Social',
              location: [ong.endereco, ong.numero].filter(Boolean).join(', '),
              region,
              neighborhood,
              hours: hoursLabel,
              hourPeriods,
              categoryColor: categoryColorMap[ong.areasAtuacao?.[0]] ?? 'bg-teal-500',
              languages: ong.idiomas ?? [],
              hasAccessibility: Array.isArray(ong.caracteristicas) && ong.caracteristicas.includes('Acessibilidade'),
              hasRemoteService: Array.isArray(ong.caracteristicas) && ong.caracteristicas.includes('Atendimento remoto'),
            };
          });
          setOngs(mapped);
          return;
        }

      } catch (err) {
        console.error('Erro ao carregar ONGs do backend:', err);
        toast.error('Erro ao carregar ONGs do backend, mostrando lista padrão.');
      }
      setOngs(allOngs);
    };
    loadOngs();
  }, []);

  // Mapeamento de bairros por região
  const neighborhoodsByRegion: { [key: string]: string[] } = {
    "Centro-Sul": ["Barro Preto", "Centro", "Funcionários", "Jardim América", "Lourdes", "Luxemburgo", 
                   "Mangabeiras", "Morro das Pedras", "Santa Efigênia", "Santa Lúcia", "Santo Agostinho", 
                   "Santo Antônio", "São Bento", "São Pedro", "Savassi", "Serra", "Sion", "Cabana"],
    "Barreiro": ["Barreiro", "Cardoso", "Industrial", "Jardim Montanhês", "Lindéia", "Petropólis"],
    "Pampulha": ["Castelo", "Céu Azul", "Copacabana", "Dona Clara", "Itapoã", "Ouro Preto", "Pampulha", 
                 "Planalto", "Santa Mônica", "Trevo"],
    "Venda Nova": ["Jardim Europa", "Nacional", "Piratininga", "Venda Nova"],
    "Norte": ["Aarão Reis", "Conjunto Felicidade", "Guarani", "Jardim Felicidade", "Jardim Guanabara", 
              "Mantiqueira", "Primeiro de Maio", "São Bernardo", "Tupi", "Várzea", "Zilah Spósito"],
    "Nordeste": ["Cachoeirinha", "Caiçara", "Cidade Nova", "Concórdia", "Goiânia", "Ipiranga", 
                 "Ribeiro de Abreu", "São Gabriel", "União"],
    "Noroeste": ["Aparecida", "Bonfim", "Carlos Prates", "Coração Eucarístico", "Dom Cabral", "Glória", 
                 "Lagoinha", "Padre Eustáquio"],
    "Oeste": ["Betânia", "Buritis", "Cabana Pai Tomás", "Camargos", "Eldorado", "Estoril", "Gameleira", 
              "Gutierrez", "Minas Caixa", "Nova Granada", "Nova Suíça", "Prado", "Santa Maria"],
    "Leste": ["Floresta", "Granja de Freitas", "Horto", "Sagrada Família", "Santa Inês", "Santa Tereza", "Taquaril"]
  };

  // Obter bairros disponíveis baseado na região selecionada
  const availableNeighborhoods = selectedRegion 
    ? neighborhoodsByRegion[selectedRegion] || []
    : [];

  // Limpar bairro selecionado quando mudar de região
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedNeighborhood(''); // Limpa o bairro ao mudar de região
  };

  const applyFilters = (filters: {
    hasSearched: boolean;
    searchTerm: string;
    region: string;
    neighborhood: string;
    category: string;
    language: string;
    hours: HourPeriod | '';
    accessibility: 'all' | 'accessibility' | 'remote';
  }) => {
    if (!filters.hasSearched) return ongs;

    return ongs.filter((ong) => {
      if (filters.searchTerm && !ong.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !ong.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !ong.category.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      if (filters.region && ong.region !== filters.region) return false;
      if (filters.neighborhood && !ong.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())) return false;
      if (filters.category && ong.category !== filters.category) return false;
      if (filters.language && !ong.languages.includes(filters.language)) return false;
      if (filters.hours) {
        const periods = ong.hourPeriods && ong.hourPeriods.length ? ong.hourPeriods : normalizeHourPeriods(ong.hours);
        if (!periods.includes(filters.hours)) return false;
      }
      if (filters.accessibility === 'accessibility' && !ong.hasAccessibility) return false;
      if (filters.accessibility === 'remote' && !ong.hasRemoteService) return false;
      return true;
    });
  };

  const handleSearch = () => {
    const nextFilters = {
      hasSearched: true,
      searchTerm,
      region: selectedRegion,
      neighborhood: selectedNeighborhood,
      category: selectedCategory,
      language: selectedLanguage,
      hours: selectedHours,
      accessibility: accessibilityFilter,
    };

    setAppliedSearchTerm(searchTerm);
    setAppliedRegion(selectedRegion);
    setAppliedNeighborhood(selectedNeighborhood);
    setAppliedCategory(selectedCategory);
    setAppliedLanguage(selectedLanguage);
    setAppliedHours(selectedHours);
    setAppliedAccessibility(accessibilityFilter);
    setHasSearched(true);
    setCurrentPage(1);

    const filtered = applyFilters(nextFilters);
    const count = filtered.length;

    setBigMessageType('success');
    setBigMessageText(`✨ Filtros aplicados com sucesso! ${count} ${count === 1 ? 'ONG encontrada' : 'ONGs encontradas'}!`);
    setShowBigMessage(true);

    setTimeout(() => setShowBigMessage(false), 4000);
    toast.success(`${count} ${count === 1 ? 'ONG encontrada' : 'ONGs encontradas'}!`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setSelectedNeighborhood('');
    setSelectedCategory('');
    setSelectedLanguage('');
    setSelectedHours('');
    setAccessibilityFilter('all');

    setAppliedSearchTerm('');
    setAppliedRegion('');
    setAppliedNeighborhood('');
    setAppliedCategory('');
    setAppliedLanguage('');
    setAppliedHours('');
    setAppliedAccessibility('all');
    setHasSearched(false);
    setCurrentPage(1);
  };

  const filteredOngs = applyFilters({
    hasSearched,
    searchTerm: appliedSearchTerm,
    region: appliedRegion,
    neighborhood: appliedNeighborhood,
    category: appliedCategory,
    language: appliedLanguage,
    hours: appliedHours,
    accessibility: appliedAccessibility,
  });

  const totalPages = Math.max(1, Math.ceil(filteredOngs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOngs = filteredOngs.slice(startIndex, startIndex + itemsPerPage);
  const hasActiveFilters = Boolean(
    appliedSearchTerm ||
    appliedRegion ||
    appliedNeighborhood ||
    appliedCategory ||
    appliedLanguage ||
    appliedHours ||
    appliedAccessibility !== 'all'
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Se uma ONG está selecionada, mostra a página de detalhes */}
      {selectedOng ? (
        <OngDetailModal 
          ong={selectedOng} 
          onClose={() => setSelectedOng(null)} 
        />
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-gray-900 mb-2">
              Encontre ONGs em Belo Horizonte
            </h1>
            <p className="text-gray-600">
              Conecte-se com organizações que fazem a diferença na nossa cidade
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            Buscar por palavra-chave
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o que procura (ex.: educação, saúde, voluntariado)"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">
              Região
            </label>
            <div className="relative">
              <select 
                value={selectedRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <option value="">Todas as regiões</option>
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

          <div>
            <label className="block text-gray-700 mb-2">
              Bairro
            </label>
            <div className="relative">
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                disabled={!selectedRegion}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">{selectedRegion ? 'Todos os bairros' : 'Selecione uma região primeiro'}</option>
                {availableNeighborhoods.map(neighborhood => (
                  <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Área de Atuação
            </label>
            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <option value="">Todas as áreas</option>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">
              Idioma
            </label>
            <div className="relative">
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <option value="">Todos os idiomas</option>
                <option value="Português">Português</option>
                <option value="Inglês">Inglês</option>
                <option value="Espanhol">Espanhol</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Horário de Atendimento
            </label>
            <div className="relative">
              <select 
                value={selectedHours}
                onChange={(e) => setSelectedHours(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <option value="">Todos os horários</option>
                <option value="manha">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="noite">Noite</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="accessibility" 
              checked={accessibilityFilter === 'accessibility'}
              onChange={() => setAccessibilityFilter('accessibility')}
              className="w-4 h-4 text-teal-600" 
            />
            <span className="text-gray-700">Possui acessibilidade para pessoas com deficiência</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="accessibility" 
              checked={accessibilityFilter === 'remote'}
              onChange={() => setAccessibilityFilter('remote')}
              className="w-4 h-4 text-teal-600" 
            />
            <span className="text-gray-700">Oferece atendimento remoto</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="accessibility" 
              checked={accessibilityFilter === 'all'}
              onChange={() => setAccessibilityFilter('all')}
              className="w-4 h-4 text-teal-600" 
            />
            <span className="text-gray-700">Todas</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleSearch}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2.5 rounded-lg transition-colors"
          >
            Buscar ONGs
          </button>
          <button 
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className={`px-8 py-2.5 rounded-lg transition-colors ${
              hasActiveFilters 
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Limpar Filtros
          </button>
          </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                view === 'list' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
              Lista
            </button>
            <button
              onClick={() => setView('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                view === 'map' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Map className="w-5 h-5" />
              Mapa
            </button>
          </div>

          {/* Results */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              {filteredOngs.length} {filteredOngs.length === 1 ? 'ONG encontrada' : 'ONGs encontradas'}
            </p>
            {hasActiveFilters && hasSearched && (
              <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">
                Filtros aplicados
              </span>
            )}
          </div>

          {/* Lista e Mapa sempre visíveis */}
          {view === 'list' ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentOngs.map((ong) => (
                    <div 
                      key={ong.id} 
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                      onClick={() => setSelectedOng(ong)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-gray-900 flex-1">{ong.name}</h3>
                        <button 
                          className="ml-2 p-1 hover:bg-gray-100 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOng(ong);
                          }}
                        >
                          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">
                        {ong.description.length > 120 ? ong.description.substring(0, 120) + '...' : ong.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${ong.categoryColor}`}>
                          {ong.category}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{ong.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{ong.hours}</span>
                        </div>
                        {ong.hasAccessibility && (
                          <div className="text-teal-600">
                            ♿ Acessibilidade
                          </div>
                        )}
                        {ong.hasRemoteService && (
                          <div className="text-teal-600">
                            💻 Atendimento Remoto
                          </div>
                        )}
                      </div>

                      <button 
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition-colors mt-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOng(ong);
                        }}
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  ))}
                </div>

                {/* Paginação */}
                {filteredOngs.length > itemsPerPage && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-teal-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <MapView ongs={filteredOngs} onSelectOng={setSelectedOng} />
            )}

            {filteredOngs.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-600 mb-4">Nenhuma ONG encontrada com os filtros selecionados.</p>
                <button 
                  onClick={handleClearFilters}
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  Limpar filtros e ver todas as ONGs
                </button>
              </div>
            )}
          
          {/* Big Message */}
          {showBigMessage && (
            <div
              className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ${
                bigMessageType === 'success' ? 'bg-teal-600' : 
                bigMessageType === 'warning' ? 'bg-amber-500' : 
                'bg-blue-600'
              } text-white px-6 py-3 rounded-lg shadow-lg border-2 border-white`}
              style={{ minWidth: '320px', maxWidth: '500px' }}
            >
              <p className="text-center">{bigMessageText}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
