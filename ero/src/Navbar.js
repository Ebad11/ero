import React from 'react';
import logo from './logo.jpeg'
// Calculate the distance between two points on the map
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

// Filter points along the route to request charging points only for specific intervals
function filterPointsAlongRoute(coordinates) {
    const filteredCoordinates = [coordinates[0]]; // Include the first coordinate
    let prevCoordinate = coordinates[0];

    for (let i = 1; i < coordinates.length; i++) {
        const currentCoordinate = coordinates[i];
        // Calculate distance between previous and current coordinate
        const distance = calculateDistance(
            prevCoordinate[0], prevCoordinate[1],
            currentCoordinate[0], currentCoordinate[1]
        );

        // Include current coordinate if it's at least 10 km apart from the previous one
        if (distance >= 10) {
            filteredCoordinates.push(currentCoordinate);
            prevCoordinate = currentCoordinate;
        }
    }

    return filteredCoordinates;
}

function Navbar(props) {
    function handleFromLocationChange(e) {
        props.setFromLocation(e.target.value);
    }

    function handleToLocationChange(e) {
        props.setToLocation(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            // Perform geocoding for the starting location
            const fromResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${props.fromLocation}&format=json&limit=1`);
            if (!fromResponse.ok) {
                throw new Error('Failed to geocode starting location');
            }
            const fromData = await fromResponse.json();
            const fromCoordinates = [fromData[0].lat, fromData[0].lon];

            // Perform geocoding for the ending location
            const toResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${props.toLocation}&format=json&limit=1`);
            if (!toResponse.ok) {
                throw new Error('Failed to geocode ending location');
            }
            const toData = await toResponse.json();
            const toCoordinates = [toData[0].lat, toData[0].lon];

            // Fetch route coordinates
            const response = await fetch(`https://api.tomtom.com/routing/1/calculateRoute/${fromCoordinates[0]},${fromCoordinates[1]}:${toCoordinates[0]},${toCoordinates[1]}/json?key=MmKs0xeYFeez2yUfBhJB2aQoMjSFGocj`);
            if (!response.ok) {
                throw new Error('Failed to fetch routes');
            }
            const data = await response.json();
            const coordinates = data.routes[0].legs[0].points;
            const routeCoordinates = coordinates.map(point => [point.latitude, point.longitude]);
            props.setRoutes([routeCoordinates])

            // Filter points along the route
            const filteredRouteCoordinates = filterPointsAlongRoute(routeCoordinates);

            // Fetch charging points for filtered points along the route
            const chargingPointsPromises = filteredRouteCoordinates.map(async point => {
                const [latitude, longitude] = point;
                const response = await fetch(`https://api.openchargemap.io/v3/poi/?output=json&latitude=${latitude}&longitude=${longitude}&maxresults=10&key=074ec762-7efe-439c-8d4f-aa7beefeebe7`);
                if (!response.ok) {
                    throw new Error('Failed to fetch charging points');
                }
                return response.json();
            });

            const chargingPointsData = await Promise.all(chargingPointsPromises);

            // Extract coordinates for charging points from each response
            const chargingPointCoordinates = chargingPointsData.flatMap(data => {
                return data.map(point => [point.AddressInfo.Latitude, point.AddressInfo.Longitude, point.AddressInfo.Title]);
            });

            // Update state with charging points
            props.setRouteChargingPoints(chargingPointCoordinates);
            console.log(chargingPointCoordinates);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg ">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#"> <img src={logo} width={"50px"} alt="" /> <b style={{"fontSize":"24px", }} id='log_name'>ZapZone</b></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                  
                    <form className="d-flex" role="search" onSubmit={handleSubmit}>
                        <input className="form-control me-2" id='fromLocation' onChange={handleFromLocationChange} value={props.fromLocation} type="search" placeholder="From Location" aria-label="Search" />
                        <input className="form-control me-2" id='toLocation' onChange={handleToLocationChange} value={props.toLocation} type="search" placeholder="To Location" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
