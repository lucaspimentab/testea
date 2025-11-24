// Utility to seed the database with initial ONGs data
// This should be run once to populate the database

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7a062fc7`;

// Import the seed data
import { ongs } from '../supabase/functions/server/seed';

export async function seedDatabase() {
  console.log('🌱 Iniciando seed do banco de dados...');
  
  try {
    // Check if database is already seeded
    const checkResponse = await fetch(`${API_BASE_URL}/ongs`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (checkResponse.ok) {
      const { ongs: existingOngs } = await checkResponse.json();
      if (existingOngs && existingOngs.length > 0) {
        console.log('✅ Banco de dados já possui dados. Seed não necessário.');
        return { success: true, message: 'Database already seeded' };
      }
    }
    
    console.log('📝 Banco de dados vazio. Iniciando seed...');
    
    // We need to call the server directly to seed
    // Since we can't directly call KV from the frontend
    console.log('⚠️ Para fazer o seed do banco de dados:');
    console.log('1. Acesse o console do Supabase');
    console.log('2. Vá até Edge Functions');
    console.log('3. Execute o script de seed manualmente');
    
    return { 
      success: false, 
      message: 'Manual seed required. Check console for instructions.' 
    };
    
  } catch (error) {
    console.error('❌ Erro ao verificar/seed banco de dados:', error);
    return { success: false, error };
  }
}

// Function to check database status
export async function checkDatabaseStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/ongs`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (response.ok) {
      const { ongs } = await response.json();
      return {
        initialized: true,
        ongCount: ongs.length,
        isEmpty: ongs.length === 0,
      };
    }
    
    return {
      initialized: false,
      ongCount: 0,
      isEmpty: true,
    };
  } catch (error) {
    console.error('Erro ao verificar status do banco:', error);
    return {
      initialized: false,
      ongCount: 0,
      isEmpty: true,
      error,
    };
  }
}
