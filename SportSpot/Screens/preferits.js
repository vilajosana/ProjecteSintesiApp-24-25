import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../utils/firebaseConfig';
import { doc, getDoc, collection } from 'firebase/firestore';
import FSection from '../components/FSection';
import { Ionicons } from '@expo/vector-icons';

const Preferits = ({ navigation }) => {
    const [uid, setUid] = useState(null);
    const [favorits, setFavorits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            setUid(user.uid);
            carregarFavorits(user.uid);
        } else {
            Alert.alert('Error', 'No hi ha cap usuari connectat.');
            setLoading(false);
        }
    }, []);

    const carregarFavorits = async (uid) => {
        try {
            if (!uid) {
                console.error('El UID no és vàlid.');
                return;
            }

            const userRef = doc(db, 'Users', uid);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                const favoriteIds = userData.favorites || [];

                if (favoriteIds.length > 0) {
                    const locationPromises = favoriteIds.map(async (favId) => {
                        const locationRef = doc(db, 'Locations', favId);
                        const locationSnapshot = await getDoc(locationRef);
                        if (locationSnapshot.exists()) {
                            return { id: locationSnapshot.id, ...locationSnapshot.data() };
                        }
                    });

                    const locationsArray = await Promise.all(locationPromises);
                    setFavorits(locationsArray.filter((location) => location !== undefined));
                } else {
                    setFavorits([]);
                }
            } else {
                Alert.alert('Error', 'Usuari no trobat.');
            }
        } catch (error) {
            console.error('Error carregant favorits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = (id) => {
        switch (id) {
            case 1: navigation.navigate('MenuPrincipal'); break;
            case 3: navigation.navigate('AfegirNovaUbicacio'); break;
            case 4: navigation.navigate('Usuari'); break;
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.cardTitle}>{item.name || 'Sense nom'}</Text>
                        <Text style={styles.cardCategory}>{item.category || 'Sense categoria'}</Text>
                    </View>
                    <TouchableOpacity style={styles.heartButton}>
                        <Ionicons name="heart" size={22} color="#FF4B6A" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.cardDescription} numberOfLines={2}>
                    {item.description || 'Sense descripció'}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Els meus Preferits</Text>
                <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={() => navigation.navigate('Info')}
                >
                    <Ionicons name="settings-outline" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Carregant preferits...</Text>
                </View>
            ) : favorits.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={48} color="#CBD5E0" />
                    <Text style={styles.emptyText}>No tens cap preferit encara</Text>
                    <Text style={styles.emptySubtext}>
                        Afegeix llocs als teus preferits fent clic al cor
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={favorits}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <View style={styles.footer}>
                <FSection
                    currentSection={2}
                    onPress={handlePress}
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
        color: '#2563EB',
        fontWeight: '600',
    },
    cardDescription: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 12,
        lineHeight: 20,
    },
    heartButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
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

export default Preferits;