import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import FSection from '../components/FSection';
import Toast from 'react-native-toast-message';

export default function HomeLlista({ navigation }) {
    const [locations, setLocations] = useState([
        { id: '1', title: 'Camp de Futbol', description: 'Estadi Municipal el Congost', rating: 0, favorite: false },
        { id: '2', title: 'Pavelló Municipal', description: 'Pavelló Nou Congost', rating: 0, favorite: false },
        { id: '3', title: 'Pista de Pàdel', description: 'The Club Padel Manresa', rating: 0, favorite: false },
    ]);
    const [currentSection, setCurrentSection] = useState(1); // Sección actual

    // Manejar clic en las estrellas
    const handleStarPress = (id, starIndex) => {
        setLocations((prevLocations) =>
            prevLocations.map((item) =>
                item.id === id && item.rating !== starIndex + 1
                    ? { ...item, rating: starIndex + 1 }
                    : item
            )
        );
    };

    // Manejar clic en el corazón
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
                    size={24}
                    color={index < rating ? 'black' : 'gray'}
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
                </View>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, marginTop: 50 }}> {/* Aquí afegim el marginTop */}
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerIcon}>
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

            {/* Configuración de Toast */}
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
});
