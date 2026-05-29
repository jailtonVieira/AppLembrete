// HomeScreen.jsx
// Tela principal do app — lista todos os lembretes com filtros, busca rápida e menu de opções

import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Modal, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useContext } from 'react';
import { Feather } from '@expo/vector-icons';
import { useTema } from '../../hooks/useTema';
import { useLembretes } from '../../context/LembretesContext';
import { AuthContext } from '../../context/AuthContext';
import { useListas } from '../../context/ListasContext';
import { useTemaContext } from '../../context/TemaContext';

// Verifica se a data de um lembrete é hoje
function ehHoje(dataHoraStr) {
  const hoje = new Date();
  const partes = dataHoraStr.split(' ')[0].split('/');
  const data = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
  return (
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear()
  );
}

export default function HomeScreen({ navigation }) {
  const { cores, fontes } = useTema();
  const { lembretes, concluir, excluir } = useLembretes();
  const { usuario, logout } = useContext(AuthContext);
  const { listas } = useListas();

  const [filtro, setFiltro] = useState('todos');
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [textoBusca, setTextoBusca] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const { modoEscuro, alternarTema } = useTemaContext();

  // Listas derivadas usadas pelos cards de resumo e filtros
  const hoje = lembretes.filter(l => ehHoje(l.dataHora));
  const programados = lembretes.filter(l => !l.concluido);
  const concluidos = lembretes.filter(l => l.concluido);

  const cards = [
    { id: 'hoje', label: 'Hoje', count: hoje.length },
    { id: 'programados', label: 'Programados', count: programados.length },
    { id: 'concluidos', label: 'Concluídos', count: concluidos.length },
    { id: 'todos', label: 'Todos', count: lembretes.length },
  ];

  // Se a busca estiver aberta filtra por texto, senão filtra pela categoria selecionada
  function lembretesFiltrados() {
    if (buscaAberta && textoBusca.length > 0) {
      return lembretes.filter(l =>
        l.titulo.toLowerCase().includes(textoBusca.toLowerCase()) ||
        l.local?.toLowerCase().includes(textoBusca.toLowerCase()) ||
        l.categoria?.toLowerCase().includes(textoBusca.toLowerCase()) ||
        l.notas?.toLowerCase().includes(textoBusca.toLowerCase())
      );
    }
    if (filtro === 'hoje') return hoje;
    if (filtro === 'programados') return programados;
    if (filtro === 'concluidos') return concluidos;
    return lembretes;
  }

  function handleExcluir(id) {
    Alert.alert('Excluir', 'Mover para a lixeira?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: () => excluir(id) },
    ]);
  }

  function fecharBusca() {
    setBuscaAberta(false);
    setTextoBusca('');
  }

  function handleSair() {
    setMenuAberto(false);
    Alert.alert('Sair', 'Deseja sair da conta?', [
      { text: 'Cancelar' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  }

  function handleMudarIdioma() {
    setMenuAberto(false);
    Alert.alert('Idioma', 'Função disponível em breve.');
  }

  // Pega a inicial do nome do usuário para o avatar
  const inicialUsuario = usuario?.nome?.charAt(0).toUpperCase() || 'U';
  const corPrioridade = { alta: '#E53935', media: '#FB8C00', baixa: '#43A047' };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 },
    headerEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: cores.primaria, alignItems: 'center', justifyContent: 'center' },
    avatarTexto: { color: cores.fundo, fontSize: 16, fontFamily: fontes.negrito },
    headerTextos: { flex: 1 },
    titulo: { fontSize: 22, fontFamily: fontes.negrito, color: cores.texto },
    subtitulo: { fontSize: 13, fontFamily: fontes.regular, color: cores.textoClaro, marginTop: 1 },
    headerDireita: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    btnIcone: { width: 36, height: 36, borderRadius: 18, backgroundColor: cores.fundoCard, borderWidth: 1, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
    buscaContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12, backgroundColor: cores.fundoCard, borderRadius: 10, borderWidth: 1, borderColor: cores.borda, paddingHorizontal: 12 },
    buscaInput: { flex: 1, padding: 12, fontSize: 16, fontFamily: fontes.regular, color: cores.texto },
    buscaCancelar: { fontSize: 15, fontFamily: fontes.medio, color: cores.texto, paddingLeft: 8 },
    cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, marginBottom: 8 },
    card: { width: '47%', backgroundColor: cores.fundoCard, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: cores.borda },
    cardAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
    cardCount: { fontSize: 22, fontFamily: fontes.negrito, color: cores.texto, marginBottom: 2 },
    cardCountAtivo: { color: cores.fundo },
    cardLabel: { fontSize: 13, fontFamily: fontes.regular, color: cores.textoClaro },
    cardLabelAtivo: { color: cores.fundo },
    listasContainer: { paddingHorizontal: 16, marginBottom: 8 },
    listasTitulo: { fontSize: 13, fontFamily: fontes.medio, color: cores.textoClaro, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
    listaItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: cores.fundoCard, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: cores.borda, gap: 12 },
    listaIcone: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    listaNome: { flex: 1, fontSize: 15, fontFamily: fontes.medio, color: cores.texto },
    listaDir: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    listaCount: { fontSize: 14, fontFamily: fontes.regular, color: cores.textoClaro },
    lista: { padding: 16, paddingTop: 8 },
    lembreteCard: { backgroundColor: cores.fundoCard, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: cores.borda },
    cardTopo: { flexDirection: 'row', justifyContent:'space-between', alignItems: 'flex-start' },
    tituloLinha: {flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', flex: 1,
},
    cardTitulo: { fontSize: 16, fontFamily: fontes.medio, color: cores.texto, flexShrink: 1, marginRight: 8 },
    cardTituloConcluido: { textDecorationLine: 'line-through', color: cores.textoClaro },
    cardInfoLinha: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    cardInfo: { fontSize: 13, fontFamily: fontes.regular, color: cores.textoClaro },
    tagHoje: { backgroundColor: '#111', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 6 },
    tagHojeTexto: { fontSize: 11, fontFamily: fontes.medio, color: '#fff' },
    badge: { backgroundColor: cores.fundo, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 8, borderWidth: 1, borderColor: cores.borda },
    badgeTexto: { fontSize: 12, fontFamily: fontes.regular, color: cores.textoClaro },
    acoes: { flexDirection: 'row', gap: 8 },
    btnCheck: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: cores.primaria, alignItems: 'center', justifyContent: 'center' },
    btnCheckAtivo: { backgroundColor: cores.primaria },
    btnExcluir: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
    vazio: { textAlign: 'center', color: cores.textoClaro, fontFamily: fontes.regular, marginTop: 40, fontSize: 15 },
    fab: { position: 'absolute', bottom: 24, right: 24, backgroundColor: cores.primaria, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start', alignItems: 'flex-end' },
    menuContainer: { backgroundColor: cores.fundoCard, borderRadius: 14, marginTop: 90, marginRight: 16, width: 220, borderWidth: 1, borderColor: cores.borda, overflow: 'hidden' },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: cores.borda },
    menuItemUltimo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    menuItemEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    menuTexto: { fontSize: 15, fontFamily: fontes.regular, color: cores.texto },
    menuTextoPerigo: { fontSize: 15, fontFamily: fontes.regular, color: cores.erro },
  });

  return (
    <SafeAreaView style={styles.container}>

      {/* Header com avatar, título e botões de busca e menu */}
      <View style={styles.header}>
        <View style={styles.headerEsquerda}>
          {/* Avatar com inicial do usuário — toque leva para o perfil */}
          <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Perfil')}>
            <Text style={styles.avatarTexto}>{inicialUsuario}</Text>
          </TouchableOpacity>
          <View style={styles.headerTextos}>
            <Text style={styles.titulo}>Meus lembretes</Text>
          </View>
        </View>
        <View style={styles.headerDireita}>
          <TouchableOpacity style={styles.btnIcone} onPress={() => setBuscaAberta(!buscaAberta)}>
            <Feather name="search" size={18} color={cores.texto} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnIcone} onPress={() => setMenuAberto(true)}>
            <Feather name="more-vertical" size={18} color={cores.texto} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de busca — aparece ao tocar no ícone de lupa */}
      {buscaAberta && (
        <View style={styles.buscaContainer}>
          <Feather name="search" size={16} color={cores.textoClaro} style={{ marginRight: 8 }} />
          <TextInput style={styles.buscaInput} value={textoBusca} onChangeText={setTextoBusca} placeholder="Buscar lembretes..." placeholderTextColor={cores.textoClaro} autoFocus />
          <TouchableOpacity onPress={fecharBusca}>
            <Text style={styles.buscaCancelar}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista principal com header de cards e listas */}
      <FlatList
        data={lembretesFiltrados()}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={!buscaAberta ? (
          <>
            {/* Cards de resumo — filtros rápidos */}
            <View style={styles.cardsContainer}>
              {cards.map(c => (
                <TouchableOpacity key={c.id} style={[styles.card, filtro === c.id && styles.cardAtivo]} onPress={() => setFiltro(c.id)}>
                  <Text style={[styles.cardCount, filtro === c.id && styles.cardCountAtivo]}>{c.count}</Text>
                  <Text style={[styles.cardLabel, filtro === c.id && styles.cardLabelAtivo]}>{c.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Listas do usuário — igual ao app de lembretes do iOS */}
            {listas.length > 0 && (
              <View style={styles.listasContainer}>
                <Text style={styles.listasTitulo}>Minhas listas</Text>
                {listas.map(lista => (
                  <TouchableOpacity key={lista.id} style={styles.listaItem} onPress={() => navigation.navigate('LembretesLista', { lista })}>
                    <View style={[styles.listaIcone, { backgroundColor: lista.cor }]}>
                      <Feather name={lista.icone || 'list'} size={16} color="#fff" />
                    </View>
                    <Text style={styles.listaNome}>{lista.nome}</Text>
                    <View style={styles.listaDir}>
                      <Text style={styles.listaCount}>{lembretes.filter(l => l.listaId === lista.id).length}</Text>
                      <Feather name="chevron-right" size={16} color={cores.textoClaro} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        ) : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.lembreteCard}
            onPress={() => navigation.navigate('DetalhesLembrete', { lembrete: item })}
          >
            
            <View style={styles.cardTopo}>
              <View style={{ flex: 1 }}>
               <View style={styles.tituloLinha}>
              <Text
                style={[styles.cardTitulo, item.concluido && styles.cardTituloConcluido]}
                numberOfLines={1}
              >
                {item.titulo}
              </Text>
              {item.prioridade && (
                <View style={{
                  backgroundColor: corPrioridade[item.prioridade] + '25',
                  borderRadius: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                  borderWidth: 1,
                  marginRight: 20, // para garantir que fique do lado direito, mesmo com títulos longos
                  borderColor: corPrioridade[item.prioridade],
                }}>
                  <Text style={{
                    fontSize: 11,
                    fontFamily: fontes.medio,
                    color: corPrioridade[item.prioridade],
                  }}>
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
                {item.local ? <View style={styles.cardInfoLinha}><Feather name="map-pin" size={12} color={cores.textoClaro} /><Text style={styles.cardInfo}>{item.local}</Text></View> : null}
                {ehHoje(item.dataHora) && !item.concluido && <View style={styles.tagHoje}><Text style={styles.tagHojeTexto}>Hoje</Text></View>}
                {item.categoria ? <View style={styles.badge}><Text style={styles.badgeTexto}>{item.categoria}</Text></View> : null}
              </View>
              {/* Botões de concluir e excluir */}
              <View style={styles.acoes}>
                <TouchableOpacity style={[styles.btnCheck, item.concluido && styles.btnCheckAtivo]} onPress={() => concluir(item.id)}>
                  {item.concluido && <Feather name="check" size={14} color={cores.fundo} />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnExcluir} onPress={() => handleExcluir(item.id)}>
                  <Feather name="x" size={14} color={cores.textoClaro} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>{buscaAberta && textoBusca.length > 0 ? 'Nenhum resultado encontrado' : 'Nenhum lembrete nessa categoria'}</Text>}
      />

      {/* Botão flutuante para criar novo lembrete */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CriarLembrete')}>
        <Feather name="plus" size={28} color={cores.fundo} />
      </TouchableOpacity>

      {/* Menu de três pontos */}
      <Modal visible={menuAberto} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuAberto(false)}>
          <View style={styles.menuContainer}>

            {/* Mudar idioma */}
            <TouchableOpacity style={styles.menuItem} onPress={handleMudarIdioma}>
              <View style={styles.menuItemEsquerda}>
                <Feather name="globe" size={18} color={cores.texto} />
                <Text style={styles.menuTexto}>Mudar idioma</Text>
              </View>
              <Feather name="chevron-right" size={16} color={cores.textoClaro} />
            </TouchableOpacity>

            {/* Abrir perfil */}
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuAberto(false); navigation.navigate('Perfil'); }}>
              <View style={styles.menuItemEsquerda}>
                <Feather name="user" size={18} color={cores.texto} />
                <Text style={styles.menuTexto}>Meu perfil</Text>
              </View>
              <Feather name="chevron-right" size={16} color={cores.textoClaro} />
            </TouchableOpacity>

            {/* Modo escuro / claro */}
            <View style={styles.menuItem}>
            <View style={styles.menuItemEsquerda}>
              <Feather name={modoEscuro ? 'moon' : 'sun'} size={18} color={cores.texto} />
              <Text style={styles.menuTexto}>{modoEscuro ? 'Modo escuro' : 'Modo claro'}</Text>
            </View>
            <Switch
              value={modoEscuro}
              onValueChange={alternarTema}
              trackColor={{ false: cores.borda, true: cores.primaria }}
              thumbColor={cores.fundo}
            />
          </View>

            {/* Sair da conta */}
            <TouchableOpacity style={styles.menuItemUltimo} onPress={handleSair}>
              <View style={styles.menuItemEsquerda}>
                <Feather name="log-out" size={18} color={cores.erro} />
                <Text style={styles.menuTextoPerigo}>Sair da conta</Text>
              </View>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}