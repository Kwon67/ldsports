// URL da API - função que retorna a URL correta baseada no ambiente
// Deve ser chamada apenas em contextos client-side (useEffect, handlers, etc.)

export function getApiUrl(): string {
  // Em produção, usar a variável de ambiente
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('[API Config] Using NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window === 'undefined') {
    // Server-side: usar localhost
    console.log('[API Config] Server-side detected, using localhost');
    return 'http://localhost:4001/api';
  }

  const hostname = window.location.hostname;
  console.log('[API Config] Client-side hostname:', hostname);

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('[API Config] Using localhost');
    return 'http://localhost:4001/api';
  }

  // Em produção no Vercel, DEVE ter NEXT_PUBLIC_API_URL configurada
  if (hostname.includes('vercel.app')) {
    console.error('[API Config] ⚠️ ERRO: NEXT_PUBLIC_API_URL não configurada no Vercel!');
    console.error('[API Config] Por favor, configure a variável de ambiente no Vercel.');
    console.error('[API Config] Exemplo: NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app/api');
    // Retorna uma URL placeholder para evitar erro, mas não vai funcionar
    return 'https://CONFIGURE-NEXT-PUBLIC-API-URL.vercel.app/api';
  }

  // Acesso via rede: usar o mesmo IP do frontend
  // Garantir que não tenha porta duplicada
  const cleanHost = hostname.split(':')[0];
  const url = `http://${cleanHost}:4001/api`;
  console.log('[API Config] Using network IP:', url);
  return url;
}

// Para compatibilidade com código existente
export const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';
