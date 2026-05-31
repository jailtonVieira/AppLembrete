import { AuthProvider } from './src/context/AuthContext';
import { LembretesProvider } from './src/context/LembretesContext';
import { ListasProvider } from './src/context/ListasContext';
import { TemaProvider, useTemaContext } from './src/context/TemaContext';
import AppNavigator from './src/navigation/AppNavigator';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function AppContent() {
  const { modoEscuro } = useTemaContext();
  return (
    <>
      <StatusBar style={modoEscuro ? 'light' : 'dark'} backgroundColor={modoEscuro ? '#000000' : '#F8F9FB'} />
      <AuthProvider>
          <ListasProvider>
            <LembretesProvider>
              <AppNavigator />
            </LembretesProvider>
          </ListasProvider>
      </AuthProvider>
    </>
  );
}

export default function App() {
  const [fontesCarregadas] = useFonts({
    'Inter': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontesCarregadas) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <TemaProvider>
        <AppContent />
      </TemaProvider>
    </SafeAreaProvider>
  );
}
