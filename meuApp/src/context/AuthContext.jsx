// AuthContext.jsx
// Gerencia o estado de autenticação do usuário em todo o app

import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  // Por enquanto o login é local... Quando o back end ficar pronto, essa função vai chamar a API e salvar o token no dispositivo
  async function login(email, senha) {
    if (email && senha) {
      setUsuario({ email, nome: 'Usuário' });
    } else {
      throw new Error('Campos inválidos');
    }
  }

  function logout() {
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}