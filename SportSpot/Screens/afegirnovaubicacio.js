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
  const [category, setCategory] = useState(''); 
  const [initialRegion, setInitialRegion] = useState(null);
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
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancelar', 'Fer una foto', 'Seleccionar des de la galeria'],
        cancelButtonIndex: 0,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          await handleCameraButtonPress();
        } else if (buttonIndex === 2) {
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
    if (name && description && location && category) {
      try {
        const newLocation = { name, description, rating, location, category, photos };

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

  const categories = ['Futbol', 'Bàsquet', 'Pàdel', 'Atletisme', 'Skatepark', 'Altres'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Recuadre superior amb el header */}
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

          {/* Selecció de categoria */}
          <Text style={styles.categoryLabel}>Categoria:</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryButton, category === cat && styles.selectedCategory]}
                onPress={() => setCategory(cat)}
              >
                <Text style={styles.categoryButtonText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mapa dins d'un recuadre */}
        {initialRegion && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={initialRegion}
              onPress={handleMapPress}
            >
              {location && <Marker coordinate={location} />}
            </MapView>
          </View>
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

      {/* Footer fixat a la part inferior */}
      <View style={styles.footer}>
        <FSection
          currentSection={3}
          onPress={(id) => console.log("Botó seleccionat:", id)}
          navigation={navigation}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF'},
  scrollContainer: { flexGrow: 1, paddingBottom: 80 },  // Es fa una mica de marge a la part inferior
  headerContainer: {
    backgroundColor: '#FF6347',
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 40,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  formContainer: { paddingHorizontal: 20 },
  input: { 
    height: 45, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 10, 
    marginBottom: 15, 
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9' 
  },
  starsContainer: { flexDirection: 'row', marginBottom: 20 },
  starsLabel: { fontSize: 18, marginRight: 10 },
  mapContainer: { 
    marginBottom: 20, 
    borderRadius: 10, 
    overflow: 'hidden', 
    marginHorizontal: 20, 
    borderWidth: 1, 
    borderColor: '#ddd' 
  },
  map: { width: '100%', height: 300 },
  cameraButton: { backgroundColor: '#FF6347', padding: 15, borderRadius: 10, alignItems: 'center' },
  addLocationButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20, marginTop: 20 },
  imageContainer: { alignItems: 'center', marginTop: 20 },
  image: { width: 150, height: 150, margin: 5 },
  categoryLabel: { fontSize: 18, marginBottom: 10 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  categoryButton: { backgroundColor: '#e0e0e0', padding: 10, borderRadius: 5, margin: 5 },
  selectedCategory: { backgroundColor: '#FF6347' },
  categoryButtonText: { color: '#333' },
  addLocationButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  footer: { 
    width: '100%',
    backgroundColor: '#f1f1f1',  // Fons suau per al footer
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cameraButtonText: { color: 'white', fontWeight: 'bold' },
});
