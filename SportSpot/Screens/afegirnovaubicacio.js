import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FSection from '../components/FSection';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

export default function AfegirNovaUbicacio({ navigation }) {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [photo, setPhoto] = useState(null);  // Estado para almacenar la foto capturada

  useEffect(() => {
    // Solicitar permisos de cámara cuando el componente se monta
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setCameraPermission(true);
      } else {
        Alert.alert("Permiso de cámara denegado", "No puedes acceder a la cámara.");
      }
    };

    requestCameraPermission();
  }, []);

  const handleIconPress = () => {
    console.log('Ícono de los tres puntos presionado');
  };

  const handlePress = (id) => {
    console.log("Han clicat al botó " + id);
    if (id === 1) {
      navigation.navigate("MenuPrincipal");
    } else if (id === 2) {
      navigation.navigate("Preferits");
    } else if (id === 4) {
      navigation.navigate("Usuari");
    }
  };

  const handleCameraButtonPress = async () => {
    if (cameraPermission) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);  // Guarda la URI de la foto capturada
      }
    } else {
      Alert.alert("Permiso de cámara", "Por favor, habilita los permisos para usar la cámara.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleIconPress} style={styles.headerIcon}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Afegir Ubicació</Text>
      </View>
      <View style={styles.search}>
        {/* Aquí se podría añadir un componente de búsqueda */}
      </View>

      {/* Botón para activar la cámara */}
      <TouchableOpacity style={styles.camera} onPress={handleCameraButtonPress}>
        <Text style={styles.cameraText}>Càmera</Text>
      </TouchableOpacity>

      {/* Mostrar la foto capturada si existe */}
      {photo && (
        <View style={styles.imageContainer}>
          <Text>Foto Capturada:</Text>
          <Image source={{ uri: photo }} style={styles.image} />
        </View>
      )}

      <FSection currentSection={3} onPress={handlePress} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#808080',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerIcon: {
    marginRight: 12,
    padding: 6,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  search: {
    height: 40,
    backgroundColor: '#d3d3d3',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
  },
  camera: {
    height: 450,
    width: '80%',
    backgroundColor: '#d3d3d3',
    marginVertical: 16,
    alignSelf: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraText: {
    fontSize: 16,
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});
