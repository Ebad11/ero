import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import locIcon from "./locIcon.png"
import Navbar from './Navbar';


function App() {

  const [userLocation, setUserLocation] = useState(null);
  const [navState, setNavState] = useState("Charging Points near you");
  const [loading, setLoading] = useState(true);
  const [chargingPoints, setChargingPoints] = useState([]);
  const [routeChargingPoints, setRouteChargingPoints] = useState(null);
  const [fromLocation, setFromLocation] = useState({latitude:"", longitude:""});
  const [toLocation, setToLocation] = useState({latitude:"", longitude:""});
  const [routes, setRoutes] = useState(null);

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
    <Navbar routeChargingPoints={routeChargingPoints}  setRouteChargingPoints={setRouteChargingPoints} routes={routes} setRoutes={setRoutes} fromLocation={fromLocation} setFromLocation={setFromLocation} setToLocation={setToLocation}  toLocation={toLocation}/>
    <div style={{ height: "100vh", postion:"relative" }} >
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

{routeChargingPoints && routeChargingPoints.map((point, index) => (
    <Marker key={index} position={point} icon={chargingIcon}>
        <Popup>{point[2]}</Popup>
    </Marker>
))}


          {routes && 
             routes.map((route, index) => (
                        <Polyline key={index} positions={route} color="blue" />
                      ))
          }
        </MapContainer>
      )}
    </div>
    </>
  );
}

export default App;
// src/App.js
// import React, { useState } from 'react';
// import { MapContainer, TileLayer, Polyline } from 'react-leaflet';

// const App = () => {
//   const fromCoordinates = { latitude: 40.7128, longitude: -74.0060 }; // Example: New York City
// const toCoordinates = { latitude: 34.0522, longitude: -118.2437 }; // Example: Los Angeles
//   const [from, setFrom] = useState('');
//   const [to, setTo] = useState('');
//   const [routes, setRoutes] = useState([]);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${"5b3ce3597851110001cf6248031841f2ead843b0a583d3e3042ddfdb"}&start=${fromCoordinates.longitude.toString()},${fromCoordinates.latitude.toString()}&end=${toCoordinates.longitude.toString()},${toCoordinates.latitude.toString()}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch routes');
//       }
//       const data = await response.json();
//       const coordinates = data.features[0].geometry.coordinates;
//       const routeCoordinates = coordinates.map(coord => [coord[1], coord[0]]);
//       setRoutes([routeCoordinates]);
//     } catch (error) {
//       console.error('Error fetching routes:', error);
//       setError('Error fetching routes. Please try again later.');
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input type="text" placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} />
//         <input type="text" placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
//         <button type="submit">Get Routes</button>
//       </form>
//       {error && <p>{error}</p>}
//       <MapContainer center={[51.505, -0.09]} zoom={1} style={{ height: '100%', width: '100%' }}>
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         {routes.map((route, index) => (
//           <Polyline key={index} positions={route} color="blue" />
//         ))}
//       </MapContainer>
//     </div>
//   );
// };

// export default App;
