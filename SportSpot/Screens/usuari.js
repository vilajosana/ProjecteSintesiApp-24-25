import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig"; 
import FSection from '../components/FSection';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

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
                }
            }
        };
        fetchUserData();
    }, []);

    const handleSave = async () => {
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(db, "Users", user.uid);
            try {
                await setDoc(userDocRef, userData, { merge: true });
                setIsEditing(false);
            } catch (error) {
                console.error("Error desant les dades:", error);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.popToTop();
        } catch (error) {
            console.error("Error tancant la sessió:", error);
        }
    };

    const handlePress = (id) => {
        switch(id) {
            case 1: navigation.navigate("MenuPrincipal"); break;
            case 2: navigation.navigate("Preferits"); break;
            case 3: navigation.navigate("AfegirNovaUbicacio"); break;
            case 4: navigation.navigate("Usuari"); break;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Perfil d'Usuari</Text>
                <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={() => navigation.navigate('Info')}
                >
                    <Ionicons name="settings-outline" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Profile Image */}
                <View style={styles.profileImageContainer}>
                    <Image 
                        source={require('../assets/profile_image.jpg')} 
                        style={styles.profileImage}
                    />
                </View>

                {/* User Info */}
                <View style={styles.card}>
                    {isEditing ? (
                        <>
                            <TextInput 
                                style={styles.input}
                                value={userData.name}
                                onChangeText={(text) => setUserData({ ...userData, name: text })}
                                placeholder="Nom"
                            />
                            <TextInput 
                                style={styles.input}
                                value={userData.surname}
                                onChangeText={(text) => setUserData({ ...userData, surname: text })}
                                placeholder="Cognoms"
                            />
                        </>
                    ) : (
                        <>
                            <Text style={styles.nameText}>{userData.name || "Nom"}</Text>
                            <Text style={styles.surnameText}>{userData.surname || "Cognoms"}</Text>
                        </>
                    )}

                    <View style={styles.infoItem}>
                        <MaterialIcons name="email" size={20} color="#2563EB" style={styles.icon} />
                        <Text style={styles.infoText}>{auth.currentUser?.email}</Text>
                    </View>

                    {isEditing ? (
                        <TextInput 
                            style={styles.input}
                            value={userData.phone}
                            onChangeText={(text) => setUserData({ ...userData, phone: text })}
                            placeholder="Telèfon"
                        />
                    ) : (
                        <View style={styles.infoItem}>
                            <FontAwesome name="phone" size={20} color="#2563EB" style={styles.icon} />
                            <Text style={styles.infoText}>{userData.phone || "Telèfon no disponible"}</Text>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <TouchableOpacity 
                        style={[
                            styles.button,
                            isEditing ? styles.saveButton : styles.editButton
                        ]} 
                        onPress={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                        <Text style={styles.buttonText}>
                            {isEditing ? "Guardar" : "Editar"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, styles.logoutButton]} 
                        onPress={handleLogout}
                    >
                        <Text style={[styles.buttonText, styles.logoutText]}>
                            Tancar Sessió
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footer}>
                <FSection
                currentSection={4}
                onPress={handlePress} // Assegurem-nos que handlePress està definit
                navigation={navigation}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
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
    content: {
        flex: 1,
        padding: 16,
    },
    profileImageContainer: {
        alignSelf: 'center',
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#2563EB',
        overflow: 'hidden',
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    nameText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    surnameText: {
        fontSize: 18,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 24,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    icon: {
        marginRight: 12,
    },
    infoText: {
        color: '#1F2937',
        fontSize: 16,
    },
    input: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 16,
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    editButton: {
        backgroundColor: '#2563EB',
    },
    saveButton: {
        backgroundColor: '#059669',
    },
    logoutButton: {
        backgroundColor: '#EF4444',
        marginTop: 16,
    },
    logoutText: {
        color: '#FFFFFF',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingVertical: 8,
        zIndex: 1, // Per garantir que estigui per sobre del mapa
    },
});

export default Usuari;