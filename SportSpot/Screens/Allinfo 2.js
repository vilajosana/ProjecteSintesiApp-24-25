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
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Configuració</Text>
            </View>

            <View style={styles.content}>
                {/* Botó per anar a la pantalla Allinfo */}
                <TouchableOpacity onPress={navigateToAllInfo} style={styles.button}>
                    <Text style={styles.buttonText}>Veure tota la informació</Text>
                </TouchableOpacity>
            </View>

            {/* Botó per tornar a la pàgina principal */}
            <View style={styles.centeredButtonContainer}>
                <TouchableOpacity onPress={handleGoBackToMain} style={styles.button}>
                    <Text style={styles.buttonText}>Tornar a la pàgina principal</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.space} />

            {/* Secció de navegació a la part inferior amb els mateixos botons */}
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
    content: {
        flex: 7,
        backgroundColor: 'lightgrey',
        padding: 20,
        marginTop: 50, // Afegim un marginTop de 50 per separar el contingut superior
        alignItems: 'center',
    },
    configText: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
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
    space: {
        height: 20, // Afegim espai entre seccions
    },
    centeredButtonContainer: {
        flex: 1,  // Això fa que ocupi tota l'alçada disponible
        justifyContent: 'center', // Centra verticalment el botó
        alignItems: 'center', // Centra horitzontalment el botó
    },
    button: {
        backgroundColor: '#FF6347', // Color de fons del botó
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FF6347',
        marginBottom: 20, // Opcional per afegir espai entre els botons
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
