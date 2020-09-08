import React from "react";
import { Map, GeoJSON,Marker, Popup, TileLayer } from "react-leaflet";
import useSwr from "swr";
import "leaflet/dist/leaflet.css"
import './App.css';


const fetcher = (...args) => fetch(...args).then(response =>response.json());

function App() {
  
  const url="https://corona.lmao.ninja/v2/countries";
var {data=[],error} = useSwr(url,{fetcher});
if(error)
console.log(error);
const geoJson = {
  type: 'FeatureCollection',
  features: data.map((country = {}) => {
    const { countryInfo = {} } = country;
    const { lat, long: lng } = countryInfo;
    return {
      type: 'Feature',
      properties: {
       ...country,
      },
      geometry: {
        type: 'Point',
        coordinates: [ lng, lat ]
      }
    }
  } )
}


geoJson.features.sort(function(a,b){
  return b.properties.cases-a.properties.cases;
});
console.log(geoJson);
return(
  <>
    <head>
  <link
rel="stylesheet"
href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
crossorigin=""
/>
</head>

      <div  id ="mapId" >
    <h1  >Covid19 DashBoard 😷</h1>  
    <Map  center={[0,0]} zoom={3} >  
    <TileLayer
  
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      // url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"//pointed Icon
        attribution='&copy; <a href="http://osm.org/copyright">OpenstreetMap</a> contributors'
        noWrap="true"
     ></TileLayer>
          <GeoJSON  id ="mapId" data={geoJson.features}></GeoJSON>
        {geoJson.features.map(park=> (
          <Marker key={park.properties.countryInfo._id}
          position={[
            park.geometry.coordinates[1],
            park.geometry.coordinates[0],
          ]}
          >
            <Popup>
              <div>
              <h4>
              <img src={park.properties.countryInfo.flag} alt="country flag" width="20" height="15"/>
                Country:{park.properties.country}
                </h4>
                <h4>
                Total Cases:{park.properties.cases}
                </h4>
                <h4>Active Cases🤒 : {park.properties.active}</h4>
                <h4>Recovered❤️ : {park.properties.recovered}</h4>
                <h4>Deaths⚰️ : {park.properties.deaths}</h4>
                <h4>Today cases : {park.properties.todayCases}</h4>
                <h4>Today Deaths⚰️ : {park.properties.todayDeaths}</h4>
              </div>
            </Popup>
          </Marker>
        ))}
    </Map>
    </div>
    </>
);
}


export default App; 
