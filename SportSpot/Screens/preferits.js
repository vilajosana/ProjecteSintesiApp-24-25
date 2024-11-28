import React from 'react';
import { View, Text } from 'react-native';
import FSection from '../components/FSection';

export default function Preferits({ navigation }) {
  const handlePress = (id) => {
    console.log("Han clicat al botó " + id);
    if (id === 1) {
      navigation.navigate("MenuPrincipal");
    } else if (id === 3) {
      navigation.navigate("AfegirNovaUbicacio");
    } else if (id === 4) {
      navigation.navigate("Usuari");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 7, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginTop: 100 }}>Soc la pagina de preferits</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: 'green' }}>
        <FSection currentSection={2} onPress={handlePress} navigation={navigation} />
      </View>
    </View>
  );
}
