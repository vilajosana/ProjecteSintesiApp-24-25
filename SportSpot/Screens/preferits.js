import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { getAuth } from 'firebase/auth'; // Importem Firebase Auth
import { db } from '../utils/firebaseConfig'; // Configuració de Firebase
import { doc, getDoc, collection } from 'firebase/firestore'; // Mètodes necessaris de Firestore
import FSection from '../components/FSection';
import { Ionicons } from '@expo/vector-icons';

const Preferits = ({ navigation }) => {
  const [uid, setUid] = useState(null); // Estat per guardar el UID
  const [favorits, setFavorits] = useState([]); // Estat per guardar els favorits
  const [loading, setLoading] = useState(true); // Estat per gestionar el loading

  // Obtenim el UID de Firebase Authentication
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      console.log('Usuari connectat amb UID:', user.uid);
      setUid(user.uid); // Guardem el UID
      carregarFavorits(user.uid); // Carreguem els favorits
    } else {
      console.log('No hi ha cap usuari connectat.');
      Alert.alert('Error', 'No hi ha cap usuari connectat.');
      setLoading(false);
    }
  }, []);

  // Funció per carregar els favorits des de Firestore
  const carregarFavorits = async (uid) => {
    try {
      console.log('Carregant favorits per UID:', uid);

      if (!uid) {
        console.error('El UID no és vàlid.');
        return;
      }

      const userRef = doc(db, 'Users', uid); // Referència a l'usuari a Firestore
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const favoriteIds = userData.favorites || []; // Obtenim els IDs dels favorits

        if (favoriteIds.length > 0) {
          const locationPromises = favoriteIds.map(async (favId) => {
            const locationRef = doc(db, 'Locations', favId);
            const locationSnapshot = await getDoc(locationRef);
            if (locationSnapshot.exists()) {
              return { id: locationSnapshot.id, ...locationSnapshot.data() };
            }
          });

          const locationsArray = await Promise.all(locationPromises);
          setFavorits(locationsArray.filter((location) => location !== undefined)); // Eliminem els valors undefined
          console.log('Favorits carregats correctament:', locationsArray);
        } else {
          console.log('No hi ha ubicacions favorites.');
          setFavorits([]); // Si no hi ha favorites, netegem el llistat
        }
      } else {
        console.error('Usuari no trobat amb UID:', uid);
        Alert.alert('Error', 'Usuari no trobat.');
      }
    } catch (error) {
      console.error('Error carregant favorits:', error);
    } finally {
      setLoading(false); // Finalitzem el loading
    }
  };

  // Funció per gestionar les accions dels botons
  const handlePress = (id) => {
    console.log('Han clicat al botó ' + id);
    if (id === 1) {
      navigation.navigate('MenuPrincipal');
    } else if (id === 3) {
      navigation.navigate('AfegirNovaUbicacio');
    } else if (id === 4) {
      navigation.navigate('Usuari');
    }
  };

  // Render del component
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Preferits</Text>
      </View>
      <View style={styles.labelContainer}>
        <TouchableOpacity style={styles.labelButton} disabled={true}>
          <Text style={styles.labelText}>Preferits</Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar loading mentre es carreguen els favorits */}
      {loading ? (
        <Text>Carregant favorits...</Text>
      ) : (
        <FlatList
          data={favorits} // Carreguem els favorits a la FlatList
          keyExtractor={(item) => item.id} // Utilitzem el ID de la ubicació com a key
          renderItem={({ item }) => (
            <View style={styles.favItem}>
              <Text>{item.name}</Text> {/* Mostrar un atribut de l'objecte favorit */}
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <FSection currentSection={2} onPress={handlePress} navigation={navigation} />
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
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#d3d3d3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 20,
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    padding: 10,
  },
  labelContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  labelButton: {
    backgroundColor: '#ff9999',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  labelText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    backgroundColor: 'lightgrey',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
  },
  favItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default Preferits;
