import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Importar LinearGradient
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalada esta librería
import FSection from '../components/FSection'; // Asegúrate de que el componente FSection esté correctamente importado

const Ressenyes = ({ navigation }) => {
  // Función para manejar la navegación desde los botones del menú
  const handlePress = (sectionId) => {
    switch (sectionId) {
      case 1:
        navigation.navigate('HomeLlista');
        break;
      case 2:
        navigation.navigate('Preferits');
        break;
      case 3:
        navigation.navigate('AfegirNovaUbicacio');
        break;
      case 4:
        navigation.navigate('Usuari');
        break;
      default:
        break;
    }
  };

  // Función para manejar el clic en el icono de 3 puntos
  const handleThreeDotsClick = () => {
    console.log('Icono de 3 puntos pulsado');
    // Puedes agregar aquí la lógica para abrir un menú de opciones o realizar alguna acción
  };

  return (
    <View style={styles.container}>
      {/* Imagen principal (Logo) con fondo blanco */}
      <View style={styles.logoContainer}>
        {/* Icono de tres puntos en la parte superior izquierda */}
        <TouchableOpacity onPress={handleThreeDotsClick} style={styles.threeDotsIcon}>
          <Ionicons name="ellipsis-vertical" size={30} color="#000" />
        </TouchableOpacity>

        <ImageBackground
          source={require('../images/SportSpotLogo2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Labels */}
      <View style={styles.labelsContainer}>
        {/* Rating con degradado */}
        <LinearGradient
          colors={['#000', '#fff']} // Negro a blanco
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.labelGradient}
        >
          <Text style={styles.labelText}>Rating</Text>
        </LinearGradient>

        {/* Estrellas */}
        <View style={styles.starsContainer}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.star}>★</Text>
          <Text style={styles.star}>★</Text>
          <Text style={styles.star}>☆</Text>
          <Text style={styles.star}>☆</Text>
        </View>

        {/* Título */}
        <View style={styles.label}>
          <Text style={styles.labelText}>Títol</Text>
        </View>
        {/* Descripción */}
        <View style={styles.label}>
          <Text style={styles.labelText}>Descripció</Text>
        </View>
      </View>

      {/* Rectángulo con fondo azul */}
      <View style={styles.photoContainer}>
        <TouchableOpacity>
          <Ionicons name="camera" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.photoText}>AFEGIR FOTO</Text>
        <TouchableOpacity>
          <Ionicons name="reload" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Menú de navegación (FSection) */}
      <FSection currentSection={3} onPress={handlePress} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e5e5',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Fondo blanco para la imagen
    position: 'relative', // Necesario para posicionar el icono en la parte superior izquierda
  },
  threeDotsIcon: {
    position: 'absolute', // Posiciona el icono de manera absoluta
    top: 10, // Distancia desde el borde superior
    left: 10, // Distancia desde el borde izquierdo
    zIndex: 1, // Asegura que el icono esté encima de la imagen
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  labelsContainer: {
    width: '80%',
    marginTop: 10,
  },
  labelGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20, // Mayor borderRadius para bordes más redondeados
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FF6347',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7F7F',
    borderRadius: 20, // Mayor borderRadius para bordes más redondeados
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FF6347',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  star: {
    fontSize: 20,
    color: '#000', // Estrellas de color negro
    marginHorizontal: 2,
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#87CEEB',
    borderRadius: 10,
    marginVertical: 10,
  },
  photoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Ressenyes;
