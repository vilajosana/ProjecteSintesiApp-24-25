import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasenya, setContrasenya] = useState('');
  const [selectedButton, setSelectedButton] = useState(null); // Estado para el botón seleccionado

  const handleIniciarSesion = () => {
    // Aquí puedes agregar la lógica para manejar el inicio de sesión
    console.log('Usuario:', usuario);
    console.log('Contraseña:', contrasenya);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../images/SportSpotLogo.png')} 
          style={styles.logo} 
          resizeMode="cover" // Cambiar a cover para llenar el área
        />
      </View>
      <View style={styles.formContainer}>
        <View style={styles.buttonRectangle}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, selectedButton === 'signIn' && styles.buttonSelected]} 
              onPress={() => {
                setSelectedButton('signIn'); // Establece el botón de "Sign in" como seleccionado
                console.log('Sign in pressed');
              }}
            >
              <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectedButton === 'signUp' && styles.buttonSelected]} 
              onPress={() => {
                setSelectedButton('signUp'); // Establece el botón de "Sign up" como seleccionado
                console.log('Sign up pressed');
              }}
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
        <Text style={styles.forgotPasswordText}>He oblidat la meva contrasenya</Text>
      </View>
      <Button
        title="Iniciar Sessió"
        onPress={handleIniciarSesion}
        color="#F08080"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Asegura que los elementos se alineen al principio
    alignItems: 'center',
    backgroundColor: 'white', // Fondo blanco
  },
  header: {
    width: '100%',
    height: 300, // Ajustar la altura del contenedor de la imagen
    overflow: 'hidden', // Asegura que la imagen no se desborde
  },
  logo: {
    width: '100%', // Hace que la imagen ocupe el ancho completo
    height: '100%', // Hace que la imagen ocupe el alto completo del contenedor
  },
  formContainer: {
    backgroundColor: 'lightgray', // Fondo gris claro
    padding: 20,
    borderRadius: 20,
    marginBottom: 20, // Espacio entre el formulario y el botón
    width: '70%', // Ajusta el ancho del formulario a un 70%
    minHeight: 270, // Aumenta la altura mínima del formulario
    alignItems: 'center', // Centra horizontalmente el contenido
    justifyContent: 'center', // Centra verticalmente el contenido
    marginTop: 40, // Agrega margen superior entre la imagen y el formulario
  },
  buttonRectangle: {
    width: '100%', // Ajusta el ancho del rectángulo al 100%
    backgroundColor: '#F08080', // Color de fondo del rectángulo
    borderRadius: 10, // Bordes redondeados
    paddingVertical: 10, // Espaciado vertical
    alignItems: 'center', // Centra horizontalmente el contenido
    marginBottom: 20, // Espacio entre el rectángulo y el resto del contenido
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%', // Asegura que el contenedor de botones use el ancho completo
  },
  button: {
    backgroundColor: 'transparent', // Color de fondo del botón (transparente para ver el rectángulo)
    borderRadius: 10,
    padding: 10,
    width: '45%', // Ajusta el ancho del botón
    alignItems: 'center', // Centra el texto dentro del botón
  },
  buttonSelected: {
    backgroundColor: '#FF6347', // Cambiar el color del botón seleccionado (ej. Tomato)
  },
  buttonText: {
    fontSize: 16,
    color: 'white', // Color del texto
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%', // Asegura que los inputs usen el ancho completo
  },
  forgotPasswordText: {
    fontSize: 12,
    color: 'red',
    textAlign: 'center',
    marginTop: 0,
  },
});

export default Login;
