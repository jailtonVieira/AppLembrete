// LoginScreen.jsx
// Tela de entrada do app — email, senha e opções de login social

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { useTema } from '../../hooks/useTema';
import { useTemaContext } from '../../context/TemaContext';
import { Switch } from 'react-native';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const { cores, fontes } = useTema();
  const { modoEscuro, alternarTema } = useTemaContext();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});

  // Valida os campos em tempo real ao sair de cada input
  function validarCampo(campo, valor) {
    const novosErros = { ...erros };
    if (campo === 'email') {
      if (!valor) novosErros.email = 'Email obrigatório';
      else if (!valor.includes('@')) novosErros.email = 'Email inválido';
      else delete novosErros.email;
    }
    if (campo === 'senha') {
      if (!valor) novosErros.senha = 'Senha obrigatória';
      else if (valor.length < 6) novosErros.senha = 'Mínimo 6 caracteres';
      else delete novosErros.senha;
    }
    setErros(novosErros);
  }

  async function handleLogin() {
  if (!email || !senha) return Alert.alert('Atenção', 'Preencha todos os campos');
  setCarregando(true);
  try {
    await login(email, senha);
  } catch {
    Alert.alert('Erro', 'Email ou senha incorretos');
  } finally {
    setCarregando(false);
  }
}

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    inner: { flex: 1, padding: 24, justifyContent: 'center' },
    logoContainer: { alignItems: 'center', marginBottom: -70, height: 180, },
    logo: { width: 150, height: 150, borderRadius: 30 },
    logoPlaceholder: { width: 80, height: 80, borderRadius: 20, backgroundColor: cores.primaria, alignItems: 'center', justifyContent: 'center'},
    titulo: { fontSize: 28, fontFamily: fontes.negrito, color: cores.texto, textAlign: 'center', marginBottom: 10 },
    subtitulo: { fontSize: 15, fontFamily: fontes.regular, color: cores.textoClaro, textAlign: 'center', marginBottom: 33 },
    label: { fontSize: 14, fontFamily: fontes.medio, color: cores.texto, marginBottom: 6 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: cores.fundoCard, borderWidth: 1, borderColor: cores.borda, borderRadius: 10, marginBottom: 4 },
    inputContainerErro: { borderColor: cores.erro },
    input: { flex: 1, padding: 14, fontSize: 16, fontFamily: fontes.regular, color: cores.texto },
    olho: { padding: 14 },
    textoErro: { fontSize: 12, color: cores.erro, marginBottom: 12, marginLeft: 2 },
    botao: { backgroundColor: cores.primaria, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 4 },
    botaoTexto: { color: cores.fundo, fontSize: 16, fontFamily: fontes.negrito },
    separador: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 10 },
    separadorLinha: { flex: 1, height: 1, backgroundColor: cores.borda },
    separadorTexto: { fontSize: 13, fontFamily: fontes.regular, color: cores.textoClaro },
    socialContainer: { flexDirection: 'row', gap: 12 },
    btnSocial: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: cores.borda, backgroundColor: cores.fundoCard },
    btnSocialTexto: { fontSize: 14, fontFamily: fontes.medio, color: cores.texto },
    rodape: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 4 },
    rodapeTexto: { fontSize: 14, fontFamily: fontes.regular, color: cores.textoClaro },
    rodapeLink: { fontSize: 14, fontFamily: fontes.negrito, color: cores.texto, },
  });

  return (
    <SafeAreaView style={s.container}>
      {/* Botão de tema no canto superior direito */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 24, paddingTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: s.container.backgroundColor, borderRadius: 20, padding: 6, borderWidth: 1, borderColor: cores.borda }}>
          <Feather name={modoEscuro ? 'moon' : 'sun'} size={16} color={cores.textoClaro} />
          <Switch
            value={modoEscuro}
            onValueChange={alternarTema}
            trackColor={{ false: cores.borda, true: cores.primaria }}
            thumbColor={cores.fundo}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>
      </View>

      <View style={s.inner}>

        {/* Logo do app — substituir pela imagem real quando o grupo entregar */}
        <View style={s.logoContainer}>
          <View style={s.logoPlaceholder}>
          <Feather name="bell" size={36} color="#fff" />
          </View>
        </View>

        <Text style={s.titulo}>NoteUp</Text>
        <Text style={s.subtitulo}>Faça login para continuar</Text>

        {/* Campo de email com validação em tempo real */}
        <Text style={s.label}>Email</Text>
        <View style={[s.inputContainer, erros.email && s.inputContainerErro]}>
          <Feather name="user" size={18} color={cores.textoClaro} style={{ marginLeft: 14 }} />
          <TextInput style={s.input} value={email} onChangeText={setEmail} onBlur={() => validarCampo('email', email)} keyboardType="email-address" autoCapitalize="none" placeholder="seu@email.com" placeholderTextColor={cores.textoClaro} />
        </View>
        {erros.email && <Text style={s.textoErro}>{erros.email}</Text>}

        {/* Campo de senha com botão de mostrar/esconder */}
        <Text style={s.label}>Senha</Text>
        <View style={[s.inputContainer, erros.senha && s.inputContainerErro]}>
          <Feather name="lock" size={18} color={cores.textoClaro} style={{ marginLeft: 14 }} />
          <TextInput style={s.input} value={senha} onChangeText={setSenha} onBlur={() => validarCampo('senha', senha)} secureTextEntry={!senhaVisivel} placeholder="••••••••" placeholderTextColor={cores.textoClaro} />
          <TouchableOpacity style={s.olho} onPress={() => setSenhaVisivel(!senhaVisivel)}>
            <Feather name={senhaVisivel ? 'eye-off' : 'eye'} size={18} color={cores.textoClaro} />
          </TouchableOpacity>
        </View>
        {erros.senha && <Text style={s.textoErro}>{erros.senha}</Text>}

        <TouchableOpacity style={s.botao} onPress={handleLogin} disabled={carregando}>
          <Text style={s.botaoTexto}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>

        {/* Separador */}
        <View style={s.separador}>

          <View style={s.separadorLinha} />
        </View>

        {/* Rodapé com link para cadastro */}
        <View style={s.rodape}>
          <Text style={s.rodapeTexto}>Não tem conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={s.rodapeLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}
