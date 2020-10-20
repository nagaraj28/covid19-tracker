import React from "react";
import { Map, GeoJSON,Marker, Popup, TileLayer } from "react-leaflet";
import useSwr from "swr";
import "leaflet/dist/leaflet.css"
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card} from "react-bootstrap";
import tlogo  from "./covidtrackerlogo.png"


const fetcher = (...args) => fetch(...args).then(response =>response.json());

function myFunction() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

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

var  totalcases=0,totalRecovered=0,totalActiveCases=0,totalDeath=0;
var set1 = new Set(); 

geoJson.features.sort(function(a,b){
  if(set1.has(b.properties.country)==false){
  set1.add(b.properties.country);
  totalcases +=b.properties.cases;
  totalActiveCases +=b.properties.active;
  totalRecovered +=b.properties.recovered;
  totalDeath +=b.properties.deaths;
  }
 /* console.log(b.properties.country);
  console.log(b.properties.cases);
*/
  return b.properties.cases-a.properties.cases;
});
console.log(geoJson.features);

return(
  <>

    <head>

    <link
  rel="stylesheet"
  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
  integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
  crossorigin="anonymous"
/>

  <link
rel="stylesheet"
href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
crossorigin=""
/>




</head>

<body>

  <div>
    <img class="titl" align="center" src= {tlogo} alt="titlelogo"   />
</div>

<div>
  <h3 class="text-success" id="mapalign">
    Global Information:
    </h3>
</div>

<div class="py-5">
    <div class="container">
      <div class="row hidden-md-up">

        <div class="col-md-4">
          <div class="card border border-dark">
            <div class="card-block ">
              <h4 class="card-title">Total Cases</h4>
              <h6 class="p-3 mb-2 bg-danger text-white">{totalcases}</h6>      
            </div>
          </div>
        </div>      

        <div class="col-md-4">
          <div class="card border border-dark">
            <div class="card-block ">
              <h4 class="card-title">Total Active Cases</h4>
              <h6 class="p-3 mb-2 bg-danger text-white">{totalActiveCases}</h6>      
            </div>
          </div>
        </div>      
        
        <div class="col-md-4">
          <div class="card border border-dark">
            <div class="card-block ">
              <h4 class="card-title">Total Recovered</h4>
              <h6 class="p-3 mb-2 bg-danger text-white">{totalRecovered}</h6>      
            </div>
          </div>
        </div> 


        <div class="col-md-4 cardpad" >
          <div class="card border border-dark">
            <div class="card-block ">
              <h4 class="card-title">Total Deaths</h4>
              <h6 class="p-3 mb-2 bg-danger text-white">{totalDeath}</h6>      
            </div>
          </div>
        </div>      

      </div>
    </div>
  </div>

<div id="mapalign">
      <div  id ="mapId" >
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
              <h6>
              <img src={park.properties.countryInfo.flag} alt="country flag" width="20" height="15"/>
                Country:{park.properties.country}
                </h6>
                <h6>
                Total Cases:{park.properties.cases}
                </h6>
                <h6>Active Cases🤒 : {park.properties.active}</h6>
                <h6>Recovered❤️ : {park.properties.recovered}</h6>
                <h6>Deaths⚰️ : {park.properties.deaths}</h6>
                <h6>Today cases : {park.properties.todayCases}</h6>
                <h6>Today Deaths⚰️ : {park.properties.todayDeaths}</h6>
              </div>
            </Popup>
          </Marker>
        ))}
    </Map>
    </div>
    </div>

    </body>
    </>
);
}


export default App; 
