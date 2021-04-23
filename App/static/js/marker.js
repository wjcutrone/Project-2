//Create the map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

//Add tilelayer to serve as background
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

//Read the csv
d3.csv("/data", function(data) {
    console.log(data);

    //Create marker cluster group
    var markers = L.markerClusterGroup();

    //Loop through data
    for (var i=0; i < data.length; i++) {

        //Establish Location
        var lat = data[i].Start_Lat;
        var lng = data[i].Start_Lng;
        var location = [lat,lng];
        
        //Check for the location property
        if (location) {

            //Add a new marker to cluster group and bind a popup
            markers.addLayer(L.marker([location[0], location[1]])
            .bindPopup("<h3>Description: "+data[i].Description
                        +"</h3><hr><h3> Severity: "+data[i].Severity
                        +"</h3><hr><h3>Time: "+data[i].Start_Time+"</h3>"
            ));
        }
    }
    
    //Add marker cluster layer to the map
    myMap.addLayer(markers);

});