const TOKEN = 'local_sys_token';

export function getToken() {
  return localStorage.getItem(TOKEN) || '';
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN);
}
