import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FSection from '../components/FSection';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons

const Preferits = ({ navigation }) => {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Preferits</Text>
      </View>
      <View style={styles.labelContainer}>
        <TouchableOpacity style={styles.labelButton} disabled={true}>
          <Text style={styles.labelText}>Preferits</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <FSection currentSection={2} onPress={handlePress} navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#d3d3d3', // Color gris para la cabecera
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 20, // Espacio entre el icono y el texto
    flex: 1, // Esto asegura que el texto esté centrado en el espacio restante
    textAlign: 'center', // Centra el texto en el espacio disponible
  },
  iconButton: {
    padding: 10,
  },
  labelContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  labelButton: {
    backgroundColor: '#ff9999',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  labelText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
  },
});

export default Preferits;