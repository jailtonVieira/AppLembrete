// LembretesContext.jsx
// Centraliza todos os lembretes e a lixeira do app
// Qualquer tela que precisar ler ou modificar lembretes usa o hook useLembretes()

import { createContext, useState, useContext } from 'react';

export const LembretesContext = createContext();

export function LembretesProvider({ children }) {
  // Dados de exemplo para desenvolvimento. Substituir pela API quando o back end estiver pronto
  const [lembretes, setLembretes] = useState([]);

  const [lixeira, setLixeira] = useState([]);

  // Cria um novo lembrete e adiciona no topo da lista
  function adicionar(lembrete) {
    const novo = { ...lembrete, id: Date.now().toString(), concluido: false };
    setLembretes(prev => [novo, ...prev]);
  }

  // Atualiza campos específicos de um lembrete pelo id
  function editar(id, dados) {
    setLembretes(prev => prev.map(l => l.id === id ? { ...l, ...dados } : l));
  }

  // Move o lembrete para a lixeira em vez de apagar direto
  function excluir(id) {
    const lembrete = lembretes.find(l => l.id === id);
    if (lembrete) {
      setLixeira(prev => [{ ...lembrete, excluidoEm: new Date().toISOString() }, ...prev]);
      setLembretes(prev => prev.filter(l => l.id !== id));
    }
  }

  // Tira o lembrete da lixeira e devolve para a lista principal
  function restaurar(id) {
    const lembrete = lixeira.find(l => l.id === id);
    if (lembrete) {
      const { excluidoEm, ...resto } = lembrete;
      setLembretes(prev => [resto, ...prev]);
      setLixeira(prev => prev.filter(l => l.id !== id));
    }
  }

  // Remove permanentemente da lixeira. (sem volta)
  function excluirDefinitivo(id) {
    setLixeira(prev => prev.filter(l => l.id !== id));
  }

  // Alterna entre concluído e não concluído
  function concluir(id) {
    setLembretes(prev => prev.map(l => l.id === id ? { ...l, concluido: !l.concluido } : l));
  }

  return (
    <LembretesContext.Provider value={{
      lembretes,
      lixeira,
      adicionar,
      editar,
      excluir,
      restaurar,
      excluirDefinitivo,
      concluir,
    }}>
      {children}
    </LembretesContext.Provider>
  );
}

// Hook personalizado para acessar o contexto sem precisar importar o LembretesContext direto
export function useLembretes() {
  return useContext(LembretesContext);
}
