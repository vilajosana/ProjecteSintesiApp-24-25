import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import FSection from '../components/FSection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Filter from '../components/filter';
import * as Animatable from 'react-native-animatable';

export default function MenuPrincipal({ navigation }) {
    const [isMapVisible, setIsMapVisible] = useState(true);
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [selectedZones, setSelectedZones] = useState([]);

    const handlePress = (id) => {
        if (id === 1) {
            navigation.navigate("MenuPrincipal");
        } else if (id === 2) {
            navigation.navigate("Preferits");
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

    const handleFilterPress = () => {
        setFilterVisible(!isFilterVisible);
    };

    const handleIconPress = () => {
        navigation.navigate("Info");
    };

    const { width, height } = Dimensions.get('window');

    return (
        <View style={{ flex: 1, paddingTop: 50 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleIconPress} style={styles.headerIcon}>
                    <Ionicons name="ellipsis-vertical" size={24} color="black" />
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
                    <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
                        <AntDesign name="filter" size={24} color="black" />
                    </TouchableOpacity>
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
                            <Marker
                                coordinate={{ latitude: 41.721010, longitude: 1.815320 }}
                                title={"Estadi Municipal El Congost- CE Manresa"}
                                description={"Descripción de la nueva ubicación"}
                            >
                                <Callout>
                                    <View style={styles.calloutContainer}>
                                        <Ionicons name="football" size={30} color="black" style={styles.footballIcon} />
                                        <Image
                                            source={{ uri: 'https://example.com/icon.png' }}
                                            style={styles.calloutIcon}
                                        />
                                        <Text style={styles.calloutTitle}>Estadi Municipal el Nou Congost</Text> 
                                        <Text style={styles.calloutDescription}>Camp de Futbol</Text> 
                                        <View style={styles.ratingContainer}>
                                            <Text>⭐⭐⭐⭐⭐</Text> 
                                        </View>
                                        <TouchableOpacity style={styles.heartButton}>
                                            <Ionicons name="heart" size={24} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                </Callout>
                            </Marker>
                        </MapView>
                    </View>
                )}

                {isFilterVisible && (
                    <Filter 
                        selectedZones={selectedZones} 
                        setSelectedZones={setSelectedZones} 
                        onClose={() => setFilterVisible(false)} 
                    />
                )}
            </View>

            <View style={styles.space} />
            <View style={styles.section}>
                <FSection currentSection={1} onPress={handlePress} navigation={navigation} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'linear-gradient(to right, #ff7e5f, #feb47b)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',  // Asegura que el títol estigui centrat
        padding: 10,
        borderBottomColor: '#ddd',
        shadowColor: '#000',
        shadowRadius: 4,
        backgroundColor: 'white',
    },
    headerTitleContainer: {
        flex: 1,  // Asegura que ocupa tot l'espai disponible
        justifyContent: 'center',
        alignItems: 'center', // Centra el títol
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginHorizontal: 20, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'semi-bold',
        color: 'black',
        textAlign: 'center', // Centrat del text
        fontFamily: 'Poppins'
    },
    headerIcon: {
        padding: 10,
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
        justifyContent: 'flex-start', // Canviat per a col·locar els botons a l'esquerra
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
    filterButton: {
        paddingHorizontal: 10,
        marginLeft: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
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
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
      },
    calloutContainer: {
        alignItems: 'center',
        width: 150,
    },
    calloutIcon: {
        width: 50,
        height: 50,
        marginBottom: 5,
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
    heartButton: {
        marginTop: 5,
    },
    footballIcon: {
        position: 'absolute',
        top: 30,
        left: '50%',
        transform: [{ translateX: -15 }],
    },
    space: {
        height: 20,
    },
    section: {
        flex: 1,
    },
});
