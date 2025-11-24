# Site sobre ONG's em BH

Frontend em Vite/React com funções Edge (Supabase) já prontas. Login de teste: `admin@ong.com` / `admin1234`.

## Pré-requisitos
- Node 18+
- Conta Supabase (projeto ref: `mmatbmsguimcfabrmnjm`)
- Supabase CLI (para deploy de função)

## Configuração
1. Crie um `.env.local` (não versione) a partir de `.env.example`:
   ```
   SUPABASE_URL=https://mmatbmsguimcfabrmnjm.supabase.co
   SUPABASE_ANON_KEY=<anon>
   SUPABASE_SERVICE_ROLE_KEY=<service-role>
   SUPABASE_ACCESS_TOKEN=<access-token-para-CLI>
   ```
2. Instale dependências:
   ```
   npm install
   ```

## Rodar local
```
npm run dev
```
Abra http://localhost:5173.

## Build
```
npm run build
```

## Funções Supabase (backend)
Código em `supabase/functions/make-server-7a062fc7/` (usa `kv_store_7a062fc7`).

### Deploy da função
```
set SUPABASE_ACCESS_TOKEN=<seu token>
npx supabase functions deploy make-server-7a062fc7 --project-ref mmatbmsguimcfabrmnjm --no-verify-jwt
```

### Recriar admin vinculado à primeira ONG
```
curl -X POST https://mmatbmsguimcfabrmnjm.supabase.co/functions/v1/make-server-7a062fc7/debug/recreate-admin
```

## Importante
- **Não** versione chaves/tokens. `.gitignore` já ignora `.env*`, `node_modules`, `build`.
- O frontend carrega ONGs do backend (`/ongs`), então novas contas/renomes aparecem automaticamente. 
