
function findLayer() {
    var searchInput = document.getElementById("search-input").value;
    var countries = getCountriesFromSearch(searchInput);
    //var countryCode = document.getElementById("search-input").value;
    var layers = geojson["_layers"];
    var correctLayers = [];
    for (e in layers) {
        var code = layers[e]["feature"]["properties"]["ISO_A2"];
        if (countries.includes(code)) {
            correctLayers.push(layers[e]);
        }
    }
    if (correctLayers.length != 0) {
        geojson.setStyle(style);
        for (let i = 0; i < correctLayers.length; i++) {
            correctLayers[i].setStyle(searchResultStyle);
        }
    } else {
        var buttons = $(".leaflet-popup-close-button");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].click();
        }
        //map.closePopup();
        geojson.setStyle(style);
    }
}



function resetSearchResults() {
    geojson.setStyle(style);
    var buttons = $(".leaflet-popup-close-button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].click();
    }
    document.getElementById("search-input").value = "";
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

var searchCategorySelection = document.getElementById("search-cat");
var searchCategory = searchCategorySelection.options[searchCategorySelection.selectedIndex].value;

function changeSearchCat() {
    searchCategory = searchCategorySelection.options[searchCategorySelection.selectedIndex].value;
    document.getElementById("search-input").placeholder = searchCategory + " name";
}

function getCountriesFromSearch(searchInput) {
    var countries = [];
    if (searchCategory == "Beer") {
        var infos = beerSearchData.filter(x => (x["beer"] + " (" + x["country"] + ")") == searchInput);
        for (let i = 0; i < infos.length; i++) {
            let c = infos[i]["country"];
            let lat = infos[i]["lat"];
            let long = infos[i]["long"]
            let abv = infos[i] ["abv"];
            if (countries.includes(c) == false) {
                countries.push(c);
            }
            let content = searchInput + "<br>Brewery : " + infos[i]["brewery"] + "<br>Abv : " + abv;
            if (lat && long) {
                let popup = L.popup(options = {autoClose: false}).setLatLng(L.latLng(lat, long)).setContent(content).openOn(map);
            }
        }
    } else {
        var infos = brewerySearchData.filter(x => x["brewery"] == searchInput);
        for (let i = 0; i < infos.length; i++) {
            let c = infos[i]["country"];
            let lat = infos[i]["lat"];
            let long = infos[i]["long"];
            let city = infos[i]["city"];
            if (countries.includes(c) == false) {
                countries.push(c);
            }
            var content = searchInput + "<br>City : " + city + "<br>Country : " + c;
            if (lat && long) {
                let popup = L.popup(options = {autoClose: false}).setLatLng(L.latLng(lat, long)).setContent(content).openOn(map);
            }
        }
    }
    return countries
}

var beerAuto = "";
fetch("../data/beer_auto.json")
    .then(response => response.json())
    .then(data => {
        beerAuto = data;
        var inp = document.getElementById("search-input");
        var currentFocus;
        inp.addEventListener("keyup", function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                document.getElementById("search-btn").click();
            }
        });
        inp.addEventListener("input", function (e) {
            if (searchCategory == "Beer") {
                var a, b, i, val = this.value;
                closeAllLists();
                if (val) {
                    if (val.length >= 3) {
                        var key = val.slice(0, 3).toUpperCase();
                        var keys = beerAuto.map(x => x["beer_key"].toUpperCase());
                        if (keys.includes(key)) {
                            var beers = beerAuto.filter(x => x["beer_key"].toUpperCase() == key).map(x => x["beer"])[0];
                            currentFocus = -1;
                            a = document.createElement("DIV");
                            a.setAttribute("id", this.id + "autocomplete-list");
                            a.setAttribute("class", "autocomplete-items");
                            this.parentNode.appendChild(a);
                            for (let i = 0; i < beers.length; i++) {
                                //console.log(beers[i]);
                                if (beers[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                                    b = document.createElement("DIV");
                                    b.innerHTML = "<strong>" + beers[i].substr(0, val.length) + "</strong>";
                                    b.innerHTML += beers[i].substr(val.length);
                                    /*insert a input field that will hold the current array item's value:*/
                                    b.innerHTML += "<input type='hidden' value='" + beers[i] + "'>";
                                    b.addEventListener("click", function (e) {
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
        inp.addEventListener("keydown", function (e) {
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
        inp.addEventListener("input", function (e) {
            if (searchCategory == "Brewery") {
                var a, b, i, val = this.value;
                closeAllLists();
                if (val) {
                    if (val.length >= 3) {
                        var key = val.slice(0, 3).toUpperCase();
                        var keys = breweryAuto.map(x => x["brewery_key"].toUpperCase());
                        if (keys.includes(key)) {
                            var breweries = breweryAuto.filter(x => x["brewery_key"].toUpperCase() == key).map(x => x["brewery"])[0];
                            currentFocus = -1;
                            a = document.createElement("DIV");
                            a.setAttribute("id", this.id + "autocomplete-list");
                            a.setAttribute("class", "autocomplete-items");
                            this.parentNode.appendChild(a);
                            for (let i = 0; i < breweries.length; i++) {
                                //console.log(beers[i]);
                                if (breweries[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                                    b = document.createElement("DIV");
                                    b.innerHTML = "<strong>" + breweries[i].substr(0, val.length) + "</strong>";
                                    b.innerHTML += breweries[i].substr(val.length);
                                    /*insert a input field that will hold the current array item's value:*/
                                    b.innerHTML += "<input type='hidden' value='" + breweries[i] + "'>";
                                    b.addEventListener("click", function (e) {
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
        inp.addEventListener("keydown", function (e) {
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