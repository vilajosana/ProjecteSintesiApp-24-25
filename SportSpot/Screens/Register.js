import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../utils/firebaseConfig'; // Importa el teu fitxer de configuració de Firebase
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedButton, setSelectedButton] = useState('signUp'); // Sign Up seleccionado por defecto

  const handleRegister = () => {
    if (email === '' || password === '' || confirmPassword === '') {
      Alert.alert('Error', 'Omple tots els camps');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Les contrassenyes no coincideixen');
      return;
    }

    if (password.length < 6) { // Comprovem que la contrasenya tingui almenys 6 caràcters
      Alert.alert('Error', 'La contrasenya ha de tenir almenys 6 caràcters');
      return;
    }

    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Usuari registrat correctament, inicia sessió automàticament
        Alert.alert('Welcome!', 'S\'ha creat la compte correctament.');
        navigation.navigate('MenuPrincipal'); // Redirigeix a la pàgina principal (Home)
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          // Si l'usuari ja existeix, mostra un missatge
          Alert.alert('Usuari existent', 'Aquest correu ja s\ha fet servir');
        } else {
          Alert.alert('Error', 'Correu invàlid');
        }
      });
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
        <View style={styles.buttonRectangle}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button, 
                selectedButton === 'signIn' && styles.buttonSelected,
                selectedButton !== null && selectedButton !== 'signIn' && styles.buttonTransparent
              ]}
              onPress={() => navigation.navigate('Login')} // Redirigir a Login
            >
              <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button, 
                selectedButton === 'signUp' && styles.buttonSelected,
                selectedButton !== null && selectedButton !== 'signUp' && styles.buttonTransparent
              ]}
              onPress={() => setSelectedButton('signUp')} // Permite seleccionar el "Sign Up"
            >
              <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
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
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#B0B0B0"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#B0B0B0"
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
        <Text style={styles.loginButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 300,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    backgroundColor: 'lightgray',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    width: '80%', // Ancho del formulario
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  buttonRectangle: {
    width: '100%',
    backgroundColor: '#F08080', // Color de fondo rosado
    borderRadius: 10,
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
    borderRadius: 10,
    padding: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: '#FF6347', // Rojo cuando está seleccionado
  },
  buttonTransparent: {
    opacity: 0.3, // Transparente cuando no está seleccionado
  },
  buttonText: {
    fontSize: 16,
    color: 'black', // Color negro para el texto de los botones
  },
  input: {
    height: 50,
    borderColor: '#D1D1D1', // Borde gris suave
    borderWidth: 1,
    borderRadius: 10, // Bordes redondeados
    marginBottom: 15,
    paddingLeft: 15,
    backgroundColor: '#F9F9F9', // Fondo gris claro en los inputs
    fontSize: 16,
    width: '100%', // Asegura que el campo ocupe todo el espacio disponible
  },
  loginButton: {
    backgroundColor: '#F08080', // Botón de registro con color rosado
    padding: 10,
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'black', // Texto en negro
    fontSize: 16,
  },
});

export default Register;
