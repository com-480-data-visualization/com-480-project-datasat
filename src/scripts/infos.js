/**
* The info panel methods
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
    } else if (world) {

        this._div.innerHTML = '<b>' + props.ISO_A2 + "</b><br/>" + '<h3>' + props.ADMIN + '</h3>';

        let content = get_data_for_C(props);
        if (content) {
            if (content % 1 !== 0) {
                content = content.toFixed(2);
            }
            this._div.innerHTML += "<b>" + get_data_text() + ": </b>";
            this._div.innerHTML += content + " " + get_data_unit();
        }

        let beer = get_data_associated_beer(props);
        let brewery = get_data_associated_brewery(props);

        if (beer && brewery) {
            this._div.innerHTML += "<br><i class='fas fa-beer'></i> " + beer;
            this._div.innerHTML += "<br><i class=' fas fa-industry'></i> " + brewery;
        }

    } else {
        let breweries_data = data_country_per_pos[props._latlng];
        this._div.innerHTML = ""

        for (b in breweries_data) {
            let dat = breweries_data[b];
            let content = dat[get_data_to_show()];
            if (content) {
                this._div.innerHTML += '<h3><i class=\' fas fa-industry\'></i> <i>' + dat["brewery"] + "</i></h3>";

                if (content % 1 !== 0) {
                    content = content.toFixed(2);
                }
                this._div.innerHTML += "<b>" + get_data_text() + ": </b>";
                this._div.innerHTML += content + " " + get_data_unit();
                let beer = dat[get_data_associated_beer_index()];
                if (beer) {
                    this._div.innerHTML += "<br><i class='fas fa-beer'></i> " + beer;
                }
                this._div.innerHTML += "<br><br>";
            }

        }

    }
};

info.addTo(map);





