export function useAuth() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return { isAuthenticated: false, role: null, user: null };
  }

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const payload = JSON.parse(decodedJson);
    
    return {
      isAuthenticated: true,
      role: payload.role,
      user: payload,
    };
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return { isAuthenticated: false, role: null, user: null };
  }
}