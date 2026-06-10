import { AppRegistry } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

const STRIPE_KEY = 'pk_test_51TgRZSHej5qXxj46QrywpL3LgnhPbbkoA6amJeKz5CjMQyEy07UUV6E6BdURhSFqAxhc0BbKuEJSkAwwj6dkChCa00f1wcSyqc';

function App() {
  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey={STRIPE_KEY}>
        <AuthProvider>
          <CartProvider>
            <AppNavigator />
          </CartProvider>
        </AuthProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App;