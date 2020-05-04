/*
 * STYLES for countries
 */

const defaultStyle = {
    fillColor: "#FFF897",
    fillOpacity: 1,
    weight: 1,
    color: "#604000",
};

const hilight = {
    weight: 3,
    fillColor: "#F6C101",
    fillOpacity: 1,
    weight: 2,
    color: "#604000",
};

const selected = {
    weight: 3,
    fillColor: "#FFF897",
    fillOpacity: 1,
    weight: 1,
    color: "#604000",
};

const hide = {
    fillColor: "#FFFFFF",
    fillOpacity: 1,
    weight: 1,
    color: "#604000",
};


/*
 * global variables
 */
// Context
var world = true;
var country = "";


// Map
var geojson = new L.GeoJSON.AJAX("../data/countries.geojson", {style: default_style, onEachFeature: onEachFeature});

L.mapbox.accessToken = 'pk.eyJ1IjoibG92aXRhbmEiLCJhIjoiY2s5aGM4MWU2MGFmZDNubW5hZzhvYzUwcSJ9.fxbhUaa-uvN57kEkyKAALA';
var map = L.mapbox.map('map')
    .setView([37.8, -20], 3);
    //.addLayer(L.mapbox.styleLayer('mapbox://styles/lovitana/ck9hcar40128e1in25eib56gd'));
map.options.minZoom = 2.1;
map.options.maxZoom = 10;
map.setMaxBounds(new L.LatLngBounds([-58.9, -175.7], [75.9, 180]));
map.options.maxBoundsViscosity = 0.5;
geojson.on('data:loaded', function () {
    geojson.addTo(map);
});


/**
 * return true if the beer is selected, false if the brewery is selected
 */
function beer_or_breweries() {
    return document.getElementById("beer-btn").checked;
}

/**
 * return the data selected by the form at the top right
 */
function get_data_to_show(){
    const el= document.getElementById("dataSelection");
    return el.options[el.selectedIndex].text;
}

/**
 * return the value of the filter
 */
function get_filter_value(){
    const el= document.getElementById("beerSelection");
    return el.options[el.selectedIndex].text;
}

/*
 * The info method for update
 *
 *  TODO decide if we want multiples methods and we change the method update dynamically
 *   or if we have one update that is general
 */
const defaultUpdate = function (props) {
    this._div.innerHTML = (props ? '<h3>' + props.ADMIN + '</h3>' +
        '<b>' + props.ISO_A2 + '</b><br />'
     + (beer_or_breweries()?"Beer":"Brewery") +'<br/>'
        + get_data_to_show(): '');
};

/*
 * Infos popup
 */
var info = L.control({position: 'bottomleft'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = defaultUpdate;

info.addTo(map);


/**
 * style of the country at the moment
 */
function default_style(feature) {
    if (world) {
        return defaultStyle;
    } else {
        if (country === feature.properties.ADMIN) {
            return selected;
        }
        return hide;
    }
}


/**
 * Goes back to world view
 */
function returnToWorld() {
    world = true;
    document.getElementById('closeCountry').style.display = 'none';
    map.setView([37.8, -20], 3);
    geojson.setStyle(default_style);
    info.update();
    //getBeerSelection();
}

/**
 *  Select a country to view and zoom on
 * @param target the country to select
 */
function selectCountry(target) {
    world = false;
    document.getElementById('closeCountry').style.display = 'block';

    country = target.feature.properties.ADMIN;
    //getBeerSelection();

    geojson.setStyle(hide);
    target.setStyle(selected);
    info.update();
}

/**
 * Zoom on a target and select it
 * @param e event
 */
function zoomAndSelect(e) {
    selectCountry(e.target);
    map.fitBounds(e.target.getBounds());
}

/**
 *  highlight the target of the event
 * @param e event happening
 * @param popupContent  FIXME ????
 */
function highlightFeature(e, popupContent) {
    var layer = e.target;
    if (layer.feature.properties.ADMIN != country) {
        layer.setStyle(hilight);
    }

    if (world) {
        info.update(layer.feature.properties);
    }
}

/**
 * Defines behavior when mouse is out a country:
 *      Reset style
 *      close pop_up
 * @param e event
 */
function mouseOut(e) {
    var layer = e.target;
    layer.setStyle(default_style(e.target.feature));
    info.update();
    //map.closePopup();
}


/**
 * What to do on each feature of the geojson
 * @param feature
 * @param layer layer of the feature
 */
function onEachFeature(feature, layer) {
    layer.addEventListener("click", zoomAndSelect, {passive: true});
    layer.addEventListener("mouseover", highlightFeature, {passive: true});
    /*
    FIXME erase obselete
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
  },{passive:true});*/
    layer.addEventListener("mouseout", mouseOut, {passive: true});
}






