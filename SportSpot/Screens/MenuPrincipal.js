import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import FSection from '../components/FSection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

export default function MenuPrincipal({ navigation }) {
    const [isMapVisible, setIsMapVisible] = useState(true);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const db = getFirestore();
        const locationsCollection = collection(db, 'Locations');

        const unsubscribe = onSnapshot(locationsCollection, (snapshot) => {
            const locationList = snapshot.docs
                .map((doc) => {
                    const data = doc.data();
                    const location = data.location;
                    if (location && location.latitude && location.longitude) {
                        return {
                            id: doc.id,
                            name: data.name || 'Sense nom',
                            description: data.description || 'Sense descripció',
                            latitude: location.latitude,
                            longitude: location.longitude,
                            rating: data.rating || 0,
                            category: data.category || 'Desconeguda',
                        };
                    }
                    return null;
                })
                .filter((loc) => loc !== null);
            setLocations(locationList);
        });

        return () => unsubscribe();
    }, []);

    const handlePress = (id) => {
        switch (id) {
            case 1: navigation.navigate("MenuPrincipal"); break;
            case 2: navigation.navigate("Preferits"); break;
            case 3: navigation.navigate("AfegirNovaUbicacio"); break;
            case 4: navigation.navigate("Usuari"); break;
        }
    };

    const toggleMapList = (view) => {
        if (view === 'map') {
            setIsMapVisible(true);
        } else if (view === 'list') {
            navigation.navigate('HomeLlista');
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Ionicons
                key={index}
                name={index < rating ? "star" : "star-outline"}
                size={16}
                color={index < rating ? '#FFD700' : '#CBD5E0'}
                style={{ marginRight: 2 }}
            />
        ));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mapa</Text>
                <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={() => navigation.navigate('Info')}
                >
                    <Ionicons name="settings-outline" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, styles.activeTab]}
                    onPress={() => toggleMapList('map')}
                >
                    <Text style={[styles.tabText, styles.activeTabText]}>Mapa</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.tab}
                    onPress={() => toggleMapList('list')}
                >
                    <Text style={styles.tabText}>Llista</Text>
                </TouchableOpacity>
            </View>

            {/* Ajustem l'alçada del mapa */}
            <View style={styles.mapContainer}>
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
                        >
                            <Callout>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutTitle}>{location.name}</Text>
                                    <Text style={styles.calloutCategory}>{location.category}</Text>
                                    <Text style={styles.calloutDescription}>{location.description}</Text>
                                    <View style={styles.calloutRating}>
                                        {renderStars(location.rating)}
                                    </View>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
            </View>

            {/* Componente FSection a la part inferior */}
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
    tabContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
        marginHorizontal: 4,
    },
    activeTab: {
        backgroundColor: '#2563EB',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748B',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    mapContainer: {
        flex: 0.8, // Limitem l'espai del mapa a 70% de la pantalla
        margin: 16,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    calloutContainer: {
        padding: 12,
        minWidth: 200,
        maxWidth: 250,
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    calloutCategory: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '600',
        marginBottom: 8,
    },
    calloutDescription: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 8,
        lineHeight: 20,
    },
    calloutRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
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
});
