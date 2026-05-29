// TemaContext.jsx
// Gerencia o tema global do app — claro ou escuro
// Usado em todas as telas via useTemaContext()

import { createContext, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';

export const TemaContext = createContext();

export function TemaProvider({ children }) {
  const esquemaSistema = useColorScheme();
  const [temaManual, setTemaManual] = useState(null);

  // Se o usuário escolheu manualmente usa o manual, senão segue o sistema
  const modoEscuro = temaManual !== null ? temaManual : esquemaSistema === 'dark';

  function alternarTema() {
    setTemaManual(prev => {
      if (prev === null) return !(esquemaSistema === 'dark');
      return !prev;
    });
  }

  return (
    <TemaContext.Provider value={{ modoEscuro, alternarTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTemaContext() {
  return useContext(TemaContext);
}