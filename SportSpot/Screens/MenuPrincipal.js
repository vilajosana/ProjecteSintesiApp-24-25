import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import FSection from '../components/FSection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

export default function MenuPrincipal({ navigation }) {
    const [isMapVisible, setIsMapVisible] = useState(true);
    const [locations, setLocations] = useState([]); // Estat per emmagatzemar les ubicacions

    useEffect(() => {
        const db = getFirestore();
        const locationsCollection = collection(db, 'Locations'); // Nom de la col·lecció a Firebase

        // Listener per canvis en temps real a Firestore
        const unsubscribe = onSnapshot(locationsCollection, (snapshot) => {
            const locationList = snapshot.docs
                .map((doc) => {
                    const data = doc.data();
                    const location = data.location; // Obté el camp `location`
                    if (location && location.latitude && location.longitude) {
                        return {
                            id: doc.id,
                            name: data.name || 'Sense nom', // Nom de la ubicació
                            description: data.description || 'Sense descripció', // Descripció de la ubicació
                            latitude: location.latitude,
                            longitude: location.longitude,
                            rating: data.rating || 0, // Valoració per defecte
                            category: data.category || 'Desconeguda', // Afegeix la categoria
                        };
                    }
                    return null; // Retorna null si les coordenades no són vàlides
                })
                .filter((loc) => loc !== null); // Elimina les ubicacions amb coordenades no vàlides
            setLocations(locationList); // Estableix l'estat amb les ubicacions vàlides
        });

        // Tornar a desconnectar el listener quan el component es destrueixi
        return () => unsubscribe();
    }, []);

    const handlePress = (id) => {
        if (id === 1) {
            navigation.navigate("MenuPrincipal");
        } else if (id === 2) {
            navigation.navigate("Preferits");
        } else if (id === 3) {
            navigation.navigate("AfegirNovaUbicacio");
        } else if (id === 4) {
            navigation.navigate("Usuari");
        }
    };

    const toggleMapList = (view) => {
        if (view === 'map') {
            setIsMapVisible(true);
        } else if (view === 'list') {
            navigation.navigate('HomeLlista');
        }
    };

    const handleIconPress = () => {
        navigation.navigate("Info");
    };

    const { width, height } = Dimensions.get('window');

    return (
        <View style={{ flex: 1, paddingTop: 50 }}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleIconPress} style={styles.headerIcon}>
                        <Ionicons name="ellipsis-vertical" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Menú Principal</Text>
                    </View>
                </View>

                <View style={styles.mapContainer}>
                    <View style={[styles.buttonArea, { marginTop: -20 }]}>
                        <View style={styles.buttonRectangle}>
                            <TouchableOpacity
                                style={[styles.button, isMapVisible && styles.buttonSelected]}
                                onPress={() => toggleMapList('map')}
                            >
                                <Text style={styles.buttonText}>Mapa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, !isMapVisible && styles.buttonSelected]}
                                onPress={() => toggleMapList('list')}
                            >
                                <Text style={styles.buttonText}>Llista</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {isMapVisible && (
                        <View style={styles.roundedMapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: 41.722730,
                                    longitude: 1.812957,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                            >
                                {locations.map((location) => (
                                    <Marker
                                        key={location.id}
                                        coordinate={{
                                            latitude: location.latitude,
                                            longitude: location.longitude,
                                        }}
                                        title={location.name}
                                        description={location.description}
                                    >
                                        <Callout>
                                            <View style={styles.calloutContainer}>
                                                <Ionicons name="location-outline" size={30} color="black" />
                                                <Text style={styles.calloutTitle}>{location.name}</Text>
                                                <Text style={styles.calloutDescription}>{location.description}</Text>
                                                <Text style={styles.calloutDescription}>{location.category}</Text>
                                                <View style={styles.ratingContainer}>
                                                    <Text>⭐ {location.rating}</Text>
                                                </View>
                                            </View>
                                        </Callout>
                                    </Marker>
                                ))}
                            </MapView>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <FSection
                    currentSection={1}
                    onPress={handlePress}
                    navigation={navigation}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 80, 
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#FF6347', // Color taronja per tota la capçalera
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20, // Fes que la capçalera sigui més alta per un millor aspecte
        paddingHorizontal: 15, // Afegim una mica de padding als costats per a més espai
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white', // El text serà blanc per destacar sobre el fons taronja
        textAlign: 'center',
    },
    headerIcon: {
        padding: 5,
        position: 'absolute',
        left: 20, // Col·loca la icona a l'esquerra
    },
    mapContainer: {
        flex: 7,
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 10,
        marginTop: -20,
    },
    buttonRectangle: {
        flexDirection: 'row',
        width: '70%',
        backgroundColor: '#F08080',
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'transparent',
        borderRadius: 10,
        padding: 12,
        width: '45%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    buttonSelected: {
        backgroundColor: '#FF6347',
    },
    buttonText: {
        fontSize: 16,
        color: 'black',
    },
    roundedMapContainer: {
        width: '95%',
        height: Dimensions.get('window').height * 0.55,
        borderRadius: 20,
        overflow: 'hidden',
        marginTop: 20,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    calloutContainer: {
        alignItems: 'center',
        width: 150,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    calloutDescription: {
        textAlign: 'center',
        fontSize: 14,
        marginVertical: 5,
    },
    ratingContainer: {
        marginBottom: 5,
    },
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
});
