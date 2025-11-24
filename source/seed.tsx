// Script to seed the database with initial data
// Run this manually when needed to populate the database
import * as kv from "./kv_store.tsx";
export const ongs = [
  {
    id: "1",
    nome: "Instituto Ação Solidária",
    descricao: "Trabalhamos com crianças e adolescentes em situação de vulnerabilidade social, oferecendo atividades educativas e culturais.",
    endereco: "Rua Curitiba, 1234",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3222-1234",
    email: "contato@acaosolidaria.org.br",
    site: "www.acaosolidaria.org.br",
    logo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Educação",
      "Crianças e Adolescentes"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9191,
    longitude: -43.9386,
    verificada: true
  },
  {
    id: "2",
    nome: "Associação Mineira de Cultura",
    descricao: "Promovemos a cultura local através de oficinas de arte, música e teatro para todas as idades.",
    endereco: "Av. Afonso Pena, 2345",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3333-2345",
    email: "info@culturamineira.org.br",
    site: "www.culturamineira.org.br",
    logo: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Educação"
    ],
    idiomas: [
      "Português",
      "Inglês"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9227,
    longitude: -43.9450,
    verificada: true
  },
  {
    id: "3",
    nome: "ONG Vida Verde",
    descricao: "Atuamos na preservação ambiental e educação ecológica, com foco em reflorestamento e conscientização.",
    endereco: "Rua da Bahia, 3456",
    bairro: "Lourdes",
    regiao: "Centro-Sul",
    telefone: "(31) 3444-3456",
    email: "contato@vidaverde.org.br",
    site: "www.vidaverde.org.br",
    logo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Meio Ambiente"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã"
    ],
    latitude: -19.9245,
    longitude: -43.9402,
    verificada: true
  },
  {
    id: "4",
    nome: "Centro Comunitário Esperança",
    descricao: "Oferecemos apoio a famílias em situação de risco, com distribuição de alimentos e apoio psicológico.",
    endereco: "Rua Tupis, 4567",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3555-4567",
    email: "esperanca@comunitario.org.br",
    site: "www.esperancacomunitaria.org.br",
    logo: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Assistência Social",
      "Saúde"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9178,
    longitude: -43.9356,
    verificada: true
  },
  {
    id: "5",
    nome: "Projeto Mãos Amigas",
    descricao: "Capacitação profissional e inserção no mercado de trabalho para jovens e adultos.",
    endereco: "Av. Amazonas, 5678",
    bairro: "Santo Agostinho",
    regiao: "Centro-Sul",
    telefone: "(31) 3666-5678",
    email: "contato@maosamigas.org.br",
    site: "www.maosamigas.org.br",
    logo: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Educação",
      "Trabalho e Emprego"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9356,
    longitude: -43.9289,
    verificada: true
  },
  {
    id: "6",
    nome: "Associação Recanto Feliz",
    descricao: "Cuidamos de idosos em situação de vulnerabilidade, oferecendo atividades recreativas e apoio médico.",
    endereco: "Rua Rio de Janeiro, 6789",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3777-6789",
    email: "recantofeliz@idosos.org.br",
    site: "www.recantofeliz.org.br",
    logo: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Idosos",
      "Saúde"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9334,
    longitude: -43.9356,
    verificada: true
  },
  {
    id: "7",
    nome: "Fundação Educação para Todos",
    descricao: "Oferecemos reforço escolar e alfabetização para crianças e adultos de baixa renda.",
    endereco: "Rua Espírito Santo, 7890",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3888-7890",
    email: "educacao@paratodos.org.br",
    site: "www.educacaoparatodos.org.br",
    logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Educação"
    ],
    idiomas: [
      "Português",
      "Espanhol"
    ],
    horarios: [
      "Noite"
    ],
    latitude: -19.9167,
    longitude: -43.9345,
    verificada: true
  },
  {
    id: "8",
    nome: "Instituto de Apoio ao Deficiente",
    descricao: "Trabalhamos pela inclusão social e profissional de pessoas com deficiência.",
    endereco: "Rua Tamoios, 8901",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3999-8901",
    email: "apoio@deficiente.org.br",
    site: "www.apoiodeficiente.org.br",
    logo: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Pessoas com Deficiência",
      "Trabalho e Emprego"
    ],
    idiomas: [
      "Português",
      "Libras"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9189,
    longitude: -43.9378,
    verificada: true
  },
  {
    id: "9",
    nome: "Projeto Saúde em Movimento",
    descricao: "Levamos atendimento médico e odontológico gratuito para comunidades carentes.",
    endereco: "Rua Goiás, 9012",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3111-9012",
    email: "saude@emmovimento.org.br",
    site: "www.saudeemmovimento.org.br",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Saúde"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã"
    ],
    latitude: -19.9289,
    longitude: -43.9423,
    verificada: true
  },
  {
    id: "10",
    nome: "Coletivo Arte nas Ruas",
    descricao: "Promovemos arte urbana e cultura de rua para jovens da periferia.",
    endereco: "Rua Sergipe, 1023",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3222-1023",
    email: "arte@nasruas.org.br",
    site: "www.artenasruas.org.br",
    logo: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Crianças e Adolescentes"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9345,
    longitude: -43.9378,
    verificada: true
  },
  {
    id: "11",
    nome: "ONG Proteção Animal BH",
    descricao: "Resgatamos e cuidamos de animais abandonados, promovendo a adoção responsável.",
    endereco: "Av. do Contorno, 2134",
    bairro: "Santa Efigênia",
    regiao: "Leste",
    telefone: "(31) 3333-2134",
    email: "protecao@animalbh.org.br",
    site: "www.protecaoanimalbh.org.br",
    logo: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Animais"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9112,
    longitude: -43.9289,
    verificada: true
  },
  {
    id: "12",
    nome: "Centro de Referência da Mulher",
    descricao: "Apoio jurídico, psicológico e social para mulheres vítimas de violência.",
    endereco: "Rua Caetés, 3245",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3444-3245",
    email: "mulher@referencia.org.br",
    site: "www.referenciamulher.org.br",
    logo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Direitos Humanos",
      "Saúde"
    ],
    idiomas: [
      "Português",
      "Espanhol"
    ],
    horarios: [
      "Manhã",
      "Tarde",
      "Noite"
    ],
    latitude: -19.9201,
    longitude: -43.9412,
    verificada: true
  },
  {
    id: "13",
    nome: "Associação Casa Abrigo",
    descricao: "Acolhimento temporário para pessoas em situação de rua.",
    endereco: "Rua dos Guajajaras, 4356",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3555-4356",
    email: "casa@abrigo.org.br",
    site: "www.casaabrigo.org.br",
    logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Assistência Social",
      "Moradia"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde",
      "Noite"
    ],
    latitude: -19.9223,
    longitude: -43.9434,
    verificada: true
  },
  {
    id: "14",
    nome: "Fundação Desenvolvimento Comunitário",
    descricao: "Projetos de geração de renda e desenvolvimento local em comunidades periféricas.",
    endereco: "Av. Bias Fortes, 5467",
    bairro: "Barro Preto",
    regiao: "Centro-Sul",
    telefone: "(31) 3666-5467",
    email: "desenvolvimento@comunitario.org.br",
    site: "www.desenvolvimentocomunitario.org.br",
    logo: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Trabalho e Emprego",
      "Assistência Social"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9267,
    longitude: -43.9389,
    verificada: true
  },
  {
    id: "15",
    nome: "Instituto Criança Feliz",
    descricao: "Apoio psicopedagógico e atividades lúdicas para crianças com dificuldades de aprendizagem.",
    endereco: "Rua Pernambuco, 6578",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3777-6578",
    email: "crianca@feliz.org.br",
    site: "www.criancafeliz.org.br",
    logo: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Crianças e Adolescentes",
      "Educação"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde"
    ],
    latitude: -19.9312,
    longitude: -43.9445,
    verificada: true
  },
  {
    id: "16",
    nome: "Projeto Esporte e Cidadania",
    descricao: "Oferecemos aulas de esportes diversos para jovens, promovendo valores e disciplina.",
    endereco: "Rua Paraíba, 7689",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3888-7689",
    email: "esporte@cidadania.org.br",
    site: "www.esportecidadania.org.br",
    logo: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Esporte",
      "Crianças e Adolescentes"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9378,
    longitude: -43.9301,
    verificada: true
  },
  {
    id: "17",
    nome: "ONG Amigos da Leitura",
    descricao: "Incentivamos o hábito da leitura através de bibliotecas comunitárias e contação de histórias.",
    endereco: "Rua dos Aimorés, 8790",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3999-8790",
    email: "amigos@leitura.org.br",
    site: "www.amigosleitura.org.br",
    logo: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Educação",
      "Cultura e Arte"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9289,
    longitude: -43.9412,
    verificada: true
  },
  {
    id: "18",
    nome: "Centro de Apoio à Juventude",
    descricao: "Orientação profissional e preparação para o mercado de trabalho para jovens.",
    endereco: "Av. Augusto de Lima, 9801",
    bairro: "Barro Preto",
    regiao: "Centro-Sul",
    telefone: "(31) 3111-9801",
    email: "juventude@apoio.org.br",
    site: "www.apoiojuventude.org.br",
    logo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Crianças e Adolescentes",
      "Trabalho e Emprego"
    ],
    idiomas: [
      "Português",
      "Inglês"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9245,
    longitude: -43.9356,
    verificada: true
  },
  {
    id: "19",
    nome: "Associação Reciclando Vidas",
    descricao: "Coleta seletiva e reciclagem, promovendo sustentabilidade e geração de renda.",
    endereco: "Rua dos Timbiras, 1912",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3222-1912",
    email: "reciclando@vidas.org.br",
    site: "www.reciclandovidas.org.br",
    logo: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Meio Ambiente",
      "Trabalho e Emprego"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã"
    ],
    latitude: -19.9198,
    longitude: -43.9367,
    verificada: true
  },
  {
    id: "20",
    nome: "Fundação Arte Inclusiva",
    descricao: "Arte-terapia e oficinas criativas para pessoas com deficiência.",
    endereco: "Rua Curitiba, 2023",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3333-2023",
    email: "arte@inclusiva.org.br",
    site: "www.arteinclusiva.org.br",
    logo: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Pessoas com Deficiência",
      "Cultura e Arte"
    ],
    idiomas: [
      "Português",
      "Libras"
    ],
    horarios: [
      "Tarde"
    ],
    latitude: -19.9201,
    longitude: -43.9389,
    verificada: true
  },
  {
    id: "21",
    nome: "Instituto Saúde Mental",
    descricao: "Atendimento psicológico gratuito e grupos de apoio para saúde mental.",
    endereco: "Av. Afonso Pena, 3134",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3444-3134",
    email: "saude@mental.org.br",
    site: "www.saudemental.org.br",
    logo: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Saúde"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde",
      "Noite"
    ],
    latitude: -19.9234,
    longitude: -43.9423,
    verificada: true
  },
  {
    id: "22",
    nome: "Projeto Horta Comunitária",
    descricao: "Agricultura urbana e educação alimentar em comunidades carentes.",
    endereco: "Rua da Bahia, 4245",
    bairro: "Lourdes",
    regiao: "Centro-Sul",
    telefone: "(31) 3555-4245",
    email: "horta@comunitaria.org.br",
    site: "www.hortacomunitaria.org.br",
    logo: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Meio Ambiente",
      "Assistência Social"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã"
    ],
    latitude: -19.9256,
    longitude: -43.9401,
    verificada: true
  },
  {
    id: "23",
    nome: "ONG Música para Todos",
    descricao: "Ensino de música e formação de bandas com instrumentos doados.",
    endereco: "Rua Tupis, 5356",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3666-5356",
    email: "musica@paratodos.org.br",
    site: "www.musicaparatodos.org.br",
    logo: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Crianças e Adolescentes"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9189,
    longitude: -43.9378,
    verificada: true
  },
  {
    id: "24",
    nome: "Associação de Apoio ao Imigrante",
    descricao: "Assistência jurídica, aulas de português e integração social para imigrantes.",
    endereco: "Av. Amazonas, 6467",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3777-6467",
    email: "apoio@imigrante.org.br",
    site: "www.apoioimigrante.org.br",
    logo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Direitos Humanos",
      "Educação"
    ],
    idiomas: [
      "Português",
      "Inglês",
      "Espanhol",
      "Francês"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9212,
    longitude: -43.9445,
    verificada: true
  },
  {
    id: "25",
    nome: "Centro de Combate ao Racismo",
    descricao: "Educação antirracista e apoio jurídico a vítimas de discriminação racial.",
    endereco: "Rua Rio de Janeiro, 7578",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3888-7578",
    email: "combate@racismo.org.br",
    site: "www.combateracismo.org.br",
    logo: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Direitos Humanos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9223,
    longitude: -43.9412,
    verificada: true
  },
  {
    id: "26",
    nome: "Projeto Leitura para Cegos",
    descricao: "Produção de audiolivros e materiais em braille para pessoas com deficiência visual.",
    endereco: "Rua Espírito Santo, 8689",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3999-8689",
    email: "leitura@cegos.org.br",
    site: "www.leituracegos.org.br",
    logo: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Pessoas com Deficiência",
      "Educação"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9178,
    longitude: -43.9367,
    verificada: true
  },
  {
    id: "27",
    nome: "Fundação Tecnologia Social",
    descricao: "Inclusão digital e cursos de tecnologia para comunidades de baixa renda.",
    endereco: "Rua Tamoios, 9790",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3111-9790",
    email: "tecnologia@social.org.br",
    site: "www.tecnologiasocial.org.br",
    logo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Educação",
      "Trabalho e Emprego"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9198,
    longitude: -43.9389,
    verificada: true
  },
  {
    id: "28",
    nome: "ONG Moradia Digna",
    descricao: "Apoio na regularização fundiária e melhorias habitacionais em comunidades.",
    endereco: "Rua Goiás, 1801",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3222-1801",
    email: "moradia@digna.org.br",
    site: "www.moradiadigna.org.br",
    logo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Moradia",
      "Direitos Humanos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9301,
    longitude: -43.9434,
    verificada: true
  },
  {
    id: "29",
    nome: "Instituto Primeira Infância",
    descricao: "Atendimento e educação infantil para crianças de 0 a 6 anos em vulnerabilidade.",
    endereco: "Rua Sergipe, 2912",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3333-2912",
    email: "primeira@infancia.org.br",
    site: "www.primeirainfancia.org.br",
    logo: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Crianças e Adolescentes",
      "Educação"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9356,
    longitude: -43.9389,
    verificada: true
  },
  {
    id: "30",
    nome: "Associação Empreendedorismo Popular",
    descricao: "Capacitação e microcrédito para pequenos empreendedores de comunidades.",
    endereco: "Av. do Contorno, 3023",
    bairro: "Santa Efigênia",
    regiao: "Leste",
    telefone: "(31) 3444-3023",
    email: "empreendedorismo@popular.org.br",
    site: "www.empreendedorismopopular.org.br",
    logo: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Trabalho e Emprego"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9123,
    longitude: -43.9301,
    verificada: true
  },
  {
    id: "31",
    nome: "Projeto Teatro na Comunidade",
    descricao: "Oficinas de teatro e apresentações em comunidades periféricas.",
    endereco: "Rua Caetés, 4134",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3555-4134",
    email: "teatro@comunidade.org.br",
    site: "www.teatrocomunidade.org.br",
    logo: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Noite"
    ],
    latitude: -19.9212,
    longitude: -43.9423,
    verificada: true
  },
  {
    id: "32",
    nome: "Centro de Apoio LGBT+",
    descricao: "Apoio psicológico, jurídico e social para a população LGBT+.",
    endereco: "Rua dos Guajajaras, 5245",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3666-5245",
    email: "apoio@lgbt.org.br",
    site: "www.apoiolgbt.org.br",
    logo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Direitos Humanos",
      "Saúde"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9234,
    longitude: -43.9445,
    verificada: true
  },
  {
    id: "33",
    nome: "ONG Combate à Fome",
    descricao: "Distribuição de alimentos e combate ao desperdício através de parcerias.",
    endereco: "Av. Bias Fortes, 6356",
    bairro: "Barro Preto",
    regiao: "Centro-Sul",
    telefone: "(31) 3777-6356",
    email: "combate@fome.org.br",
    site: "www.combatefome.org.br",
    logo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Assistência Social"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9278,
    longitude: -43.9401,
    verificada: true
  },
  {
    id: "34",
    nome: "Fundação Memória e Cultura Afro",
    descricao: "Preservação e valorização da cultura afro-brasileira através de eventos e oficinas.",
    endereco: "Rua Pernambuco, 7467",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3888-7467",
    email: "memoria@culturaafro.org.br",
    site: "www.memoriaculturaafro.org.br",
    logo: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Educação"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9323,
    longitude: -43.9456,
    verificada: true
  },
  {
    id: "35",
    nome: "Instituto Água Limpa",
    descricao: "Conscientização sobre uso racional da água e recuperação de nascentes.",
    endereco: "Rua Paraíba, 8578",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3999-8578",
    email: "agua@limpa.org.br",
    site: "www.agualimpa.org.br",
    logo: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Meio Ambiente"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã"
    ],
    latitude: -19.9389,
    longitude: -43.9312,
    verificada: true
  },
  {
    id: "36",
    nome: "Projeto Jovem Aprendiz",
    descricao: "Programa de aprendizagem profissional e inserção no mercado de trabalho.",
    endereco: "Rua dos Aimorés, 9689",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3111-9689",
    email: "jovem@aprendiz.org.br",
    site: "www.jovemaprendiz.org.br",
    logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Trabalho e Emprego",
      "Crianças e Adolescentes"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9301,
    longitude: -43.9423,
    verificada: true
  },
  {
    id: "37",
    nome: "Associação Cuidado com Autistas",
    descricao: "Apoio a famílias e atividades terapêuticas para pessoas com autismo.",
    endereco: "Av. Augusto de Lima, 1790",
    bairro: "Barro Preto",
    regiao: "Centro-Sul",
    telefone: "(31) 3222-1790",
    email: "cuidado@autistas.org.br",
    site: "www.cuidadoautistas.org.br",
    logo: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Saúde",
      "Pessoas com Deficiência"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9256,
    longitude: -43.9367,
    verificada: true
  },
  {
    id: "38",
    nome: "ONG Dança Inclusiva",
    descricao: "Aulas de dança para pessoas com e sem deficiência, promovendo a inclusão.",
    endereco: "Rua dos Timbiras, 2901",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3333-2901",
    email: "danca@inclusiva.org.br",
    site: "www.dancainclusiva.org.br",
    logo: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Pessoas com Deficiência"
    ],
    idiomas: [
      "Português",
      "Libras"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9209,
    longitude: -43.9378,
    verificada: true
  },
  {
    id: "39",
    nome: "Centro de Mediação de Conflitos",
    descricao: "Mediação comunitária e cultura de paz em comunidades.",
    endereco: "Rua Curitiba, 4012",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3444-4012",
    email: "mediacao@conflitos.org.br",
    site: "www.mediacaoconflitos.org.br",
    logo: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Direitos Humanos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9212,
    longitude: -43.9401,
    verificada: true
  },
  {
    id: "40",
    nome: "Fundação Educação Ambiental",
    descricao: "Educação ambiental em escolas e comunidades, promovendo sustentabilidade.",
    endereco: "Av. Afonso Pena, 5123",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3555-5123",
    email: "educacao@ambiental.org.br",
    site: "www.educacaoambiental.org.br",
    logo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Meio Ambiente",
      "Educação"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9245,
    longitude: -43.9434,
    verificada: true
  },
  {
    id: "41",
    nome: "Instituto Direito à Cidade",
    descricao: "Advocacy por políticas públicas e participação cidadã em decisões urbanas.",
    endereco: "Rua da Bahia, 6234",
    bairro: "Lourdes",
    regiao: "Centro-Sul",
    telefone: "(31) 3666-6234",
    email: "direito@cidade.org.br",
    site: "www.direitocidade.org.br",
    logo: "https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Direitos Humanos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9267,
    longitude: -43.9412,
    verificada: true
  },
  {
    id: "42",
    nome: "Projeto Fotografia Social",
    descricao: "Oficinas de fotografia para jovens de comunidades, registrando suas realidades.",
    endereco: "Rua Tupis, 7345",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3777-7345",
    email: "fotografia@social.org.br",
    site: "www.fotografiasocial.org.br",
    logo: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Crianças e Adolescentes"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde"
    ],
    latitude: -19.9201,
    longitude: -43.9389,
    verificada: true
  },
  {
    id: "43",
    nome: "Associação Pais de Crianças Especiais",
    descricao: "Rede de apoio e troca de experiências entre pais de crianças com deficiência.",
    endereco: "Av. Amazonas, 8456",
    bairro: "Santo Agostinho",
    regiao: "Centro-Sul",
    telefone: "(31) 3888-8456",
    email: "pais@especiais.org.br",
    site: "www.paisespeciais.org.br",
    logo: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Pessoas com Deficiência",
      "Saúde"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Noite"
    ],
    latitude: -19.9367,
    longitude: -43.9301,
    verificada: true
  },
  {
    id: "44",
    nome: "ONG Cinema na Quebrada",
    descricao: "Exibições gratuitas de filmes e oficinas de audiovisual em periferias.",
    endereco: "Rua Rio de Janeiro, 9567",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3999-9567",
    email: "cinema@quebrada.org.br",
    site: "www.cinemaquebrada.org.br",
    logo: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Noite"
    ],
    latitude: -19.9345,
    longitude: -43.9367,
    verificada: true
  },
  {
    id: "45",
    nome: "Centro de Referência do Idoso",
    descricao: "Atividades físicas, culturais e de convivência para a terceira idade.",
    endereco: "Rua Espírito Santo, 1678",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3111-1678",
    email: "referencia@idoso.org.br",
    site: "www.referenciaidoso.org.br",
    logo: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Idosos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9189,
    longitude: -43.9378,
    verificada: true
  },
  {
    id: "46",
    nome: "Fundação Agroecologia Urbana",
    descricao: "Técnicas de agricultura orgânica e permacultura em áreas urbanas.",
    endereco: "Rua Tamoios, 2789",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3222-2789",
    email: "agroecologia@urbana.org.br",
    site: "www.agroecologiaurbana.org.br",
    logo: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Meio Ambiente"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã"
    ],
    latitude: -19.9198,
    longitude: -43.9401,
    verificada: true
  },
  {
    id: "47",
    nome: "Projeto Mães Acolhedoras",
    descricao: "Apoio a mães solo com doação de enxoval, acompanhamento e orientação.",
    endereco: "Rua Goiás, 3890",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3333-3890",
    email: "maes@acolhedoras.org.br",
    site: "www.maesacolhedoras.org.br",
    logo: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Assistência Social",
      "Saúde"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde"
    ],
    latitude: -19.9312,
    longitude: -43.9445,
    verificada: true
  },
  {
    id: "48",
    nome: "Instituto Literatura Periférica",
    descricao: "Incentivo à escrita e publicação de autores de periferia.",
    endereco: "Rua Sergipe, 4901",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3444-4901",
    email: "literatura@periferia.org.br",
    site: "www.literaturaperiferia.org.br",
    logo: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Educação"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Noite"
    ],
    latitude: -19.9367,
    longitude: -43.9401,
    verificada: true
  },
  {
    id: "49",
    nome: "Associação Costura Solidária",
    descricao: "Cursos de costura e geração de renda para mulheres em vulnerabilidade.",
    endereco: "Av. do Contorno, 5012",
    bairro: "Santa Efigênia",
    regiao: "Leste",
    telefone: "(31) 3555-5012",
    email: "costura@solidaria.org.br",
    site: "www.costurasolidaria.org.br",
    logo: "https://images.unsplash.com/photo-1545221308-fbb6dc7ff7e4?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1545221308-fbb6dc7ff7e4?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Trabalho e Emprego"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9134,
    longitude: -43.9312,
    verificada: true
  },
  {
    id: "50",
    nome: "ONG Bike Solidária",
    descricao: "Doação e manutenção de bicicletas para trabalhadores de baixa renda.",
    endereco: "Rua Caetés, 6123",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3666-6123",
    email: "bike@solidaria.org.br",
    site: "www.bikesolidaria.org.br",
    logo: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Assistência Social",
      "Meio Ambiente"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã"
    ],
    latitude: -19.9223,
    longitude: -43.9434,
    verificada: true
  },
  {
    id: "51",
    nome: "Centro de Valorização da Vida",
    descricao: "Prevenção ao suicídio através de apoio emocional e escuta voluntária.",
    endereco: "Rua dos Guajajaras, 7234",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3777-7234",
    email: "valorização@vida.org.br",
    site: "www.valorizacaovida.org.br",
    logo: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Saúde"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde",
      "Noite"
    ],
    latitude: -19.9245,
    longitude: -43.9456,
    verificada: true
  },
  {
    id: "52",
    nome: "Projeto Hip Hop Cultura",
    descricao: "Oficinas de rap, breaking, graffiti e DJing para jovens.",
    endereco: "Av. Bias Fortes, 8345",
    bairro: "Barro Preto",
    regiao: "Centro-Sul",
    telefone: "(31) 3888-8345",
    email: "hiphop@cultura.org.br",
    site: "www.hiphopcultura.org.br",
    logo: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Crianças e Adolescentes"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9289,
    longitude: -43.9412,
    verificada: true
  },
  {
    id: "53",
    nome: "Fundação Combate à Tuberculose",
    descricao: "Conscientização, prevenção e apoio a pacientes com tuberculose.",
    endereco: "Rua Pernambuco, 9456",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3999-9456",
    email: "combate@tuberculose.org.br",
    site: "www.combatetuberculose.org.br",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Saúde"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9334,
    longitude: -43.9467,
    verificada: true
  },
  {
    id: "54",
    nome: "Instituto Economia Criativa",
    descricao: "Apoio a artistas e empreendedores criativos de comunidades.",
    endereco: "Rua Paraíba, 1567",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3111-1567",
    email: "economia@criativa.org.br",
    site: "www.economiacriativa.org.br",
    logo: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Trabalho e Emprego"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde"
    ],
    latitude: -19.9389,
    longitude: -43.9323,
    verificada: true
  },
  {
    id: "55",
    nome: "Associação Resgate de Tradições",
    descricao: "Preservação de tradições culturais mineiras através de festivais e oficinas.",
    endereco: "Rua dos Aimorés, 2678",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3222-2678",
    email: "resgate@tradicoes.org.br",
    site: "www.resgatetrad icoes.org.br",
    logo: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9301,
    longitude: -43.9434,
    verificada: true
  },
  {
    id: "56",
    nome: "ONG Capoeira para Todos",
    descricao: "Aulas de capoeira como ferramenta de inclusão social e cultural.",
    endereco: "Av. Augusto de Lima, 3789",
    bairro: "Barro Preto",
    regiao: "Centro-Sul",
    telefone: "(31) 3333-3789",
    email: "capoeira@paratodos.org.br",
    site: "www.capoeiraparatodos.org.br",
    logo: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Esporte"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9267,
    longitude: -43.9378,
    verificada: true
  },
  {
    id: "57",
    nome: "Centro de Apoio ao Migrante",
    descricao: "Assistência e integração de migrantes internos vindos de outras regiões.",
    endereco: "Rua dos Timbiras, 4890",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3444-4890",
    email: "apoio@migrante.org.br",
    site: "www.apoiomigrante.org.br",
    logo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Assistência Social",
      "Direitos Humanos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9209,
    longitude: -43.9389,
    verificada: true
  },
  {
    id: "58",
    nome: "Projeto Circo Social",
    descricao: "Oficinas de circo e artes cênicas para crianças e adolescentes.",
    endereco: "Rua Curitiba, 5901",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3555-5901",
    email: "circo@social.org.br",
    site: "www.circosocial.org.br",
    logo: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Crianças e Adolescentes"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde"
    ],
    latitude: -19.9223,
    longitude: -43.9412,
    verificada: true
  },
  {
    id: "59",
    nome: "Fundação Preservação Arquitetônica",
    descricao: "Educação patrimonial e preservação do patrimônio histórico de BH.",
    endereco: "Av. Afonso Pena, 7012",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3666-7012",
    email: "preservacao@arquitetonica.org.br",
    site: "www.preservacaoarq.org.br",
    logo: "https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Educação"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã"
    ],
    latitude: -19.9256,
    longitude: -43.9445,
    verificada: true
  },
  {
    id: "60",
    nome: "Instituto Segurança Alimentar",
    descricao: "Combate à insegurança alimentar através de bancos de alimentos e educação nutricional.",
    endereco: "Rua da Bahia, 8123",
    bairro: "Lourdes",
    regiao: "Centro-Sul",
    telefone: "(31) 3777-8123",
    email: "seguranca@alimentar.org.br",
    site: "www.segurancaalimentar.org.br",
    logo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Assistência Social",
      "Saúde"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9278,
    longitude: -43.9423,
    verificada: true
  },
  {
    id: "61",
    nome: "Associação Yoga Social",
    descricao: "Aulas gratuitas de yoga e meditação para comunidades de baixa renda.",
    endereco: "Rua Tupis, 9234",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3888-9234",
    email: "yoga@social.org.br",
    site: "www.yogasocial.org.br",
    logo: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Saúde",
      "Esporte"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9201,
    longitude: -43.9401,
    verificada: true
  },
  {
    id: "62",
    nome: "ONG Democratização Cultural",
    descricao: "Acesso gratuito a eventos culturais e formação de público.",
    endereco: "Av. Amazonas, 1345",
    bairro: "Santo Agostinho",
    regiao: "Centro-Sul",
    telefone: "(31) 3999-1345",
    email: "democratizacao@cultural.org.br",
    site: "www.democratizacaocultural.org.br",
    logo: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Noite"
    ],
    latitude: -19.9378,
    longitude: -43.9312,
    verificada: true
  },
  {
    id: "63",
    nome: "Centro de Educação Financeira",
    descricao: "Educação financeira e combate ao superendividamento para famílias de baixa renda.",
    endereco: "Rua Rio de Janeiro, 2456",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3111-2456",
    email: "educacao@financeira.org.br",
    site: "www.educacaofinanceira.org.br",
    logo: "https://images.unsplash.com/photo-1554224311-9558f6d503b6?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1554224311-9558f6d503b6?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Educação",
      "Assistência Social"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Noite"
    ],
    latitude: -19.9345,
    longitude: -43.9378,
    verificada: true
  },
  {
    id: "64",
    nome: "Projeto Robótica para Todos",
    descricao: "Ensino de robótica e programação para crianças de escolas públicas.",
    endereco: "Rua Espírito Santo, 3567",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3222-3567",
    email: "robotica@paratodos.org.br",
    site: "www.roboticaparatodos.org.br",
    logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Educação"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde"
    ],
    latitude: -19.9189,
    longitude: -43.9389,
    verificada: true
  },
  {
    id: "65",
    nome: "Fundação Saúde Bucal",
    descricao: "Atendimento odontológico gratuito e educação em saúde bucal.",
    endereco: "Rua Tamoios, 4678",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3333-4678",
    email: "saude@bucal.org.br",
    site: "www.saudebucal.org.br",
    logo: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Saúde"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9209,
    longitude: -43.9412,
    verificada: true
  },
  {
    id: "66",
    nome: "Instituto Liberdade Assistida",
    descricao: "Acompanhamento e ressocialização de adolescentes em conflito com a lei.",
    endereco: "Rua Goiás, 5789",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3444-5789",
    email: "liberdade@assistida.org.br",
    site: "www.liberdadeassistida.org.br",
    logo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Crianças e Adolescentes",
      "Direitos Humanos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9323,
    longitude: -43.9456,
    verificada: true
  },
  {
    id: "67",
    nome: "Associação Grafite Arte",
    descricao: "Oficinas de grafite e muralismo para expressão artística urbana.",
    endereco: "Rua Sergipe, 6890",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3555-6890",
    email: "grafite@arte.org.br",
    site: "www.grafitearte.org.br",
    logo: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9378,
    longitude: -43.9412,
    verificada: true
  },
  {
    id: "68",
    nome: "ONG Mediação Escolar",
    descricao: "Prevenção e mediação de conflitos em ambiente escolar.",
    endereco: "Av. do Contorno, 7901",
    bairro: "Santa Efigênia",
    regiao: "Leste",
    telefone: "(31) 3666-7901",
    email: "mediacao@escolar.org.br",
    site: "www.mediacaoescolar.org.br",
    logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Educação",
      "Crianças e Adolescentes"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9145,
    longitude: -43.9323,
    verificada: true
  },
  {
    id: "69",
    nome: "Centro de Apoio ao Desempregado",
    descricao: "Orientação profissional, elaboração de currículos e encaminhamento para vagas.",
    endereco: "Rua Caetés, 8012",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3777-8012",
    email: "apoio@desempregado.org.br",
    site: "www.apoiodesempregado.org.br",
    logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Trabalho e Emprego"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9234,
    longitude: -43.9445,
    verificada: true
  },
  {
    id: "70",
    nome: "Projeto Xadrez na Escola",
    descricao: "Ensino de xadrez para desenvolvimento do raciocínio lógico em crianças.",
    endereco: "Rua dos Guajajaras, 9123",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3888-9123",
    email: "xadrez@escola.org.br",
    site: "www.xadrezescola.org.br",
    logo: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Educação",
      "Esporte"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde"
    ],
    latitude: -19.9245,
    longitude: -43.9467,
    verificada: true
  },
  {
    id: "71",
    nome: "Fundação Combate ao Trabalho Infantil",
    descricao: "Denúncia, fiscalização e apoio a crianças retiradas do trabalho infantil.",
    endereco: "Av. Bias Fortes, 1234",
    bairro: "Barro Preto",
    regiao: "Centro-Sul",
    telefone: "(31) 3999-1234",
    email: "combate@trabalhoinfantil.org.br",
    site: "www.combatetrabalhoinfantil.org.br",
    logo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Crianças e Adolescentes",
      "Direitos Humanos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9289,
    longitude: -43.9423,
    verificada: true
  },
  {
    id: "72",
    nome: "Instituto Direito à Saúde",
    descricao: "Advocacy por políticas públicas de saúde e acesso a tratamentos.",
    endereco: "Rua Pernambuco, 2345",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3111-2345",
    email: "direito@saude.org.br",
    site: "www.direitosaude.org.br",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Saúde",
      "Direitos Humanos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9345,
    longitude: -43.9478,
    verificada: true
  },
  {
    id: "73",
    nome: "Associação Pets Terapeutas",
    descricao: "Terapia assistida por animais em hospitais, asilos e centros de reabilitação.",
    endereco: "Rua Paraíba, 3456",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3222-3456",
    email: "pets@terapeutas.org.br",
    site: "www.petsterapeutas.org.br",
    logo: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Saúde",
      "Animais"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde"
    ],
    latitude: -19.9401,
    longitude: -43.9334,
    verificada: true
  },
  {
    id: "74",
    nome: "ONG Apoio ao Ex-Detento",
    descricao: "Reinserção social e profissional de egressos do sistema prisional.",
    endereco: "Rua dos Aimorés, 4567",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3333-4567",
    email: "apoio@exdetento.org.br",
    site: "www.apoioexdetento.org.br",
    logo: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Trabalho e Emprego",
      "Direitos Humanos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9312,
    longitude: -43.9445,
    verificada: true
  },
  {
    id: "75",
    nome: "Centro de Referência em Agroecologia",
    descricao: "Formação e assessoria técnica em agricultura ecológica.",
    endereco: "Av. Augusto de Lima, 5678",
    bairro: "Barro Preto",
    regiao: "Centro-Sul",
    telefone: "(31) 3444-5678",
    email: "referencia@agroecologia.org.br",
    site: "www.referenciaagroecologia.org.br",
    logo: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Meio Ambiente",
      "Trabalho e Emprego"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã"
    ],
    latitude: -19.9278,
    longitude: -43.9389,
    verificada: true
  },
  {
    id: "76",
    nome: "Projeto Poesia nas Ruas",
    descricao: "Saraus e intervenções poéticas em espaços públicos.",
    endereco: "Rua dos Timbiras, 6789",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3555-6789",
    email: "poesia@ruas.org.br",
    site: "www.poesiaruas.org.br",
    logo: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Noite"
    ],
    latitude: -19.9220,
    longitude: -43.9401,
    verificada: true
  },
  {
    id: "77",
    nome: "Fundação Paz no Trânsito",
    descricao: "Educação para o trânsito e prevenção de acidentes.",
    endereco: "Rua Curitiba, 7890",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3666-7890",
    email: "paz@transito.org.br",
    site: "www.paztransito.org.br",
    logo: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Educação"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9234,
    longitude: -43.9423,
    verificada: true
  },
  {
    id: "78",
    nome: "Instituto Geração de Energia Limpa",
    descricao: "Instalação de painéis solares em comunidades e educação sobre energias renováveis.",
    endereco: "Av. Afonso Pena, 8901",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3777-8901",
    email: "energia@limpa.org.br",
    site: "www.energialimpa.org.br",
    logo: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Meio Ambiente"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9267,
    longitude: -43.9456,
    verificada: true
  },
  {
    id: "79",
    nome: "Associação Educação Sexual",
    descricao: "Educação sexual e reprodutiva para adolescentes e jovens.",
    endereco: "Rua da Bahia, 9012",
    bairro: "Lourdes",
    regiao: "Centro-Sul",
    telefone: "(31) 3888-9012",
    email: "educacao@sexual.org.br",
    site: "www.educacaosexual.org.br",
    logo: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Saúde",
      "Educação"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde"
    ],
    latitude: -19.9289,
    longitude: -43.9434,
    verificada: true
  },
  {
    id: "80",
    nome: "ONG Memória Oral",
    descricao: "Registro e preservação de histórias de vida de moradores antigos de BH.",
    endereco: "Rua Tupis, 1123",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3999-1123",
    email: "memoria@oral.org.br",
    site: "www.memoriaoral.org.br",
    logo: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Idosos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9212,
    longitude: -43.9412,
    verificada: true
  },
  {
    id: "81",
    nome: "Centro de Promoção da Igualdade Racial",
    descricao: "Ações afirmativas e combate ao racismo institucional.",
    endereco: "Av. Amazonas, 2234",
    bairro: "Santo Agostinho",
    regiao: "Centro-Sul",
    telefone: "(31) 3111-2234",
    email: "promocao@igualdaderacial.org.br",
    site: "www.promocaoigualdaderacial.org.br",
    logo: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Direitos Humanos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9389,
    longitude: -43.9323,
    verificada: true
  },
  {
    id: "82",
    nome: "Projeto Oficina de Marcenaria",
    descricao: "Ensino de marcenaria e restauração de móveis para geração de renda.",
    endereco: "Rua Rio de Janeiro, 3345",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3222-3345",
    email: "oficina@marcenaria.org.br",
    site: "www.oficinamarcenaria.org.br",
    logo: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Trabalho e Emprego"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9356,
    longitude: -43.9389,
    verificada: true
  },
  {
    id: "83",
    nome: "Fundação Esporte Adaptado",
    descricao: "Prática de esportes adaptados para pessoas com deficiência.",
    endereco: "Rua Espírito Santo, 4456",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3333-4456",
    email: "esporte@adaptado.org.br",
    site: "www.esporteadaptado.org.br",
    logo: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Esporte",
      "Pessoas com Deficiência"
    ],
    idiomas: [
      "Português",
      "Libras"
    ],
    horarios: [
      "Tarde"
    ],
    latitude: -19.9201,
    longitude: -43.9401,
    verificada: true
  },
  {
    id: "84",
    nome: "Instituto Comunicação Comunitária",
    descricao: "Formação em jornalismo comunitário e produção de mídia local.",
    endereco: "Rua Tamoios, 5567",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3444-5567",
    email: "comunicacao@comunitaria.org.br",
    site: "www.comunicacaocomunitaria.org.br",
    logo: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Educação",
      "Cultura e Arte"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Noite"
    ],
    latitude: -19.9220,
    longitude: -43.9423,
    verificada: true
  },
  {
    id: "85",
    nome: "Associação Banho Solidário",
    descricao: "Banhos quentes e distribuição de itens de higiene para pessoas em situação de rua.",
    endereco: "Rua Goiás, 6678",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3555-6678",
    email: "banho@solidario.org.br",
    site: "www.banhosolidario.org.br",
    logo: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Assistência Social"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9334,
    longitude: -43.9467,
    verificada: true
  },
  {
    id: "86",
    nome: "ONG Cozinha Comunitária",
    descricao: "Refeições gratuitas e cursos de culinária para geração de renda.",
    endereco: "Rua Sergipe, 7789",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3666-7789",
    email: "cozinha@comunitaria.org.br",
    site: "www.cozinhacomunitaria.org.br",
    logo: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Assistência Social",
      "Trabalho e Emprego"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9378,
    longitude: -43.9423,
    verificada: true
  },
  {
    id: "87",
    nome: "Centro de Apoio a Vítimas de Violência",
    descricao: "Atendimento psicológico, jurídico e social a vítimas de violência.",
    endereco: "Av. do Contorno, 8890",
    bairro: "Santa Efigênia",
    regiao: "Leste",
    telefone: "(31) 3777-8890",
    email: "apoio@vitimas.org.br",
    site: "www.apoiovitimas.org.br",
    logo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Direitos Humanos",
      "Saúde"
    ],
    idiomas: [
      "Português",
      "Espanhol"
    ],
    horarios: [
      "Manhã",
      "Tarde",
      "Noite"
    ],
    latitude: -19.9156,
    longitude: -43.9334,
    verificada: true
  },
  {
    id: "88",
    nome: "Projeto Escola de Pais",
    descricao: "Orientação e apoio para pais e responsáveis sobre educação de filhos.",
    endereco: "Rua Caetés, 9901",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3888-9901",
    email: "escola@pais.org.br",
    site: "www.escolapais.org.br",
    logo: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Educação",
      "Crianças e Adolescentes"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Noite"
    ],
    latitude: -19.9245,
    longitude: -43.9456,
    verificada: true
  },
  {
    id: "89",
    nome: "Fundação Natação para Todos",
    descricao: "Aulas de natação gratuitas para crianças e adultos.",
    endereco: "Rua dos Guajajaras, 1012",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3999-1012",
    email: "natacao@paratodos.org.br",
    site: "www.natacaoparatodos.org.br",
    logo: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Esporte",
      "Saúde"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9256,
    longitude: -43.9478,
    verificada: true
  },
  {
    id: "90",
    nome: "Instituto Combate à Obesidade Infantil",
    descricao: "Educação nutricional e atividades físicas para crianças com obesidade.",
    endereco: "Av. Bias Fortes, 2123",
    bairro: "Barro Preto",
    regiao: "Centro-Sul",
    telefone: "(31) 3111-2123",
    email: "combate@obesidade.org.br",
    site: "www.combateobesidade.org.br",
    logo: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Saúde",
      "Crianças e Adolescentes"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde"
    ],
    latitude: -19.9301,
    longitude: -43.9434,
    verificada: true
  },
  {
    id: "91",
    nome: "Associação Empoderamento Feminino",
    descricao: "Formação política e liderança para mulheres de comunidades.",
    endereco: "Rua Pernambuco, 3234",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3222-3234",
    email: "empoderamento@feminino.org.br",
    site: "www.empoderamentofeminino.org.br",
    logo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Direitos Humanos",
      "Educação"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Noite"
    ],
    latitude: -19.9367,
    longitude: -43.9489,
    verificada: true
  },
  {
    id: "92",
    nome: "ONG Literatura de Cordel",
    descricao: "Preservação e difusão da literatura de cordel através de oficinas e saraus.",
    endereco: "Rua Paraíba, 4345",
    bairro: "Savassi",
    regiao: "Centro-Sul",
    telefone: "(31) 3333-4345",
    email: "literatura@cordel.org.br",
    site: "www.literaturacordel.org.br",
    logo: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Noite"
    ],
    latitude: -19.9412,
    longitude: -43.9345,
    verificada: true
  },
  {
    id: "93",
    nome: "Centro de Valorização do Artesanato",
    descricao: "Apoio a artesãos locais com capacitação e comercialização de produtos.",
    endereco: "Rua dos Aimorés, 5456",
    bairro: "Funcionários",
    regiao: "Centro-Sul",
    telefone: "(31) 3444-5456",
    email: "valorizacao@artesanato.org.br",
    site: "www.valorizacaoartesanato.org.br",
    logo: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte",
      "Trabalho e Emprego"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9323,
    longitude: -43.9456,
    verificada: true
  },
  {
    id: "94",
    nome: "Projeto Jardinagem Terapêutica",
    descricao: "Uso de atividades de jardinagem para reabilitação e bem-estar.",
    endereco: "Av. Augusto de Lima, 6567",
    bairro: "Barro Preto",
    regiao: "Centro-Sul",
    telefone: "(31) 3555-6567",
    email: "jardinagem@terapeutica.org.br",
    site: "www.jardim agemterapeutica.org.br",
    logo: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Saúde",
      "Meio Ambiente"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã"
    ],
    latitude: -19.9289,
    longitude: -43.9401,
    verificada: true
  },
  {
    id: "95",
    nome: "Fundação Documentário Social",
    descricao: "Produção de documentários sobre questões sociais de BH.",
    endereco: "Rua dos Timbiras, 7678",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3666-7678",
    email: "documentario@social.org.br",
    site: "www.documentariosocial.org.br",
    logo: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Cultura e Arte"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde",
      "Noite"
    ],
    latitude: -19.9231,
    longitude: -43.9412,
    verificada: true
  },
  {
    id: "96",
    nome: "Instituto Direitos da Criança",
    descricao: "Defesa e promoção dos direitos de crianças e adolescentes.",
    endereco: "Rua Curitiba, 8789",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3777-8789",
    email: "direitos@crianca.org.br",
    site: "www.direitoscrianca.org.br",
    logo: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Crianças e Adolescentes",
      "Direitos Humanos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9245,
    longitude: -43.9434,
    verificada: true
  },
  {
    id: "97",
    nome: "Associação Filosofia para Crianças",
    descricao: "Oficinas de filosofia adaptadas para desenvolvimento do pensamento crítico infantil.",
    endereco: "Av. Afonso Pena, 9890",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3888-9890",
    email: "filosofia@criancas.org.br",
    site: "www.filosofiacriancas.org.br",
    logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Educação",
      "Crianças e Adolescentes"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Tarde"
    ],
    latitude: -19.9278,
    longitude: -43.9467,
    verificada: true
  },
  {
    id: "98",
    nome: "ONG Mobilidade Urbana",
    descricao: "Advocacy por transporte público de qualidade e ciclovias seguras.",
    endereco: "Rua da Bahia, 1901",
    bairro: "Lourdes",
    regiao: "Centro-Sul",
    telefone: "(31) 3999-1901",
    email: "mobilidade@urbana.org.br",
    site: "www.mobilidadeurbana.org.br",
    logo: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Meio Ambiente",
      "Direitos Humanos"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9301,
    longitude: -43.9445,
    verificada: true
  },
  {
    id: "99",
    nome: "Centro de Aconselhamento em DSTs",
    descricao: "Testagem, aconselhamento e prevenção de doenças sexualmente transmissíveis.",
    endereco: "Rua Tupis, 2012",
    bairro: "Centro",
    regiao: "Centro-Sul",
    telefone: "(31) 3111-2012",
    email: "aconselhamento@dsts.org.br",
    site: "www.aconselhamentodsts.org.br",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Saúde"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9223,
    longitude: -43.9423,
    verificada: true
  },
  {
    id: "100",
    nome: "Projeto BH Mais Humana",
    descricao: "Articulação de diversas ONGs para ações conjuntas em prol da cidade.",
    endereco: "Av. Amazonas, 3123",
    bairro: "Santo Agostinho",
    regiao: "Centro-Sul",
    telefone: "(31) 3222-3123",
    email: "contato@bhmaishumana.org.br",
    site: "www.bhmaishumana.org.br",
    logo: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=200&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop"
    ],
    areasAtuacao: [
      "Direitos Humanos",
      "Assistência Social"
    ],
    idiomas: [
      "Português"
    ],
    horarios: [
      "Manhã",
      "Tarde"
    ],
    latitude: -19.9401,
    longitude: -43.9334,
    verificada: true
  }
];
export async function seedDatabase() {
  console.log('Starting database seed...');
  // Create admin user in KV store (simpler than Supabase Auth for prototyping)
  const adminUser = await kv.get('user:admin@ong.com');
  if (!adminUser) {
    await kv.set('user:admin@ong.com', {
      email: 'admin@ong.com',
      password: 'admin123',
      name: 'Administrador',
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    console.log('✅ Admin user created in KV store: admin@ong.com / admin123');
  } else {
    console.log('✅ Admin user already exists');
  }
  // Seed ONGs
  for (const ong of ongs){
    await kv.set(`ongs:${ong.id}`, ong);
    // Initialize metrics for each ONG
    await kv.set(`metricas:${ong.id}`, {
      ongId: ong.id,
      visualizacoes: Math.floor(Math.random() * 1000),
      cliques: Math.floor(Math.random() * 200),
      interessados: Math.floor(Math.random() * 50),
      historico: []
    });
  }
  console.log(`Seeded ${ongs.length} ONGs with metrics`);
  // Seed some sample vagas
  const sampleVagas = [
    {
      id: "vaga-1",
      ongId: "1",
      titulo: "Voluntário para aulas de reforço",
      descricao: "Buscamos voluntários para dar aulas de reforço em matemática e português para crianças do ensino fundamental.",
      requisitos: "Ensino médio completo, paciência e dedicação",
      horario: "Terças e quintas, 14h às 16h",
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    },
    {
      id: "vaga-2",
      ongId: "2",
      titulo: "Professor de teatro voluntário",
      descricao: "Procuramos professor de teatro para oficinas com jovens de comunidades.",
      requisitos: "Experiência com teatro, disponibilidade aos sábados",
      horario: "Sábados, 9h às 12h",
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    },
    {
      id: "vaga-3",
      ongId: "3",
      titulo: "Voluntário para ações de reflorestamento",
      descricao: "Ajude-nos a plantar mudas e cuidar de áreas verdes da cidade.",
      requisitos: "Disposição física, amor pela natureza",
      horario: "Domingos, 7h às 11h",
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    }
  ];
  for (const vaga of sampleVagas){
    await kv.set(`vagas:${vaga.id}`, vaga);
  }
  console.log(`Seeded ${sampleVagas.length} sample vagas`);
  console.log('Database seed completed!');
}
