import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, TextInput, ScrollView, ActionSheetIOS } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc, updateDoc, getDoc } from 'firebase/firestore'; 
import { useLocationContext } from '../Screens/LocationContext';
import MapView, { Marker } from 'react-native-maps';
import FSection from '../components/FSection';

export default function AfegirNovaUbicacio({ navigation }) {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null); // Per guardar la regió inicial del mapa
  const { addLocation } = useLocationContext();

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');

      const locationStatus = await Location.requestForegroundPermissionsAsync();
      if (locationStatus.status === 'granted') {
        const userLocation = await Location.getCurrentPositionAsync({});
        const coords = userLocation.coords;

        // Configurar la ubicació inicial i el marcador al mapa
        setInitialRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLocation(coords);
      } else {
        Alert.alert(
          "Permisos de localització denegats",
          "No es pot obtenir la ubicació inicial. Es farà servir una posició per defecte."
        );

        // Ubicació per defecte en cas de no tenir permisos
        setInitialRegion({
          latitude: 41.3851,
          longitude: 2.1734,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    };

    requestPermissions();
  }, []);

  const handlePhotoSelection = async () => {
    // Creem una acció de selecció per l'usuari
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancelar', 'Fer una foto', 'Seleccionar des de la galeria'],
        cancelButtonIndex: 0,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          // Si es tria "Fer una foto"
          await handleCameraButtonPress();
        } else if (buttonIndex === 2) {
          // Si es tria "Seleccionar des de la galeria"
          await handleGallerySelection();
        }
      }
    );
  };

  const handleCameraButtonPress = async () => {
    if (cameraPermission) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setPhotos([...photos, result.assets[0].uri]);
      }
    } else {
      Alert.alert("Permís de càmera", "Per favor, habilita els permisos per a usar la càmera.");
    }
  };

  const handleGallerySelection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
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

        const locationRef = await addDoc(collection(db, 'Locations'), newLocation);

        const currentUser = auth.currentUser;
        if (currentUser) {
          const userRef = doc(db, 'Users', currentUser.uid);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const updatedLocations = [...(userData.locations || []), locationRef.id];

            await updateDoc(userRef, { locations: updatedLocations });
          }
        }

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

  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    setLocation(coordinate);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Recuadre superior */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Informació Fitxa</Text>
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

        {initialRegion && (
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            onPress={handleMapPress}
          >
            {location && <Marker coordinate={location} />}
          </MapView>
        )}

        {/* Botó per seleccionar foto */}
        <TouchableOpacity style={styles.cameraButton} onPress={handlePhotoSelection}>
          <Text style={styles.cameraButtonText}>Afegir Foto</Text>
        </TouchableOpacity>

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

        <TouchableOpacity style={styles.addLocationButton} onPress={handleAddLocation}>
          <Text style={styles.addLocationButtonText}>Afegir Ubicació</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FSection a la part inferior */}
      <FSection
        currentSection={3}
        onPress={(id) => console.log("Botó seleccionat:", id)}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'space-between' },
  headerContainer: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 40, // Afegeix espai a la part superior per evitar la iloteta
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  formContainer: { paddingHorizontal: 20 },
  input: { height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 10, marginBottom: 15, paddingHorizontal: 10 },
  starsContainer: { flexDirection: 'row', marginBottom: 20 },
  starsLabel: { fontSize: 18, marginRight: 10 },
  map: { width: '100%', height: 300, marginBottom: 20 },
  cameraButton: { backgroundColor: '#ff6347', padding: 15, borderRadius: 10, alignItems: 'center' },
  addLocationButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  imageContainer: { alignItems: 'center', marginTop: 20 },
  image: { width: 150, height: 150, margin: 5 },
});
