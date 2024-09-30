import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

const Inici = () => {
  const navigation = useNavigation(); // Obtén la función de navegación

  return (
    <View style={styles.container}>
      {/* Cabecera con la imagen de fondo */}
      <ImageBackground
        source={require('../images/SportSpotLogo.png')} // Ruta corregida
        style={styles.header}
        resizeMode="contain" // Ajuste para mantener la proporción de la imagen
      />

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
    backgroundColor: '#e5e5e5', // Color de fondo general
    padding: 20,
  },
  header: {
    width: '100%',
    height: 469, // Ocupar todo el ancho de la pantalla
    aspectRatio: 16 / 9, // Proporción para adaptarse a diferentes tamaños de pantalla
    marginBottom: 20, // Espacio entre la cabecera y el título
  },
  titleContainer: {
    backgroundColor: '#ff9999', // Color de fondo del título
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 32,
    marginBottom: 20, // Espacio entre el título y el siguiente elemento
    width: '80%', // Ancho del título
    alignItems: 'center',
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Posición de la sombra
    shadowOpacity: 0.25, // Opacidad de la sombra
    shadowRadius: 3.84, // Radio de la sombra
    elevation: 5, // Elevación para darle un aspecto 3D
  },
  titleText: {
    fontSize: 30, // Tamaño del texto del título
    fontWeight: 'bold',
    color: 'black', // Color del texto
  },
  space: {
    height: 20, // Ajusta esta altura según el espacio deseado
  },
  button: {
    backgroundColor: '#ff9999', // Color de fondo del botón
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 40,
    width: '80%', // Ancho del botón
    alignItems: 'center',
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Posición de la sombra
    shadowOpacity: 0.25, // Opacidad de la sombra
    shadowRadius: 3.84, // Radio de la sombra
    elevation: 5, // Elevación para darle un aspecto 3D
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Inici;
