import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sua-api.com',
  timeout: 10000,
});

export const lembreteService = {
  listar: () => api.get('/lembretes'),
  criar: (dados) => api.post('/lembretes', dados),
  editar: (id, dados) => api.put(`/lembretes/${id}`, dados),
  excluir: (id) => api.delete(`/lembretes/${id}`),
  restaurar: (id) => api.patch(`/lembretes/${id}/restaurar`),
  lixeira: () => api.get('/lembretes/lixeira'),
};

export default api;