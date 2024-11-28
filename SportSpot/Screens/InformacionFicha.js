import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const InformacionFicha = ({ route, navigation }) => {
    const { site } = route.params; // Recibir datos del sitio desde la lista

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>{site.title}</Text>
            <Text>{site.description}</Text>
            <Text>{'★'.repeat(site.rating) + '☆'.repeat(5 - site.rating)}</Text>

            {/* Mapa */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 41.722, // Reemplaza con coordenadas reales
                    longitude: 1.888,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker coordinate={{ latitude: 41.722, longitude: 1.888 }} title={site.title} />
            </MapView>

            {/* Botón de regreso */}
            <Button
                title="Volver"
                onPress={() => navigation.goBack()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    map: {
        width: '100%',
        height: 300,
        marginVertical: 20,
    },
});

export default InformacionFicha;