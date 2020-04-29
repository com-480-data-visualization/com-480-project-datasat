const defaultStyle = {
    fillColor: "#F6C101",
    fillOpacity: .6,
    weight: 2,
    color: "#604000",
    };

function style(feature) {
  return defaultStyle;
}



var geojson = new L.GeoJSON.AJAX("../data/countries.geojson", {style:style, onEachFeature:onEachFeature});

L.mapbox.accessToken = 'pk.eyJ1IjoibG92aXRhbmEiLCJhIjoiY2s5aGM4MWU2MGFmZDNubW5hZzhvYzUwcSJ9.fxbhUaa-uvN57kEkyKAALA';
var map = L.mapbox.map('map')
    .setView([37.8, -20], 3)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/lovitana/ck9hcar40128e1in25eib56gd'));
map.options.zoomDelta = 0.5;
map.options.minZoom = 2.5;
map.options.maxZoom = 7;
map.setMaxBounds(map.getBounds());
map.options.maxBoundsViscosity = 1.0;
//L.geoJson(geojson).addTo(map);
geojson.on('data:loaded', function(){
geojson.addTo(map);
});
/*
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
        '<b>' + props.ADMIN + '</b><br />'
        : 'Hover over a state');
};

info.addTo(map);
*/
function highlightFeature(e, popupContent) {
  var layer = e.target;
  layer.setStyle({
    weight: 5,
    fillColor: "#F6C101",
    fillOpacity: 1,
  });

  //var mouseX = window.event.clientX;
  //var mouseY = window.event.clientY;
  //d3.select("#hovertool").style("left", mouseX + "px").style("top", mouseY + 'px').style("opacity", .5);
/*
  var mouseX = window.event.clientX;
  var mouseY = window.event.clientY;
  var hovertool = document.getElementById("hovertool");
  hovertool.style.opacity=1;
  hovertool.style.left = mouseX + 'px';
  hovertool.style.top = mouseY + 'px';
*/

}
function mouseOut(e) {
  var layer = e.target;
  layer.setStyle(defaultStyle);
  map.closePopup();
  //info.update();
}

function onMouseClick(e) {
  
}

function onEachFeature(feature, layer) {
  var popupContent = "Top rated beers in " + feature.properties.ADMIN + " :<br> - Feld <br> - Heineken"//feature.properties.ADMIN;
  /*layer.on({
    mouseover: highlightFeature,
    mousemove: function(e) {
      var popup  = L.popup({closeButton:false}).setLatLng(e.latlng).setContent(popupContent).openOn(map);
    },
    mouseout: mouseOut
  }, {passive:true}); */
  layer.addEventListener("mouseover", highlightFeature, {passive:true});
  layer.addEventListener("mousemove", function(e) {
    //highlightFeature(e);
    var popup  = L.popup({closeButton:false}).setLatLng(e.latlng).setContent(popupContent).openOn(map);

  }, {passive:true});
  layer.addEventListener("mouseout", mouseOut, {passive:true});
}

/*
 NOT USED RN
 */
/*


function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {
        // `DOMContentLoaded` already fired
        action();
    }
}
function fetchJSON(url) {
    return fetch(url)
        .then(function(response) {
            return response.json();
        });
}

fetchJSON('../../data/countries.geojson')
    .then(function(data1) {


        L.geoJson(data1).addTo(map);

    });

var mapboxAccessToken = {"pk.eyJ1IjoibG92aXRhbmEiLCJhIjoiY2s5aGM4MWU2MGFmZDNubW5hZzhvYzUwcSJ9.fxbhUaa-uvN57kEkyKAALA"};
var map = L.map('map').setView([37.8, -96], 4);
L.tileLayer('https://api.mapbox.com/styles/lovitana/ck9hcar40128e1in25eib56gd?access_token=' + mapboxAccessToken, {
    id: 'lovitana/ck9hcar40128e1in25eib56gd',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);
*/
