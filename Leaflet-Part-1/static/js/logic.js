// Wait for the DOM to be fully loaded before executing any code
document.addEventListener("DOMContentLoaded", function () {

    // Initialize the map
    var map = L.map('map').setView([37.7749, -122.4149], 5);
  
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    // Function to fetch earthquake data and plot markers
    function plotEarthquakes() {
      var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
      fetch(url)
        .then(response => response.json())
        .then(data => {
          L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
              var mag = feature.properties.mag;
              var depth = feature.geometry.coordinates[2];
              var radius = Math.sqrt(Math.abs(mag)) * 5;
              var color = getColor(depth);
              return L.circleMarker(latlng, {
                radius: radius,
                fillColor: color,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
              }).bindPopup("<b>Magnitude:</b> " + mag + "<br><b>Depth:</b> " + depth + " km");
            }
          }).addTo(map);
          addLegend();
        })
        .catch(error => console.error('Error fetching earthquake data:', error));
    }
  
    // Function to assign color based on depth
    function getColor(depth) {
      return depth > +90 ? '#DC143C' :
        depth > 70 ? '#F4A460' :
          depth > 50 ? '#FFA500' :
            depth > 30 ? '#FFD700' :
              depth > 10 ? '#FFFF00' :
                '#7FFF00';
    }
  
   // Function to assign color based on depth
function getColor(depth) {
    return depth > +90 ? '#DC143C' :
      depth > 70 ? '#F4A460' :
        depth > 50 ? '#FFA500' :
          depth > 30 ? '#FFD700' :
            depth > 10 ? '#FFFF00' :
              '#7FFF00';
  }
  
  // Function to add legend
function addLegend() {
    var legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, +90],
        colors = ['#7FFF00','#FFFF00','#FFD700', '#FFA500','#F4A460', '#DC143C'];
  
      div.innerHTML += '<h4>Depth</h4>';
      // loop through depth intervals and generate a label with a colored square for each interval
      for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<div style="background-color:' + colors[i] + '; width: 20px; height: 20px; display: inline-block;"></div>' +
          depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
      }
  
      return div;
    };
  
    legend.addTo(map);
  }
    // Plot earthquakes on initial load
    plotEarthquakes();
  
  });
  