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
    fillColor: "#ff0000",
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
    .setView([37.8, -20], 3)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/lovitana/ck9hcar40128e1in25eib56gd'));
map.options.minZoom = 2.1;
map.options.maxZoom = 12;
map.setMaxBounds(new L.LatLngBounds([-58.9, -175.7], [75.9, 180]));
map.options.maxBoundsViscosity = 0.5;
geojson.on('data:loaded', function () {
    geojson.addTo(map);
});
changeWordCloud();




/**
 * return true if the icons need to be seen
 */
function show_icon() {
    return ! document.getElementById("beer-btn").checked;
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

function get_data_unit() {
    const el = document.getElementById("dataSelection");
    return el.options[el.selectedIndex].dataset.unit;

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
    } else if(world){

        this._div.innerHTML ='<b>' + props.ISO_A2 + "</b><br/>" + '<h3>' + props.ADMIN + '</h3>';

        let content = get_data_for_C(props);
        if (content) {
            if(content%1 !== 0){
                content = content.toFixed(2);
            }
            this._div.innerHTML +="<b>"+get_data_text()+": </b>";
            this._div.innerHTML += content +" "+ get_data_unit();
        }

        let beer = get_data_associated_beer(props);
        let brewery = get_data_associated_brewery(props);

        if( beer && brewery){
            this._div.innerHTML +="<br><i class='fas fa-beer'></i> "+beer;
            this._div.innerHTML +="<br><i class=' fas fa-industry'></i> "+brewery;
        }

    }else{
        let breweries_data = data_country_per_pos[props._latlng];

        this._div.innerHTML=""

        for( b in breweries_data){
            let dat = breweries_data[b];
            this._div.innerHTML +='<h3><i class=\' fas fa-industry\'></i> <i>'+dat["brewery"]+"</i></h3>";
            let content = dat[get_data_to_show()];
            if(content) {
                if(content%1 !== 0){
                    content = content.toFixed(2);
                }
                this._div.innerHTML +="<b>"+get_data_text()+": </b>";
                this._div.innerHTML += content +" "+ get_data_unit();

            }
            let beer = dat[get_data_associated_beer_index()];
            if(beer){
                this._div.innerHTML +="<br><i class='fas fa-beer'></i> "+beer;
            }
            this._div.innerHTML +="<br><br>";

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
var data_country = [""];
var data_country_per_pos = [""];
const MAX_SIZE=100;
function load_data_country(isoCode){
    fetch("../data/country_data/"+isoCode+".json")
        .then(response => response.json())
        .then(data_c=>{
            data_country = getRandom(data_c,MAX_SIZE);
            data_country.forEach(d=>{d.LatLong = L.latLng([d.lat,d.long]);});
            data_country_per_pos=groupBy(data_country,"LatLong");
            whenCountryDataLoaded();
        });

}


function whenCountryDataLoaded() {
    updateColorScheme();
    update_breweries_on_map();

}

function combineData(datas){
    let d_s = get_data_to_show();
    if(d_s==="n_beers" || d_s =="avg_abv"){
        let sum =0;
        for( d in datas){
            sum += datas[d][d_s];
        }
        return (d_s==="n_beers")? sum: sum/datas.length;
    }
    if(d_s==="max_abv"  || d_s==="best_beer_score" || d_s === "popularity") {
        let max =datas[0][d_s];
        for( d in datas){
            if(max < datas[d][d_s]){
                max = datas[d][d_s];
            }
        }
        return max;
    }
    return 0.0;
}

function getRandom(arr, n) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        return arr;
    while (n--) {
        let x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}
var markers_layout = L.layerGroup();
markers_layout.addTo(map);
var icon_layout = L.layerGroup();

function update_breweries_on_map(){
    if(markers_layout) {
        markers_layout.clearLayers();
        icon_layout.clearLayers();
        //markers_layout.remove();
        if(world){
            return;
        }

    }
    //let markers = [];
    for(latlong in data_country_per_pos) {

        let datas = data_country_per_pos[latlong];
        let breweries = "";

        let color = getColor(combineData(datas));
        if(!color){
            color = "white";
        }
        if(!datas[0].lat || !datas[0].long){
            continue;
        }
        const circle= L.circleMarker([datas[0].lat, datas[0].long], {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            radius: 24*Math.sqrt(datas.length)
        });
        circle.on('mouseover',ev=>{info.update(ev.target)});
        circle.on('mouseout',ev=> {info.update()});

        markers_layout.addLayer(circle);
    }

    for(latlong in data_country_per_pos) {

        let datas = data_country_per_pos[latlong];
        let breweries = "";

        for (d in datas) {
            breweries += datas[d].brewery + "<br>"
        }
        let size = Math.floor(25*Math.sqrt(datas.length));
        if(!size){
            size = 25;
        }
        if(!datas[0].lat || !datas[0].long){
            continue;
        }

        const icon=L.icon({
            iconUrl: 'images/brew.png',
            iconSize:     [size, size], // size of the icon
        })

        icon_layout.addLayer(L.marker([datas[0].lat, datas[0].long], {icon: icon}).bindPopup(breweries).on('mouseover',ev=>{info.update(ev.target)}));
    }
}


/**
 *
 */
function whenShowingChange(index) {
    var beer1 = document.getElementById("beerSelection");
    var beer2 = document.getElementById("beerSelection2");
    if(beer1.selectedIndex != beer2.selectedIndex){
        if(index == 1){
            beer2.selectedIndex = beer1.selectedIndex;
        }
        if(index == 2){
            beer1.selectedIndex = beer2.selectedIndex;
        }
    }

    updateColorScheme();
    changeWordCloud();
    if(world) {
        geojson.setStyle(style);
    }else{
        update_breweries_on_map();
    }
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

var max_val = 0;
var min_val = 0;

/**
 * Create a color scheme for the data
 */
function updateColorScheme() {

    let array = [];
    let dat_to_show = get_data_to_show();
    if(world) {
        min_val = datas['US'][dat_to_show];
        max_val = datas['US'][dat_to_show];
        for (c in datas) {

            let d = datas[c][dat_to_show];
            if (c === 'null' || !d) {
                continue;
            }

            if (d < min_val) {
                min_val = d;
            }
            if (max_val < d) {
                max_val = d;
            }
        }
    }else{
        min_val = 10000;
        max_val =0;
        for (c in data_country_per_pos) {

            let d = combineData(data_country_per_pos[c]);
            if (c === 'null' || !d) {
                continue;
            }

            if (d < min_val) {
                min_val = d;
            }
            if (max_val < d) {
                max_val = d;
            }
        }
    }

    legend.update();
    info.update();
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
    this._div.innerHTML = "";

    if(!world){
        this._div.innerHTML+=
            " <svg height=\"180\" width=\"300\">\n" +
            "  <circle cx=\"90\" cy=\"148\" r=\"24\" stroke=\"black\" stroke-width=\"2\" fill-opacity=\"0\" />\n" +
            "   <circle cx=\"90\" cy=\"113\" r=\"59\" stroke=\"black\" stroke-width=\"2\" fill-opacity=\"0\" />\n" +
            "   <circle cx=\"90\" cy=\"90\" r=\"83\" stroke=\"black\" stroke-width=\"2\" fill-opacity=\"0\"/>\n" +
            "   <line x1=\"90\" y1=\"7\" x2=\"180\" y2=\"7\" style=\"stroke:black\" stroke-width=1 />\n" +
            "    <line x1=\"90\" y1=\"124\" x2=\"180\" y2=\"124\" style=\"stroke:black\" stroke-width=1 />\n" +
            "    <line x1=\"90\" y1=\"54\" x2=\"180\" y2=\"54\" style=\"stroke:black\" stroke-width=1 />\n" +
            "   <text x=\"183\" y=\"15\">12 Breweries</text>\n" +
            "   <text x=\"183\" y=\"59\">\n" +
            "     6 Breweries\n" +
            "   </text>\n" +
            "   <text x=\"183\" y=\"129\"> 1 Brewery</text>\n" +
            "</svg> "
    }

    // loop through our density intervals and generate a label with a colored square for each interval
    this._div.innerHTML +="<h2><b>" + get_data_text()+"</b>  ("+get_data_unit()+")</h2>";
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

    data_country =[];

    world = true;
    document.getElementById('closeCountry').style.display = 'none';
    document.getElementById('beer-type').style.display='block';
    document.getElementById("btn-gr").style.display='none';

    map.setView([37.8, -20], 3);
    updateColorScheme();
    geojson.setStyle(style);
    info.update();
    c_properties = "";
    country = "";
    get_fun_fact('HOME');
    //getBeerSelection();
    update_breweries_on_map();
}

/**
 *  Select a country to view and zoom on
 * @param target the country to select
 */
function selectCountry(target) {
    world = false;
    document.getElementById('closeCountry').style.display = 'block';

    // TODO remove the 2 lines when type implemented
    document.getElementById('beer-type').style.display='none';
    document.getElementById("beerSelection").selectedIndex = 0;
    document.getElementById("btn-gr").style.display='block';


    country = target.feature.properties.ISO_A2;
    c_properties = target.feature.properties;
    //getBeerSelection();
    document.getElementById('chart-container').innerHTML = ''
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
    layer = e.target;
    country = layer.feature.properties.ISO_A2;
    get_fun_fact(country);
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
    layer.addEventListener("mouseout", mouseOut, {passive: true});
}

function changeWordCloud(){
    document.getElementById('chart-container').innerHTML =""
    var beer = document.getElementById('beerSelection');
    var selected = beer.options[beer.selectedIndex].value;
    if( selected != "AllBeer"){
        var chart = anychart.tagCloud(getDataWords(selected));
    }else{
        var chart = anychart.tagCloud();
    }
        var customColorScale = anychart.scales.linearColor();
        customColorScale.colors([ "#DF8D03","#A94E02"]);

        var title = chart.title();
        title.enabled(true);

        title.useHtml(true);
        title.text(
        "<br><a style=\"color:#460000;\">"+
        "How beer lovers describe the   ..........................:</a>"
        );

        chart.colorScale(customColorScale);
        chart.bounds(0,0,'100%','100%');
        chart.angles([0])
        chart.background().fill((255,255,255),0);
        // set the color range length
        chart.container("chart-container");
        chart.draw();



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

function get_fun_fact(country) {
    file_path = "../data/country_fun_facts/" + country + ".html";

    textBox = document.getElementById("specific-infos");
    fetch("../data/country_fun_facts/" + country + ".html")
            .then(function(response) {
                if (!response.ok) {
                    return getCountryGenericData(country);
                }else {
                    return response.text();
                }
            })
            .then(data => {
                textBox.innerHTML = data;
            })
            .catch((err) => alert(err));

}
function getCountryGenericData(country) {
    if (country in datas){
        var description = "<ul>";
        if ("n_beers" in datas[country]) {
            description += "<li>There are " + datas[country]["n_beers"] + " different craft beers in this country. <br> <br>";
        }
        if ("max_abv_beer" in datas[country]) {
            description += "<li>The beer with the highest ABV is : " + datas[country]["max_abv_beer"] + " with an ABV of " + datas[country]["max_abv"] + "<br><br>";
        }
        if ("best_beer" in datas[country]) {
            description += "<li>The best reviewed beer is : " + datas[country]["best_beer"] + "<br><br>";
        }
        description += "</ul>";
        return description;
    }else {
        return "No information about this country...";
    }
}

function findLayer() {
    var searchInput = document.getElementById("search-input").value;
    var countries = getCountriesFromSearch(searchInput);
    //var countryCode = document.getElementById("search-input").value;
    var layers = geojson["_layers"];
    var correctLayers = [];
    for(e in layers){
        var code = layers[e]["feature"]["properties"]["ISO_A2"];
        if (countries.includes(code)) {
            correctLayers.push(layers[e]);
        }
    }
    if (correctLayers != []) {
        resetStyles();
        for(let i = 0 ; i < correctLayers.length ; i++) {
            correctLayers[i].setStyle(searchResultStyle);
        }
    }
    else {
        resetStyles();
    }
}

function resetStyles() {
    var layers = geojson["_layers"];
    for(e in layers) {
        layers[e].setStyle(style(layers[e]["feature"]));
    }
}

var beerSearchData = "";
fetch("../data/beer_search_data.json")
    .then(response => response.json())
    .then(data => {
        beerSearchData = data;
        //var beerNames = data.map((x) => x["beer"]);
        //beerNames.filter((v, i, a) => a.indexOf(v) == i);
        //autocomplete(document.getElementById("search-input"), beerNames);
    });

var brewerySearchData = "";
fetch("../data/brewery_search_data.json")
    .then(response => response.json())
    .then(data => {
        brewerySearchData = data;
    });

function getCountriesFromSearch(searchInput) {
    var countries = [];
    for (item in beerSearchData) {
        if (beerSearchData[item]["beer"] == searchInput) {
            var c = beerSearchData[item]["country"];
            if (countries.includes(c) == false) {
                countries.push(c);
            }
        }
    }
    for (item in brewerySearchData) {
        if (brewerySearchData[item]["brewery"] == searchInput) {
            var c = brewerySearchData[item]["country"];
            if (countries.includes(c) == false) {
                countries.push(c);
            }
        }
    }
    return countries
}
/*
var searchKeys = "";
fetch("../data/searchKeys.json")
    .then(response => response.json())
    .then(data => {
        searchKeys = data;
        //autocomplete(document.getElementById("search-input"), searchKeys);
    });
*/
var searchCategorySelection = document.getElementById("search-cat");
var searchCategory = searchCategorySelection.options[searchCategorySelection.selectedIndex].value;

function changeSearchCat() {
    searchCategory = searchCategorySelection.options[searchCategorySelection.selectedIndex].value;
}

var beerAuto = "";
fetch("../data/beer_auto.json")
.then(response => response.json())
.then(data => {
    beerAuto = data;
    var inp = document.getElementById("search-input");
    var currentFocus;
    inp.addEventListener("input", function(e) {
        if (searchCategory == "Beer") {
        var a, b, i, val = this.value;
        closeAllLists();
        if (val) {
            if (val.length >= 3) {
                var key = val.slice(0, 3);
                var keys = beerAuto.map(x => x["beer_key"]);
                if (keys.includes(key)) {
                    var beers = beerAuto.filter(x => x["beer_key"] == key).map(x => x["beer"])[0];
                    currentFocus = -1;
                    a = document.createElement("DIV");
                    a.setAttribute("id", this.id + "autocomplete-list");
                    a.setAttribute("class", "autocomplete-items");
                    this.parentNode.appendChild(a);
                    for(let i = 0 ; i < beers.length; i++) {
                        //console.log(beers[i]);
                        if (beers[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                            b = document.createElement("DIV");
                            b.innerHTML = "<strong>" + beers[i].substr(0, val.length) + "</strong>";
                            b.innerHTML += beers[i].substr(val.length);
                            /*insert a input field that will hold the current array item's value:*/
                            b.innerHTML += "<input type='hidden' value='" + beers[i] + "'>";
                            b.addEventListener("click", function(e) {
                                inp.value = this.getElementsByTagName("input")[0].value;
                                closeAllLists();
                            })
                            a.appendChild(b);
                        }
                    }
                }
            }
        }
    }
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
                }
        }
    });
      function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
      }
function removeActive(x) {
/*a function to remove the "active" class from all autocomplete items:*/
for (var i = 0; i < x.length; i++) {
  x[i].classList.remove("autocomplete-active");
}
}
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

});

var breweryAuto = "";
fetch("../data/brewery_auto.json")
.then(response => response.json())
.then(data => {
    breweryAuto = data;
    var inp = document.getElementById("search-input");
    var currentFocus;
    inp.addEventListener("input", function(e) {
        if (searchCategory == "Brewery") {
        var a, b, i, val = this.value;
        closeAllLists();
        if (val) {
            if (val.length >= 3) {
                var key = val.slice(0, 3);
                var keys = breweryAuto.map(x => x["brewery_key"]);
                if (keys.includes(key)) {
                    var breweries = breweryAuto.filter(x => x["brewery_key"] == key).map(x => x["brewery"])[0];
                    currentFocus = -1;
                    a = document.createElement("DIV");
                    a.setAttribute("id", this.id + "autocomplete-list");
                    a.setAttribute("class", "autocomplete-items");
                    this.parentNode.appendChild(a);
                    for(let i = 0 ; i < breweries.length; i++) {
                        //console.log(beers[i]);
                        if (breweries[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                            b = document.createElement("DIV");
                            b.innerHTML = "<strong>" + breweries[i].substr(0, val.length) + "</strong>";
                            b.innerHTML += breweries[i].substr(val.length);
                            /*insert a input field that will hold the current array item's value:*/
                            b.innerHTML += "<input type='hidden' value='" + breweries[i] + "'>";
                            b.addEventListener("click", function(e) {
                                inp.value = this.getElementsByTagName("input")[0].value;
                                closeAllLists();
                            })
                            a.appendChild(b);
                        }
                    }
                }
            }
        }
    }
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
                }
        }
    });
      function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
      }
function removeActive(x) {
/*a function to remove the "active" class from all autocomplete items:*/
for (var i = 0; i < x.length; i++) {
  x[i].classList.remove("autocomplete-active");
}
}
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

});
