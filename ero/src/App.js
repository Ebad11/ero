import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [locations, setLocations] = useState([
    { id: 1, name: 'Delhi', lat: 28.7041, lng:77.1025 },
    { id: 2, name: 'Location 2', lat: 51.51, lng: -0.1 },
    { id: 3, name: 'Location 3', lat: 51.515, lng: -0.095 }
    // Add more locations as needed
  ]);

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map(location => (
        <Marker key={location.id} position={[location.lat, location.lng]}>
          <Popup>
            <p>{location.name}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
