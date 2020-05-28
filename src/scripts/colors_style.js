

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
    if (world) {
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
    } else {
        min_val = 100000000;
        max_val = -1;
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
        if (min_val > max_val) {
            min_val = 0;
            max_val = 1;
        }
        if (min_val == max_val) {
            min_val -= 1;
            max_val += 1;
        }
    }

    legend.update();
    info.update();
}


const colorScale = chroma.scale(colors);

function getColor(d) {
    if (d < min_val) {
        d = min_val;
    }
    if (d > max_val) {
        d = max_val;
    }
    let x = 1.0 - (d - min_val) / (max_val - min_val);
    return colorScale(x);
}






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
