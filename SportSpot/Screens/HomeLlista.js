import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import FSection from '../components/FSection';  // Importa el teu component FSection
import Toast from 'react-native-toast-message';
import { firebase } from '../utils/firebaseConfig';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function HomeLlista({ navigation }) {
    const [locations, setLocations] = useState([]);
    const [currentSection, setCurrentSection] = useState(1);
    const [user, setUser] = useState(null);

    const auth = getAuth();

    const loadLocations = async () => {
        try {
            const db = getFirestore();
            const locationsCollection = collection(db, 'Locations');
            const locationSnapshot = await getDocs(locationsCollection);
            const locationList = locationSnapshot.docs.map(async (doc) => {
                const data = doc.data();
                const location = data.location;

                // Comprovar si les coordenades són vàlides
                if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
                    console.warn(`Ubicació sense coordenades vàlides: ${doc.id}`);
                    return null;
                }

                return {
                    id: doc.id,
                    name: data.name || 'Sense nom',
                    description: data.description || 'Sense descripció',
                    photo: null,  // Ja no assignem cap imatge
                    rating: data.rating || 0,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    category: data.category || 'Sense categoria',
                    favorite: data.favorite || false,
                };
            });

            // Esperar que totes les ubicacions siguin resoltes
            const resolvedLocations = await Promise.all(locationList);
            setLocations(resolvedLocations.filter((location) => location !== null));
        } catch (error) {
            console.error('Error carregant les ubicacions:', error);
            Alert.alert('Error', 'No s\'han pogut carregar les ubicacions');
        }
    };

    const handleSectionChange = (id) => {
        setCurrentSection(id);
    };

    const handlePress = (id) => {
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

    const loadUserFavorites = async (userId) => {
        const db = getFirestore();
        const userRef = doc(db, 'Users', userId);
        try {
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                const favoriteLocations = userData.favorites || [];
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

    const loadUser = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);
            loadUserFavorites(currentUser.uid);
        }
    };

    useEffect(() => {
        loadLocations();
        loadUser();
    }, []);

    const updateRatingInFirestore = async (id, rating) => {
        const db = getFirestore();
        const locationRef = doc(db, 'Locations', id);
        try {
            await updateDoc(locationRef, { rating: rating });
        } catch (error) {
            console.error("Error actualitzant la valoració:", error);
        }
    };

    const updateFavoritesInFirestore = async (locationId) => {
        const db = getFirestore();
        const userRef = doc(db, 'Users', user.uid);

        try {
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                let updatedFavorites;

                if (userData.favorites && userData.favorites.includes(locationId)) {
                    updatedFavorites = userData.favorites.filter((id) => id !== locationId);
                } else {
                    updatedFavorites = [...(userData.favorites || []), locationId];
                }

                await updateDoc(userRef, { favorites: updatedFavorites });

                setLocations((prevLocations) =>
                    prevLocations.map((item) =>
                        item.id === locationId ? { ...item, favorite: !item.favorite } : item
                    )
                );
            }
        } catch (error) {
            console.error('Error actualitzant els preferits:', error);
            Alert.alert('Error', 'No s\'ha pogut actualitzar els preferits');
        }
    };

    const renderStars = (rating, id) => {
        return Array.from({ length: 5 }, (_, index) => (
            <TouchableOpacity
                key={index}
                style={styles.starContainer}
            >
                <Ionicons
                    name={index < rating ? "star" : "star-outline"}
                    size={16}
                    color={index < rating ? '#FFD700' : '#CBD5E0'}
                />
            </TouchableOpacity>
        ));
    };

    const renderHeart = (favorite, id) => {
        return (
            <TouchableOpacity 
                onPress={() => handleHeartPress(id)}
                style={styles.heartButton}
            >
                <Ionicons
                    name={favorite ? "heart" : "heart-outline"}
                    size={22}
                    color={favorite ? '#FF4B6A' : '#64748B'}
                />
            </TouchableOpacity>
        );
    };

    const handleHeartPress = (id) => {
        if (user) {
            updateFavoritesInFirestore(id);  // La funció que ja tens per actualitzar els preferits
        } else {
            Alert.alert('Has d\'iniciar sessió', 'Necessites iniciar sessió per afegir als preferits.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {item.photo ? (
                <Image source={item.photo} style={styles.cardImage} />
            ) : (
                <View style={styles.cardImage} /> 
            )}
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <TouchableOpacity 
                        style={styles.titleContainer}
                        onPress={() => navigation.navigate('InformacionFicha', { locationId: item.id })}
                    >
                        <Text style={styles.cardTitle}>{item.name || 'Nom desconegut'}</Text>
                        <Text style={styles.cardCategory}>{item.category || 'Sense categoria'}</Text>
                    </TouchableOpacity>
                    {renderHeart(item.favorite, item.id)}
                </View>
                
                <Text style={styles.cardDescription} numberOfLines={2}>
                    {item.description || 'Descripció no disponible'}
                </Text>
                
                <View style={styles.cardFooter}>
                    <View style={styles.ratingContainer}>
                        {renderStars(item.rating, item.id)}
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Llista</Text>
                <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={() => navigation.navigate('Info')}
                >
                    <Ionicons name="settings-outline" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navigation.navigate('MenuPrincipal')}
                >
                    <Text style={styles.tabText}>Mapa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                    <Text style={[styles.tabText, styles.activeTabText]}>Llista</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={locations}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
            <View style={styles.footer}>
                <FSection
                    currentSection={1}
                    onPress={handlePress}
                    navigation={navigation}
                />
            </View>
            
            <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        paddingBottom: 100, // Space for FSection at the bottom
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
    listContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardContent: {
        padding: 16,
        marginTop: 0, // Eliminar l'espai superior de la imatge dins el contingut
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleContainer: {
        flex: 1,
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    cardCategory: {
        fontSize: 14,
        color: '#6B7280',
    },
    cardDescription: {
        fontSize: 14,
        color: '#4B5563',
        marginTop: 8,
    },
    cardFooter: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    heartButton: {
        padding: 8,
    },
    starContainer: {
        marginRight: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    }
});
