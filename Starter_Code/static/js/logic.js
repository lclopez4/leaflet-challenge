// Create the 'basemap' tile layer that will be the background of our map
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "© OpenStreetMap contributors"
});

// Create the map object and set the center and zoom level
let myMap = L.map("map", {
  center: [37.7749, -122.4194], // Centered on San Francisco
  zoom: 5,
  layers: [basemap]
});

// Earthquake GeoJSON data URL
let earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine marker color based on depth
function getColor(depth) {
  if (depth > 90) return "#800026";
  else if (depth > 70) return "#BD0026";
  else if (depth > 50) return "#E31A1C";
  else if (depth > 30) return "#FC4E2A";
  else if (depth > 10) return "#FD8D3C";
  else return "#FEB24C";
}

// Function to determine marker radius based on magnitude
function getRadius(magnitude) {
  return magnitude === 0 ? 1 : magnitude * 4;
}

// Style function for markers
function styleInfo(feature) {
  return {
    fillColor: getColor(feature.geometry.coordinates[2]), // depth
    color: "#000",
    radius: getRadius(feature.properties.mag),
    weight: 0.5,
    opacity: 1,
    fillOpacity: 0.8
  };
}

// Load earthquake data and plot on map
d3.json(earthquakeUrl).then(function (data) {
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        `<strong>Location:</strong> ${feature.properties.place}<br>
         <strong>Magnitude:</strong> ${feature.properties.mag}<br>
         <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`
      );
    }
  }).addTo(myMap);

  // Create legend
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = [
      "#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"
    ];

    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        `<i style="background:${colors[i]}"></i> ` +
        `${depths[i]}${depths[i + 1] ? "&ndash;" + depths[i + 1] + " km<br>" : "+ km"}`;
    }

    return div;
  };

  legend.addTo(myMap);
});
