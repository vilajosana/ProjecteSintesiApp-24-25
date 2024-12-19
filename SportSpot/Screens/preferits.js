import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { db } from '../utils/firebaseConfig';  // Importa la configuració de Firebase
import { collection, getDocs, query, where } from 'firebase/firestore';  // Importa els mètodes necessaris de Firestore
import FSection from '../components/FSection';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons

const Preferits = ({ navigation, userId }) => {
  const [favorits, setFavorits] = useState([]);  // Afegim un estat per emmagatzemar els favorits
  const [loading, setLoading] = useState(true);  // Afegim estat per gestionar la càrrega de dades

  // Carregar favorits des de Firestore
  const carregarFavorits = async () => {
    try {
      // Consulta per obtenir l'usuari amb un userId determinat
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('userId', '==', userId)); // Assegura't que 'userId' existeixi
  
      const querySnapshot = await getDocs(q);
      console.log('Dades obtingudes:', querySnapshot); // Veure si es retorna alguna dada
  
      if (querySnapshot.empty) {
        console.log('No s\'han trobat favorits per aquest usuari.');
        setLoading(false); // Finalitza el loading
        return; // Sortim si no hi ha dades
      }
  
      const favoritsArray = [];
      querySnapshot.forEach((doc) => {
        // Afegeix cada document a la llista de favorits
        console.log("Document dels favorits:", doc.data());
        favoritsArray.push(doc.data());
      });
  
      // Actualitza l'estat amb els favorits obtinguts
      setFavorits(favoritsArray);
      setLoading(false); // Finalitza el loading
  
    } catch (error) {
      console.error('Error carregant els favorits: ', error);
      setLoading(false); // Finalitza el loading en cas d'error
    }
  };

  // Utilitzem useEffect per carregar els favorits en carregar el component
  useEffect(() => {
    if (userId) {
      carregarFavorits();  // Cridem la funció per carregar els favorits
    }
  }, [userId]);

  const handlePress = (id) => {
    console.log("Han clicat al botó " + id);
    if (id === 1) {
      navigation.navigate("MenuPrincipal");
    } else if (id === 3) {
      navigation.navigate("AfegirNovaUbicacio");
    } else if (id === 4) {
      navigation.navigate("Usuari");
    }
  };

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
      
      {/* Mostrar loading mentre es carrega */}
      {loading ? (
        <Text>Carregant favorits...</Text>
      ) : (
        <FlatList
          data={favorits}  // Carreguem els favorits a la FlatList
          keyExtractor={(item, index) => index.toString()}  // Utilitzem un index com a key
          renderItem={({ item }) => (
            <View style={styles.favItem}>
              <Text>{item.name}</Text>  {/* Mostrar un atribut de l'objecte favorit */}
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
    backgroundColor: '#ffffff',
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
