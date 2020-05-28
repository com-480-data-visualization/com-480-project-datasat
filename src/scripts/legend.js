
/*
 * LEGEND
 */

var legend = L.control({position: 'bottomright'});


legend.update = function () {
    this._div.innerHTML = "";

    if (!world && max_breweries > 1) {
        let height = MAX_R * 2 + 20;
        let cy1 = (height - (MIN_R + 10));
        let middle = Math.floor((max_breweries) / 2);
        let r2 = rScale(middle);
        let cy2 = (height - (r2 + 10));
        let cy3 = (height - (MAX_R + 10))
        this._div.innerHTML +=
            " <svg height=\"" + height + "\" width=\"300\">\n" +
            "  <circle cx=\"90\" cy=\"" + cy1 + "\" r=\"" + MIN_R + "\" stroke=\"black\" stroke-width=\"2\" fill-opacity=\"0\" />\n" +
            "   <circle cx=\"90\" cy=\"" + cy2 + "\" r=\"" + r2 + "\" stroke=\"black\" stroke-width=\"2\" fill-opacity=\"0\" />\n" +
            "   <circle cx=\"90\" cy=\"" + cy3 + "\" r=\"" + MAX_R + "\" stroke=\"black\" stroke-width=\"2\" fill-opacity=\"0\"/>\n" +
            "   <line x1=\"90\" y1=\"" + (cy2 - r2) + "\" x2=\"180\" y2=\"" + (cy2 - r2) + "\" style=\"stroke:black\" stroke-width=1 />\n" +
            "    <line x1=\"90\" y1=\"" + (cy1 - MIN_R) + "\" x2=\"180\" y2=\"" + (cy1 - MIN_R) + "\" style=\"stroke:black\" stroke-width=1 />\n" +
            "    <line x1=\"90\" y1=\"" + (cy3 - MAX_R) + "\" x2=\"180\" y2=\"" + (cy3 - MAX_R) + "\" style=\"stroke:black\" stroke-width=1 />\n" +
            "   <text x=\"183\" y=\"" + (cy3 - MAX_R + 4) + "\">" + max_breweries + " Breweries</text>\n" +
            "   <text x=\"183\" y=\"" + (cy2 - r2 + 4) + "\">\n" +
            "     " + middle + " Breweries\n" +
            "   </text>\n" +
            "   <text x=\"183\" y=\"" + (cy1 - MIN_R + 4) + "\"> 1 Brewery</text>\n" +
            "</svg> "
    }

    // loop through our density intervals and generate a label with a colored square for each interval
    this._div.innerHTML += "<h2><b>" + get_data_text() + "</b>  (" + get_data_unit() + ")</h2>";
    this._div.innerHTML += "<div class='gradient'>"
    for (let i = 100; i >= 1; i--) {
        this._div.innerHTML += "<span class='grad-step' style='background-color:" + colorScale(i / 100.0) + "' ></span>"
    }
    let approximation = approximate(min_val, max_val)
    let max = approximation.max;
    let min = approximation.min;
    let med = approximation.med;
    this._div.innerHTML += "</div><div class='grad-val'>"
    this._div.innerHTML += "<span class='min'>" + min + "</span>";
    this._div.innerHTML += "<span class='med'>" + med + "</span>";
    this._div.innerHTML += "<span class='max'>" + max + "</span> ";
    this._div.innerHTML += "</div>"
}

function approximate(min, max) {
    let diff = max - min;
    let med = (max + min) / 2;
    let i = 0;
    while (diff > 10) {
        i += 1;
        diff = diff / 10;
        min = min / 10;
        max = max / 10;
        med = med / 10;
    }
    min = (min).toFixed(1);
    med = med.toFixed(1);
    max = (max + 0.1).toFixed(1);
    while (i > 0) {
        i -= 1;
        min = min * 10;
        max = max * 10;
        med = med * 10;
    }

    return {min: min, med: med, max: max};
}

legend.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info legend');
    return this._div;
};