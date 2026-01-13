// URL da API - função que retorna a URL correta baseada no ambiente
// Deve ser chamada apenas em contextos client-side (useEffect, handlers, etc.)

export function getApiUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side: usar localhost
    return 'http://localhost:4001/api';
  }

  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4001/api';
  }

  // Acesso via rede: usar o mesmo IP do frontend
  return `http://${hostname}:4001/api`;
}

// Para compatibilidade com código existente
export const API_URL: string = 'http://localhost:4001/api';
