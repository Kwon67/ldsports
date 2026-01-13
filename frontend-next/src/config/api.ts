// URL da API - função que retorna a URL correta baseada no ambiente
// Deve ser chamada apenas em contextos client-side (useEffect, handlers, etc.)

export function getApiUrl(): string {
  // Em produção, usar a variável de ambiente
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window === 'undefined') {
    // Server-side: usar localhost
    return 'http://localhost:4001/api';
  }

  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4001/api';
  }

  // Acesso via rede: usar o mesmo IP do frontend
  // Garantir que não tenha porta duplicada
  const cleanHost = hostname.split(':')[0];
  return `http://${cleanHost}:4001/api`;
}

// Para compatibilidade com código existente
export const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';
