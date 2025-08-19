// src/utils/auth.ts

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  return !!(token && username)
}

export function getUserInfo() {
  return {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role'),
  }
}

export function logout(router?: any) {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('role')
  if (router) router.push({ name: 'home' })
}
