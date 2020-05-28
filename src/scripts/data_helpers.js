
/**
 * return the data selected by the form at the top right
 */
function get_data_to_show_no_genre() {
    const el = document.getElementById("dataSelection");
    return el.options[el.selectedIndex].value;
}

function get_data_to_show() {
    const el = document.getElementById("dataSelection");
    const beer = document.getElementById("beerSelection")
    if (beer.options[beer.selectedIndex].value !== "AllBeer") {
        return el.options[el.selectedIndex].value + '_' + beer.options[beer.selectedIndex].value;
    } else {
        return el.options[el.selectedIndex].value
    }
}


function get_data_associated_beer_index() {
    const el = document.getElementById("dataSelection");
    const beer = document.getElementById("beerSelection");

    if (beer.options[beer.selectedIndex].value !== "AllBeer") {
        return el.options[el.selectedIndex].dataset.beer + '_' + beer.options[beer.selectedIndex].value;
    } else {
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
        if (beer_id) {
            return data_C[beer_id];
        } else {
            return false;
        }
    }
}

function get_data_unit() {
    const el = document.getElementById("dataSelection");
    return el.options[el.selectedIndex].dataset.unit;

}


function get_data_associated_brewery_index() {
    const el = document.getElementById("dataSelection");
    const beer = document.getElementById("beerSelection");
    if (beer.options[beer.selectedIndex].value !== "AllBeer") {
        return el.options[el.selectedIndex].dataset.brew + '_' + beer.options[beer.selectedIndex].value;
    } else {
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
        if (brew_id) {
            return data_C[brew_id];
        } else {
            return false;
        }
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
