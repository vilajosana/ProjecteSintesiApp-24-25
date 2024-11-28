import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import FSection from '../components/FSection';
import { MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';

const Usuari = ({ navigation }) => {
    const handlePress = (id) => {
        console.log("Han clicat al botó " + id);
        if (id === 1) {
            navigation.navigate("MenuPrincipal");
        } else if (id === 2) {
            navigation.navigate("Preferits");
        } else if (id === 3) {
            navigation.navigate("AfegirNovaUbicacio");
        }
    };

    const handleLogout = () => {
        console.log("Tancar Sessió");
        navigation.popToTop(); // Regresa a la pantalla inicial (Inici)
    };

    const handleMenu = () => {
        console.log("Menu clicked");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.menuButton}
                    onPress={handleMenu}
                >
                    <Entypo name="dots-three-vertical" size={24} color="black" />
                </TouchableOpacity>
                <Image 
                    source={require('../assets/user_profile.png')} 
                    style={styles.headerImage} 
                />
            </View>
            <View style={styles.userInfo}>
                <View style={styles.profileImageContainer}>
                    <Image 
                        source={require('../assets/profile_image.jpg')} 
                        style={styles.profileImage} 
                    />
                </View>
                
                <View style={styles.infoContainer}>
                    <View style={styles.circularNameContainer}>
                        <View style={styles.leftDot} />
                        <Text style={styles.nameText}>Carlos</Text>
                        <View style={styles.rightDot} />
                    </View>
                    <View style={styles.circularSurnameContainer}>
                        <View style={styles.leftDotSurname} />
                        <Text style={styles.surnameText}>Rodriguez Lopez</Text>
                        <View style={styles.rightDotSurname} />
                    </View>
                    
                    <View style={styles.infoItem}>
                        <MaterialIcons name="email" size={20} color="black" style={styles.icon} />
                        <Text style={styles.infoText}>carlos@gmail.com</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <FontAwesome name="phone" size={20} color="black" style={styles.icon} />
                        <Text style={styles.infoText}>+34 622 680 126</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.logoutButton} 
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutText}>Tancar Sessió</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.footer}>
                <FSection currentSection={4} onPress={handlePress} navigation={navigation} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        width: Dimensions.get('window').width,
        height: 175,
        backgroundColor: '#ffffff',
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    headerImage: {
        flex: 1,
        height: '100%',
        resizeMode: 'cover',
    },
    menuButton: {
        padding: 10,
        zIndex: 1,
        marginTop: 10,
        marginLeft: 10,
    },
    userInfo: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    profileImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#000',
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    infoContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 15,
    },
    circularNameContainer: {
        backgroundColor: '#6c757d',
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 100,
        marginBottom: 5,
        alignItems: 'center',
        position: 'relative',
    },
    leftDot: {
        position: 'absolute',
        top: '80%',
        left: 20,
        transform: [{ translateY: -5 }],
        width: 10,
        height: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    rightDot: {
        position: 'absolute',
        top: '80%',
        right: 20,
        transform: [{ translateY: -5 }],
        width: 10,
        height: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    circularSurnameContainer: {
        backgroundColor: '#e0e0e0',
        borderRadius: 50,
        paddingVertical: 8,
        paddingHorizontal: 60,
        marginBottom: 10,
        alignItems: 'center',
        position: 'relative',
    },
    leftDotSurname: {
        position: 'absolute',
        top: '80%',
        left: 20,
        transform: [{ translateY: -5 }],
        width: 10,
        height: 10,
        backgroundColor: 'black',
        borderRadius: 5,
    },
    rightDotSurname: {
        position: 'absolute',
        top: '80%',
        right: 20,
        transform: [{ translateY: -5 }],
        width: 10,
        height: 10,
        backgroundColor: 'black',
        borderRadius: 5,
    },
    nameText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    surnameText: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0e0',
        width: '100%',
        padding: 12,
        borderRadius: 25,
        marginVertical: 5,
    },
    icon: {
        marginRight: 10,
    },
    infoText: {
        color: 'black',
        fontSize: 14,
    },
    logoutButton: {
        backgroundColor: '#ff9999',
        width: '100%',
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 15,
    },
    logoutText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        width: '100%',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        position: 'absolute',
        bottom: 0,
    },
});

export default Usuari;
