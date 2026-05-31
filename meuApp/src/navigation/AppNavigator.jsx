// AppNavigator.jsx
// Define toda a estrutura de navegação do app

import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import { AuthContext } from '../context/AuthContext';
import { useTemaContext } from '../context/TemaContext';
import { claro, escuro } from '../theme';

import LoginScreen from '../screens/Auth/LoginScreen';
import CadastroScreen from '../screens/Auth/CadastroScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import BuscaScreen from '../screens/Busca/BuscaScreen';
import ListasScreen from '../screens/listas/ListasScreen';
import LembretesListaScreen from '../screens/listas/LembretesListaScreen';
import CriarLembreteScreen from '../screens/Lembrete/CriarLembreteScreen';
import DetalhesLembreteScreen from '../screens/Lembrete/DetalhesLembreteScreen';
import LixeiraScreen from '../screens/Lixeira/LixeiraScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab bar com suporte completo ao tema escuro/claro
function HomeTabs() {
  const { modoEscuro } = useTemaContext();
  const cores = modoEscuro ? escuro : claro;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoClaro,
        tabBarStyle: {
          backgroundColor: cores.fundoCard,
          borderTopColor: cores.borda,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Listas"
        component={ListasScreen}
        options={{
          tabBarLabel: 'Listas',
          tabBarIcon: ({ color, size }) => <Feather name="list" size={size} color={color} />,
        }}
      />

      <Tab.Screen
      name="Busca"
      component={BuscaScreen}
      options={{
      tabBarLabel: 'Buscar',
      tabBarIcon: ({ color, size }) => <Feather name="search" size={size} color={color} />,
  }}
/>
      <Tab.Screen
        name="Lixeira"
        component={LixeiraScreen}
        options={{
          tabBarLabel: 'Lixeira',
          tabBarIcon: ({ color, size }) => <Feather name="trash-2" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { usuario } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {usuario ? (
          <>
            <Stack.Screen name="Main" component={HomeTabs} options={{ headerShown: false }} />
            <Stack.Screen name="CriarLembrete" component={CriarLembreteScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DetalhesLembrete" component={DetalhesLembreteScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LembretesLista" component={LembretesListaScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
