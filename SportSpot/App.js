import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Inici from './Screens/inici';  // Asegúrate de que la ruta sea correcta
import Login from './Screens/Login';  // Asegúrate de que la ruta sea correcta
import Register from './Screens/Register';  // Importa la pantalla Register

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inici">
        <Stack.Screen name="Inici" component={Inici} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
