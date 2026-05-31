import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  async function login(email, senha, nomeUsuario) {
    if (email && senha) {
      setUsuario({ email, nome: nomeUsuario || email.split('@')[0], foto: null });
    } else {
      throw new Error('Campos inválidos');
    }
  }

  // Atualiza a foto do usuário no contexto
  function atualizarFoto(uri) {
    setUsuario(prev => ({ ...prev, foto: uri }));
  }

// Atualiza o nome do usuário no contexto
function atualizarNome(novoNome) {
  setUsuario(prev => ({ ...prev, nome: novoNome }));
}

// Remove a foto do usuário
function removerFoto() {
  setUsuario(prev => ({ ...prev, foto: null }));
}

  function logout() {
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, atualizarFoto, atualizarNome, removerFoto }}>
      {children}
    </AuthContext.Provider>
  );
}
