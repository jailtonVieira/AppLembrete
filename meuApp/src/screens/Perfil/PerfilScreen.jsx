// PerfilScreen.jsx
// Tela de perfil do usuário com opção de foto

import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTema } from '../../hooks/useTema';
import { AuthContext } from '../../context/AuthContext';

export default function PerfilScreen({ navigation }) {
  const { cores, fontes } = useTema();
  const { usuario, logout, atualizarFoto, atualizarNome, removerFoto } = useContext(AuthContext);
  const [foto, setFoto] = useState(usuario?.foto || null);
  const [modalNome, setModalNome] = useState(false);
  const [novoNome, setNovoNome] = useState('');

  const inicialUsuario = usuario?.nome?.charAt(0).toUpperCase() || 'U';

  async function handleEscolherFoto() {
  Alert.alert('Foto de perfil', 'O que deseja fazer?', [
    { text: 'Cancelar' },
    {
      text: 'Remover foto',
      style: 'destructive',
      onPress: () => {
        setFoto(null);
        removerFoto();
      },
    },
    {
      text: 'Escolher foto',
      onPress: async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Precisamos de acesso à galeria para trocar a foto.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
        if (!result.canceled) {
          const uri = result.assets[0].uri;
          setFoto(uri);
          atualizarFoto(uri);
        }
      },
    },
  ]);
}

  function handleSair() {
    Alert.alert('Sair', 'Deseja sair da conta?', [
      { text: 'Cancelar' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    header: { flexDirection: 'row', alignItems: 'center', padding: 24, paddingBottom: 12, gap: 12 },
    btnVoltar: { width: 36, height: 36, borderRadius: 18, backgroundColor: cores.fundoCard, borderWidth: 1, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
    headerTitulo: { fontSize: 18, fontFamily: fontes.negrito, color: cores.texto },
    avatarContainer: { alignItems: 'center', paddingVertical: 32 },
    avatarWrapper: { position: 'relative', marginBottom: 16 },
    avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: cores.primaria, alignItems: 'center', justifyContent: 'center' },
    avatarTexto: { fontSize: 36, fontFamily: fontes.negrito, color: '#fff' },
    avatarFoto: { width: 96, height: 96, borderRadius: 48 },
    btnEditar: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: cores.primaria, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: cores.fundo },
    nomeUsuario: { fontSize: 22, fontFamily: fontes.negrito, color: cores.texto, marginBottom: 4 },
    emailUsuario: { fontSize: 15, fontFamily: fontes.regular, color: cores.textoClaro },
    secao: { marginHorizontal: 16, marginBottom: 16, backgroundColor: cores.fundoCard, borderRadius: 14, borderWidth: 1, borderColor: cores.borda, overflow: 'hidden' },
    secaoTitulo: { fontSize: 11, fontFamily: fontes.medio, color: cores.textoClaro, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
    infoLinha: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
    infoTexto: { flex: 1, fontSize: 15, fontFamily: fontes.regular, color: cores.texto },
    divisor: { height: 1, backgroundColor: cores.borda, marginHorizontal: 16 },
    btnSair: { marginHorizontal: 16, marginTop: 8, padding: 16, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: cores.erro },
    btnSairTexto: { fontSize: 16, fontFamily: fontes.medio, color: cores.erro },
    aviso: { textAlign: 'center', fontSize: 13, fontFamily: fontes.regular, color: cores.textoClaro, marginTop: 8 },
  });

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={cores.texto} />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Meu perfil</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatarWrapper} onPress={handleEscolherFoto}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.avatarFoto} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>{inicialUsuario}</Text>
            </View>
          )}
          <View style={styles.btnEditar}>
            <Feather name="camera" size={14} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.nomeUsuario}>{usuario?.nome || 'Usuário'}</Text>
        <Text style={styles.emailUsuario}>{usuario?.email || ''}</Text>
      </View>

      {/* Informações da conta */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Conta</Text>
        <View style={styles.infoLinha}>
          <Feather name="user" size={18} color={cores.textoClaro} />
          <Text style={styles.infoTexto}>{usuario?.nome || 'Usuário'}</Text>
        </View>
        <View style={styles.divisor} />
        <View style={styles.infoLinha}>
          <Feather name="mail" size={18} color={cores.textoClaro} />
          <Text style={styles.infoTexto}>{usuario?.email || 'email@exemplo.com'}</Text>
        </View>
      </View>

      {/* Configurações */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Configurações</Text>
        <TouchableOpacity style={styles.infoLinha} onPress={handleEscolherFoto}>
          <Feather name="camera" size={18} color={cores.textoClaro} />
          <Text style={styles.infoTexto}>Alterar foto</Text>
          <Feather name="chevron-right" size={16} color={cores.textoClaro} />
        </TouchableOpacity>
        <View style={styles.divisor} />
        <TouchableOpacity style={styles.infoLinha} onPress={() => { setNovoNome(usuario?.nome || ''); setModalNome(true); }}>
          <Feather name="user" size={18} color={cores.textoClaro} />
          <Text style={styles.infoTexto}>Alterar nome</Text>
          <Feather name="chevron-right" size={16} color={cores.textoClaro} />
        </TouchableOpacity>
      </View>

      {/* Modal para alterar nome */}
  <Modal visible={modalNome} transparent animationType="slide">
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>

    <View style={{ backgroundColor: cores.fundoCard, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 }}>
      <Text style={{ fontSize: 18, fontFamily: fontes.negrito, color: cores.texto, marginBottom: 20 }}>
        Alterar nome
      </Text>
      <TextInput
        style={{ backgroundColor: cores.fundo, borderWidth: 1, borderColor: cores.borda, borderRadius: 10, padding: 14, fontSize: 16, fontFamily: fontes.regular, color: cores.texto, marginBottom: 16 }}
        value={novoNome}
        onChangeText={setNovoNome}
        placeholder="Novo nome"
        placeholderTextColor={cores.textoClaro}
        autoFocus
      />
      <TouchableOpacity
        style={{ backgroundColor: cores.primaria, padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 8 }}
        onPress={() => {
          if (!novoNome.trim()) return Alert.alert('Atenção', 'Digite um nome válido');
          atualizarNome(novoNome.trim());
          setModalNome(false);
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontFamily: fontes.negrito }}>Salvar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 16, alignItems: 'center' }}
        onPress={() => setModalNome(false)}
      >
        <Text style={{ color: cores.erro, fontSize: 16, fontFamily: fontes.medio }}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
</Modal>

      {/* Botão de sair */}
      <TouchableOpacity style={styles.btnSair} onPress={handleSair}>
        <Text style={styles.btnSairTexto}>Sair da conta</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}