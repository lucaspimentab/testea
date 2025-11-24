import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7a062fc7`;

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// Helper function to make API requests
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    console.error(`API Error on ${endpoint}:`, error);
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// ONGs API
export const ongsApi = {
  list: async (filters?: {
    regiao?: string;
    bairro?: string;
    areaAtuacao?: string;
    idioma?: string;
    horario?: string;
    busca?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const queryString = params.toString();
    return apiRequest(`/ongs${queryString ? `?${queryString}` : ''}`);
  },

  get: async (id: string) => {
    return apiRequest(`/ongs/${id}`);
  },

  create: async (ong: any) => {
    return apiRequest('/ongs', {
      method: 'POST',
      body: JSON.stringify(ong),
    });
  },

  update: async (id: string, ong: any) => {
    return apiRequest(`/ongs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ong),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/ongs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Vagas API
export const vagasApi = {
  list: async (ongId?: string) => {
    const params = ongId ? `?ongId=${ongId}` : '';
    return apiRequest(`/vagas${params}`);
  },

  get: async (id: string) => {
    return apiRequest(`/vagas/${id}`);
  },

  create: async (vaga: any) => {
    return apiRequest('/vagas', {
      method: 'POST',
      body: JSON.stringify(vaga),
    });
  },

  update: async (id: string, vaga: any) => {
    return apiRequest(`/vagas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vaga),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/vagas/${id}`, {
      method: 'DELETE',
    });
  },
};

// Perguntas API
export const perguntasApi = {
  list: async (ongId?: string) => {
    const params = ongId ? `?ongId=${ongId}` : '';
    return apiRequest(`/perguntas${params}`);
  },

  create: async (pergunta: any) => {
    return apiRequest('/perguntas', {
      method: 'POST',
      body: JSON.stringify(pergunta),
    });
  },

  answer: async (id: string, resposta: string) => {
    return apiRequest(`/perguntas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ resposta }),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/perguntas/${id}`, {
      method: 'DELETE',
    });
  },
};

// Métricas API
export const metricasApi = {
  get: async (ongId: string) => {
    return apiRequest(`/metricas/${ongId}`);
  },

  update: async (ongId: string, action: 'view' | 'click' | 'interest') => {
    return apiRequest(`/metricas/${ongId}`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  },
};

// Documentos API
export const documentosApi = {
  list: async (ongId: string) => {
    return apiRequest(`/documentos/${ongId}`);
  },

  upload: async (file: File, ongId: string, tipo: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ongId', ongId);
    formData.append('tipo', tipo);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/documentos/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token || publicAnonKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      console.error('Upload Error:', error);
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },
};

// Auth API
export const authApi = {
  signup: async (email: string, password: string, name: string) => {
    return apiRequest('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  me: async () => {
    return apiRequest('/me');
  },
};
