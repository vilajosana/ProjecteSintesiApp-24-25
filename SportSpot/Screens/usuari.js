import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig"; 
import FSection from '../components/FSection';
import { MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';

const Usuari = ({ navigation }) => {
    const [userData, setUserData] = useState({ name: '', surname: '', phone: '' });
    const [isEditing, setIsEditing] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;

            if (user) {
                const userDocRef = doc(db, "Users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                } else {
                    console.log("No s'ha trobat el document de l'usuari.");
                }
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("Sessió tancada correctament.");
            navigation.popToTop();
        } catch (error) {
            console.error("Error tancant la sessió:", error);
        }
    };

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* Botó "tres puntets" per obrir el menú - baixat una mica */}
                <TouchableOpacity 
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Info')}  // Canviat per navegar a "Allinfo"
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
                    {isEditing ? (
                        <TextInput 
                            style={styles.editableInput}
                            value={userData.name}
                            onChangeText={(text) => setUserData({ ...userData, name: text })}
                            placeholder="Nom"
                        />
                    ) : (
                        <View style={styles.circularNameContainer}>
                            <Text style={styles.nameText}>{userData.name || "Nom"}</Text>
                        </View>
                    )}

                    {isEditing ? (
                        <TextInput 
                            style={styles.editableInput}
                            value={userData.surname}
                            onChangeText={(text) => setUserData({ ...userData, surname: text })}
                            placeholder="Cognoms"
                        />
                    ) : (
                        <View style={styles.circularSurnameContainer}>
                            <Text style={styles.surnameText}>{userData.surname || "Cognoms"}</Text>
                        </View>
                    )}

                    <View style={styles.infoItem}>
                        <MaterialIcons name="email" size={20} color="black" style={styles.icon} />
                        <Text style={styles.infoText}>{auth.currentUser?.email || "Correu electrònic"}</Text>
                    </View>

                    {isEditing ? (
                        <TextInput 
                            style={styles.editableInput}
                            value={userData.phone}
                            onChangeText={(text) => setUserData({ ...userData, phone: text })}
                            placeholder="Telèfon"
                        />
                    ) : (
                        <View style={styles.infoItem}>
                            <FontAwesome name="phone" size={20} color="black" style={styles.icon} />
                            <Text style={styles.infoText}>{userData.phone || "Telèfon no disponible"}</Text>
                        </View>
                    )}

                    {isEditing ? (
                        <TouchableOpacity 
                            style={styles.saveButton} 
                            onPress={() => setIsEditing(false)}
                        >
                            <Text style={styles.saveText}>Guardar</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            style={styles.editButton} 
                            onPress={() => setIsEditing(true)}
                        >
                            <Text style={styles.editText}>Editar</Text>
                        </TouchableOpacity>
                    )}

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
        marginTop: 30,  // Augmentat per baixar-lo més
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
    },
    circularSurnameContainer: {
        backgroundColor: '#e0e0e0',
        borderRadius: 50,
        paddingVertical: 8,
        paddingHorizontal: 60,
        marginBottom: 10,
        alignItems: 'center',
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
    editableInput: {
        backgroundColor: '#f0f0f0',
        width: '100%',
        padding: 10,
        borderRadius: 25,
        marginVertical: 5,
        textAlign: 'center',
        fontSize: 16,
    },
    editButton: {
        backgroundColor: '#99ccff',
        width: '100%',
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    editText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#66bb6a',
        width: '100%',
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    saveText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Usuari;
