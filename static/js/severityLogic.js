// Creating map object
//function Initialize() {
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  //try replacing mapbox/streets-v11 with mapbox/satellite-v9
  id: "mapbox/light-v9",
  accessToken: API_KEY
}).addTo(myMap);
//}



var link1 = "static/data/accident-2019.json";
var link2 = "static/data/accident-2020.json";



function getColor(d) {
  return d > 300  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
}

function drawMap(link){
  // Grabbing our GeoJSON data..
    d3.json(link, function(data) {
      console.log(data);
      var stateFeature= statesData.features
      for(var i=0;i<stateFeature.length;i++) {
        var currentState=stateFeature[i].properties.name
        stateFeature[i].properties.accidents=data[currentState]

      }
      console.log(stateFeature);
      var geoJson= L.geoJson(statesData,{
        style: function(feature) {
          return {
            color: "white",
            // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
            fillColor: getColor(feature.properties.accidents),
            fillOpacity: 0.5,
            weight: 1.5
          }
        },

      //Binding a pop-up to each layer
      onEachFeature: function(feature, layer) {
        layer.on({
          // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          },
          // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
          click: function(event) {
            myMap.fitBounds(event.target.getBounds());
          }
        });
        layer.bindPopup("<strong>State: " + feature.properties.name + "</strong><hr><strong>Accidents count: "+ feature.properties.accidents + "</strong>");
      }
    }).addTo(myMap);
  });
}
drawMap(link1);


  // Set up the legend
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (myMap) {
  
    var div = L.DomUtil.create('div', 'info legend');
    var counts = [0,10,20,50,100,200,300];
    var labels = [];
      
  
    div.innerHTML += "<strong>Accidents counts</strong><br>";
  
    for (var i = 0; i < counts.length; i++) {
      div.innerHTML += '<i style="background:'+ getColor(counts[i]+1) +'"></i>' +
      counts[i] + (counts[i + 1] ? '&ndash;' + counts[i + 1] + '<br>' : '+');
      //'<i style="background:'+getColor(counts[i])+'"></i><span>'+labels[i]+'</span><br>';
    } 
    return div;
  
  };
  
  legend.addTo(myMap);

  var legend = L.control({position: 'topright'});
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select id="mySelect" onchange="myFunction()"><option value="1">2019<option value="2">2020</select>'
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend.addTo(myMap);

function myFunction() {
  var x = document.getElementById("mySelect").value;
  if(x==1){
    drawMap(link1);
  }else{
    drawMap(link2);
  }
}
  

//'<select><option>2019</option><option>2020</option></select>';