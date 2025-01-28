import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { firebase } from '../utils/firebaseConfig';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import FSection from '../components/FSection';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InformacionFicha = ({ route, navigation }) => {
  const { locationId } = route.params || {};
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!locationId) {
        setError("No s'ha proporcionat cap identificador de la ubicació.");
        return;
      }

      try {
        const db = getFirestore();
        const locationRef = doc(db, 'Locations', locationId);
        const locationSnap = await getDoc(locationRef);

        if (locationSnap.exists()) {
          const data = locationSnap.data();
          setLocation({
            id: locationSnap.id,
            name: data.name || 'Sense nom',
            description: data.description || 'Sense descripció',
            category: data.category || 'Sense categoria',
            latitude: data.location?.latitude || 41.722,
            longitude: data.location?.longitude || 1.888,
            rating: data.rating || 0,
            photos: data.photos || [],
          });
        } else {
          setError("No s'ha trobat cap ubicació amb aquest identificador.");
        }
      } catch (err) {
        console.error("Error carregant la ubicació:", err);
        setError("Hi ha hagut un problema carregant la ubicació.");
      }
    };

    fetchLocation();
  }, [locationId]);

  // Funció handlePress
  const handlePress = (sectionId) => {
    console.log(`Section ${sectionId} clicked`);
    // Aquí pots definir el comportament segons la secció seleccionada.
    // Exemple: navegar a una altra pàgina o actualitzar l'estat.
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color={index < rating ? '#FFD700' : '#CBD5E0'}
        style={{ marginRight: 2 }}
      />
    ));
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Torna enrere</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregant informació...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalls de la Ubicació</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.nameText}>{location.name}</Text>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{location.category}</Text>
          </View>
          <Text style={styles.descriptionText}>{location.description}</Text>
          <View style={styles.ratingContainer}>{renderStars(location.rating)}</View>
        </View>

        {location.photos.length > 0 && (
          <View style={styles.photosContainer}>
            <FlatList
              data={location.photos}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.photoCard}>
                  <Image source={{ uri: item }} style={styles.photo} />
                </View>
              )}
            />
          </View>
        )}
      </ScrollView>

      
      <View style={styles.footer}>
        <FSection
          currentSection={1}
          onPress={handlePress} // Assegurem-nos que handlePress està definit
          navigation={navigation}
        />
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  categoryChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  categoryText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photosContainer: {
    marginBottom: 16,
  },
  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  photo: {
    width: width * 0.7,
    height: height * 0.3,
    borderRadius: 12,
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
        zIndex: 1, // Per garantir que estigui per sobre del mapa
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    margin: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    margin: 20,
  },
});

export default InformacionFicha;
