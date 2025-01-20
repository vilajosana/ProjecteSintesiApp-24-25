import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { firebase } from '../utils/firebaseConfig'; // Configuració de Firebase
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
                    const locationData = {
                        id: locationSnap.id,
                        name: data.name || 'Sense nom',
                        description: data.description || 'Sense descripció',
                        latitude: data.location?.latitude || 41.722,
                        longitude: data.location?.longitude || 1.888,
                        rating: data.rating || 0,
                    };
                    setLocation(locationData);
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

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
                <Button title="Torna enrere" onPress={() => navigation.goBack()} />
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
        <View style={styles.mainContainer}>
            {/* Header amb el botó de tornada */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Detalls de la Ubicació</Text>
                </View>
            </View>

            {/* Contingut principal */}
            <View style={styles.contentContainer}>
                {/* Recuadre per al nom */}
                <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>{location.name}</Text>
                </View>

                {/* Recuadre per a la descripció */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>{location.description}</Text>
                    <Text style={styles.ratingText}>
                        {'★'.repeat(location.rating) + '☆'.repeat(5 - location.rating)}
                    </Text>
                </View>

                {/* Mapa en un recuadre arrodonit */}
                <View style={styles.roundedMapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            title={location.name}
                        />
                    </MapView>
                </View>
            </View>

            {/* FSection */}
            <View style={styles.section}>
                <FSection currentSection={1} onPress={(id) => console.log(id)} navigation={navigation} />
            </View>
        </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        position: 'absolute',
        left: 10,
        padding: 10,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    contentContainer: {
        flex: 7,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    nameContainer: {
        backgroundColor: '#fff5e6',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ffd59a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ff7f50',
    },
    descriptionContainer: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    descriptionText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff6347',
    },
    roundedMapContainer: {
        width: '100%',
        height: height * 0.4,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 15,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    section: {
        flex: 1,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        margin: 20,
    },
    loadingText: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
    },
});

export default InformacionFicha;
