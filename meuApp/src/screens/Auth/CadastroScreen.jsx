// CadastroScreen.jsx
// Tela de cadastro — nome, email, senha e confirmação

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useTema } from '../../hooks/useTema';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function CadastroScreen({ navigation }) {
  const { cores, fontes } = useTema();

  const [nome, setNome] = useState('');
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});

  // Força da senha — retorna fraca, média ou forte
  function forcaSenha(s) {
    if (s.length < 6) return { label: 'Fraca', cor: cores.erro, largura: '30%' };
    if (s.length < 10 || !/[0-9]/.test(s)) return { label: 'Média', cor: '#FB8C00', largura: '60%' };
    return { label: 'Forte', cor: '#43A047', largura: '100%' };
  }

  // Valida os campos em tempo real ao sair de cada input
  function validarCampo(campo, valor) {
    const novosErros = { ...erros };
    if (campo === 'nome') {
      if (!valor) novosErros.nome = 'Nome obrigatório';
      else delete novosErros.nome;
    }
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
    if (campo === 'confirmarSenha') {
      if (!valor) novosErros.confirmarSenha = 'Confirme sua senha';
      else if (valor !== senha) novosErros.confirmarSenha = 'As senhas não coincidem';
      else delete novosErros.confirmarSenha;
    }
    setErros(novosErros);
  }

  async function handleCadastro() {
    if (!nome || !email || !senha || !confirmarSenha) return Alert.alert('Atenção', 'Preencha todos os campos');
    if (senha !== confirmarSenha) return Alert.alert('Atenção', 'As senhas não coincidem');
    setCarregando(true);
    try {
      // Faz login automático após cadastro passando o nome real
      await login(email, senha, nome);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
    } catch {
      Alert.alert('Erro', 'Não foi possível criar a conta');
    } finally {
      setCarregando(false);
    }
  }

  const forca = senha ? forcaSenha(senha) : null;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    conteudo: { padding: 24, flexGrow: 1, justifyContent: 'center' },
    titulo: { fontSize: 28, fontFamily: fontes.negrito, color: cores.texto, marginBottom: 4 },
    subtitulo: { fontSize: 15, fontFamily: fontes.regular, color: cores.textoClaro, marginBottom: 32 },
    label: { fontSize: 14, fontFamily: fontes.medio, color: cores.texto, marginBottom: 6 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: cores.fundoCard, borderWidth: 1, borderColor: cores.borda, borderRadius: 10, marginBottom: 4 },
    inputContainerErro: { borderColor: cores.erro },
    input: { flex: 1, padding: 14, fontSize: 16, fontFamily: fontes.regular, color: cores.texto },
    olho: { padding: 14 },
    textoErro: { fontSize: 12, color: cores.erro, marginBottom: 12, marginLeft: 2 },
    // Indicador de força da senha
    forcaContainer: { marginBottom: 12 },
    forcaBarra: { height: 4, borderRadius: 2, backgroundColor: cores.borda, marginBottom: 4 },
    forcaPreenchimento: { height: 4, borderRadius: 2 },
    forcaTexto: { fontSize: 12, fontFamily: fontes.regular },
    botao: { backgroundColor: cores.primaria, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
    botaoTexto: { color: cores.fundo, fontSize: 16, fontFamily: fontes.negrito },
    rodape: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 4 },
    rodapeTexto: { fontSize: 14, fontFamily: fontes.regular, color: cores.textoClaro },
    rodapeLink: { fontSize: 14, fontFamily: fontes.negrito, color: cores.texto,},
  });

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.conteudo}>
        <Text style={s.titulo}>Criar conta</Text>
        <Text style={s.subtitulo}>Preencha os dados para se cadastrar</Text>

        {/* Campo nome */}
        <Text style={s.label}>Nome</Text>
        <View style={[s.inputContainer, erros.nome && s.inputContainerErro]}>
        <Feather name="user" size={18} color={cores.textoClaro} style={{ marginLeft: 14 }} />
        <TextInput style={s.input} value={nome} onChangeText={setNome} onBlur={() => validarCampo('nome', nome)} placeholder="Seu nome" placeholderTextColor={cores.textoClaro} />
        </View>
        {erros.nome && <Text style={s.textoErro}>{erros.nome}</Text>}

        {/* Campo email */}
        <Text style={s.label}>Email</Text>
        <View style={[s.inputContainer, erros.email && s.inputContainerErro]}>
        <Feather name="mail" size={18} color={cores.textoClaro} style={{ marginLeft: 14 }} />
        <TextInput style={s.input} value={email} onChangeText={setEmail} onBlur={() => validarCampo('email', email)} keyboardType="email-address" autoCapitalize="none" placeholder="seu@email.com" placeholderTextColor={cores.textoClaro} />
        </View>
        {erros.email && <Text style={s.textoErro}>{erros.email}</Text>}

        {/* Campo senha com indicador de força */}
        <Text style={s.label}>Senha</Text>
        <View style={[s.inputContainer, erros.senha && s.inputContainerErro]}>
        <Feather name="lock" size={18} color={cores.textoClaro} style={{ marginLeft: 14 }} />
        <TextInput style={s.input} value={senha} onChangeText={setSenha} onBlur={() => validarCampo('senha', senha)} secureTextEntry={!senhaVisivel} placeholder="••••••••" placeholderTextColor={cores.textoClaro} />
        <TouchableOpacity style={s.olho} onPress={() => setSenhaVisivel(!senhaVisivel)}>
        <Feather name={senhaVisivel ? 'eye-off' : 'eye'} size={18} color={cores.textoClaro} />
        </TouchableOpacity>
        </View>
        {erros.senha && <Text style={s.textoErro}>{erros.senha}</Text>}

        {/* Barra de força da senha */}
        {forca && (
          <View style={s.forcaContainer}>
            <View style={s.forcaBarra}>
              <View style={[s.forcaPreenchimento, { width: forca.largura, backgroundColor: forca.cor }]} />
            </View>
            <Text style={[s.forcaTexto, { color: forca.cor }]}>Senha {forca.label}</Text>
          </View>
        )}

        {/* Campo confirmar senha */}
        <Text style={s.label}>Confirmar senha</Text>
        <View style={[s.inputContainer, erros.confirmarSenha && s.inputContainerErro]}>
        <Feather name="lock" size={18} color={cores.textoClaro} style={{ marginLeft: 14 }} />
        <TextInput style={s.input} value={confirmarSenha} onChangeText={setConfirmarSenha} onBlur={() => validarCampo('confirmarSenha', confirmarSenha)} secureTextEntry={!confirmarSenhaVisivel} placeholder="••••••••" placeholderTextColor={cores.textoClaro} />
        <TouchableOpacity style={s.olho} onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}>
        <Feather name={confirmarSenhaVisivel ? 'eye-off' : 'eye'} size={18} color={cores.textoClaro} />
        </TouchableOpacity>
        </View>
        {erros.confirmarSenha && <Text style={s.textoErro}>{erros.confirmarSenha}</Text>}

        <TouchableOpacity style={s.botao} onPress={handleCadastro} disabled={carregando}>
          <Text style={s.botaoTexto}>{carregando ? 'Cadastrando...' : 'Cadastrar'}</Text>
        </TouchableOpacity>

        {/* Rodapé com link para login */}
        <View style={s.rodape}>
          <Text style={s.rodapeTexto}>Já tem conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={s.rodapeLink}>Entrar</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}