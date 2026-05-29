// ListasContext.jsx
// Gerencia as listas personalizadas do usuário

import { createContext, useState, useContext } from 'react';

export const ListasContext = createContext();

export function ListasProvider({ children }) {
  const [listas, setListas] = useState([
    { id: '1', nome: 'Pessoal', cor: '#E53935', icone: 'user' },
    { id: '2', nome: 'Trabalho', cor: '#1E88E5', icone: 'briefcase' },
    { id: '3', nome: 'Faculdade', cor: '#43A047', icone: 'book' },
  ]);

  const [lixeiraListas, setLixeiraListas] = useState([]);

  function adicionarLista(lista) {
    const nova = { ...lista, id: Date.now().toString() };
    setListas(prev => [...prev, nova]);
  }

  function editarLista(id, dados) {
    setListas(prev => prev.map(l => l.id === id ? { ...l, ...dados } : l));
  }

  // Move uma ou mais listas para a lixeira
  function excluirListas(ids) {
    const paraExcluir = listas.filter(l => ids.includes(l.id));
    setLixeiraListas(prev => [...paraExcluir.map(l => ({ ...l, excluidoEm: new Date().toISOString() })), ...prev]);
    setListas(prev => prev.filter(l => !ids.includes(l.id)));
  }

  function restaurarLista(id) {
    const lista = lixeiraListas.find(l => l.id === id);
    if (lista) {
      const { excluidoEm, ...resto } = lista;
      setListas(prev => [resto, ...prev]);
      setLixeiraListas(prev => prev.filter(l => l.id !== id));
    }
  }

  function excluirListaDefinitivo(id) {
    setLixeiraListas(prev => prev.filter(l => l.id !== id));
  }

  return (
    <ListasContext.Provider value={{
      listas, lixeiraListas,
      adicionarLista, editarLista,
      excluirListas, restaurarLista, excluirListaDefinitivo,
    }}>
      {children}
    </ListasContext.Provider>
  );
}

export function useListas() {
  return useContext(ListasContext);
}