import React from 'react'

function Navbar(props) {

function handleFromLatitudeChange(e)
{
    props.setFromLocation({latitude:e.target.value});
}

function handleFromLongitudeChange(e)
{
    props.setFromLocation({longitude:e.target.value});
}
function handletoLatitudeChange(e)
{
    props.setToLocation({latitude:e.target.value});
}

function handletoLongitudeChange(e)
{
    props.setToLocation({longitude:e.target.value});
}

async function handleSubmit()
{
    alert("JHelf")
          
            try {
              const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${"5b3ce3597851110001cf6248031841f2ead843b0a583d3e3042ddfdb"}&start=${props.fromLocation.longitude.toString()},${props.toLocation.latitude.toString()}&end=${props.toLocation.longitude.toString()},${props.toLocation.latitude.toString()}`);
              if (!response.ok) {
                throw new Error('Failed to fetch routes');
              }
              const data = await response.json();
              const coordinates = data.features[0].geometry.coordinates;
              const routeCoordinates = coordinates.map(coord => [coord[1], coord[0]]);
              props.setRoutes([routeCoordinates]);
              alert(props.routes)
            } catch (error) {
              console.error('Error fetching routes:', error);
            }
};

  return (
    <>
    <nav className="navbar navbar-expand-lg ">
    <div className="container-fluid">
      <a className="navbar-brand" href="#">ZapZone</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#"></a>
        </li>
        <form className="d-flex" role="search">
          <input className="form-control me-2" id='fromLatitude' onChange={handleFromLatitudeChange} value={props.fromLocation.latitude} type="search" placeholder="From Latitude" aria-label="Search"/>
          <input className="form-control me-2" id='fromLongitude' onChange={handleFromLongitudeChange} value={props.fromLocation.longitude} type="search" placeholder="From Longitude" aria-label="Search"/>
          <input className="form-control me-2"  id='toInput'  onChange={handletoLatitudeChange} value={props.toLocation.latitude} type="search" placeholder="To Latitude" aria-label="Search"/>
          <input className="form-control me-2"  id='toInput'  onChange={handletoLongitudeChange} value={props.toLocation.longitude} type="search" placeholder="To Longitude" aria-label="Search"/>
          <button className="btn btn-outline-success" onClick={handleSubmit}>Search</button>
        </form>
      </div>
  </nav>
    </>
  )
}

export default Navbar
