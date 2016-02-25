'use strict';

import 'babel-polyfill';
import Leaflet from 'leaflet';
Leaflet.Icon.Default.imagePath = './images';

import fetch from './fetch';

let map = Leaflet.map('leaflet').setView([44.315098,-123.1255047], 10);

Leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© <a href="http://mapbox.com">Mapbox</a>',
   maxZoom: 18,
   id: 'mapbox.streets',
   accessToken: 'pk.eyJ1IjoiaG92aXMiLCJhIjoiY2lqemw3ZnU4MnMyZXZ3a2l2dm1ja2t6aCJ9.cZaMlyBq0j00_EpwkKVJXw',
}).addTo(map);

let marker = Leaflet.marker([44.315098,-123.1255047]).addTo(map);

let data;
fetch.get("https://busknight.firebaseio.com/hovis/gunter.json")
   .then( result => plot_gunter_pings(JSON.parse(result), map) )
   .catch( message => console.error(message) );

function plot_gunter_pings(data, map) {
   // TODO: Lose the imperative style
   for (let entry of Object.entries(data)) {
      let location = entry[1].loc;
      let marker = Leaflet.marker(location).addTo(map);
      marker.bindPopup(format_data(entry[1]));
   }
}

function format_data(object) {
   // Take an object (a gunter ping) and format the raw data so it can be read more easily
   // OMG so much TODO here, I really want a better way of doing this
   let rows = Object.keys(object).map( key => `<tr><th>${key}</th><td>${object[key]}</td></tr>`).join('');
   let table = `<table>${rows}</table>`;
   return table;
}
