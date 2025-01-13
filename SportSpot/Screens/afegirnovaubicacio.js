import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc, updateDoc, getDoc } from 'firebase/firestore'; 
import { useLocationContext } from '../Screens/LocationContext';

export default function AfegirNovaUbicacio({ navigation }) {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [photos, setPhotos] = useState([]); // Array per guardar múltiples fotos
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState(null);
  const { addLocation } = useLocationContext();

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setCameraPermission(true);
      } else {
        Alert.alert("Permís de càmera denegat", "No pots accedir a la càmera.");
      }
    };

    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permís de localització denegat", "No pots accedir a la teva ubicació.");
      } else {
        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation.coords);
      }
    };

    requestCameraPermission();
    requestLocationPermission();
  }, []);

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

  const handlePhotoSelection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]); // Afegir la foto seleccionada a l'array
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
        setPhotos([...photos, result.assets[0].uri]); // Afegir la foto capturada a l'array
      }
    } else {
      Alert.alert("Permís de càmera", "Per favor, habilita els permisos per a usar la càmera.");
    }
  };

  const handleStarPress = (index) => {
    setRating(index + 1);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleStarPress(index)}
        style={styles.starButton}
      >
        <Ionicons
          name="star-outline"
          size={24}
          color={index < rating ? 'yellow' : 'gray'}
        />
      </TouchableOpacity>
    ));
  };

  const handleRemovePhoto = (uri) => {
    // Mostrar un alert per confirmar l'eliminació de la foto
    Alert.alert(
      "Confirmar eliminació",
      "Estàs segur que vols eliminar aquesta foto?",
      [
        { text: "Cancel·lar", style: "cancel" },
        { text: "Eliminar", onPress: () => setPhotos(photos.filter(photo => photo !== uri)) }
      ]
    );
  };

  const handleAddLocation = async () => {
    if (name && description && location) {
      try {
        const newLocation = { name, description, rating, location, photos };

        // Afegir la nova ubicació a la col·lecció Locations
        const locationRef = await addDoc(collection(db, 'Locations'), newLocation);

        // Afegir la ubicació a la llista de l'usuari
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userRef = doc(db, 'Users', currentUser.uid);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const updatedLocations = [...(userData.locations || []), locationRef.id];

            // Actualitzar la llista d'ubicacions de l'usuari
            await updateDoc(userRef, { locations: updatedLocations });
          }
        }

        // Un cop afegida la ubicació, mostra un missatge d'èxit i redirigeix
        Alert.alert('Ubicació afegida!', 'La ubicació s\'ha afegit correctament.');
        navigation.navigate("MenuPrincipal");

      } catch (error) {
        console.error('Error afegint la ubicació:', error);
        Alert.alert('Error', 'No s\'ha pogut afegir la ubicació');
      }
    } else {
      Alert.alert("Error", "Si us plau, omple tots els camps.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePress} style={styles.headerIcon}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Afegir Nova Ubicació</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nom de la ubicació"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripció"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <View style={styles.starsContainer}>
          <Text style={styles.starsLabel}>Valoració:</Text>
          {renderStars()}
        </View>
      </View>

      {/* Botó per seleccionar foto de càmera o galeria */}
      <TouchableOpacity style={styles.cameraButton} onPress={() => {
        Alert.alert(
          "Selecciona una opció",
          "Tria una opció per afegir una foto",
          [
            { text: "Càmera", onPress: handleCameraButtonPress },
            { text: "Galeria", onPress: handlePhotoSelection },
            { text: "Cancel·lar", style: "cancel" }
          ]
        );
      }}>
        <Text style={styles.cameraButtonText}>Afegir Foto</Text>
      </TouchableOpacity>

      {/* Mostrar les fotos seleccionades */}
      {photos.length > 0 && (
        <View style={styles.imageContainer}>
          <View style={styles.photosContainer}>
            {photos.map((photoUri, index) => (
              <TouchableOpacity key={index} onPress={() => handleRemovePhoto(photoUri)}>
                <Image source={{ uri: photoUri }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Botó per afegir la ubicació */}
      <TouchableOpacity style={styles.addLocationButton} onPress={handleAddLocation}>
        <Text style={styles.addLocationButtonText}>Afegir Ubicació</Text>
      </TouchableOpacity>

      {/* Secció amb els 4 botons dins del recuadre */}
      <View style={styles.footer}>
        <View style={styles.footerButtonsContainer}>
          <TouchableOpacity onPress={() => handlePress(1)} style={styles.footerButton}>
            <Ionicons name="home" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress(2)} style={styles.footerButton}>
            <Ionicons name="heart-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress(3)} style={styles.footerButton}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress(4)} style={styles.footerButton}>
            <Ionicons name="person-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

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
  formContainer: {
    padding: 20,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  starsLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  starButton: {
    marginRight: 5,
  },
  cameraButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cameraButtonText: {
    color: '#fff',
  },
  addLocationButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addLocationButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 150,
    height: 150,
    margin: 5,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
  },
  footerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
    paddingTop: 10,
  },
  footerButton: {
    padding: 10,
  },
});
