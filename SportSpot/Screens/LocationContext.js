import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);

  const addLocation = (newLocation) => {
    setLocations((prevLocations) => [...prevLocations, newLocation]);
  };

  return (
    <LocationContext.Provider value={{ locations, addLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

// Asegurat que el hook estigui exportat correctament
export const useLocationContext = () => {
  return useContext(LocationContext);
};
