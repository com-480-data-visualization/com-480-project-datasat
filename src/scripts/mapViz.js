
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

