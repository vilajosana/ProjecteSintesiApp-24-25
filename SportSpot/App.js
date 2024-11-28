import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Inici from './Screens/Inici';
import Login from './Screens/Login';
import Register from './Screens/Register';
import MenuPrincipal from './Screens/MenuPrincipal';
import AfegirNovaUbicacio from './Screens/AfegirNovaUbicacio';
import HomeLlista from './Screens/HomeLlista';
import Info from './Screens/Info';
import Preferits from './Screens/Preferits';
import Ressenyes from './Screens/Ressenyes';
import Usuari from './Screens/Usuari';
import InformacionFicha from './Screens/InformacionFicha';  // Corregir la ruta aquí

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Inici">
                <Stack.Screen name="Inici" component={Inici} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                <Stack.Screen name="MenuPrincipal" component={MenuPrincipal} options={{ headerShown: false }} />
                <Stack.Screen name="AfegirNovaUbicacio" component={AfegirNovaUbicacio} options={{ headerShown: false }} />
                <Stack.Screen name="HomeLlista" component={HomeLlista} options={{ headerShown: false }} />
                <Stack.Screen name="Info" component={Info} options={{ headerShown: false }} />
                <Stack.Screen name="Preferits" component={Preferits} options={{ headerShown: false }} />
                <Stack.Screen name="Ressenyes" component={Ressenyes} options={{ headerShown: false }} />
                <Stack.Screen name="Usuari" component={Usuari} options={{ headerShown: false }} />
                <Stack.Screen name="InformacionFicha" component={InformacionFicha} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
