// DetalhesLembreteScreen.jsx
// Exibe todos os dados de um lembrete e permite gerenciar subtarefas

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useTema } from '../../hooks/useTema';
import { useLembretes } from '../../context/LembretesContext';

export default function DetalhesLembreteScreen({ navigation, route }) {
  const { cores, fontes } = useTema();
  const { excluir, editar } = useLembretes();
  const { lembrete } = route.params;

  const [subtarefas, setSubtarefas] = useState(lembrete.subtarefas || []);
  const [novaSubtarefa, setNovaSubtarefa] = useState('');

  const corPrioridade = { alta: '#E53935', media: '#FB8C00', baixa: '#43A047' };

  function handleExcluir() {
    Alert.alert('Excluir', 'Mover para a lixeira?', [
      { text: 'Cancelar' },
      { text: 'Excluir', style: 'destructive', onPress: () => { excluir(lembrete.id); navigation.goBack(); } },
    ]);
  }

  function handleAdicionarSubtarefa() {
    if (!novaSubtarefa.trim()) return;
    const nova = { id: Date.now().toString(), titulo: novaSubtarefa.trim(), concluida: false };
    const atualizadas = [...subtarefas, nova];
    setSubtarefas(atualizadas);
    editar(lembrete.id, { subtarefas: atualizadas });
    setNovaSubtarefa('');
  }

  function handleConcluirSubtarefa(id) {
    const atualizadas = subtarefas.map(s => s.id === id ? { ...s, concluida: !s.concluida } : s);
    setSubtarefas(atualizadas);
    editar(lembrete.id, { subtarefas: atualizadas });
  }

  function handleExcluirSubtarefa(id) {
    const atualizadas = subtarefas.filter(s => s.id !== id);
    setSubtarefas(atualizadas);
    editar(lembrete.id, { subtarefas: atualizadas });
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 12 },
    btnVoltar: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    btnVoltarTexto: { fontSize: 16, fontFamily: fontes.medio, color: cores.texto },
    btnExcluirTexto: { fontSize: 16, fontFamily: fontes.medio, color: cores.erro },
    conteudo: { padding: 24, paddingBottom: 40 },
    tituloLinha: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    titulo: { fontSize: 26, fontFamily: fontes.negrito, color: cores.texto, flex: 1 },
    tituloConcluido: { textDecorationLine: 'line-through', color: cores.textoClaro },
    prioridadeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginBottom: 16 },
    prioridadeTexto: { fontSize: 13, fontFamily: fontes.medio },
    notas: { fontSize: 15, fontFamily: fontes.regular, color: cores.textoClaro, marginBottom: 20 },
    secao: { backgroundColor: cores.fundoCard, borderRadius: 12, borderWidth: 1, borderColor: cores.borda, marginBottom: 16, overflow: 'hidden' },
    secaoTitulo: { fontSize: 12, fontFamily: fontes.medio, color: cores.textoClaro, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    infoLinha: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingTop: 6, gap: 10 },
    infoTexto: { fontSize: 15, fontFamily: fontes.regular, color: cores.texto },
    divisor: { height: 1, backgroundColor: cores.borda, marginHorizontal: 16 },
    subtarefaItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
    subtarefaCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: cores.primaria, alignItems: 'center', justifyContent: 'center' },
    subtarefaCheckAtivo: { backgroundColor: cores.primaria },
    subtarefaTexto: { fontSize: 15, fontFamily: fontes.regular, color: cores.texto, flex: 1 },
    subtarefaTextoConcluida: { textDecorationLine: 'line-through', color: cores.textoClaro },
    adicionarLinha: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
    adicionarInput: { flex: 1, fontSize: 15, fontFamily: fontes.regular, color: cores.texto },
    adicionarBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: cores.primaria, alignItems: 'center', justifyContent: 'center' },
    botao: { backgroundColor: cores.primaria, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    botaoTexto: { color: cores.fundo, fontSize: 16, fontFamily: fontes.negrito },
    botaoSecundario: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: cores.borda },
    botaoSecundarioTexto: { color: cores.texto, fontSize: 16, fontFamily: fontes.medio },
  });

  return (
    <SafeAreaView style={styles.container}>

      {/* Header com botão de voltar e excluir */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={cores.texto} />
          <Text style={styles.btnVoltarTexto}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleExcluir}>
          <Text style={styles.btnExcluirTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.conteudo}>

        {/* Título com indicador de prioridade */}
        <View style={styles.tituloLinha}>
          {lembrete.prioridade && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: corPrioridade[lembrete.prioridade] }} />}
          <Text style={[styles.titulo, lembrete.concluido && styles.tituloConcluido]}>{lembrete.titulo}</Text>
        </View>

        {lembrete.prioridade && (
          <View style={styles.prioridadeBadge}>
            <Text style={[styles.prioridadeTexto, { color: corPrioridade[lembrete.prioridade] }]}>Prioridade {lembrete.prioridade}</Text>
          </View>
        )}

        {lembrete.notas ? <Text style={styles.notas}>{lembrete.notas}</Text> : null}

        {/* Seção de detalhes — só mostra campos que foram preenchidos */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Detalhes</Text>
          <View style={styles.infoLinha}>
            <Feather name="calendar" size={16} color={cores.textoClaro} />
            <Text style={styles.infoTexto}>{lembrete.dataHora?.split(' ')[0] || lembrete.dataHora}</Text>
          </View>
{lembrete.dataHora?.includes(' ') && (
  <>
    <View style={styles.divisor} />
    <View style={styles.infoLinha}>
      <Feather name="clock" size={16} color={cores.textoClaro} />
      <Text style={styles.infoTexto}>{lembrete.dataHora.split(' ')[1]}</Text>
    </View>
  </>
)}
          {lembrete.local ? (<><View style={styles.divisor} /><View style={styles.infoLinha}><Feather name="map-pin" size={16} color={cores.textoClaro} /><Text style={styles.infoTexto}>{lembrete.local}</Text></View></>) : null}
          {lembrete.categoria ? (<><View style={styles.divisor} /><View style={styles.infoLinha}><Feather name="tag" size={16} color={cores.textoClaro} /><Text style={styles.infoTexto}>{lembrete.categoria}</Text></View></>) : null}
          {lembrete.url ? (<><View style={styles.divisor} /><View style={styles.infoLinha}><Feather name="link" size={16} color={cores.textoClaro} /><Text style={styles.infoTexto}>{lembrete.url}</Text></View></>) : null}
          {lembrete.antecipacao ? (
            <><View style={styles.divisor} /><View style={styles.infoLinha}><Feather name="bell" size={16} color={cores.textoClaro} /><Text style={styles.infoTexto}>{typeof lembrete.antecipacao === 'object' ? `${lembrete.antecipacao.valor} ${lembrete.antecipacao.unidade} antes` : lembrete.antecipacao}</Text></View></>
          ) : null}
          {lembrete.repeticao ? (
            <><View style={styles.divisor} /><View style={styles.infoLinha}><Feather name="repeat" size={16} color={cores.textoClaro} /><Text style={styles.infoTexto}>{typeof lembrete.repeticao === 'object' ? `A cada ${lembrete.repeticao.valor} ${lembrete.repeticao.unidade}` : lembrete.repeticao}</Text></View></>
          ) : null}
        </View>

        {/* Seção de subtarefas */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Subtarefas</Text>
          {subtarefas.map((s, index) => (
            <View key={s.id}>
              {index > 0 && <View style={styles.divisor} />}
              <View style={styles.subtarefaItem}>
                <TouchableOpacity style={[styles.subtarefaCheck, s.concluida && styles.subtarefaCheckAtivo]} onPress={() => handleConcluirSubtarefa(s.id)}>
                  {s.concluida && <Feather name="check" size={12} color={cores.fundo} />}
                </TouchableOpacity>
                <Text style={[styles.subtarefaTexto, s.concluida && styles.subtarefaTextoConcluida]}>{s.titulo}</Text>
                <TouchableOpacity onPress={() => handleExcluirSubtarefa(s.id)}>
                  <Feather name="x" size={16} color={cores.textoClaro} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {subtarefas.length > 0 && <View style={styles.divisor} />}
          {/* Campo para adicionar nova subtarefa */}
          <View style={styles.adicionarLinha}>
            <TextInput style={styles.adicionarInput} value={novaSubtarefa} onChangeText={setNovaSubtarefa} placeholder="Adicionar subtarefa..." placeholderTextColor={cores.textoClaro} onSubmitEditing={handleAdicionarSubtarefa} />
            <TouchableOpacity style={styles.adicionarBtn} onPress={handleAdicionarSubtarefa}>
              <Feather name="plus" size={16} color={cores.fundo} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('CriarLembrete', { lembrete })}>
          <Text style={styles.botaoTexto}>Editar lembrete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoSecundario} onPress={() => navigation.goBack()}>
          <Text style={styles.botaoSecundarioTexto}>Voltar</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}