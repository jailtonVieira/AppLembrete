// CriarLembreteScreen.jsx
// Tela para criar um novo lembrete

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTema } from '../../hooks/useTema';
import { useLembretes } from '../../context/LembretesContext';

const opcoesAntecipacao = [
  { id: '5min', label: '5 minutos antes' },
  { id: '10min', label: '10 minutos antes' },
  { id: '30min', label: '30 minutos antes' },
  { id: '1h', label: '1 hora antes' },
  { id: '2h', label: '2 horas antes' },
  { id: '1d', label: '1 dia antes' },
  { id: '2d', label: '2 dias antes' },
  { id: '1s', label: '1 semana antes' },
  { id: '1m', label: '1 mês antes' },
  { id: 'personalizado', label: 'Personalizado' },
];

const opcoesRepeticao = [
  { id: 'hora', label: 'A cada hora' },
  { id: 'diario', label: 'Diariamente' },
  { id: 'diasSemana', label: 'Dias de semana' },
  { id: 'fimSemana', label: 'Fins de semana' },
  { id: 'semanal', label: 'Semanalmente' },
  { id: 'quinzenal', label: 'Quinzenalmente' },
  { id: 'mensal', label: 'Mensalmente' },
  { id: '3meses', label: 'A cada 3 meses' },
  { id: '6meses', label: 'A cada 6 meses' },
  { id: 'personalizado', label: 'Personalizado' },
];

export default function CriarLembreteScreen({ navigation, route }) {
  const { cores, fontes, modoEscuro } = useTema();
  const { adicionar } = useLembretes();

  const [titulo, setTitulo] = useState('');
  const [notas, setNotas] = useState('');
  const [categoria, setCategoria] = useState('');
  const [url, setUrl] = useState('');
  const [prioridade, setPrioridade] = useState(null);
  const [antecipacao, setAntecipacao] = useState(null);
  const [repeticao, setRepeticao] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});
  const [listaId] = useState(route.params?.listaId || null);

  const [data, setData] = useState(null);
  const [hora, setHora] = useState(null);
  const [dataTemp, setDataTemp] = useState(new Date());
  const [horaTemp, setHoraTemp] = useState(new Date());
  const [mostrarData, setMostrarData] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);

  const [modalAntecipacao, setModalAntecipacao] = useState(false);
  const [modalRepeticao, setModalRepeticao] = useState(false);
  const [antecipacaoPersonalizada, setAntecipacaoPersonalizada] = useState({ valor: '', unidade: 'minutos' });
  const [repeticaoPersonalizada, setRepeticaoPersonalizada] = useState({ valor: '', unidade: 'dias' });

  const unidadesAntecipacao = ['minutos', 'horas', 'dias', 'semanas', 'meses'];
  const unidadesRepeticao = ['horas', 'dias', 'semanas', 'meses'];

  const prioridades = [
    { id: 'baixa', label: 'Baixa', cor: '#10B981' },
    { id: 'media', label: 'Média', cor: '#F59E0B' },
    { id: 'alta', label: 'Alta', cor: '#EF4444' },
  ];

  function formatarData(d) {
    if (!d) return null;
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  function formatarHora(h) {
    if (!h) return null;
    return `${String(h.getHours()).padStart(2, '0')}:${String(h.getMinutes()).padStart(2, '0')}`;
  }

  // CORREÇÃO DO BUG — função que estava faltando
  function dataHoraFormatada() {
    if (!data && !hora) return null;
    if (data && !hora) return formatarData(data);
    if (!data && hora) return formatarHora(hora);
    return `${formatarData(data)} ${formatarHora(hora)}`;
  }

  function labelAntecipacao() {
    if (!antecipacao) return 'Nenhuma';
    if (antecipacao === 'personalizado') return antecipacaoPersonalizada.valor ? `${antecipacaoPersonalizada.valor} ${antecipacaoPersonalizada.unidade} antes` : 'Personalizado';
    return opcoesAntecipacao.find(o => o.id === antecipacao)?.label || 'Nenhuma';
  }

  function labelRepeticao() {
    if (!repeticao) return 'Nunca';
    if (repeticao === 'personalizado') return repeticaoPersonalizada.valor ? `A cada ${repeticaoPersonalizada.valor} ${repeticaoPersonalizada.unidade}` : 'Personalizado';
    return opcoesRepeticao.find(o => o.id === repeticao)?.label || 'Nunca';
  }

  function validar() {
    const novosErros = {};
    if (!titulo) novosErros.titulo = 'Título obrigatório';
    if (!data && !hora) novosErros.dataHora = 'Data e hora obrigatórias';
    if (url && !url.startsWith('http')) novosErros.url = 'URL inválida, comece com http://';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSalvar() {
    if (!validar()) return;
    setCarregando(true);
    try {
      adicionar({
        titulo,
        notas,
        dataHora: dataHoraFormatada(),
        categoria,
        url,
        prioridade,
        listaId,
        antecipacao: antecipacao === 'personalizado' ? antecipacaoPersonalizada : antecipacao,
        repeticao: repeticao === 'personalizado' ? repeticaoPersonalizada : repeticao,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o lembrete');
    } finally {
      setCarregando(false);
    }
  }

  function ModalSelecao({ visivel, titulo, opcoes, valorAtual, onSelecionar, onFechar, personalizado, setPersonalizado, unidades }) {
    return (
      <Modal visible={visivel} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalConteudo}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>{titulo}</Text>
              <TouchableOpacity onPress={onFechar}><Text style={styles.modalFechar}>Fechar</Text></TouchableOpacity>
            </View>
            <ScrollView>
              {opcoes.map(op => (
                <TouchableOpacity key={op.id} style={styles.opcaoItem} onPress={() => { onSelecionar(op.id); if (op.id !== 'personalizado') onFechar(); }}>
                  <Text style={styles.opcaoTexto}>{op.label}</Text>
                  {valorAtual === op.id && <Feather name="check" size={16} color={cores.primaria} />}
                </TouchableOpacity>
              ))}
              {valorAtual === 'personalizado' && (
                <View style={styles.personalizado}>
                  <Text style={styles.personalizadoTitulo}>Definir intervalo</Text>
                  <TextInput style={styles.personalizadoInput} value={personalizado.valor} onChangeText={v => setPersonalizado(prev => ({ ...prev, valor: v }))} placeholder="Ex: 3" placeholderTextColor={cores.textoClaro} keyboardType="numeric" />
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                    {unidades.map(u => (
                      <TouchableOpacity key={u} style={[styles.unidadeBtn, personalizado.unidade === u && styles.unidadeBtnAtivo]} onPress={() => setPersonalizado(prev => ({ ...prev, unidade: u }))}>
                        <Text style={[styles.unidadeTexto, personalizado.unidade === u && styles.unidadeTextoAtivo]}>{u}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity style={styles.confirmarBtn} onPress={onFechar}>
                    <Text style={styles.confirmarTexto}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    conteudo: { padding: 24, paddingBottom: 40 },
    secao: { backgroundColor: cores.fundoCard, borderRadius: 14, borderWidth: 1, borderColor: cores.borda, marginBottom: 16, overflow: 'hidden' },
    secaoTitulo: { fontSize: 11, fontFamily: fontes.medio, color: cores.textoClaro, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
    input: { padding: 14, paddingTop: 8, fontSize: 16, fontFamily: fontes.regular, color: cores.texto },
    inputArea: { height: 120, textAlignVertical: 'top', paddingTop: 8 },
    divisor: { height: 1, backgroundColor: cores.borda, marginHorizontal: 16 },
    textoErro: { fontSize: 12, color: cores.erro, marginTop: -10, marginBottom: 12, paddingHorizontal: 4 },
    prioridadeContainer: { flexDirection: 'row', padding: 12, gap: 8 },
    prioridadeBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: cores.borda, backgroundColor: cores.fundo },
    prioridadeTexto: { fontSize: 13, fontFamily: fontes.medio, color: cores.textoClaro, marginTop: 4 },
    seletorBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    seletorLabel: { fontSize: 16, fontFamily: fontes.regular, color: cores.texto },
    seletorValor: { fontSize: 15, fontFamily: fontes.regular, color: cores.textoClaro },
    botao: { backgroundColor: cores.primaria, padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
    botaoTexto: { color: '#FFFFFF', fontSize: 16, fontFamily: fontes.negrito },
    botaoSecundario: { padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: cores.borda },
    botaoSecundarioTexto: { color: cores.texto, fontSize: 16, fontFamily: fontes.medio },
    modal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalConteudo: { backgroundColor: cores.fundoCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: cores.borda },
    modalTitulo: { fontSize: 17, fontFamily: fontes.negrito, color: cores.texto },
    modalFechar: { fontSize: 16, fontFamily: fontes.medio, color: cores.erro },
    opcaoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: cores.borda },
    opcaoTexto: { fontSize: 16, fontFamily: fontes.regular, color: cores.texto },
    personalizado: { padding: 16 },
    personalizadoTitulo: { fontSize: 14, fontFamily: fontes.medio, color: cores.textoClaro, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
    personalizadoInput: { backgroundColor: cores.fundo, borderWidth: 1, borderColor: cores.borda, borderRadius: 10, padding: 12, fontSize: 16, color: cores.texto, fontFamily: fontes.regular },
    unidadeBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: cores.borda, backgroundColor: cores.fundo },
    unidadeBtnAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
    unidadeTexto: { fontSize: 13, fontFamily: fontes.medio, color: cores.textoClaro },
    unidadeTextoAtivo: { color: '#FFFFFF' },
    confirmarBtn: { backgroundColor: cores.primaria, margin: 16, padding: 14, borderRadius: 12, alignItems: 'center' },
    confirmarTexto: { color: '#FFFFFF', fontSize: 16, fontFamily: fontes.negrito },
    seletorContainer: { backgroundColor: cores.fundoCard, borderRadius: 14, borderWidth: 1, borderColor: cores.borda, marginBottom: 16, overflow: 'hidden' },
    seletorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: cores.borda },
    seletorTitulo: { fontSize: 15, fontFamily: fontes.negrito, color: cores.texto },
    seletorCancelar: { fontSize: 15, fontFamily: fontes.medio, color: cores.erro },
    seletorConfirmar: { fontSize: 15, fontFamily: fontes.negrito, color: cores.primaria },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Feather name="arrow-left" size={22} color={cores.texto} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: fontes.negrito, color: cores.texto }}>Novo lembrete</Text>
      </View>

      <ScrollView contentContainerStyle={styles.conteudo}>

        {/* Título e notas */}
        <View style={styles.secao}>
          <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Título" placeholderTextColor={cores.textoClaro} />
          <View style={styles.divisor} />
          <TextInput style={[styles.input, styles.inputArea]} value={notas} onChangeText={setNotas} placeholder="Notas / descrição (opcional)" placeholderTextColor={cores.textoClaro} multiline />
        </View>
        {erros.titulo && <Text style={styles.textoErro}>{erros.titulo}</Text>}

        {/* Data e hora */}
        <View style={styles.secao}>
          <TouchableOpacity style={styles.seletorBtn} onPress={() => setMostrarData(true)} disabled={mostrarHora}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Feather name="calendar" size={16} color={cores.textoClaro} />
              <Text style={styles.seletorLabel}>Data</Text>
            </View>
            <Text style={[styles.seletorValor, data && { color: cores.texto, fontFamily: fontes.medio }]}>{data ? formatarData(data) : 'Nenhuma ›'}</Text>
          </TouchableOpacity>
          <View style={styles.divisor} />
          <TouchableOpacity style={styles.seletorBtn} onPress={() => setMostrarHora(true)} disabled={mostrarData}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Feather name="clock" size={16} color={cores.textoClaro} />
              <Text style={styles.seletorLabel}>Hora</Text>
            </View>
            <Text style={[styles.seletorValor, hora && { color: cores.texto, fontFamily: fontes.medio }]}>{hora ? formatarHora(hora) : 'Nenhuma ›'}</Text>
          </TouchableOpacity>
        </View>
        {erros.dataHora && <Text style={styles.textoErro}>{erros.dataHora}</Text>}

        {/* Seletor de data */}
        {mostrarData && (
          Platform.OS === 'ios' ? (
            <View style={styles.seletorContainer}>
              <View style={styles.seletorHeader}>
                <TouchableOpacity onPress={() => setMostrarData(false)}><Text style={styles.seletorCancelar}>Cancelar</Text></TouchableOpacity>
                <Text style={styles.seletorTitulo}>Selecionar data</Text>
                <TouchableOpacity onPress={() => { setData(dataTemp); setMostrarData(false); }}><Text style={styles.seletorConfirmar}>Confirmar</Text></TouchableOpacity>
              </View>
              <DateTimePicker value={dataTemp} mode="date" display="spinner" onChange={(e, d) => { if (d) setDataTemp(d); }} minimumDate={new Date()} locale="pt-BR" textColor={cores.texto} />
            </View>
          ) : (
            <DateTimePicker value={dataTemp} mode="date" display="default" onChange={(e, d) => { setMostrarData(false); if (d) setData(d); }} minimumDate={new Date()} />
          )
        )}

        {/* Seletor de hora */}
        {mostrarHora && (
          Platform.OS === 'ios' ? (
            <View style={styles.seletorContainer}>
              <View style={styles.seletorHeader}>
                <TouchableOpacity onPress={() => setMostrarHora(false)}><Text style={styles.seletorCancelar}>Cancelar</Text></TouchableOpacity>
                <Text style={styles.seletorTitulo}>Selecionar hora</Text>
                <TouchableOpacity onPress={() => { setHora(horaTemp); setMostrarHora(false); }}><Text style={styles.seletorConfirmar}>Confirmar</Text></TouchableOpacity>
              </View>
              <DateTimePicker value={horaTemp} mode="time" display="spinner" onChange={(e, h) => { if (h) setHoraTemp(h); }} locale="pt-BR" textColor={cores.texto} />
            </View>
          ) : (
            <DateTimePicker value={horaTemp} mode="time" display="default" onChange={(e, h) => { setMostrarHora(false); if (h) setHora(h); }} />
          )
        )}

        {/* Antecipação e repetição */}
        <View style={styles.secao}>
          <TouchableOpacity style={styles.seletorBtn} onPress={() => setModalAntecipacao(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Feather name="bell" size={16} color={cores.textoClaro} />
              <Text style={styles.seletorLabel}>Lembrar antes</Text>
            </View>
            <Text style={styles.seletorValor}>{labelAntecipacao()} ›</Text>
          </TouchableOpacity>
          <View style={styles.divisor} />
          <TouchableOpacity style={styles.seletorBtn} onPress={() => setModalRepeticao(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Feather name="repeat" size={16} color={cores.textoClaro} />
              <Text style={styles.seletorLabel}>Repetir</Text>
            </View>
            <Text style={styles.seletorValor}>{labelRepeticao()} ›</Text>
          </TouchableOpacity>
        </View>

        {/* Prioridade */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Prioridade</Text>
          <View style={styles.prioridadeContainer}>
            {prioridades.map(p => (
              <TouchableOpacity key={p.id} style={[styles.prioridadeBtn, prioridade === p.id && { borderColor: p.cor, backgroundColor: p.cor }]} onPress={() => setPrioridade(prioridade === p.id ? null : p.id)}>
                <Feather name={p.id === 'alta' ? 'alert-circle' : p.id === 'media' ? 'alert-triangle' : 'info'} size={18} color={prioridade === p.id ? '#fff' : p.cor} />
                <Text style={[styles.prioridadeTexto, { color: prioridade === p.id ? '#fff' : p.cor }]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categoria e URL */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Categoria</Text>
          <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} placeholder="Ex: Trabalho, Saúde" placeholderTextColor={cores.textoClaro} />
          <View style={styles.divisor} />
          <Text style={styles.secaoTitulo}>URL</Text>
          <TextInput style={styles.input} value={url} onChangeText={setUrl} placeholder="https://" placeholderTextColor={cores.textoClaro} keyboardType="url" autoCapitalize="none" />
        </View>
        {erros.url && <Text style={styles.textoErro}>{erros.url}</Text>}

        <TouchableOpacity style={styles.botao} onPress={handleSalvar} disabled={carregando}>
          <Text style={styles.botaoTexto}>{carregando ? 'Salvando...' : 'Salvar lembrete'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoSecundario} onPress={() => navigation.goBack()}>
          <Text style={styles.botaoSecundarioTexto}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>

      <ModalSelecao visivel={modalAntecipacao} titulo="Lembrar antes" opcoes={opcoesAntecipacao} valorAtual={antecipacao} onSelecionar={setAntecipacao} onFechar={() => setModalAntecipacao(false)} personalizado={antecipacaoPersonalizada} setPersonalizado={setAntecipacaoPersonalizada} unidades={unidadesAntecipacao} />
      <ModalSelecao visivel={modalRepeticao} titulo="Repetir" opcoes={opcoesRepeticao} valorAtual={repeticao} onSelecionar={setRepeticao} onFechar={() => setModalRepeticao(false)} personalizado={repeticaoPersonalizada} setPersonalizado={setRepeticaoPersonalizada} unidades={unidadesRepeticao} />
    </SafeAreaView>
  );
}