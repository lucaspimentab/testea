import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();
// Enable logger
app.use('*', logger(console.log));
// Enable CORS for all routes and methods
app.use("/*", cors({
  origin: "*",
  allowHeaders: [
    "Content-Type",
    "Authorization"
  ],
  allowMethods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS"
  ],
  exposeHeaders: [
    "Content-Length"
  ],
  maxAge: 600
}));
// Initialize Supabase clients
const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
// Initialize storage bucket on startup
const BUCKET_NAME = 'make-7a062fc7-documents';
(async ()=>{
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const bucketExists = buckets?.some((bucket)=>bucket.name === BUCKET_NAME);
  if (!bucketExists) {
    await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
      public: false
    });
    console.log(`Created bucket: ${BUCKET_NAME}`);
  }
  // Always ensure admin user exists on startup
  const adminUser = await kv.get('user:admin@ong.com');
  if (!adminUser) {
    // Buscar a primeira ONG para relacionar
    const ongs = await kv.getByPrefix('ongs:');
    const firstOng = ongs[0];
    await kv.set('user:admin@ong.com', {
      email: 'admin@ong.com',
      password: 'admin1234',
      name: 'Administrador',
      role: 'admin',
      ongId: firstOng?.id || null,
      createdAt: new Date().toISOString()
    });
    console.log('Admin user created: admin@ong.com / admin1234');
    if (firstOng) {
      console.log('Admin user linked to ONG:', firstOng.nome);
    }
  } else {
    console.log('Admin user already exists');
  }
})();
// Helper function to verify authentication using simple token system
async function verifyAuth(authHeader) {
  console.log('🔐 verifyAuth called');
  console.log('Auth header:', authHeader);
  if (!authHeader) {
    console.log('❌ Missing authorization header');
    return {
      error: 'Missing authorization header',
      user: null
    };
  }
  const token = authHeader.split(' ')[1];
  console.log('📝 Extracted token:', token);
  if (!token) {
    console.log('❌ Invalid authorization header format');
    return {
      error: 'Invalid authorization header',
      user: null
    };
  }
  // Token is just the email for simplicity (in production, use JWT)
  const user = await kv.get(`user:${token}`);
  console.log('👤 User lookup result:', user ? 'Found' : 'Not found');
  if (!user) {
    console.log('❌ User not found for token:', token);
    return {
      error: 'Unauthorized',
      user: null
    };
  }
  console.log('✅ Auth successful for:', user.email);
  return {
    error: null,
    user: {
      id: token,
      email: token,
      ...user
    }
  };
}
// Health check endpoint
app.get("/make-server-7a062fc7/health", (c)=>{
  return c.json({
    status: "ok"
  });
});
// ==================== DEBUG ROUTES ====================
// Debug endpoint to check admin user
app.get("/make-server-7a062fc7/debug/check-admin", async (c)=>{
  try {
    const adminUser = await kv.get('user:admin@ong.com');
    const allUsers = await kv.getByPrefix('user:');
    const allOngs = await kv.getByPrefix('ongs:');
    return c.json({
      adminExists: !!adminUser,
      adminData: adminUser,
      totalUsers: allUsers.length,
      totalOngs: allOngs.length,
      firstOngId: allOngs[0]?.id,
      firstOngName: allOngs[0]?.nome
    });
  } catch (error) {
    console.error('Debug error:', error);
    return c.json({
      error: 'Debug error'
    }, 500);
  }
});
// Force recreate admin user with proper ONG link
app.post("/make-server-7a062fc7/debug/recreate-admin", async (c)=>{
  try {
    console.log('🔧 Recreating admin user...');
    // Get all ONGs
    const allOngs = await kv.getByPrefix('ongs:');
    console.log('📊 Total ONGs in database:', allOngs.length);
    if (allOngs.length === 0) {
      console.log('❌ No ONGs found in database');
      return c.json({
        error: 'No ONGs found. Please seed database first by clicking "📊 Criar Métricas e Dados".'
      }, 400);
    }
    // Preferir ONG custom (id/nome) para a conta admin
    const normalize = (v: string)=>v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const preferredOng = allOngs.find((ong)=>ong.id === '6e855537-4a3d-414f-91f7-4a3577c705a1') || 
      allOngs.find((ong)=>normalize(String(ong.email || '')).includes('lucaspimentabraga2')) ||
      allOngs.find((ong)=>normalize(String(ong.endereco || '')).includes('rua ingas')) ||
      allOngs.find((ong)=>normalize(String(ong.nome || '')).includes('acao solidaria')) || 
      allOngs[0];
    console.log('🏢 ONG selecionada para admin:', preferredOng.nome, '- ID:', preferredOng.id);
    // Create admin user with ONG link
    const adminUser = {
      email: 'admin@ong.com',
      password: 'admin1234',
      name: 'Administrador',
      role: 'admin',
      ongId: preferredOng.id,
      createdAt: new Date().toISOString()
    };
    await kv.set('user:admin@ong.com', adminUser);
    console.log('✅ Admin user recreated successfully');
    console.log('✅ Admin ongId:', adminUser.ongId);
    // Verify it was saved
    const savedUser = await kv.get('user:admin@ong.com');
    console.log('✅ Verification - Saved user ongId:', savedUser?.ongId);
    return c.json({
      success: true,
      message: 'Admin user created and linked successfully!',
      adminUser: {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        ongId: adminUser.ongId
      },
      linkedOng: {
        id: firstOng.id,
        nome: firstOng.nome,
        email: firstOng.email,
        telefone: firstOng.telefone
      }
    });
  } catch (error) {
    console.error('❌ Error recreating admin:', error);
    return c.json({
      error: 'Error recreating admin: ' + error.message
    }, 500);
  }
});

// Force set admin user to a specific ONG ID (debug)
app.post("/make-server-7a062fc7/debug/set-admin-ong", async (c)=>{
  try {
    const body = await c.req.json();
    const ongId = body?.ongId;
    if (!ongId) {
      return c.json({ error: 'ongId is required' }, 400);
    }
    const ong = await kv.get(`ongs:${ongId}`);
    if (!ong) {
      return c.json({ error: 'ONG not found' }, 404);
    }
    const existingUser = await kv.get('user:admin@ong.com');
    const adminUser = {
      email: 'admin@ong.com',
      password: 'admin1234',
      name: 'Administrador',
      role: 'admin',
      ongId,
      createdAt: existingUser?.createdAt || new Date().toISOString()
    };
    await kv.set('user:admin@ong.com', adminUser);
    return c.json({
      success: true,
      adminUser: {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        ongId: adminUser.ongId
      },
      linkedOng: {
        id: ong.id,
        nome: ong.nome,
        email: ong.email,
        telefone: ong.telefone
      }
    });
  } catch (error: any) {
    console.error('Erro no set-admin-ong:', error);
    return c.json({ error: error.message }, 500);
  }
});
// ==================== AUTH ROUTES ====================
// Login - simple authentication
app.post("/make-server-7a062fc7/login", async (c)=>{
  try {
    const body = await c.req.json();
    const { email, password } = body;
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    console.log('Password length:', password?.length);
    if (!email || !password) {
      console.log('Missing email or password');
      return c.json({
        error: 'Missing email or password'
      }, 400);
    }
    // Get user from KV store
    const user = await kv.get(`user:${email}`);
    console.log('User found in KV:', user ? 'Yes' : 'No');
    if (user) {
      console.log('Stored password:', user.password);
      console.log('Provided password:', password);
      console.log('Passwords match:', user.password === password);
      console.log('Password type comparison:', typeof user.password, 'vs', typeof password);
    }
    if (!user || user.password !== password) {
      console.log('❌ Invalid credentials');
      return c.json({
        error: 'Invalid credentials'
      }, 401);
    }
    console.log('✅ Login successful for:', email);
    // Get the user's ONG if they have one
    let userOng = null;
    if (user.ongId) {
      userOng = await kv.get(`ongs:${user.ongId}`);
      console.log('✅ User ONG found:', userOng?.nome);
    }
    // Return user data with token (email as token for simplicity)
    return c.json({
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        ongId: user.ongId
      },
      ong: userOng,
      token: email // Simple token (in production, use JWT)
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({
      error: 'Internal server error'
    }, 500);
  }
});
// Sign up - create new admin user + ONG
app.post("/make-server-7a062fc7/signup", async (c)=>{
  try {
    const body = await c.req.json();
    const { email, password, name, ongNome, ongDescricao, telefone, cep, numero, endereco, bairro, regiao, site, horarios, areasAtuacao, idiomas, caracteristicas } = body;
    if (!email || !password || !name || !ongNome || !ongDescricao || !telefone || !cep || !numero) {
      return c.json({
        error: 'Missing required fields'
      }, 400);
    }
    // Check if user already exists
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return c.json({
        error: 'User already exists'
      }, 400);
    }
    // Create ONG
    const ongId = crypto.randomUUID();
    const newOng = {
      id: ongId,
      nome: ongNome,
      descricao: ongDescricao,
      telefone,
      email,
      cep,
      numero,
      endereco: endereco || '',
      bairro: bairro || '',
      regiao: regiao || '',
      site: site || '',
      horarios: horarios || [],
      areasAtuacao: areasAtuacao || [],
      idiomas: idiomas || [],
      caracteristicas: caracteristicas || [],
      verificada: false,
      createdAt: new Date().toISOString()
    };
    await kv.set(`ongs:${ongId}`, newOng);

    // Create new user linked to ONG
    const newUser = {
      email,
      password,
      name,
      role: 'admin',
      ongId,
      createdAt: new Date().toISOString()
    };
    await kv.set(`user:${email}`, newUser);
    return c.json({
      user: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        ongId
      },
      ong: newOng,
      token: email
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({
      error: 'Internal server error'
    }, 500);
  }
});
// Get current user session
app.get("/make-server-7a062fc7/me", async (c)=>{
  const authResult = await verifyAuth(c.req.header('Authorization'));
  if (authResult.error) {
    return c.json({
      error: authResult.error
    }, 401);
  }
  let userOng = null;
  if (authResult.user?.ongId) {
    userOng = await kv.get(`ongs:${authResult.user.ongId}`);
  }
  return c.json({
    user: authResult.user,
    ong: userOng
  });
});
// ==================== ONGs ROUTES ====================
// List all ONGs with optional filters
app.get("/make-server-7a062fc7/ongs", async (c)=>{
  try {
    const ongs = await kv.getByPrefix('ongs:');
    // Parse query parameters for filtering
    const regiao = c.req.query('regiao');
    const bairro = c.req.query('bairro');
    const areaAtuacao = c.req.query('areaAtuacao');
    const idioma = c.req.query('idioma');
    const horario = c.req.query('horario');
    const busca = c.req.query('busca');
    let filtered = ongs;
    if (regiao) {
      filtered = filtered.filter((ong)=>ong.regiao === regiao);
    }
    if (bairro) {
      filtered = filtered.filter((ong)=>ong.bairro === bairro);
    }
    if (areaAtuacao) {
      filtered = filtered.filter((ong)=>ong.areasAtuacao?.includes(areaAtuacao));
    }
    if (idioma) {
      filtered = filtered.filter((ong)=>ong.idiomas?.includes(idioma));
    }
    if (horario) {
      filtered = filtered.filter((ong)=>ong.horarios?.includes(horario));
    }
    if (busca) {
      const searchTerm = busca.toLowerCase();
      filtered = filtered.filter((ong)=>ong.nome?.toLowerCase().includes(searchTerm) || ong.descricao?.toLowerCase().includes(searchTerm) || ong.areasAtuacao?.some((area)=>area.toLowerCase().includes(searchTerm)));
    }
    return c.json({
      ongs: filtered
    });
  } catch (error) {
    console.error('Error fetching ONGs:', error);
    return c.json({
      error: 'Error fetching ONGs'
    }, 500);
  }
});
// Get specific ONG by ID
app.get("/make-server-7a062fc7/ongs/:id", async (c)=>{
  try {
    const id = c.req.param('id');
    const ong = await kv.get(`ongs:${id}`);
    if (!ong) {
      return c.json({
        error: 'ONG not found'
      }, 404);
    }
    return c.json({
      ong
    });
  } catch (error) {
    console.error('Error fetching ONG:', error);
    return c.json({
      error: 'Error fetching ONG'
    }, 500);
  }
});
// Create new ONG (requires auth)
app.post("/make-server-7a062fc7/ongs", async (c)=>{
  const authResult = await verifyAuth(c.req.header('Authorization'));
  if (authResult.error) {
    return c.json({
      error: authResult.error
    }, 401);
  }
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const ong = {
      id,
      ...body,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      criadoPor: authResult.user.id
    };
    await kv.set(`ongs:${id}`, ong);
    // Initialize metrics for the new ONG
    const metricas = {
      ongId: id,
      visualizacoes: 0,
      cliques: 0,
      interessados: 0,
      historico: []
    };
    await kv.set(`metricas:${id}`, metricas);
    return c.json({
      ong
    });
  } catch (error) {
    console.error('Error creating ONG:', error);
    return c.json({
      error: 'Error creating ONG'
    }, 500);
  }
});
// Update ONG (requires auth)
app.put("/make-server-7a062fc7/ongs/:id", async (c)=>{
  const authResult = await verifyAuth(c.req.header('Authorization'));
  if (authResult.error) {
    console.log('❌ Auth error:', authResult.error);
    return c.json({
      error: authResult.error
    }, 401);
  }
  try {
    const id = c.req.param('id');
    console.log('=== UPDATE ONG ===');
    console.log('ONG ID:', id);
    console.log('User:', authResult.user.email);
    const existingOng = await kv.get(`ongs:${id}`);
    console.log('Existing ONG found:', existingOng ? 'Yes' : 'No');
    if (!existingOng) {
      console.log('❌ ONG not found');
      return c.json({
        error: 'ONG not found'
      }, 404);
    }
    const body = await c.req.json();
    console.log('Update data received:', JSON.stringify(body, null, 2));
    const updatedOng = {
      ...existingOng,
      ...body,
      id,
      atualizadoEm: new Date().toISOString()
    };
    console.log('Updated ONG:', JSON.stringify(updatedOng, null, 2));
    await kv.set(`ongs:${id}`, updatedOng);
    console.log('✅ ONG updated successfully');
    return c.json({
      ong: updatedOng
    });
  } catch (error) {
    console.error('❌ Error updating ONG:', error);
    return c.json({
      error: 'Error updating ONG',
      details: error.message
    }, 500);
  }
});
// Delete ONG (requires auth)
app.delete("/make-server-7a062fc7/ongs/:id", async (c)=>{
  const authResult = await verifyAuth(c.req.header('Authorization'));
  if (authResult.error) {
    return c.json({
      error: authResult.error
    }, 401);
  }
  try {
    const id = c.req.param('id');
    await kv.del(`ongs:${id}`);
    await kv.del(`metricas:${id}`);
    return c.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting ONG:', error);
    return c.json({
      error: 'Error deleting ONG'
    }, 500);
  }
});
// ==================== VAGAS ROUTES ====================
// List all vagas with optional ONG filter
app.get("/make-server-7a062fc7/vagas", async (c)=>{
  try {
    const ongId = c.req.query('ongId');
    const vagas = await kv.getByPrefix('vagas:');
    let filtered = vagas;
    if (ongId) {
      filtered = filtered.filter((vaga)=>vaga.ongId === ongId);
    }
    return c.json({
      vagas: filtered
    });
  } catch (error) {
    console.error('Error fetching vagas:', error);
    return c.json({
      error: 'Error fetching vagas'
    }, 500);
  }
});
// Get specific vaga by ID
app.get("/make-server-7a062fc7/vagas/:id", async (c)=>{
  try {
    const id = c.req.param('id');
    const vaga = await kv.get(`vagas:${id}`);
    if (!vaga) {
      return c.json({
        error: 'Vaga not found'
      }, 404);
    }
    return c.json({
      vaga
    });
  } catch (error) {
    console.error('Error fetching vaga:', error);
    return c.json({
      error: 'Error fetching vaga'
    }, 500);
  }
});
// Create new vaga (requires auth)
app.post("/make-server-7a062fc7/vagas", async (c)=>{
  const authResult = await verifyAuth(c.req.header('Authorization'));
  if (authResult.error) {
    return c.json({
      error: authResult.error
    }, 401);
  }
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const vaga = {
      id,
      ...body,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };
    await kv.set(`vagas:${id}`, vaga);
    return c.json({
      vaga
    });
  } catch (error) {
    console.error('Error creating vaga:', error);
    return c.json({
      error: 'Error creating vaga'
    }, 500);
  }
});
// Update vaga (requires auth)
app.put("/make-server-7a062fc7/vagas/:id", async (c)=>{
  const authResult = await verifyAuth(c.req.header('Authorization'));
  if (authResult.error) {
    return c.json({
      error: authResult.error
    }, 401);
  }
  try {
    const id = c.req.param('id');
    const existingVaga = await kv.get(`vagas:${id}`);
    if (!existingVaga) {
      return c.json({
        error: 'Vaga not found'
      }, 404);
    }
    const body = await c.req.json();
    const updatedVaga = {
      ...existingVaga,
      ...body,
      id,
      atualizadoEm: new Date().toISOString()
    };
    await kv.set(`vagas:${id}`, updatedVaga);
    return c.json({
      vaga: updatedVaga
    });
  } catch (error) {
    console.error('Error updating vaga:', error);
    return c.json({
      error: 'Error updating vaga'
    }, 500);
  }
});
// Delete vaga (requires auth)
app.delete("/make-server-7a062fc7/vagas/:id", async (c)=>{
  const authResult = await verifyAuth(c.req.header('Authorization'));
  if (authResult.error) {
    return c.json({
      error: authResult.error
    }, 401);
  }
  try {
    const id = c.req.param('id');
    await kv.del(`vagas:${id}`);
    return c.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting vaga:', error);
    return c.json({
      error: 'Error deleting vaga'
    }, 500);
  }
});
// ==================== PERGUNTAS ROUTES ====================
// List all perguntas with optional ONG filter (público recebe apenas respondidas)
app.get("/make-server-7a062fc7/perguntas", async (c)=>{
  const authHeader = c.req.header('Authorization');
  const isPublic = !authHeader;
  const authResult = authHeader ? await verifyAuth(authHeader) : { error: null, user: null };
  if (authHeader && authResult.error) {
    return c.json({ error: authResult.error }, 401);
  }
  try {
    const ongId = c.req.query('ongId');
    const perguntas = await kv.getByPrefix('perguntas:');
    let filtered = perguntas;
    if (ongId) {
      filtered = filtered.filter((pergunta)=>pergunta.ongId === ongId);
    }
    // Remover duplicadas (mesma mensagem+email), mantendo a mais recente
    filtered = filtered
      .sort((a, b)=>new Date(b.criadoEm || 0).getTime() - new Date(a.criadoEm || 0).getTime())
      .filter((p, idx, arr)=>{
        const key = `${(p.email || '').toLowerCase()}|${(p.mensagem || '').toLowerCase()}`;
        return arr.findIndex((x)=>`${(x.email || '').toLowerCase()}|${(x.mensagem || '').toLowerCase()}` === key) === idx;
      });
    if (isPublic) {
      filtered = filtered.filter((pergunta)=>pergunta.respondida);
    }
    return c.json({ perguntas: filtered });
  } catch (error) {
    console.error('Error fetching perguntas:', error);
    return c.json({ error: 'Error fetching perguntas' }, 500);
  }
});
// Create new pergunta (public)
app.post("/make-server-7a062fc7/perguntas", async (c)=>{
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const pergunta = {
      id,
      ...body,
      nome: body.nome || body.nomeUsuario || 'Visitante',
      email: body.email || 'visitante@example.com',
      respondida: body.respondida ?? false,
      resposta: body.resposta ?? null,
      criadoEm: new Date().toISOString()
    };
    await kv.set(`perguntas:${id}`, pergunta);
    return c.json({
      pergunta
    });
  } catch (error) {
    console.error('Error creating pergunta:', error);
    return c.json({
      error: 'Error creating pergunta'
    }, 500);
  }
});
// Answer pergunta (requires auth)
app.put("/make-server-7a062fc7/perguntas/:id", async (c)=>{
  const authResult = await verifyAuth(c.req.header('Authorization'));
  if (authResult.error) {
    return c.json({
      error: authResult.error
    }, 401);
  }
  try {
    const id = c.req.param('id');
    const existingPergunta = await kv.get(`perguntas:${id}`);
    if (!existingPergunta) {
      return c.json({
        error: 'Pergunta not found'
      }, 404);
    }
    const body = await c.req.json();
    const updatedPergunta = {
      ...existingPergunta,
      resposta: body.resposta,
      respondida: true,
      respondidoEm: new Date().toISOString()
    };
    await kv.set(`perguntas:${id}`, updatedPergunta);
    return c.json({
      pergunta: updatedPergunta
    });
  } catch (error) {
    console.error('Error answering pergunta:', error);
    return c.json({
      error: 'Error answering pergunta'
    }, 500);
  }
});
// Delete pergunta (requires auth)
app.delete("/make-server-7a062fc7/perguntas/:id", async (c)=>{
  const authResult = await verifyAuth(c.req.header('Authorization'));
  if (authResult.error) {
    return c.json({
      error: authResult.error
    }, 401);
  }
  try {
    const id = c.req.param('id');
    await kv.del(`perguntas:${id}`);
    return c.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting pergunta:', error);
    return c.json({
      error: 'Error deleting pergunta'
    }, 500);
  }
});
// ==================== MÉTRICAS ROUTES ====================
// Get metrics for an ONG
app.get("/make-server-7a062fc7/metricas/:ongId", async (c)=>{
  const authResult = await verifyAuth(c.req.header('Authorization'));
  if (authResult.error) {
    return c.json({
      error: authResult.error
    }, 401);
  }
  try {
    const ongId = c.req.param('ongId');
    let metricas = await kv.get(`metricas:${ongId}`);
    // If metrics don't exist, create them
    if (!metricas) {
      metricas = {
        ongId,
        visualizacoes: 0,
        cliques: 0,
        interessados: 0,
        historico: []
      };
      await kv.set(`metricas:${ongId}`, metricas);
    }
    return c.json({
      metricas
    });
  } catch (error) {
    console.error('Error fetching metricas:', error);
    return c.json({
      error: 'Error fetching metricas'
    }, 500);
  }
});
// Update metrics for an ONG
app.post("/make-server-7a062fc7/metricas/:ongId", async (c)=>{
  try {
    const ongId = c.req.param('ongId');
    const body = await c.req.json();
    let metricas = await kv.get(`metricas:${ongId}`);
    if (!metricas) {
      metricas = {
        ongId,
        visualizacoes: 0,
        cliques: 0,
        interessados: 0,
        historico: []
      };
    }
    // Update metrics based on action
    if (body.action === 'view') {
      metricas.visualizacoes++;
    } else if (body.action === 'click') {
      metricas.cliques++;
    } else if (body.action === 'interest') {
      metricas.interessados++;
    }
    // Add to history
    if (!metricas.historico) {
      metricas.historico = [];
    }
    metricas.historico.push({
      data: new Date().toISOString(),
      acao: body.action
    });
    await kv.set(`metricas:${ongId}`, metricas);
    return c.json({
      metricas
    });
  } catch (error) {
    console.error('Error updating metricas:', error);
    return c.json({
      error: 'Error updating metricas'
    }, 500);
  }
});
// ==================== DOCUMENTOS ROUTES ====================
// Upload document (requires auth)
app.post("/make-server-7a062fc7/documentos/upload", async (c)=>{
  const authResult = await verifyAuth(c.req.header('Authorization'));
  if (authResult.error) {
    return c.json({
      error: authResult.error
    }, 401);
  }
  try {
    const formData = await c.req.formData();
    const file = formData.get('file');
    const ongId = formData.get('ongId');
    const tipo = formData.get('tipo');
    if (!file || !ongId || !tipo) {
      return c.json({
        error: 'Missing required fields'
      }, 400);
    }
    const fileName = `${ongId}/${tipo}-${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();
    const { data, error } = await supabaseAdmin.storage.from(BUCKET_NAME).upload(fileName, fileBuffer, {
      contentType: file.type,
      upsert: false
    });
    if (error) {
      console.error('Error uploading document:', error);
      return c.json({
        error: 'Error uploading document'
      }, 500);
    }
    // Create signed URL valid for 1 year
    const { data: urlData } = await supabaseAdmin.storage.from(BUCKET_NAME).createSignedUrl(fileName, 31536000);
    // Store document metadata
    const documentoId = crypto.randomUUID();
    const documento = {
      id: documentoId,
      ongId,
      tipo,
      nome: file.name,
      path: fileName,
      url: urlData?.signedUrl,
      criadoEm: new Date().toISOString()
    };
    await kv.set(`documentos:${documentoId}`, documento);
    return c.json({
      documento
    });
  } catch (error) {
    console.error('Error in document upload route:', error);
    return c.json({
      error: 'Error uploading document'
    }, 500);
  }
});
// List documents for an ONG (requires auth)
app.get("/make-server-7a062fc7/documentos/:ongId", async (c)=>{
  const authResult = await verifyAuth(c.req.header('Authorization'));
  if (authResult.error) {
    return c.json({
      error: authResult.error
    }, 401);
  }
  try {
    const ongId = c.req.param('ongId');
    const documentos = await kv.getByPrefix('documentos:');
    const filtered = documentos.filter((doc)=>doc.ongId === ongId);
    return c.json({
      documentos: filtered
    });
  } catch (error) {
    console.error('Error fetching documentos:', error);
    return c.json({
      error: 'Error fetching documentos'
    }, 500);
  }
});
Deno.serve(app.fetch);
