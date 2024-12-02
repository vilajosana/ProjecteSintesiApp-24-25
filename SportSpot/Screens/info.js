import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FSection from '../components/FSection'; // Si vols reutilitzar aquest component

export default function Info({ navigation }) {
    const [isFilterVisible, setFilterVisible] = useState(false);

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

    const handleFilterPress = () => {
        setFilterVisible(!isFilterVisible);
        console.log("Ícono de filtro presionado");
    };

    const { width, height } = Dimensions.get('window');

    // Funció per tornar a la pàgina principal
    const handleGoBackToMain = () => {
        navigation.navigate("MenuPrincipal");
    };

    // Funció per navegar a la pantalla Allinfo
    const navigateToAllInfo = () => {
        navigation.navigate("Allinfo");
    };

    return (
        <View style={styles.container}>
            {/* Capçalera amb botó de tornada */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Configuració</Text>
            </View>

            {/* Botó d'Informació a la part superior */}
            <View style={styles.content}>
                <TouchableOpacity onPress={navigateToAllInfo} style={styles.rectangularButton}>
                    <Text style={styles.buttonText}>Informació</Text>
                </TouchableOpacity>
            </View>

            {/* Botó per tornar a la pàgina principal */}
            <View style={styles.centeredBottomButtonContainer}>
                <TouchableOpacity onPress={handleGoBackToMain} style={styles.button}>
                    <Text style={styles.buttonText}>Tornar a la pàgina principal</Text>
                </TouchableOpacity>
            </View>

            {/* Secció de navegació a la part inferior amb els mateixos botons */}
            <View style={styles.section}>
                <FSection currentSection={1} onPress={handlePress} navigation={navigation} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', // Fons de la pantalla
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey',
        paddingVertical: 10,
        marginTop: 50,  // Afegim un margin superior per separar de la part superior
        width: '100%',  // Amplada completa
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
    content: {
        flex: 1, // Es deixa una part superior per al botó de "Informació"
        justifyContent: 'flex-start',  // Col·loca el botó al principi
        alignItems: 'center',  // Centra el botó horitzontalment
        paddingTop: 20,  // Separació superior per al botó
    },
    button: {
        backgroundColor: '#FF6347', // Color de fons del botó
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FF6347',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    rectangularButton: {
        backgroundColor: '#808080', // Color gris per al botó
        paddingVertical: 15,
        paddingHorizontal: 40, // Ampliem el padding horitzontal per mantenir la forma rectangular
        borderRadius: 20,  // Puntes arrodonides però no circulars
        borderWidth: 1,
        borderColor: '#808080', // Bordes del mateix color gris
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredBottomButtonContainer: {
        flex: 1, // Fa que aquest contenidor ocupi tota la seva alçada disponible
        justifyContent: 'flex-end', // Col·loca el botó a la part inferior
        alignItems: 'center', // Centra el botó horitzontalment
        marginBottom: 30, // Opcional per deixar un espai entre el botó i la part inferior de la pantalla
        width: '100%', // Amplada completa
        
    },
    section: {
        flex: 1,
    },
});
