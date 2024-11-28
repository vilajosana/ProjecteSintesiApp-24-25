import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import FSection from '../components/FSection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Filter from '../components/filter';

export default function MenuPrincipal({ navigation }) {
    const [isMapVisible, setIsMapVisible] = useState(true);
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [selectedZones, setSelectedZones] = useState([]); // Estado para las zonas seleccionadas

    const handlePress = (id) => {
        console.log("Han clicat al botó " + id);
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
            navigation.navigate('HomeLlista'); // Navegar a la pantalla HomeLlista
        }
    };

    const handleFilterPress = () => {
        setFilterVisible(!isFilterVisible);
        console.log("Ícono de filtro presionado");
    };

    const { width, height } = Dimensions.get('window');

    const handleFooterPress = () => {
        console.log("Texto del footer presionado");
    };

    const handleIconPress = () => {
        console.log("Ícono de los tres puntos presionado");
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleIconPress} style={styles.headerIcon}>
                    <Ionicons name="ellipsis-vertical" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Menú Principal</Text>
            </View>
            <View style={styles.mapContainer}>
                <View style={styles.buttonArea}>
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

                {isMapVisible ? (
                    <MapView
                        style={{ width: width * 1, height: height * 0.5 }}
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
                ) : (
                    <View style={styles.listContainer}>
                        <Text style={styles.listItem}>Llista de Elementos</Text>
                    </View>
                )}

{isFilterVisible && (
    <Filter 
        selectedZones={selectedZones} 
        setSelectedZones={setSelectedZones} 
        onClose={() => setFilterVisible(false)}  // Aquí es donde se cierra el filtro
    />
)}

            </View>
            <TouchableOpacity style={styles.footer} onPress={handleFooterPress}>
                <Text style={styles.footerText}>Afegir Ubicació</Text>
                <View style={styles.circleIcon}>
                    <Ionicons name="add" size={24} color="black" />
                </View>
            </TouchableOpacity>
            <View style={styles.space} />
            <View style={styles.section}>
                <FSection currentSection={1} onPress={handlePress} navigation={navigation} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'grey',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    headerTitle: {
        fontSize: 24,
        color: 'black',
        textAlign: 'center',
        flex: 1,
    },
    headerIcon: {
        padding: 10,
    },
    mapContainer: {
        flex: 7,
        backgroundColor: 'grey',
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
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
        padding: 10,
        width: '45%',
        alignItems: 'center',
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
    listContainer: {
        backgroundColor: 'lightgrey',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        width: '70%',
        alignItems: 'center',
    },
    listItem: {
        fontSize: 16,
        color: 'black',
    },
    footer: {
        backgroundColor: 'grey',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleIcon: {
        borderWidth: 4,
        borderColor: 'black',
        borderRadius: 50,
        padding: 6,
        marginLeft: 10,
    },
    footerText: {
        fontSize: 16,
        color: 'black',
    },
    section: {
        flex: 1,
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
});
