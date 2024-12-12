import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../utils/firebaseConfig'; // Importa el teu fitxer de configuració de Firebase
import { signInWithEmailAndPassword } from 'firebase/auth'; // Funció per iniciar sessió amb un usuari

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedButton, setSelectedButton] = useState('signIn'); // Sign In seleccionado por defecto

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Per favor, omple tots els camps');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Sessió Iniciada', 'Benvingut!');
        navigation.navigate('MenuPrincipal'); // Redirigeix a la pàgina principal després de fer login
      })
      .catch((error) => {
        Alert.alert('Error', 'Credencials incorrectes');
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
              onPress={() => {
                setSelectedButton('signIn');
                navigation.navigate('Login');
              }}
            >
              <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button, 
                selectedButton === 'signUp' && styles.buttonSelected,
                selectedButton !== null && selectedButton !== 'signUp' && styles.buttonTransparent
              ]}
              onPress={() => navigation.navigate('Register')} // Redirigir a Register
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
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centrado verticalmente
    alignItems: 'center', // Centrado horizontalmente
    backgroundColor: '#F5F5F5', // Fondo gris claro
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
    minHeight: 270,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  buttonRectangle: {
    width: '100%',
    backgroundColor: '#F08080',
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
    backgroundColor: '#FF6347', // Rojo más intenso
  },
  buttonTransparent: {
    opacity: 0.3, // Transparente para los botones no seleccionados
  },
  buttonText: {
    fontSize: 16,
    color: 'black', // Texto en negro
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
    backgroundColor: '#F08080', // Color de botón rosado
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
  registerText: {
    color: '#F08080', // Texto de registro en rosado
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
});

export default Login;
