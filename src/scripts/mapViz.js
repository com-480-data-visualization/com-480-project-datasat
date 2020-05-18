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
    //fillColor: "#F6C101",
    fillOpacity: 0.8,
    weight: 4,
    opacity:1,
    color: "#000000",
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
    const beer = document.getElementById("beerSelection")
    if (beer.options[beer.selectedIndex].value !== "AllBeer"){
        return el.options[el.selectedIndex].value + '_'+ beer.options[beer.selectedIndex].value;
    }else{
        return el.options[el.selectedIndex].value 
    }
}


function get_data_associated_beer_index() {
    const el = document.getElementById("dataSelection");
    const beer = document.getElementById("beerSelection");

    if (beer.options[beer.selectedIndex].value !== "AllBeer"){
        return el.options[el.selectedIndex].dataset.beer+ '_'+ beer.options[beer.selectedIndex].value;
    }else{
        return el.options[el.selectedIndex].dataset.beer;
    }
}
/**
 * return the beer associated with the data if any
 */
function get_data_associated_beer(props) {
    let data_C = datas[props.ISO_A2];
    if (data_C) {
        let beer_id = get_data_associated_beer_index();
        if(beer_id) {
            return data_C[beer_id];
        }else{return  false;}
    }
}


function get_data_associated_brewery_index() {
    const el = document.getElementById("dataSelection");
    const beer = document.getElementById("beerSelection");
    if (beer.options[beer.selectedIndex].value !== "AllBeer"){
        return el.options[el.selectedIndex].dataset.brew+ '_'+ beer.options[beer.selectedIndex].value;
    }else{
        return el.options[el.selectedIndex].dataset.brew;
    }
}
/**
 * return the brewery associated with the data if any
 */
function get_data_associated_brewery(props) {
    let data_C = datas[props.ISO_A2];
    if (data_C) {
        let brew_id = get_data_associated_brewery_index();
        if(brew_id) {
            return data_C[brew_id];
        }else{return  false;}
    }
}

/**
 * return the value of the filter
 */
function get_filter_text() {
    const el = document.getElementById("beerSelection");
    return el.options[el.selectedIndex].text;
}

function get_data_text() {
    const el = document.getElementById("dataSelection");
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

/*
 * Infos popup
 */
var info = L.control({position: 'bottomleft'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function (props) {
    if (!props) {
        this._div.innerHTML = '';
    } else {
        this._div.innerHTML ='<b>' + props.ISO_A2 + "</b><br/>" + '<h3>' + props.ADMIN + '</h3>';

        let content = get_data_for_C(props);
        if (content) {
            if(content%1 !== 0){
                content = content.toFixed(2);
            }
            this._div.innerHTML +="<b>"+get_data_text()+": </b>";
            this._div.innerHTML += content;
        }

        let beer = get_data_associated_beer(props);
        let brewery = get_data_associated_brewery(props);

        if( beer && brewery){
            this._div.innerHTML +="<br><i class='fas fa-beer'></i> "+beer;
            this._div.innerHTML +="<br><i class=' fas fa-industry'></i> "+brewery;
        }

    }
};

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
 * What to do once the datas are loaded
 */
function whenDataLoaded() {
    legend.addTo(map);
    updateColorScheme();
    geojson.setStyle(style);

}


/*
 * Load data associated with a country
 */
var data_country = "";
function load_data_country(isoCode){
    fetch("../data/country_data/"+isoCode+".json")
        .then(response => response.json())
        .then(data_c=>{
            data_country = data_c;
            whenCountryDataLoaded();
        });

}

function whenCountryDataLoaded() {
    console.log(data_country);
}

/**
 *
 */
function whenShowingChange() {
    updateColorScheme();
    changeWordCloud();
    geojson.setStyle(style);
}


// get the color for a given data
const colors = ['#460000',
    '#522c04',
    '#6f3b03',
    '#b46208',
    '#ec7119',
    '#fc8c2a',
    '#FEB24C',
    '#FED976',
    '#ffe6ad'];

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
var max_val = 0;
var min_val = 0;

/**
 * Create a color scheme for the data
 */
function updateColorScheme() {

    let array = [];
    let dat_to_show = get_data_to_show()
    min_val = datas['US'][dat_to_show];
    max_val = datas['US'][dat_to_show];
    for (c in datas) {

        let d = datas[c][dat_to_show];
        if(c === 'null' || !d){
            continue;
        }

        if(d<min_val){
            min_val = d;
        }
        if(max_val<d){
            max_val = d;
        }
    }

    legend.update();
}


const colorScale = chroma.scale(colors);
function getColor(d) {
    let x = 1.0- (d-min_val)/(max_val -min_val);
    return colorScale(x);
}

/*
 * LEGEND
 */

var legend = L.control({position: 'bottomright'});

legend.update = function () {
    // loop through our density intervals and generate a label with a colored square for each interval
    this._div.innerHTML ="<h2><b>" + get_data_text()+"</b></h2>";
    /*for (let i = 0; i < 8; i++) {
        let x = i/8;
        let d = max_val *(1-x) + min_val*x;
        this._div.innerHTML +=
            '<i style="background:' + getColor(d ) + '"></i> ' +
            Math.round(d+.05)  + '<br>';
    }*/
    this._div.innerHTML +="<div class='gradient'>"
    for(let i = 100; i >= 1; i--){
        this._div.innerHTML +="<span class='grad-step' style='background-color:"+colorScale(i/100.0)+"' ></span>"
    }
    let approximation = approximate(min_val,max_val)
    let max = approximation.max;
    let min = approximation.min;
    let med =approximation.med;
    this._div.innerHTML +="</div><div class='grad-val'>"
    this._div.innerHTML += "<span class='min'>"+min+"</span>";
    this._div.innerHTML += "<span class='med'>"+med+"</span>";
    this._div.innerHTML += "<span class='max'>"+max+"</span> ";
    this._div.innerHTML += "</div>"
}

function approximate(min,max){
    let diff = max-min;
    let med = (max + min )/2;
    let i = 0;
    while(diff>10){
        i+=1;
        diff = diff/10;
        min = min/10;
        max= max/10;
        med = med/10;
    }
    min = (min).toFixed(1);
    med = med.toFixed(1);
    max = (max+0.1).toFixed(1);
    while(i>0){
        i-=1;
        min = min*10;
        max= max*10;
        med = med*10;
    }

    return {min:min,med:med,max:max};
}

legend.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info legend');
    return this._div;
};

/**
 * style of the country at the moment
 */
function style(feature) {
    if (world) {

        let data_c = get_data_for_C(feature.properties);

        if (data_c) {
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

    load_data_country(country);
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

function changeWordCloud(){
    document.getElementById('chart-container').innerHTML =""
    var beer = document.getElementById('beerSelection');
    var selected = beer.options[beer.selectedIndex].value;
    if( selected != "AllBeer"){
        var chart = anychart.tagCloud(getDataWords(selected));
    
        // enable a color range
        var customColorScale = anychart.scales.linearColor();
        customColorScale.colors([ "#DF8D03","#A94E02"]);
        chart.title("How beer lovers describe the "+ selected +'s:')
        chart.colorScale(customColorScale);
        chart.bounds(0,0,'100%','100%');
        chart.angles([0])
        chart.background().fill((255,255,255),0);
        // set the color range length
        chart.container("chart-container");
        chart.draw();
        
    }
}

var word_data = "";
fetch("../data/word_cloud.json")
    .then(response => response.json())
    .then(data => {
        word_data = data;    
    });

function getDataWords(beerSelected){
    return word_data[beerSelected]["words"]
}   