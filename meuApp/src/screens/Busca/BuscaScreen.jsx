// BuscaScreen.jsx
// Tela de busca — só mostra resultados ao digitar ou filtrar

import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useTema } from '../../hooks/useTema';
import { useLembretes } from '../../context/LembretesContext';
import { useListas } from '../../context/ListasContext';

export default function BuscaScreen({ navigation }) {
  const { cores, fontes } = useTema();
  const { lembretes } = useLembretes();
  const { listas } = useListas();

  const [texto, setTexto] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState(null);

  const corPrioridade = { alta: '#EF4444', media: '#F59E0B', baixa: '#10B981' };
  const prioridades = [
    { id: 'alta', label: 'Alta' },
    { id: 'media', label: 'Média' },
    { id: 'baixa', label: 'Baixa' },
  ];

  // Só mostra resultados se o usuário digitou pelo menos 2 caracteres OU selecionou uma prioridade
  const buscaAtiva = texto.length >= 2 || filtroPrioridade !== null;

  function resultados() {
    if (!buscaAtiva) return [];
    return lembretes.filter(l => {
      const matchTexto = texto.length < 2 || (
        l.titulo?.toLowerCase().includes(texto.toLowerCase()) ||
        l.categoria?.toLowerCase().includes(texto.toLowerCase()) ||
        l.notas?.toLowerCase().includes(texto.toLowerCase())
      );
      const matchPrioridade = !filtroPrioridade || l.prioridade === filtroPrioridade;
      return matchTexto && matchPrioridade;
    });
  }

  function nomeLista(listaId) {
    if (!listaId) return null;
    return listas.find(l => l.id === listaId) || null;
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    header: { padding: 24, paddingBottom: 12 },
    titulo: { fontSize: 28, fontFamily: fontes.negrito, color: cores.texto, marginBottom: 12 },
    buscaContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: cores.fundoCard, borderRadius: 12, borderWidth: 1, borderColor: cores.borda, paddingHorizontal: 12 },
    input: { flex: 1, padding: 13, fontSize: 16, fontFamily: fontes.regular, color: cores.texto },
    filtros: { flexDirection: 'row', gap: 8, marginTop: 12 },
    filtroBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: cores.borda, backgroundColor: cores.fundoCard, flexDirection: 'row', alignItems: 'center', gap: 6 },
    filtroBtnAtivo: { borderWidth: 1.5 },
    filtroTexto: { fontSize: 13, fontFamily: fontes.medio, color: cores.textoClaro },
    lista: { padding: 16, paddingTop: 8 },
    card: { backgroundColor: cores.fundoCard, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: cores.borda },
    tituloLinha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    cardTitulo: { fontSize: 16, fontFamily: fontes.medio, color: cores.texto, flex: 1, marginRight: 8 },
    cardTituloConcluido: { textDecorationLine: 'line-through', color: cores.textoClaro },
    etiqueta: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1 },
    etiquetaTexto: { fontSize: 11, fontFamily: fontes.medio },
    cardInfoLinha: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    cardInfo: { fontSize: 13, fontFamily: fontes.regular, color: cores.textoClaro },
    listaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 8, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
    listaBadgeTexto: { fontSize: 12, fontFamily: fontes.regular },
    badge: { backgroundColor: cores.fundo, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 8, borderWidth: 1, borderColor: cores.borda },
    badgeTexto: { fontSize: 12, fontFamily: fontes.regular, color: cores.textoClaro },
    // Estado inicial — convida o usuário a digitar
    dicaContainer: { alignItems: 'center', marginTop: 60 },
    dicaTexto: { textAlign: 'center', color: cores.textoClaro, fontFamily: fontes.regular, marginTop: 12, fontSize: 15 },
    dicaSubTexto: { textAlign: 'center', color: cores.textoClaro, fontFamily: fontes.regular, marginTop: 4, fontSize: 13 },
    vazio: { textAlign: 'center', color: cores.textoClaro, fontFamily: fontes.regular, marginTop: 40, fontSize: 15 },
  });

  const lista = resultados();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Buscar</Text>

        {/* Campo de busca */}
        <View style={styles.buscaContainer}>
          <Feather name="search" size={16} color={cores.textoClaro} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            value={texto}
            onChangeText={setTexto}
            placeholder="Título, categoria, notas..."
            placeholderTextColor={cores.textoClaro}
          />
          {texto.length > 0 && (
            <TouchableOpacity onPress={() => setTexto('')}>
              <Feather name="x" size={18} color={cores.textoClaro} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros de prioridade */}
        <View style={styles.filtros}>
          {prioridades.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.filtroBtn, filtroPrioridade === p.id && { ...styles.filtroBtnAtivo, borderColor: corPrioridade[p.id] }]}
              onPress={() => setFiltroPrioridade(filtroPrioridade === p.id ? null : p.id)}
            >
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: corPrioridade[p.id] }} />
              <Text style={[styles.filtroTexto, filtroPrioridade === p.id && { color: corPrioridade[p.id] }]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={lista}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const listaDoLembrete = nomeLista(item.listaId);
          return (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DetalhesLembrete', { lembrete: item })}>
              {/* Título à esquerda, etiqueta de prioridade à direita */}
              <View style={styles.tituloLinha}>
                <Text style={[styles.cardTitulo, item.concluido && styles.cardTituloConcluido]} numberOfLines={1}>
                  {item.titulo}
                </Text>
                {item.prioridade && (
                  <View style={[styles.etiqueta, { backgroundColor: corPrioridade[item.prioridade] + '25', borderColor: corPrioridade[item.prioridade] }]}>
                    <Text style={[styles.etiquetaTexto, { color: corPrioridade[item.prioridade] }]}>
                      {item.prioridade.charAt(0).toUpperCase() + item.prioridade.slice(1)}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.cardInfoLinha}>
                <Feather name="calendar" size={12} color={cores.textoClaro} />
                <Text style={styles.cardInfo}>{item.dataHora?.split(' ')[0] || item.dataHora}</Text>
              </View>
              {item.dataHora?.includes(' ') && (
                <View style={styles.cardInfoLinha}>
                  <Feather name="clock" size={12} color={cores.textoClaro} />
                  <Text style={styles.cardInfo}>{item.dataHora.split(' ')[1]}</Text>
                </View>
              )}
              {/* Badge mostrando em qual lista o lembrete está */}
              {listaDoLembrete && (
                <View style={[styles.listaBadge, { borderColor: listaDoLembrete.cor }]}>
                  <Feather name={listaDoLembrete.icone || 'list'} size={11} color={listaDoLembrete.cor} />
                  <Text style={[styles.listaBadgeTexto, { color: listaDoLembrete.cor }]}>{listaDoLembrete.nome}</Text>
                </View>
              )}
              {item.categoria ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeTexto}>{item.categoria}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          !buscaAtiva ? (
            // Estado inicial — ainda não pesquisou nada
            <View style={styles.dicaContainer}>
              <Feather name="search" size={40} color={cores.borda} />
              <Text style={styles.dicaTexto}>Digite para buscar</Text>
              <Text style={styles.dicaSubTexto}>ou filtre por prioridade acima</Text>
            </View>
          ) : (
            <Text style={styles.vazio}>Nenhum resultado encontrado.</Text>
          )
        }
      />
    </SafeAreaView>
  );
}