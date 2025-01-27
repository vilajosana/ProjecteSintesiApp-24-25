import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { firebase } from '../utils/firebaseConfig'; 
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Toast from 'react-native-toast-message'; 
import FSection from '../components/FSection'; // Importar el component FSection

export default function Preferits({ navigation }) {
    const [locations, setLocations] = useState([]);
    const [user, setUser] = useState(null);
    const [activeSection, setActiveSection] = useState(2); // Canviar a 2 per marcar la secció Preferits com a activa per defecte

    const auth = getAuth();

    const loadLocations = async () => {
        try {
            const db = getFirestore();
            const locationsCollection = collection(db, 'Locations');
            const locationSnapshot = await getDocs(locationsCollection);
            const locationList = locationSnapshot.docs.map(async (doc) => {
                const data = doc.data();
                const location = data.location;

                if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
                    console.warn(`Ubicació sense coordenades vàlides: ${doc.id}`);
                    return null;
                }

                let photoURL = null;
                if (data.photo) {
                    const storageRef = firebase.storage().ref(data.photo);  
                    try {
                        photoURL = await storageRef.getDownloadURL();
                    } catch (error) {
                        console.error("Error obtenint la URL de la imatge:", error);
                    }
                }

                return {
                    id: doc.id,
                    name: data.name || 'Sense nom',
                    description: data.description || 'Sense descripció',
                    photo: photoURL,  
                    rating: data.rating || 0,
                    latitude: location.latitude, 
                    longitude: location.longitude, 
                    category: data.category || 'Sense categoria', 
                    favorite: data.favorite || false,
                };
            });

            const resolvedLocations = await Promise.all(locationList);
            setLocations(resolvedLocations.filter((location) => location !== null));
        } catch (error) {
            console.error('Error carregant les ubicacions:', error);
            Alert.alert('Error', 'No s\'han pogut carregar les ubicacions');
        }
    };

    const loadUser = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);
        }
    };

    useEffect(() => {
        loadLocations(); 
        loadUser(); 
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                    <TouchableOpacity onPress={() => navigation.navigate('InformacionFicha', { locationId: item.id })}>
                        <Text style={styles.itemTitle}>{item.name || 'Nom desconegut'}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.itemDescription}>{item.description || 'Descripció no disponible'}</Text>
                <Text style={styles.itemCategory}>{item.category || 'Sense categoria'}</Text> 
            </View>
        </View>
    );

    // Funció per actualitzar la secció activa
    const handleSectionChange = (sectionIndex) => {
        setActiveSection(sectionIndex); 
    };

    return (
        <View style={{ flex: 1, marginTop: 50 }}>
            {/* Header idèntic al de HomeLlista */}
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Info')}>
                        <Ionicons name="ellipsis-vertical" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Preferits</Text>
                </View>
            </View>

            <FlatList
                data={locations}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />

            {/* Afegir el component FSection a la part inferior */}
            <View style={styles.footerContainer}>
                <FSection 
                    currentSection={activeSection} // Passar la secció activa com a prop
                    onPress={handleSectionChange}  // Actualitzar la secció activa quan es prem un botó
                    navigation={navigation} 
                />
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
        backgroundColor: '#FF6347',  // Taronja per a la secció activa
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
    },
    itemContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
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
    itemCategory: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 5,
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
});
