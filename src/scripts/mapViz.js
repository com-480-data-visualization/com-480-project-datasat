const defaultStyle = {
    fillColor: "#F6C101",
    fillOpacity: .6,
    weight: 2,
    color: "#604000",
    };

const hilight = {   weight: 3,
    fillColor: "#F6C101",
    fillOpacity: 1
};

const hide = {
    fillColor: "#FFFFFF",
    fillOpacity: 1,
    weight: 1
};

var world = true;
var country = "";
function style(feature) {
    if(world){
        return defaultStyle;
    }else{
        if(country === feature.properties.ADMIN){
            return hilight;
        }
        return hide;
    }

}



var geojson = new L.GeoJSON.AJAX("../data/countries.geojson", {style:style, onEachFeature:onEachFeature});

L.mapbox.accessToken = 'pk.eyJ1IjoibG92aXRhbmEiLCJhIjoiY2s5aGM4MWU2MGFmZDNubW5hZzhvYzUwcSJ9.fxbhUaa-uvN57kEkyKAALA';
var map = L.mapbox.map('map')
    .setView([37.8, -20], 3)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/lovitana/ck9hcar40128e1in25eib56gd'));
map.options.minZoom = 2.3;
map.options.maxZoom = 7;
map.setMaxBounds(new L.LatLngBounds([-58.9, -175.7], [75.9, 180]));
map.options.maxBoundsViscosity = 1.0;
geojson.on('data:loaded', function(){
geojson.addTo(map);
});

function returnToWorld(){
    world = true;
    document.getElementById('closeCountry').style.display = 'none';
    map.setView([37.8, -20], 3);
    geojson.setStyle(style);
    getBeerSelection();
}

function selectCountry(e){
    world=false;
    document.getElementById('closeCountry').style.display = 'block';
    country = e.target.feature.properties.ADMIN;
    getBeerSelection();

    geojson.setStyle(hide);
    e.target.setStyle(hilight);
}

function zoomToFeature(e) {
    selectCountry(e);
    map.fitBounds(e.target.getBounds());
}


function highlightFeature(e, popupContent) {
  var layer = e.target;
  layer.setStyle(hilight);
}

function mouseOut(e) {
  var layer = e.target;
  layer.setStyle(style(e.target.feature));
  map.closePopup();
}

function onMouseClick(e) {

}

function onEachFeature(feature, layer) {
    layer.addEventListener("click",zoomToFeature,{passive:true});
    layer.addEventListener("mouseover", highlightFeature, {passive:true});
    layer.addEventListener("mousemove", function(e) {
        if (world){
            var beerSelection = document.getElementById("beerSelection");
            var beerChoice = beerSelection.options[beerSelection.selectedIndex].value;
            var dataTypeSelection = document.getElementById("dataSelection");
            var dataType = dataTypeSelection.options[dataTypeSelection.selectedIndex].value;
            if (beerChoice == "All Beer Types") {
                beerChoice = "Beers";
            }
            var popupContent = "<b>" + feature.properties.ADMIN + " </b><br> " + beerChoice + " having the highest " + dataType +" : <br> - Feld <br> - Heineken";

            var popup  = L.popup({closeButton:false}).setLatLng(e.latlng).setContent(popupContent).openOn(map);
        }
  },{passive:true});
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
