import { createClient } from '@supabase/supabase-js'

// Como você não tem acesso ao painel da Vercel para configurar variáveis de ambiente,
// vamos definir as chaves diretamente aqui.
// Nota: Em um projeto real/produção com dados sensíveis, isso não é recomendado,
// mas para este caso específico funcionará.

const supabaseUrl = 'https://lvnqqbeldyihjjuixmsb.supabase.co'
const supabaseKey = 'sb_secret_wOpcaRrhHknfgSlMgUcg2g_qcpFqleB'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)