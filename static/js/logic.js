
// Visualizing-Data-with-Leaflet - logic.js

// Earthquakes GeoJSON URL Variables
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"
var platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


var earthquakes = new L.LayerGroup();



var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});
var grayscaleMap =  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

// Define baseMaps Object to Hold Base Layers
var baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": grayscaleMap,
    "Outdoors": outdoorsMap
};

// Create Overlay Object to Hold Overlay Layers
var overlayMaps = {
    "Earthquakes": earthquakes
};

// Create Map, Passing In satelliteMap & earthquakes as Default Layers to Display on Load
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [satelliteMap, earthquakes]
});
var geojson;
// Create a Layer Control + Pass in baseMaps and overlayMaps + Add the Layer Control to the Map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Grab the data with d3
d3.json(earthquakesURL, function(earthquakeData) {
    
        // Function to Determine Size of Marker Based on the Magnitude of the Earthquake
    function markerSize(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 2;
    }
    // Function to Determine Style of Marker Based on the Magnitude of the Earthquake
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: chooseColor(feature.properties.mag),
          color: "#000000",
          radius: markerSize(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
    }
    // Function to Determine Color of Marker Based on the Magnitude of the Earthquake
    function chooseColor(magnitude) {
        return magnitude > 5 ? '#FF0000' :
        magnitude > 4  ? '#f0a76b' :
        magnitude > 3  ? '#f3ba4d' :
        magnitude > 2 ? '#f3db4d' :
        magnitude > 1   ? '#e1f34d' :
        magnitude > 0   ? '#168f48' :
                   '#FFEDA0';
    }
    // Create a GeoJSON Layer Containing the Features Array on the earthquakeData Object
    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        // Function to Run Once For Each feature in the features Array
        // Give Each feature a Popup Describing the Place & Time of the Earthquake
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + 
            "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
            
        }
    // Add earthquakeData to earthquakes LayerGroups 
    }).addTo(myMap);




    // // Set Up Legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        scale = [0, 1, 2, 3, 4, 5];
        
      ////////  created the html to be displayed in the legend
        for(var i=0; i<6;i++)
        {   
            // if(i<5){
            //     div.innerHTML+='<i style="background:' + chooseColor(scale[i]) + '"></i> ' +'<h1>'+i+'-'+(i+1)+'</h1>'

            // }
            // else {
            //     div.innerHTML+='<h1>'+i+'+</h1>'
            // }
            
            div.innerHTML +=
            '<i style="background:' + chooseColor(scale[i] + 1) + '"></i> ' +
            scale[i] + (scale[i + 1] ? '&ndash;' + scale[i + 1] + '<br>' : '+');
            
            // #style tag with i
        }
      
        return div
      };
    // Add Legend to the Map
    legend.addTo(myMap);
});