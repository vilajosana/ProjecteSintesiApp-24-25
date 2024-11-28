import React from 'react';
import { View } from 'react-native';
import FButton from './FButton';

export default function FSection({ currentSection, onPress, navigation }) {
    return (
        <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
            <View style={{ 
                flexDirection: 'row', 
                backgroundColor: 'white', 
                borderRadius: 15, 
                padding: 10, 
                elevation: 5, 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            }}>
                <FButton 
                    selectedIcon="home" 
                    unselectedIcon="home-outline" 
                    id={1} 
                    onPress={onPress} 
                    isSelected={currentSection === 1} 
                    navigation={navigation} 
                />
                
                <FButton 
                    selectedIcon="heart" 
                    unselectedIcon="heart-outline" 
                    id={2} 
                    onPress={onPress} 
                    isSelected={currentSection === 2} 
                    navigation={navigation} 
                />
                
                <FButton 
                    selectedIcon="plus" 
                    unselectedIcon="plus-outline" 
                    id={3} 
                    onPress={onPress} 
                    isSelected={currentSection === 3} 
                    navigation={navigation} 
                />
                
                <FButton 
                    selectedIcon="account" 
                    unselectedIcon="account-outline" 
                    id={4} 
                    onPress={onPress} 
                    isSelected={currentSection === 4} 
                    navigation={navigation} 
                />
            </View>
        </View>
    );
}
