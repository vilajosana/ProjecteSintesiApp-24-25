import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Register = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasenya, setContrasenya] = useState('');
  const [repetirContrasenya, setRepetirContrasenya] = useState('');
  const [selectedButton, setSelectedButton] = useState('signUp'); // Sign Up seleccionado por defecto
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      setSelectedButton('signUp'); // Asegura que siempre esté marcado Sign Up al enfocarse en la pantalla
    }, [])
  );

  const handleIniciarSesion = () => {
    console.log('Usuario:', usuario);
    console.log('Contraseña:', contrasenya);
    console.log('Repetir Contraseña:', repetirContrasenya);
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
              style={[styles.button, 
                selectedButton === 'signIn' && styles.buttonSelected,
                selectedButton !== null && selectedButton !== 'signIn' && styles.buttonTransparent
              ]} 
              onPress={() => {
                setSelectedButton('signIn');
                navigation.navigate('Login', { from: 'Register' });
              }}
            >
              <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, 
                selectedButton === 'signUp' && styles.buttonSelected,
                selectedButton !== null && selectedButton !== 'signUp' && styles.buttonTransparent
              ]} 
              onPress={() => setSelectedButton('signUp')}
            >
              <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Usuari"
          onChangeText={setUsuario}
          value={usuario}
        />
        <TextInput
          style={styles.input}
          placeholder="Contrasenya"
          onChangeText={setContrasenya}
          value={contrasenya}
          secureTextEntry={true} 
        />
        <TextInput
          style={styles.input}
          placeholder="Repetir Contrasenya"
          onChangeText={setRepetirContrasenya}
          value={repetirContrasenya}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={() => {
          handleIniciarSesion();
          navigation.navigate('Login');
        }}
      >
        <Text style={styles.loginButtonText}>Registrar-se</Text> 
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
    width: '70%',
    minHeight: 320,
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
    backgroundColor: '#FF6347',
  },
  buttonTransparent: {
    opacity: 0.3,
  },
  buttonText: {
    fontSize: 16,
    color: 'black', // Cambiado a negro
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#F08080',
    padding: 10,
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'black', // Cambiado a negro
    fontSize: 16,
  },
});

export default Register;
