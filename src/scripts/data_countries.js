/*
 * Load data associated with a country
 */
var data_country = [""];
var data_country_per_pos = [""];
const MAX_SIZE = 100;

function load_data_country(isoCode) {
    fetch("../data/country_data/" + isoCode + ".json")
        .then(response => response.json())
        .then(data_c => {
            data_country = data_c;//getRandom(data_c,MAX_SIZE);

            data_country.forEach(d => {
                d.LatLong = L.latLng([d.lat, d.long]);
            });
            data_country_per_pos = groupBy(data_country, "LatLong");

            let max = 0;
            for (let latlong in data_country_per_pos) {
                if (max < data_country_per_pos[latlong].length) {
                    max = data_country_per_pos[latlong].length;
                }
            }
            max_breweries = max;
            rScale = sqrScale(max);
            whenCountryDataLoaded();
        });

}


function whenCountryDataLoaded() {
    updateColorScheme();
    update_breweries_on_map();
}

var overload_panel = L.control({position: 'bottomright'});
overload_panel.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info overload');
    this._div.innerHTML = "<i style='color: red' class=\"fas fa-exclamation-circle\"></i>" +
        "Some clusters contain too much data to be rendered";
    return this._div;
};

function combineData(datas) {
    let d_s = get_data_to_show_no_genre();
    let d_s_g = get_data_to_show();
    if (d_s === "n_beers" || d_s === "avg_abv") {
        let sum = 0;
        let sum_b = 0;
        for (d in datas) {
            sum += datas[d][d_s_g];
            sum_b += (datas[d][d_s_g]) ? 1 : 0;
        }
        return (d_s === "n_beers") ? sum : sum / sum_b;
    }
    if (d_s === "max_abv" || d_s === "best_beer_score" || d_s === "popularity") {
        let max = datas[0][d_s_g];
        for (d in datas) {
            if (max < datas[d][d_s_g]) {
                max = datas[d][d_s_g];
            }
        }
        return max;
    }
    return 0.0;
}

function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

const MIN_R = 10;
const MAX_R = 50;

function sqrScale(max) {
    if (max <= 1.1) {
        return x => MIN_R;
    }
    const factor = (MAX_R * MAX_R) / (MIN_R * MIN_R) - 1;
    return x => MIN_R * Math.sqrt(1.0 + factor * (x - 1) / (max - 1));
}


var rScale = x => 1.0;
var max_breweries = 0;

var markers_layout = L.layerGroup();
var markers_cluster = L.markerClusterGroup({
    disableClusteringAtZoom: 10,
    spiderfyOnMaxZoom: false,
    maxClusterRadius: 50,
    iconCreateFunction: function (cluster) {
        let childCount = cluster.getChildCount();


        if (childCount > 1000) {
            overload_panel.addTo(map);

            let icon = new L.DivIcon({
                html: '<div style="background-color: red"><span style="color: white">' + childCount + '</span></div>',
                className: 'marker-cluster marker-cluster-large',
                iconSize: new L.Point(40, 40)
            });
            return icon;
        }
        let childs = cluster.getAllChildMarkers();

        let set_lat_long = new Set(childs.map(x => x._latlng));
        let dats = [];
        for (let latLong of set_lat_long.values()) {
            dats = dats.concat(data_country_per_pos[latLong]);
        }
        let d = combineData(dats);
        let color = d ? getColor(d) : "#A0A0A0";

        let nColor = color > "#EC7119" ? "black" : "white";
        let icon = new L.DivIcon({
            html: '<div style="background-color: ' + color + '"><span style="color:' + nColor + '">' + childCount + '</span></div>',
            className: 'marker-cluster marker-cluster-large',
            iconSize: new L.Point(40, 40)
        });

        return icon;
    }
});
markers_cluster.addTo(map);
markers_cluster.on('animationend', ev => {
    info.update()
});


function update_breweries_on_map() {
    if (markers_cluster) {
        markers_cluster.clearLayers();
        markers_layout.clearLayers();
        if (world) {
            return;
        }

    }
    let markers = [];

    let d_s_g = get_data_to_show();

    for (latlong in data_country_per_pos) {

        let datas = data_country_per_pos[latlong];
        let breweries = "";

        let d = combineData(datas);
        if (d === null) {
            continue;
        }
        let color = d ? getColor(d) : "gray";
        if (!datas[0].lat || !datas[0].long) {
            continue;
        }

        let temp = [];
        for (d in datas) {
            if (datas[d][d_s_g] != null) {
                temp.push(datas[d]);
            }
        }
        datas = temp;

        if (datas.length == 0) {
            continue;
        }

        for (let idx = 0; idx < datas.length - 1; idx++) {
            const circle_hidden = L.circleMarker([datas[0].lat, datas[0].long], {
                fillOpacity: 0.,
                opacity: 0,
                radius: 0
            });

            //markers_cluster.addLayer(circle_hidden);
            markers.push(circle_hidden);
        }
        const circle = L.circleMarker([datas[0].lat, datas[0].long], {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            radius: rScale(datas.length)
        });
        circle.on('mouseover', ev => {
            info.update(ev.target)
        });
        //circle.on('mouseout',ev=> {info.update()});

        markers.push(circle)
        markers_layout.addLayer(circle);


    }
    markers_cluster.addLayers(markers);
}
