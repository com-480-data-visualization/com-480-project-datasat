/*
 * STYLES for countries
 */
const searchColor = "#8b0000";
const defaultStyle = {
    fillColor: "#FFF897",
    fillOpacity: 1,
    weight: 1,
    color: "#604000",
};

const highlight = {
    //fillColor: "#F6C101",
    fillOpacity: 0.8,
    weight: 4,
    opacity: 1,
    color: "#000000",
};

const selected = {
    weight: 3,
    fillColor: "#FFF897",
    fillOpacity: 0,
    color: "#604000",
};

const hide = {
    fillColor: "#FFF897",
    fillOpacity: 1,
    weight: 1,
    color: "#604000",
};

const noDataStyle = {
    fillColor: "#c2c2c2",
    fillOpacity: 1,
    weight: 1,
    color: "#ffffff",
};

const searchResultStyle = {
    fillColor: searchColor,
    fillOpacity: 1,
    weight: 4,
    color: "#000000",
};
/*
 * global variables
 */
// Context
var world = true;
var country = "";
var c_properties = "";


// Map
var geojson = new L.GeoJSON.AJAX("../data/countries.geojson", {style: style, onEachFeature: onEachFeature});

L.mapbox.accessToken = 'pk.eyJ1IjoibG92aXRhbmEiLCJhIjoiY2s5aGM4MWU2MGFmZDNubW5hZzhvYzUwcSJ9.fxbhUaa-uvN57kEkyKAALA';
var map = L.mapbox.map('map')
    .setView([37.8, -20], 3)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/lovitana/ck9hcar40128e1in25eib56gd'));
map.options.minZoom = 2.1;
map.options.maxZoom = 12;
map.setMaxBounds(new L.LatLngBounds([-58.9, -175.7], [75.9, 180]));
map.options.maxBoundsViscosity = 0.5;
geojson.on('data:loaded', function () {
    geojson.addTo(map);
});





/**
 *
 */
function whenShowingChange(index) {
    var beer1 = document.getElementById("beerSelection");
    var beer2 = document.getElementById("beerSelection2");
    if (beer1.selectedIndex != beer2.selectedIndex) {
        if (index == 1) {
            beer2.selectedIndex = beer1.selectedIndex;
        }
        if (index == 2) {
            beer1.selectedIndex = beer2.selectedIndex;
        }
    }

    updateColorScheme();
    changeWordCloud();
    if (world) {
        geojson.setStyle(style);
    } else {
        update_breweries_on_map();
    }
}


/**
 * Goes back to world view
 */
function returnToWorld() {
    overload_panel.remove();

    data_country = [];

    world = true;
    document.getElementById('closeCountry').style.display = 'none';
    document.getElementById("btn-gr").style.display = 'none';

    map.setView([37.8, -20], 3);
    updateColorScheme();
    geojson.setStyle(style);
    info.update();
    c_properties = "";
    country = "";
    get_fun_fact('HOME');
    changeWordCloud();
    //getBeerSelection();
    update_breweries_on_map();
}

/**
 *  Select a country to view and zoom on
 * @param target the country to select
 */
function selectCountry(target) {
    overload_panel.remove();
    world = false;
    document.getElementById('closeCountry').style.display = 'block';


    document.getElementById("btn-gr").style.display = 'block';

    country = target.feature.properties.ISO_A2;
    c_properties = target.feature.properties;
    //getBeerSelection();
    geojson.setStyle(hide);
    target.setStyle(selected);
    info.update(c_properties);

    load_data_country(country);
}

/**
 * Zoom on a target and select it
 * @param e event
 */
function zoomAndSelect(e) {
    let layer = e.target;
    if (world || country !== layer.feature.properties.ISO_A2) {
        selectCountry(e.target);
        map.fitBounds(e.target.getBounds());

        country = layer.feature.properties.ISO_A2;
        get_fun_fact(country);
    }

}

/**
 *  highlight the target of the event
 * @param e event happening
 * @param popupContent  FIXME ????
 */
function highlightFeature(e, popupContent) {
    var layer = e.target;
    if (layer.feature.properties.ISO_A2 != country) {
        if (layer.options.fillColor != searchColor) {
            layer.setStyle(highlight);
        }
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
    if (layer.options.fillColor != searchColor) {
        layer.setStyle(style(e.target.feature));
    }
    if (world) {
        info.update();
    }
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
    layer.addEventListener("mouseout", mouseOut, {passive: true});
}


