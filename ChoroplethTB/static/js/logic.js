var mapboxAccessToken = API_KEY;
var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
  id: 'mapbox/light-v9',
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  zoomOffset: -1,
}).addTo(map);

var geoJson = L.geoJson(statesData);
geoJson.addTo(map);

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

function getColor(d) {
  return d > 23 ? '#ff367f' :
         d > 22 ? '#ff00ff' :
         d > 21 ? '#b00355' :
         d > 20 ? '#ac6fd5' :
         d > 19 ? '#7007a6' :
         d > 18 ? '#3823d2' :
         d > 17 ? '#000080' :
         d > 16 ? '#0000ff' :
         d > 15 ? '#0066bb' :
         d > 14 ? '#008080' :
         d > 13 ? '#00ffff' :
         d > 12 ? '#888888' :
         d > 11 ? '#00720e' :
         d > 10 ? '#02c000' :
         d > 9 ? '#00ff00' :
         d > 8 ? '#80ff7a' :
         d > 7 ? '#a2b13d' :
         d > 6 ? '#d0d81e' :
         d > 5 ? '#ffff00' :
         d > 4 ? '#ffc500' :
         d > 3 ? '#ff8b00' :
         d > 2 ? '#ff5000' :
         d > 1 ? '#bd1f1f' :
         d > 0 ? '#ff0000' :
                 '#ffffff';
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.time),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

var timeOfDay = [];

function timeConversion(response) {

  var data = response.features;
  
  function FormatMin(n) {
    return (n<10) ? '0'+n : n;
  };

  function FormatHr(n) {
    return (n>12) ? n-12 : n;
  };

  function AMPM(n) {
    return (n>12) ? 'PM' : 'AM';
  };

  for (var i = 0; i < data.length; i++) {
    timeOfDay.push(
      FormatHr(Math.floor(data[i].properties.time)) + ':' + 
      FormatMin(Math.round((data[i].properties.time - Math.floor(data[i].properties.time))*60)) + 
      AMPM(data[i].properties.time)
    );
  };
};

timeConversion(statesData);

for(var i = 0; i < timeOfDay.length; i++) {
  var clockTime = "clock";
  var newValue = timeOfDay[i];
  if (newValue === "NaN:NaNAM") {
    statesData.features[i].properties[clockTime] = "NA";
  } else {
    statesData.features[i].properties[clockTime] = newValue;
  };
};

function onEachFeature(feature, layer) {

  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  })
  
  for (var i = 0; i < timeOfDay.length; i++) {
    layer.bindPopup("<h1>" + feature.properties.name + "</h1><hr><h2>" + feature.properties.clock + "</h2>")
    };
    
};

L.geoJson(statesData, {style: style}).addTo(map);
geojson = L.geoJson(statesData, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend');
  var times = [0, 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1, 14.1, 15.1, 16.1, 17.1, 18.1, 19.1, 20.1, 21.1, 22.1, 23.1];
  var labels = [
    `NA`,
    `12AM - 1AM`,
    `1AM - 2AM`,
    `2AM - 3AM`,
    `3AM - 4AM`,
    `4AM - 5AM`,
    `5AM - 6AM`,
    `6AM - 7AM`,
    `7AM - 8AM`,
    `8AM - 9AM`,
    `9AM - 10AM`,
    `10AM - 11AM`,
    `11AM - 12PM`,
    `12PM - 1PM`,
    `1PM - 2PM`,
    `2PM - 3PM`,
    `3PM - 4PM`,
    `4PM - 5PM`,
    `5PM - 6PM`,
    `6PM - 7PM`,
    `7PM - 8PM`,
    `8PM - 9PM`,
    `9PM - 10PM`,
    `10PM - 11PM`,
    `11PM - 12AM`];

  div.innerHTML += "<strong>Average Time of Accident</strong><br>";

  for (var i = 0; i < times.length; i++) {
    div.innerHTML += '<i style="background:'+getColor(times[i])+'"></i><span>'+labels[i]+'</span><br>';
  } return div;

};

legend.addTo(map);
