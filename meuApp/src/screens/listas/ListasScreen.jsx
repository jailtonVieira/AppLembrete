// ListasScreen.jsx
// Tela para criar, editar, excluir e selecionar listas

import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useTema } from '../../hooks/useTema';
import { useListas } from '../../context/ListasContext';

const coresDisponiveis = [
  '#E53935', '#D81B60', '#8E24AA', '#3949AB',
  '#1E88E5', '#00ACC1', '#00897B', '#43A047',
  '#C0CA33', '#FB8C00', '#F4511E', '#6D4C41',
];

const iconesDisponiveis = [
  { nome: 'list' }, { nome: 'briefcase' }, { nome: 'book' },
  { nome: 'home' }, { nome: 'heart' }, { nome: 'star' },
  { nome: 'shopping-cart' }, { nome: 'activity' }, { nome: 'target' },
  { nome: 'music' }, { nome: 'camera' }, { nome: 'map-pin' },
  { nome: 'dollar-sign' }, { nome: 'coffee' }, { nome: 'sun' },
  { nome: 'globe' }, { nome: 'users' }, { nome: 'gift' },
  { nome: 'flag' }, { nome: 'tool' },
];

export default function ListasScreen({ navigation }) {
  const { cores, fontes } = useTema();
  const { listas, adicionarLista, editarLista, excluirListas } = useListas();

  const [modalAberto, setModalAberto] = useState(false);
  const [listaSelecionada, setListaSelecionada] = useState(null);
  const [nome, setNome] = useState('');
  const [corSelecionada, setCorSelecionada] = useState(coresDisponiveis[0]);
  const [iconeSelecionado, setIconeSelecionado] = useState('list');

  // Controle do modo de seleção
  const [modoSelecao, setModoSelecao] = useState(false);
  const [selecionadas, setSelecionadas] = useState([]);

  function handleNovaLista() {
    setListaSelecionada(null);
    setNome('');
    setCorSelecionada(coresDisponiveis[0]);
    setIconeSelecionado('list');
    setModalAberto(true);
  }

  function handleEditarLista(lista) {
    setListaSelecionada(lista);
    setNome(lista.nome);
    setCorSelecionada(lista.cor);
    setIconeSelecionado(lista.icone || 'list');
    setModalAberto(true);
  }

  function handleSalvar() {
    if (!nome.trim()) return Alert.alert('Atenção', 'Digite um nome para a lista');
    const dados = { nome: nome.trim(), cor: corSelecionada, icone: iconeSelecionado };
    if (listaSelecionada) { editarLista(listaSelecionada.id, dados); } else { adicionarLista(dados); }
    setModalAberto(false);
  }

  // Alterna seleção de uma lista
  function toggleSelecao(id) {
    setSelecionadas(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  // Seleciona ou desmarca todas
  function toggleSelecionarTodas() {
    if (selecionadas.length === listas.length) {
      setSelecionadas([]);
    } else {
      setSelecionadas(listas.map(l => l.id));
    }
  }

  function handleExcluirSelecionadas() {
    if (selecionadas.length === 0) return;
    Alert.alert(
      'Mover para lixeira',
      `Mover ${selecionadas.length} lista(s) para a lixeira?`,
      [
        { text: 'Cancelar' },
        { text: 'Mover', style: 'destructive', onPress: () => {
          excluirListas(selecionadas);
          setSelecionadas([]);
          setModoSelecao(false);
        }},
      ]
    );
  }

  function handleCancelarSelecao() {
    setSelecionadas([]);
    setModoSelecao(false);
  }

  const todasSelecionadas = selecionadas.length === listas.length && listas.length > 0;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 12, },
    titulo: { fontSize: 28, fontFamily: fontes.negrito, color: cores.texto },
    headerAcoes: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    btnIcone: { width: 36, height: 36, borderRadius: 18, backgroundColor: cores.fundoCard, borderWidth: 1, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
    btnNova: { width: 36, height: 36, borderRadius: 18, backgroundColor: cores.primaria, alignItems: 'center', justifyContent: 'center' },
    // Barra de seleção
    barraSelecao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: cores.fundoCard, borderBottomWidth: 1, borderBottomColor: cores.borda },
    barraSelecaoTexto: { fontSize: 14, fontFamily: fontes.medio, color: cores.texto },
    barraSelecaoAcoes: { flexDirection: 'row', gap: 16 },
    btnSelecaoAcao: { fontSize: 14, fontFamily: fontes.medio, color: cores.primaria, marginRight: 5 },
    btnSelecaoPerigo: { fontSize: 14, fontFamily: fontes.medio, color: cores.erro },
    lista: { padding: 16, paddingTop: 8 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: cores.fundoCard, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: cores.borda, gap: 12 },
    cardSelecionado: { borderColor: cores.primaria, backgroundColor: cores.primaria + '10' },
    cardIcone: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    cardNome: { flex: 1, fontSize: 16, fontFamily: fontes.medio, color: cores.texto },
    cardAcoes: { flexDirection: 'row', gap: 12 },
    // Checkbox de seleção
    checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
    checkboxAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
    vazio: { textAlign: 'center', color: cores.textoClaro, fontFamily: fontes.regular, marginTop: 40, fontSize: 15 },
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalConteudo: { backgroundColor: cores.fundoCard, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitulo: { fontSize: 18, fontFamily: fontes.negrito, color: cores.texto },
    modalCancelar: { fontSize: 15, fontFamily: fontes.medio, color: cores.erro },
    label: { fontSize: 12, fontFamily: fontes.medio, color: cores.textoClaro, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
    previewContainer: { alignItems: 'center', marginBottom: 20 },
    preview: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    input: { backgroundColor: cores.fundo, borderWidth: 1, borderColor: cores.borda, borderRadius: 10, padding: 14, fontSize: 16, fontFamily: fontes.regular, color: cores.texto, marginBottom: 20 },
    coresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    corOpcao: { width: 32, height: 32, borderRadius: 16 },
    corOpcaoAtiva: { borderWidth: 3, borderColor: cores.texto },
    iconesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    iconeOpcao: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.fundo, borderWidth: 1, borderColor: cores.borda },
    iconeOpcaoAtivo: { borderColor: cores.primaria, backgroundColor: cores.primaria },
    botao: { backgroundColor: cores.primaria, padding: 16, borderRadius: 12, alignItems: 'center' },
    botaoTexto: { color: cores.fundo, fontSize: 16, fontFamily: fontes.negrito },
  });

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.titulo}>Minhas listas</Text>
        <View style={s.headerAcoes}>
          {!modoSelecao && listas.length > 0 && (
            <TouchableOpacity style={s.btnIcone} onPress={() => setModoSelecao(true)}>
              <Feather name="check-square" size={18} color={cores.texto} />
            </TouchableOpacity>
          )}
          {!modoSelecao && (
            <TouchableOpacity style={s.btnNova} onPress={handleNovaLista}>
              <Feather name="plus" size={20} color={cores.fundo} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Barra de ações do modo seleção */}
      {modoSelecao && (
        <View style={s.barraSelecao}>
          <Text style={s.barraSelecaoTexto}>{selecionadas.length} selecionado</Text>
          <View style={s.barraSelecaoAcoes}>
            <TouchableOpacity onPress={toggleSelecionarTodas}>
              <Text style={s.btnSelecaoAcao}>{todasSelecionadas ? 'Desmarcar todas' : 'Selecionar todas'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExcluirSelecionadas}>
              <Text style={s.btnSelecaoPerigo}>Remover listas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelarSelecao}>
              <Text style={s.btnSelecaoAcao}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={listas}
        keyExtractor={item => item.id}
        contentContainerStyle={s.lista}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.card, modoSelecao && selecionadas.includes(item.id) && s.cardSelecionado]}
            onPress={() => modoSelecao ? toggleSelecao(item.id) : navigation.navigate('LembretesLista', { lista: item })}
            onLongPress={() => { setModoSelecao(true); toggleSelecao(item.id); }}
          >
            {/* Checkbox visível no modo seleção */}
            {modoSelecao && (
              <View style={[s.checkbox, selecionadas.includes(item.id) && s.checkboxAtivo]}>
                {selecionadas.includes(item.id) && <Feather name="check" size={13} color="#fff" />}
              </View>
            )}
            <View style={[s.cardIcone, { backgroundColor: item.cor }]}>
              <Feather name={item.icone || 'list'} size={18} color="#fff" />
            </View>
            <Text style={s.cardNome}>{item.nome}</Text>
            {!modoSelecao && (
              <View style={s.cardAcoes}>
                <TouchableOpacity onPress={() => handleEditarLista(item)}>
                  <Feather name="edit-2" size={18} color={cores.textoClaro} />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={s.vazio}>Nenhuma lista criada ainda.</Text>}
      />

      <Modal visible={modalAberto} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={s.modalConteudo}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitulo}>{listaSelecionada ? 'Editar lista' : 'Nova lista'}</Text>
                <TouchableOpacity onPress={() => setModalAberto(false)}>
                  <Text style={s.modalCancelar}>Cancelar</Text>
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* Preview */}
                <View style={s.previewContainer}>
                  <View style={[s.preview, { backgroundColor: corSelecionada }]}>
                    <Feather name={iconeSelecionado} size={28} color="#fff" />
                  </View>
                </View>

                <Text style={s.label}>Nome</Text>
                <TextInput style={s.input} value={nome} onChangeText={setNome} placeholder="Ex: Faculdade, Compras..." placeholderTextColor={cores.textoClaro} />

                <Text style={s.label}>Cor</Text>
                <View style={s.coresContainer}>
                  {coresDisponiveis.map(cor => (
                    <TouchableOpacity key={cor} style={[s.corOpcao, { backgroundColor: cor }, corSelecionada === cor && s.corOpcaoAtiva]} onPress={() => setCorSelecionada(cor)} />
                  ))}
                </View>

                <Text style={s.label}>Ícone</Text>
                <View style={s.iconesContainer}>
                  {iconesDisponiveis.map(icone => (
                    <TouchableOpacity key={icone.nome} style={[s.iconeOpcao, iconeSelecionado === icone.nome && s.iconeOpcaoAtivo]} onPress={() => setIconeSelecionado(icone.nome)}>
                      <Feather name={icone.nome} size={20} color={iconeSelecionado === icone.nome ? '#fff' : cores.textoClaro} />
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={s.botao} onPress={handleSalvar}>
                  <Text style={s.botaoTexto}>{listaSelecionada ? 'Salvar alterações' : 'Criar lista'}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
