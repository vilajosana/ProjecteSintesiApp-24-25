    import React, { useState, useEffect } from 'react';
    import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
    import { Ionicons } from 'react-native-vector-icons';
    import FSection from '../components/FSection';
    import Toast from 'react-native-toast-message'; // Importa Toast directament
    import { firebase } from '../utils/firebaseConfig'; // Importa la configuració de Firebase
    import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

    export default function HomeLlista({ navigation }) {
        const [locations, setLocations] = useState([]);
        const [currentSection, setCurrentSection] = useState(1); // Sección actual

        // Funció per carregar les ubicacions des de Firebase
        const loadLocations = async () => {
            try {
                const db = getFirestore();
                const locationsCollection = collection(db, 'Locations'); // 'Locations' és el nom de la col·lecció a Firebase
                const locationSnapshot = await getDocs(locationsCollection);
                const locationList = locationSnapshot.docs.map(doc => ({
                    id: doc.id, 
                    title: doc.data().Nom, // 'Nom' és el camp que tens a la teva BD
                    description: doc.data().Geolocation, // 'Geolocation' és el camp que tens a la teva BD
                    rating: doc.data().rating || 0, // Si la valoració no existeix, assignem 0
                    favorite: doc.data().favorite || false, // Inicialment no està a favorits
                }));
                setLocations(locationList);
            } catch (error) {
                console.error('Error loading locations:', error);
                Alert.alert('Error', 'No s\'han pogut carregar les ubicacions');
            }
        };

        useEffect(() => {
            loadLocations(); // Carregar les ubicacions quan es carrega el component
        }, []);

        // Funció per actualitzar la valoració de la ubicació a Firestore
        const updateRatingInFirestore = async (id, rating) => {
            const db = getFirestore();
            const locationRef = doc(db, 'Locations', id); // Referència al document de la ubicació
            try {
                await updateDoc(locationRef, {
                    rating: rating, // Actualitzem la valoració
                });
            } catch (error) {
                console.error('Error updating rating:', error);
                Alert.alert('Error', 'No s\'ha pogut actualitzar la valoració');
            }
        };

        // Manejar clic en les estrelles
        const handleStarPress = (id, starIndex) => {
            const newRating = starIndex + 1; // Calculant la nova valoració
            setLocations((prevLocations) =>
                prevLocations.map((item) =>
                    item.id === id && item.rating !== newRating
                        ? { ...item, rating: newRating }
                        : item
                )
            );
            // Actualitzar la valoració a Firestore
            updateRatingInFirestore(id, newRating);
        };

        // Manejar clic en el cor
        const handleHeartPress = (id) => {
            setLocations((prevLocations) =>
                prevLocations.map((item) =>
                    item.id === id
                        ? { ...item, favorite: !item.favorite }
                        : item
                )
            );
            // Mostrar notificación usando Toast
            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Elemento guardado en favoritos',
                visibilityTime: 1500,
            });
        };

        // Manejar cambio de sección
        const handleSectionChange = (sectionId) => {
            setCurrentSection(sectionId);
            if (sectionId === 1) {
                navigation.navigate('MenuPrincipal');
            } else if (sectionId === 2) {
                navigation.navigate('AfegirNovaUbicacio');
            }
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
                        size={18} // Mida més petita
                        color={index < rating ? 'yellow' : 'gray'} // Groc quan es clica
                    />
                </TouchableOpacity>
            ));
        };

        const renderItem = ({ item }) => (
            <View style={styles.item}>
                <Ionicons name="location-outline" size={24} color="black" style={styles.mapPinIcon} />
                <View style={styles.itemContent}>
                    <View style={styles.itemTextContainer}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemDescription}>{item.description}</Text>
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
                        <TouchableOpacity onPress={() => navigation.navigate('Allinfo')}>
                            <Ionicons
                                name="ellipsis-vertical"
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );

        return (
            <View style={{ flex: 1, marginTop: 50 }}> {/* Aquí afegim el marginTop */}
                <View style={styles.headerContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Allinfo')}>
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

                {/* Aquí agregamos el componente FSection */}
                <View style={styles.footerContainer}>
                    <FSection currentSection={currentSection} onPress={handleSectionChange} navigation={navigation} />
                </View>

                {/* Configuració de la navegació dels botons */}
                <View style={styles.footerButtons}>
                    <TouchableOpacity onPress={() => navigation.navigate('AfegirNovaUbicacio')}>
                        <Ionicons name="add" size={40} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Preferits')}>
                        <Ionicons name="heart" size={40} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Usuari')}>
                        <Ionicons name="person" size={40} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Configuración de Toast */}
                <Toast />
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
            flex: 1, // Permet que el nom ocupi més espai
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
