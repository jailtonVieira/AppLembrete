// useTema.js
// Hook que retorna as cores e fontes do tema atual

import { useTemaContext } from '../context/TemaContext';
import { claro, escuro, fontes } from '../theme';

export function useTema() {
  const { modoEscuro } = useTemaContext();
  const cores = modoEscuro ? escuro : claro;
  return { cores, fontes, modoEscuro };
}