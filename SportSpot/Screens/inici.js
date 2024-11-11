import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Inici = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Contenedor blanco con bordes redondeados para la imagen */}
      <View style={styles.imageWrapper}>
        <View style={styles.imageContainer}>
          <ImageBackground
            source={require('../images/SportSpotLogo.png')}
            style={styles.header}
            resizeMode="cover" // Cambiado a "cover" para ajustar la imagen al recuadro
          />
        </View>
      </View>

      {/* Título en un fondo ovalado */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>SPORTS SPOT</Text>
      </View>

      {/* Espacio entre el título y el primer botón */}
      <View style={styles.space} />

      {/* Botón de inicio de sesión */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Iniciar Sessió</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Registrar-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
    padding: 20,
  },
  imageWrapper: {
    width: '90%',
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 0,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    backgroundColor: '#ff9999',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 32,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  space: {
    height: 20,
  },
  button: {
    backgroundColor: '#ff9999',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 40,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Inici;
