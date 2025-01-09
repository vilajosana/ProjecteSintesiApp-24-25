import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc, updateDoc, getDoc } from 'firebase/firestore'; // Importar Firebase
import { useLocationContext } from '../Screens/LocationContext'; // Importar el context

export default function AfegirNovaUbicacio({ navigation }) {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState(null);
  const { addLocation } = useLocationContext();  // Accedir al context per afegir ubicacions

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Sol·licitar permisos de càmera
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setCameraPermission(true);
      } else {
        Alert.alert("Permís de càmera denegat", "No pots accedir a la càmera.");
      }
    };

    // Sol·licitar permisos de localització
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permís de localització denegat", "No pots accedir a la teva ubicació.");
      } else {
        // Obtenir la ubicació actual
        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation.coords);
      }
    };

    requestCameraPermission();
    requestLocationPermission();
  }, []);

  const handleCameraButtonPress = async () => {
    if (cameraPermission) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
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

  const handleAddLocation = async () => {
    if (name && description && location) {
      try {
        const newLocation = { name, description, rating, location, photo };

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

      <TouchableOpacity style={styles.cameraButton} onPress={handleCameraButtonPress}>
        <Text style={styles.cameraButtonText}>Obrir Càmera</Text>
      </TouchableOpacity>

      {photo && (
        <View style={styles.imageContainer}>
          <Text>Foto Capturada:</Text>
          <Image source={{ uri: photo }} style={styles.image} />
        </View>
      )}

      {/* Botó per afegir la ubicació */}
      <TouchableOpacity style={styles.addLocationButton} onPress={handleAddLocation}>
        <Text style={styles.addLocationButtonText}>Afegir Ubicació</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: { flexDirection: 'row', padding: 20, backgroundColor: '#ff6347', alignItems: 'center' },
  headerIcon: { marginRight: 12 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  formContainer: { padding: 20 },
  input: { height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 10, marginBottom: 15, paddingHorizontal: 10, backgroundColor: '#fff' },
  starsContainer: { flexDirection: 'row', marginBottom: 20 },
  starsLabel: { fontSize: 18, marginRight: 10 },
  starButton: { marginRight: 5 },
  cameraButton: { backgroundColor: '#ff6347', padding: 15, borderRadius: 10, alignItems: 'center' },
  cameraButtonText: { color: '#fff' },
  imageContainer: { alignItems: 'center', marginTop: 20 },
  image: { width: 250, height: 250 },
  addLocationButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  addLocationButtonText: { fontSize: 18, color: '#fff' }
});
