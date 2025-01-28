import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; 

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedButton, setSelectedButton] = useState('signUp'); 

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Per favor, omple tots els camps');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Les contrassenyes no coincideixen');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contrasenya ha de tenir almenys 6 caràcters');
      return;
    }

    const auth = getAuth();
    const db = getFirestore();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'Users', user.uid), {
        email: user.email,
        createdAt: new Date(),
      });

      Alert.alert('Benvingut!', 'Compte creat correctament.');
      navigation.navigate('MenuPrincipal');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Aquest correu ja està registrat');
      } else {
        Alert.alert('Error', 'Hi ha hagut un problema, torna-ho a intentar.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../images/SportSpotLogo.png')} 
          style={styles.logo} 
          resizeMode="cover" 
        />
      </View>

      <View style={styles.formContainer}>
        {/* Botons de selecció */}
        <View style={styles.buttonRectangle}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, selectedButton === 'signIn' && styles.buttonSelected]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Iniciar Sessió</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectedButton === 'signUp' && styles.buttonSelected]}
              onPress={() => setSelectedButton('signUp')}
            >
              <Text style={styles.buttonText}>Registra't</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Camps d'entrada */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#B0B0B0"
        />
        <TextInput
          style={styles.input}
          placeholder="Contrasenya"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#B0B0B0"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirma la Contrasenya"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#B0B0B0"
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
        <Text style={styles.loginButtonText}>Registra't</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  header: {
    width: '100%',
    height: 300,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonRectangle: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: '#2563EB',
  },
  buttonText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    paddingLeft: 15,
    backgroundColor: '#F9FAFB',
    fontSize: 16,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 12,
    width: '70%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Register;
