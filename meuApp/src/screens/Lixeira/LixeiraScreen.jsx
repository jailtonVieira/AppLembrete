// LixeiraScreen.jsx
// Exibe os lembretes excluídos — o usuário pode restaurar ou apagar definitivamente

import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTema } from '../../hooks/useTema';
import { useLembretes } from '../../context/LembretesContext';

export default function LixeiraScreen() {
  const { cores, fontes } = useTema();
  const { lixeira, restaurar, excluirDefinitivo } = useLembretes();

  const corPrioridade = { alta: '#E53935', media: '#FB8C00', baixa: '#43A047' };

  function handleExcluirDefinitivo(id) {
    Alert.alert('Atenção', 'Excluir permanentemente? Não dá para desfazer.', [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => excluirDefinitivo(id),
      },
    ]);
  }

  function handleLimparTudo() {
    Alert.alert('Limpar lixeira', 'Excluir todos os itens permanentemente?', [
      { text: 'Cancelar' },
      {
        text: 'Limpar tudo',
        style: 'destructive',
        onPress: () => lixeira.forEach(l => excluirDefinitivo(l.id)),
      },
    ]);
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 24,
      paddingBottom: 12,
    },
    titulo: { fontSize: 28, fontFamily: fontes.negrito, color: cores.texto },
    btnLimpar: { fontSize: 15, fontFamily: fontes.medio, color: cores.erro },
    lista: { padding: 16 },
    card: {
      backgroundColor: cores.fundoCard,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: cores.borda,
    },
    cardTitulo: {
      fontSize: 16,
      fontFamily: fontes.medio,
      color: cores.textoClaro,
      marginBottom: 4,
    },
    cardInfoLinha: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    cardInfo: {
      fontSize: 13,
      fontFamily: fontes.regular,
      color: cores.textoClaro,
    },
    acoes: { flexDirection: 'row', gap: 10, marginTop: 12 },
    btnRestaurar: {
      flex: 1,
      backgroundColor: cores.primaria,
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: 'center',
    },
    btnExcluir: {
      flex: 1,
      backgroundColor: cores.fundo,
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: cores.erro,
    },
    btnRestaurarTexto: { color: cores.fundo, fontFamily: fontes.medio, fontSize: 14 },
    btnExcluirTexto: { color: cores.erro, fontFamily: fontes.medio, fontSize: 14 },
    vazio: {
      textAlign: 'center',
      color: cores.textoClaro,
      fontFamily: fontes.regular,
      marginTop: 16,
      fontSize: 15,
    },
    vazioContainer: {
      alignItems: 'center',
      marginTop: 60,
    },
  });

  return (
    <SafeAreaView style={styles.container}>

      {/* Header — botão "Limpar tudo" só aparece quando tem itens na lixeira */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Lixeira</Text>
        {lixeira.length > 0 && (
          <TouchableOpacity onPress={handleLimparTudo}>
            <Text style={styles.btnLimpar}>Limpar tudo</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={lixeira}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={[
            styles.card,
            // Mantém a barra de prioridade mesmo na lixeira
            item.prioridade && {
              borderLeftWidth: 4,
              borderLeftColor: corPrioridade[item.prioridade],
            },
          ]}>
            <Text style={styles.cardTitulo}>{item.titulo}</Text>

            <View style={styles.cardInfoLinha}>
              <Feather name="clock" size={12} color={cores.textoClaro} />
              <Text style={styles.cardInfo}>{item.dataHora}</Text>
            </View>

            {item.local ? (
              <View style={styles.cardInfoLinha}>
                <Feather name="map-pin" size={12} color={cores.textoClaro} />
                <Text style={styles.cardInfo}>{item.local}</Text>
              </View>
            ) : null}

            {/* Botões de ação */}
            <View style={styles.acoes}>
              <TouchableOpacity
                style={styles.btnRestaurar}
                onPress={() => restaurar(item.id)}
              >
                <Text style={styles.btnRestaurarTexto}>Restaurar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnExcluir}
                onPress={() => handleExcluirDefinitivo(item.id)}
              >
                <Text style={styles.btnExcluirTexto}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Feather name="trash-2" size={40} color={cores.textoClaro} />
            <Text style={styles.vazio}>Lixeira vazia.</Text>
          </View>
        }
      />

    </SafeAreaView>
  );
}
