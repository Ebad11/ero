import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import locIcon from "./locIcon.png"
import Navbar from './Navbar';

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chargingPoints, setChargingPoints] = useState([]);

  // Custom icon for charging points
  const chargingIcon = new L.Icon({
    iconUrl: 'https://openchargemap.org/favicon.ico', // You can replace this with your custom charging point icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

   // Custom icon user icon
   const userIcon = new L.Icon({
    iconUrl: locIcon, // You can replace this with your custom charging point icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
           setUserLocation([latitude, longitude]);
          // setUserLocation([36.7783, -119.4179]); California
          // setUserLocation([40.7128, -74.0060]); //New York
          setLoading(false);
        },
        error => {
          console.error('Error getting user location:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchChargingPoints(userLocation[0], userLocation[1]);
    }
  }, [userLocation]);

  const fetchChargingPoints = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://api.openchargemap.io/v3/poi/?output=json&latitude=${latitude}&longitude=${longitude}&maxresults=100&key=${"074ec762-7efe-439c-8d4f-aa7beefeebe7"}`);
      if (!response.ok) {
        throw new Error('Failed to fetch charging points');
      }
      const data = await response.json();
      setChargingPoints(data);
    } catch (error) {
      console.error('Error fetching charging points:', error);
    }
  };

  return (
    <>
    <Navbar/>
    <div style={{ height: "100vh" }}>
      {loading ? (
        <div>Loading the closest Charging Points...</div>
      ) : (
        <MapContainer
          center={userLocation || [51.505, -0.09]}
          zoom={userLocation ? 13 : 5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>You</Popup>
            </Marker>
          )}
          {chargingPoints.map(point => (
            <Marker key={point.ID} position={[point.AddressInfo.Latitude, point.AddressInfo.Longitude]} icon={chargingIcon}>
              <Popup>{point.AddressInfo.Title}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
    </>
  );
}

export default App;
