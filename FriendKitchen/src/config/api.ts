const normalizeBaseUrl = (baseUrl: string) => {
  if (!baseUrl || baseUrl === './' || baseUrl === '/./') {
    return '';
  }

  let normalized = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`;
  normalized = normalized.replace(/\/\.\//g, '/').replace(/\/+/g, '/');

  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
};

const baseUrl = normalizeBaseUrl(import.meta.env.BASE_URL);

export const API_BASE = `${baseUrl}/api`;
