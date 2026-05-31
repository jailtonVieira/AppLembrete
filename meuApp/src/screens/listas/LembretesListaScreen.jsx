// LembretesListaScreen.jsx
// Mostra os lembretes de uma lista específica

import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTema } from '../../hooks/useTema';
import { useLembretes } from '../../context/LembretesContext';

export default function LembretesListaScreen({ navigation, route }) {
  const { cores, fontes } = useTema();
  const { lembretes, concluir, excluir } = useLembretes();
  const { lista } = route.params;

  const lembretesLista = lembretes.filter(l => l.listaId === lista.id);
  const corPrioridade = { alta: '#EF4444', media: '#F59E0B', baixa: '#10B981' };

  function handleExcluir(id) {
    Alert.alert('Excluir', 'Mover para a lixeira?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: () => excluir(id) },
    ]);
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    header: { flexDirection: 'row', alignItems: 'center', padding: 24, paddingBottom: 12, gap: 12 },
    btnVoltar: { width: 36, height: 36, borderRadius: 18, backgroundColor: cores.fundoCard, borderWidth: 1, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
    bolinha: { width: 14, height: 14, borderRadius: 7 },
    headerTextos: { flex: 1 },
    titulo: { fontSize: 24, fontFamily: fontes.negrito, color: cores.texto },
    subtitulo: { fontSize: 13, fontFamily: fontes.regular, color: cores.textoClaro, marginTop: 2 },
    lista: { padding: 16, paddingTop: 8 },
    card: { backgroundColor: cores.fundoCard, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: cores.borda },
    // Linha do título com prioridade — título à esquerda, etiqueta à direita
    tituloLinha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    cardTitulo: { fontSize: 16, fontFamily: fontes.medio, color: cores.texto, flex: 1, marginRight: 8 },
    cardTituloConcluido: { textDecorationLine: 'line-through', color: cores.textoClaro },
    etiqueta: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1 ,marginRight:10,},
    etiquetaTexto: { fontSize: 11, fontFamily: fontes.medio,},
    cardInfoLinha: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    cardInfo: { fontSize: 13, fontFamily: fontes.regular, color: cores.textoClaro },
    acoes: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    cardTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    btnCheck: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: cores.primaria, alignItems: 'center', justifyContent: 'center' },
    btnCheckAtivo: { backgroundColor: cores.primaria },
    btnExcluir: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
    vazio: { textAlign: 'center', color: cores.textoClaro, fontFamily: fontes.regular, marginTop: 40, fontSize: 15 },
    fab: { position: 'absolute', bottom: 24, right: 24, backgroundColor: lista.cor, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={cores.texto} />
        </TouchableOpacity>
        <View style={[styles.bolinha, { backgroundColor: lista.cor }]} />
        <View style={styles.headerTextos}>
          <Text style={styles.titulo}>{lista.nome}</Text>
        </View>
      </View>

      <FlatList
        data={lembretesLista}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DetalhesLembrete', { lembrete: item })}>
            <View style={styles.cardTopo}>
              <View style={{ flex: 1 }}>
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
              </View>
              <View style={styles.acoes}>
                <TouchableOpacity style={[styles.btnCheck, item.concluido && styles.btnCheckAtivo]} onPress={() => concluir(item.id)}>
                  {item.concluido && <Feather name="check" size={14} color="#fff" />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnExcluir} onPress={() => handleExcluir(item.id)}>
                  <Feather name="x" size={14} color={cores.textoClaro} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum lembrete nessa lista ainda.</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CriarLembrete', { listaId: lista.id })}>
        <Feather name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
