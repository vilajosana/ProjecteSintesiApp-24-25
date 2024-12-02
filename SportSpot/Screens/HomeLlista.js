import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import FSection from '../components/FSection';

export default function HomeLlista({ navigation }) {
    const [locations, setLocations] = useState([]);

    // Cargar datos de AsyncStorage al iniciar la pantalla
    useEffect(() => {
        loadLocations();
    }, []);

    // Función para cargar datos desde AsyncStorage
    const loadLocations = async () => {
        try {
            const storedLocations = await AsyncStorage.getItem('locations');
            if (storedLocations !== null) {
                setLocations(JSON.parse(storedLocations));
            } else {
                // Datos iniciales si no hay nada en AsyncStorage
                setLocations([
                    { id: '1', title: 'Camp de Futbol', description: 'Estadi Municipal el Congost', rating: 0, favorite: false },
                    { id: '2', title: 'Pavelló Municipal', description: 'Pavelló Nou Congost', rating: 0, favorite: false },
                    { id: '3', title: 'Pista de Pàdel', description: 'The Club Padel Manresa', rating: 0, favorite: false },
                ]);
            }
        } catch (error) {
            console.error('Error loading locations:', error);
        }
    };

    // Función para guardar datos en AsyncStorage
    const saveLocations = async (updatedLocations) => {
        try {
            await AsyncStorage.setItem('locations', JSON.stringify(updatedLocations));
        } catch (error) {
            console.error('Error saving locations:', error);
        }
    };

    // Manejar clic en las estrellas
    const handleStarPress = (id, starIndex) => {
        const updatedLocations = locations.map((item) =>
            item.id === id ? { ...item, rating: starIndex + 1 } : item
        );
        setLocations(updatedLocations);
        saveLocations(updatedLocations); // Guardar cambios
    };

    // Manejar clic en el corazón
    const handleHeartPress = (id) => {
        const updatedLocations = locations.map((item) =>
            item.id === id ? { ...item, favorite: !item.favorite } : item
        );
        setLocations(updatedLocations);
        saveLocations(updatedLocations); // Guardar cambios

        // Mostrar notificación usando Toast
        Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Elemento guardado en favoritos',
            visibilityTime: 1500,
        });
    };

    // Función para renderizar las estrellas
    const renderStars = (rating, id) => {
        return Array.from({ length: 5 }, (_, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(id, index)}
                style={styles.starButton}
            >
                <Ionicons
                    name={index < rating ? 'star' : 'star-outline'}
                    size={24}
                    color={index < rating ? 'black' : 'gray'}
                />
            </TouchableOpacity>
        ));
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <View style={styles.itemInfo}>
                    <View style={styles.starsContainer}>
                        {renderStars(item.rating, item.id)}
                    </View>
                    <TouchableOpacity onPress={() => handleHeartPress(item.id)}>
                        <Ionicons
                            name={item.favorite ? 'heart' : 'heart-outline'}
                            size={24}
                            color={item.favorite ? 'red' : 'black'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Home Llista</Text>
                <View style={styles.buttonArea}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('MenuPrincipal')}
                    >
                        <Text style={styles.buttonText}>Mapa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buttonSelected]}>
                        <Text style={styles.buttonText}>Llista</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={locations}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />

            {/* Componente FSection */}
            <View style={styles.footerContainer}>
                <FSection currentSection={1} onPress={() => {}} navigation={navigation} />
            </View>

            <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'grey',
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
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
    buttonArea: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'transparent',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
        width: '40%',
        alignItems: 'center',
    },
    buttonSelected: {
        backgroundColor: '#FF6347',
    },
    buttonText: {
        fontSize: 16,
        color: 'black',
    },
    listContainer: {
        paddingHorizontal: 25,
    },
    item: {
        backgroundColor: 'lightgrey',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    mapPinIcon: {
        position: 'absolute',
        top: 15,
        left: 10,
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTextContainer: {
        flex: 1,
        marginLeft: 40,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    itemDescription: {
        fontSize: 14,
        color: 'gray',
    },
    starsContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: 'lightgray',
        borderTopWidth: 1,
        borderTopColor: 'gray',
    },
});
