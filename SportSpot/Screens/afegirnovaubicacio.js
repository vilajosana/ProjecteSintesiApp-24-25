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
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
},
scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
},
headerContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 60, // Aumentado de 40 a 60
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    paddingTop: 20, // Añadido padding superior extra
    paddingBottom: 20, // Añadido padding inferior extra
},
headerText: {
    fontSize: 28,
    color: '#1F2937',
    fontWeight: '700',
},
  formContainer: {
      padding: 16,
      backgroundColor: '#FFFFFF',
      margin: 16,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
  },
  input: {
      backgroundColor: '#F5F7FA',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      fontSize: 16,
      color: '#2D3748',
      borderWidth: 1,
      borderColor: '#E2E8F0',
  },
  mapContainer: {
      margin: 16,
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      height: 300,
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: '#E2E8F0',
  },
  map: {
      width: '100%',
      height: '100%',
  },
  categoryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 20,
      paddingHorizontal: 8,
  },
  categoryButton: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 25,
      backgroundColor: '#EDF2F7',
      borderWidth: 1,
      borderColor: '#CBD5E0',
      marginBottom: 8,
  },
  selectedCategory: {
      backgroundColor: '#2563EB',
      borderColor: '#2563EB',
  },
  categoryButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#4A5568',
  },
  selectedCategoryText: {
      color: '#FFFFFF',
  },
  starsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      backgroundColor: '#F7FAFC',
      padding: 12,
      borderRadius: 12,
  },
  starsLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#2D3748',
      marginRight: 12,
  },
  starButton: {
      padding: 6,
  },
  photoSection: {
      margin: 16,
      backgroundColor: '#FFFFFF',
      padding: 16,
      borderRadius: 16,
  },
  photosContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 12,
      justifyContent: 'center',
  },
  cameraButton: {
      backgroundColor: '#2563EB',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginHorizontal: 20,
      marginVertical: 10,
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
  },
  cameraButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
  },
  image: {
      width: 120,
      height: 120,
      borderRadius: 12,
      margin: 4,
      borderWidth: 2,
      borderColor: '#E2E8F0',
  },
  addLocationButton: {
      backgroundColor: '#2563EB',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginHorizontal: 20,
      marginVertical: 20,
      marginBottom: 80, // Espacio extra para evitar que el footer lo tape
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
  },
  addLocationButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
  },
  footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E2E8F0',
      paddingVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
  },
});