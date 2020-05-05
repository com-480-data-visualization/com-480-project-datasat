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

const noDataStyle = {
    fillColor: "#c2c2c2",
    fillOpacity: 1,
    weight: 1,
    color: "#ffffff",
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
function get_data_to_show() {
    const el = document.getElementById("dataSelection");
    return el.options[el.selectedIndex].value;
}

/**
 * return the value of the filter
 */
function get_filter_value() {
    const el = document.getElementById("beerSelection");
    return el.options[el.selectedIndex].text;
}


function get_data_for_C(props) {
    let data_C = datas[props.ISO_A2];
    if (data_C) {
        return data_C[get_data_to_show()];
    }
}

/**
 * The info method for update
 *
 *  TODO decide if we want multiples methods and we change the method update dynamically
 *   or if we have one update that is general
 */
const defaultUpdate = function (props) {
    if (!props) {
        this._div.innerHTML = '';
    } else {
        let name = '<b>' + props.ISO_A2 + "</b><br/>" + '<h3>' + props.ADMIN + '</h3>';

        let content = get_data_for_C(props);
        if(!content){
            content="";
        }



        this._div.innerHTML = name + content;
    }
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


/*
 * Load the data
 */
var datas = "";
fetch("../data/countries_basic_data.json")
    .then(response => response.json())
    .then(data => {
        datas = data;
        whenDataLoaded();
    });


/**
 * Filter datas
 */
function filter() {
    //TODO change datas
}


/**
 * What to do once the datas are loaded
 */
function whenDataLoaded() {
    getColor = createColorScheme();
    geojson.setStyle(style);
    //console.log(datas);
}

/**
 *
 */
function whenShowingChange() {
    getColor = createColorScheme();
    geojson.setStyle(style);
}


// get the color for a given data
var getColor = d=>defaultStyle.fillColor;

/**
 * Create a color scheme for the data
 *  type: linear or exponential
 *  TODO  separate color in 20% of the data each
 */
function createColorScheme() {

    let array =[];
    for(c in datas) {
        array.push( datas[c][get_data_to_show()]);
    }

    array = array.sort((a,b)=> a-b);

    return function(d) {
        return d > quartile(array,0.95) ? '#800026' :
            d > quartile(array,0.9) ? '#BD0026' :
                d > quartile(array,0.8) ? '#E31A1C' :
                    d > quartile(array,0.7)? '#FC4E2A' :
                        d > quartile(array,0.55) ? '#FD8D3C' :
                            d > quartile(array,0.4) ? '#FEB24C' :
                                d > quartile(array,0.2) ? '#FED976' :
                                    '#FFEDA0';
    };
}

/**
 * Return the quartile of an already sorted data
 * @param data
 * @param q
 * @returns the quartile
 */
function quartile(data, q) {
    const pos = ((data.length) - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if( (data[base+1]!==undefined) ) {
        return data[base] + rest * (data[base+1] - data[base]);
    } else {
        return data[base];
    }
}

/**
 * style of the country at the moment
 */
function style(feature) {
    if (world) {

        let data_c = get_data_for_C(feature.properties);

        if(data_c){
            return {
                fillColor: getColor(data_c),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 1
            };
        }

        return noDataStyle;
    } else {
        if (country === feature.properties.ISO_A2) {
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
    geojson.setStyle(style);
    info.update();
    c_properties = "";
    country = "";
    //getBeerSelection();
}

/**
 *  Select a country to view and zoom on
 * @param target the country to select
 */
function selectCountry(target) {
    world = false;
    document.getElementById('closeCountry').style.display = 'block';

    country = target.feature.properties.ISO_A2;
    c_properties = target.feature.properties;
    //getBeerSelection();

    geojson.setStyle(hide);
    target.setStyle(selected);
    info.update(c_properties);
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
    if (layer.feature.properties.ISO_A2 != country) {
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
    layer.setStyle(style(e.target.feature));
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






