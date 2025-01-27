import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../utils/firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth'; 

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedButton, setSelectedButton] = useState('signIn'); 

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Per favor, omple tots els camps');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Sessió Iniciada', 'Benvingut!');
        navigation.navigate('MenuPrincipal'); 
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
        {/* Button Section */}
        <View style={styles.buttonRectangle}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, selectedButton === 'signIn' && styles.buttonSelected]}
              onPress={() => setSelectedButton('signIn')}
            >
              <Text style={styles.buttonText}>Iniciar Sessió</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectedButton === 'signUp' && styles.buttonSelected]}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.buttonText}>Registra't</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Input Fields */}
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
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Inicia Sessió</Text>
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
    minHeight: 270,
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

export default Login;
