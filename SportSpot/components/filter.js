import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default function Filter({ onClose, onFilter, items }) {
  const [selectedZones, setSelectedZones] = useState([]);

  const toggleZoneSelection = (zone) => {
    setSelectedZones((prev) => {
      const newZones = prev.includes(zone)
        ? prev.filter((z) => z !== zone)
        : [...prev, zone];
      return newZones;
    });
  };

  const filterItems = () => {
    const filteredItems = items.filter((item) =>
      selectedZones.includes(item.zone)
    );
    onFilter(filteredItems);
  };

  const resetSelection = () => {
    setSelectedZones([]);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Filtrar</Text>
          <TouchableOpacity onPress={resetSelection}>
            <Text style={styles.resetText}>Restablir</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Valoracions</Text>
        <TouchableOpacity style={styles.filterOption}>
          <Text style={styles.optionText}>Mes valorats</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Zones</Text>
        <View style={styles.zoneOptions}>
          {["Futbol", "Bàsquet", "Atletisme", "Pàdel", "Pavellons", "Skatepark"].map(
            (zone) => (
              <TouchableOpacity
                key={zone}
                style={[
                  styles.zoneButton,
                  selectedZones.includes(zone) && styles.selectedZoneButton,
                ]}
                onPress={() => toggleZoneSelection(zone)}
              >
                <Text
                  style={[
                    styles.zoneText,
                    selectedZones.includes(zone) && styles.selectedZoneText,
                  ]}
                >
                  {zone}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <TouchableOpacity style={styles.showResultsButton} onPress={filterItems}>
          <Text style={styles.showResultsText}>Mostrar Resultats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Tancar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

Filter.propTypes = {
  onClose: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      zone: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetText: {
    color: 'blue',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  filterOption: {
    backgroundColor: '#0096C7',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 10,
  },
  optionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  zoneOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    justifyContent: 'center',
  },
  zoneButton: {
    backgroundColor: 'white',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  selectedZoneButton: {
    backgroundColor: 'blue',
    borderColor: 'blue',
  },
  zoneText: {
    fontSize: 14,
  },
  selectedZoneText: {
    color: 'white',
  },
  showResultsButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  showResultsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: 'grey',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeText: {
    color: 'white',
    fontSize: 14,
  },
});
