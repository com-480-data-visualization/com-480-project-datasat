
function changeWordCloud() {
    document.getElementById('chart-container').innerHTML = ""
    var beer = document.getElementById('beerSelection');
    var selected = beer.options[beer.selectedIndex].value;
    if (selected != "AllBeer") {
        var chart = anychart.tagCloud(getDataWords(selected));
    } else {
        var chart = anychart.tagCloud();
    }
    var customColorScale = anychart.scales.linearColor();
    customColorScale.colors(["#DF8D03", "#A94E02"])

    chart.title("  ");

    chart.colorScale(customColorScale);
    chart.bounds(0, 0, '100%', '100%');
    chart.angles([0])
    chart.background().fill((255, 255, 255), 0);
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

function getDataWords(beerSelected) {
    return word_data[beerSelected]["words"]
}

function get_fun_fact(country) {
    file_path = "../data/country_fun_facts/" + country + ".html";

    textBox = document.getElementById("specific-infos");
    fetch("../data/country_fun_facts/" + country + ".html")
        .then(function (response) {
            if (!response.ok) {
                return getCountryGenericData(country);
            } else {
                return response.text();
            }
        })
        .then(data => {
            if (world) {
                textBox.innerHTML = data;
            } else {
                var countryName = "";
                var layers = geojson["_layers"];
                for (e in layers) {
                    var iso = layers[e]["feature"]["properties"]["ISO_A2"];
                    if (iso == country) {
                        countryName = layers[e]["feature"]["properties"]["ADMIN"];
                        break;
                    }
                }
                if (countryName != "") {
                    textBox.innerHTML = '<img src="https://www.countryflags.io/' + country + '/flat/64.png">' + "<span class='fun-fact-emph'>" + countryName + "</span>" + data;
                } else {
                    textBox.innerHTML = '<img src="https://www.countryflags.io/' + country + '/flat/64.png">' + data;
                }
            }
        })
        .catch((err) => alert(err));

}

function getCountryGenericData(country) {
    if (country in datas) {
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
    } else {
        return "<br>No information about this country...";
    }
}