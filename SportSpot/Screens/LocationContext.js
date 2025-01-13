import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, collection, getDocs } from '../utils/firebaseConfig'; // Importem la nova API modular

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Recuperar les ubicacions de Firebase amb la nova API
    const fetchLocations = async () => {
      const locationsCollection = collection(db, 'locations');  // Accedeix a la col·lecció 'locations'
      const snapshot = await getDocs(locationsCollection);  // Obté els documents de la col·lecció
      const newLocations = snapshot.docs.map(doc => doc.data());  // Mapeja els documents per obtenir les dades
      setLocations(newLocations);  // Actualitza l'estat
    };

    fetchLocations(); // Cridem la funció per obtenir les ubicacions

  }, []);

  return (
    <LocationContext.Provider value={{ locations }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  return useContext(LocationContext);
};
