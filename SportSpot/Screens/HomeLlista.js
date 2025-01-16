import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import FSection from '../components/FSection';
import Toast from 'react-native-toast-message'; // Importa Toast directament
import { firebase } from '../utils/firebaseConfig'; // Importa la configuració de Firebase
import { getFirestore, collection, getDocs, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function HomeLlista({ navigation }) {
    const [locations, setLocations] = useState([]);
    const [currentSection, setCurrentSection] = useState(1); // Secció actual
    const [user, setUser] = useState(null); // Emmagatzema l'usuari actual

    const auth = getAuth();

    // Funció per carregar les ubicacions des de Firebase
    const loadLocations = async () => {
        try {
            const db = getFirestore();
            const locationsCollection = collection(db, 'Locations');
            const locationSnapshot = await getDocs(locationsCollection);
            const locationList = locationSnapshot.docs.map((doc) => {
                const data = doc.data();
                const location = data.location; // Camp `location` amb subcamps `latitude` i `longitude`

                // Comprovar si `location` és vàlid
                if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
                    console.warn(`Ubicació sense coordenades vàlides: ${doc.id}`);
                    return null;
                }

                return {
                    id: doc.id,
                    name: data.name || 'Sense nom',
                    description: data.description || 'Sense descripció',
                    rating: data.rating || 0,
                    latitude: location.latitude, // Latitud
                    longitude: location.longitude, // Longitud
                    favorite: data.favorite || false,
                };
            }).filter((location) => location !== null); // Elimina ubicacions no vàlides
            setLocations(locationList);
        } catch (error) {
            console.error('Error carregant les ubicacions:', error);
            Alert.alert('Error', 'No s\'han pogut carregar les ubicacions');
        }
    };
    
    const handleSectionChange = (id) => {
        setCurrentSection(id);  // Actualitza la secció actual
    };
    
    
    const handlePress = (id) => {
        // Realitzar la navegació segons el botó premsat
        switch (id) {
            case 1:
                navigation.navigate("MenuPrincipal");
                break;
            case 2:
                navigation.navigate("Preferits");
                break;
            case 3:
                navigation.navigate("AfegirNovaUbicacio");
                break;
            case 4:
                navigation.navigate("Usuari");
                break;
            default:
                break;
        }
    };

    // Funció per carregar els preferits de l'usuari
    const loadUserFavorites = async (userId) => {
        const db = getFirestore();
        const userRef = doc(db, 'Users', userId);
        try {
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                const favoriteLocations = userData.favorites || [];

                // Actualitza la visibilitat dels favorits en les ubicacions
                setLocations((prevLocations) =>
                    prevLocations.map((item) => ({
                        ...item,
                        favorite: favoriteLocations.includes(item.id),
                    }))
                );
            }
        } catch (error) {
            console.error('Error carregant els preferits de l\'usuari:', error);
        }
    };

    // Funció per obtenir l'usuari actual
    const loadUser = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);
            loadUserFavorites(currentUser.uid); // Carregar els preferits de l'usuari
        }
    };

    useEffect(() => {
        loadLocations(); // Carregar les ubicacions quan es carrega el component
        loadUser(); // Carregar l'usuari actual
    }, []);

    // Funció per actualitzar la valoració de la ubicació a Firestore
    const updateRatingInFirestore = async (id, rating) => {
        const db = getFirestore();
        const locationRef = doc(db, 'Locations', id);
        try {
            await updateDoc(locationRef, { rating: rating });
        } catch (error) {
            console.error("Error actualitzant la valoració:", error);
        }
    };

    // Funció per eliminar una ubicació de Firebase
    const deleteLocation = async (id) => {
        const db = getFirestore();
        const locationRef = doc(db, 'Locations', id);
        try {
            await deleteDoc(locationRef); // Eliminar el document de la ubicació
            setLocations((prevLocations) => prevLocations.filter((location) => location.id !== id)); // Actualitzar la llista de ubicacions
            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Ubicació eliminada!',
                visibilityTime: 1500,
            });
        } catch (error) {
            console.error('Error eliminant la ubicació:', error);
            Alert.alert('Error', 'No s\'ha pogut eliminar les ubicacions');
        }
    };

    // Funció per mostrar l'alerta de confirmació d'eliminació
    const handleDeletePress = (id) => {
        Alert.alert(
            'Confirmar Eliminació',
            'Estàs segur que vols eliminar aquesta ubicació?',
            [
                {
                    text: 'Cancel·lar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    onPress: () => deleteLocation(id),
                },
            ],
            { cancelable: false }
        );
    };

    // Funció per actualitzar els preferits de l'usuari a Firestore
    const updateFavoritesInFirestore = async (locationId) => {
        const db = getFirestore();
        const userRef = doc(db, 'Users', user.uid); // Referència a l'usuari actual

        try {
            // Obtenir el document de l'usuari
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                let updatedFavorites;

                if (userData.favorites && userData.favorites.includes(locationId)) {
                    // Si la ubicació ja és als preferits, la traiem
                    updatedFavorites = userData.favorites.filter((id) => id !== locationId);
                } else {
                    // Si la ubicació no és als preferits, la afegim
                    updatedFavorites = [...(userData.favorites || []), locationId];
                }

                // Actualitzar els preferits de l'usuari
                await updateDoc(userRef, { favorites: updatedFavorites });

                // Actualitzar la visibilitat del cor (favorit) a la llista de locations
                setLocations((prevLocations) =>
                    prevLocations.map((item) =>
                        item.id === locationId ? { ...item, favorite: !item.favorite } : item
                    )
                );

                Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: 'Ubicació afegida als teus preferits!',
                    visibilityTime: 1500,
                });
            }
        } catch (error) {
            console.error('Error actualitzant els preferits:', error);
            Alert.alert('Error', 'No s\'ha pogut actualitzar els preferits');
        }
    };

    // Manejar clic en les estrelles
    const handleStarPress = (id, starIndex) => {
        const newRating = starIndex + 1;
        setLocations((prevLocations) =>
            prevLocations.map((item) =>
                item.id === id && item.rating !== newRating
                    ? { ...item, rating: newRating }
                    : item
            )
        );
        updateRatingInFirestore(id, newRating);
    };

    // Manejar clic en el cor
    const handleHeartPress = (id) => {
        updateFavoritesInFirestore(id);
    };

    const renderStars = (rating, id) => {
        return Array.from({ length: 5 }, (_, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(id, index)}
                style={styles.starButton}
            >
                <Ionicons
                    name="star-outline"
                    size={18}
                    color={index < rating ? 'yellow' : 'gray'}
                />
            </TouchableOpacity>
        ));
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Ionicons name="location-outline" size={24} color="black" style={styles.mapPinIcon} />
            <View style={styles.itemContent}>
                <View style={styles.itemTextContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('InformacionFicha', { locationId: item.id })}>
                        <Text style={styles.itemTitle}>{item.name || 'Nom desconegut'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.itemDescription}>{item.description || 'Descripció no disponible'}</Text>
                </View>
                <View style={styles.itemInfo}>
                    <View style={styles.starsContainer}>
                        {renderStars(item.rating, item.id)}
                    </View>
                    <TouchableOpacity onPress={() => handleHeartPress(item.id)}>
                        <Ionicons
                            name="heart-outline"
                            size={24}
                            color={item.favorite ? 'red' : 'black'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePress(item.id)}>
                        <Ionicons name="ellipsis-vertical" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
    
    

    return (
        <View style={{ flex: 1, marginTop: 50 }}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Info')}>
                        <Ionicons name="ellipsis-vertical" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Home Llista</Text>
                </View>

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

            <View style={styles.footerContainer}>
                <FSection currentSection={currentSection} onPress={handleSectionChange} navigation={navigation} />
            </View>
            <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'white',
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
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    mapPinIcon: {
        marginRight: 10,
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTextContainer: {
        flex: 1,
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
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 10,
    },
    starButton: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        marginHorizontal: 2,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: 'lightgrey',
        borderTopWidth: 1,
        borderTopColor: 'gray',
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: 'lightgrey',
    },
});
