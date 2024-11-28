import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FButton = ({ selectedIcon, unselectedIcon, id, onPress, isSelected }) => {
    return (
        <TouchableOpacity onPress={() => onPress(id)} style={styles.button}>
            <Icon name={isSelected ? selectedIcon : unselectedIcon} size={30} color={isSelected ? 'red' : 'black'} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
});

export default FButton;
