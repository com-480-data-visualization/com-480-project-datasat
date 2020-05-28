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
    changeWordCloud();

}