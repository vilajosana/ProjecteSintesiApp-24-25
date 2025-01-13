import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Info({ navigation }) {
    const { width } = Dimensions.get('window');

    return (
        <View style={styles.container}>
            {/* Icona superior esquerra */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Imatge del corredor i seccions */}
            <View style={styles.content}>
                {/* Imatge del corredor */}
                <View style={styles.runnerImage}>
                    <Ionicons name="walk-outline" size={80} color="black" />
                </View>

                {/* Secció de Social Media */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Social media</Text>
                    <View style={styles.iconRow}>
                        <Ionicons name="logo-twitter" size={32} color="black" style={styles.icon} />
                        <Ionicons name="logo-instagram" size={32} color="black" style={styles.icon} />
                        <Ionicons name="logo-facebook" size={32} color="black" style={styles.icon} />
                    </View>
                </View>

                {/* Secció de creadors */}
                <View style={[styles.section, styles.creatorsSection]}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Creadors</Text>
                    </TouchableOpacity>
                    <View style={styles.creatorsRow}>
                        <View style={styles.creatorItem}>
                            <Ionicons name="person-circle-outline" size={32} color="black" />
                            <Text>Gerard</Text>
                        </View>
                        <View style={styles.creatorItem}>
                            <Ionicons name="person-circle-outline" size={32} color="black" />
                            <Text>Biel</Text>
                        </View>
                        <View style={styles.creatorItem}>
                            <Ionicons name="person-circle-outline" size={32} color="black" />
                            <Text>Eric</Text>
                        </View>
                    </View>
                </View>

                {/* Secció de Contactar */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Contactar</Text>
                    </TouchableOpacity>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactText}>📞 999 999 999</Text>
                        <Text style={styles.contactText}>✉️ holaeric@rubias.com</Text>
                        <Text style={styles.contactText}>📍 Carrer de Folch i Torres, 5, 13, 08241 Manresa (Barcelona)</Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2025 Company Name</Text>
                <View style={styles.footerLinks}>
                    <TouchableOpacity onPress={() => navigation.navigate("PrivacyPolicy")}>
                        <Text style={styles.footerLink}>Política de Privacitat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("TermsOfService")}>
                        <Text style={styles.footerLink}>Termes i Condicions</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    headerIcon: {
        padding: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    runnerImage: {
        marginVertical: 20,
    },
    section: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '60%',
    },
    icon: {
        marginHorizontal: 10,
    },
    creatorsSection: {
        marginTop: 30,
    },
    creatorsRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '80%',
        marginTop: 10,
    },
    creatorItem: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#FF6347',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    contactInfo: {
        marginTop: 10,
        alignItems: 'center',
    },
    contactText: {
        fontSize: 14,
        marginVertical: 5,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,  // Aumenta el padding para que el recuadro sea más grande
        borderColor: 'grey',
        backgroundColor: 'white', // Fons blanc
        borderRadius: 20, // Arrodonir cantonades
        marginHorizontal: 10, // Màrgin lateral
        shadowColor: '#000', // Color de l'ombra
        shadowOffset: { width: 0, height: 2 }, // Offset de l'ombra
        shadowOpacity: 0.2, // Opacitat de l'ombra
        shadowRadius: 5, // Difusió de l'ombra
        elevation: 5, // Ombra per a Android
        position: 'absolute', // Col·loca el footer de manera absoluta
        bottom: 0, // Ajusta la distància des de la part inferior de la pantalla
        left: 0,
        right: 0,
        height: 100,  // Aumenta la altura del recuadro para hacerlo más grande
    },
    footerText: {
        fontSize: 14,
        color: '#808080',
        marginBottom: 10,
    },
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerLink: {
        fontSize: 14,
        color: '#FF6347',
        marginHorizontal: 15,
    },
});
