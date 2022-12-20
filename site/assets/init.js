function skipEvery(array, n) {
    var out = []
    var index = 0;
    for (var i = 0; i < array.length; i+=n) {
        out[index++] = array[i];
    }
    return out;
}

let decimationRate = 27;

let data = {
    "eurirs": {
        "labels": [],
        "10y": [],
        "15y": [],
        "20y": [],
        "25y": [],
        "30y": []
    },
    "euribor": {
        "labels": [],
        "1m": [],
        "3m": [],
        "6m": [],
        "12m": []
    }
}

let eurirsToShow = skipEvery(eurirsRaw.split("\n"), decimationRate);
var index = 0;
for (var i = 0; i < eurirsToShow.length; i++) {
    let line = eurirsToShow[i];
    let datapoint = line.split(",").map(x => x.trim())

    if (line.startsWith("DATE") || line === "") continue;

    data["eurirs"]["labels"][index] = datapoint[0];
    data["eurirs"]["10y"][index] = datapoint[1];
    data["eurirs"]["15y"][index] = datapoint[2];
    data["eurirs"]["20y"][index] = datapoint[3];
    data["eurirs"]["25y"][index] = datapoint[4];
    data["eurirs"]["30y"][index] = datapoint[5];

    index++;
}

let eurirsTable = document.getElementById("table-eurirs");
let eurirsLines = eurirsRaw.split("\n");
for (var i = 0; i < eurirsLines.length; i++) {
    let line = eurirsLines[i];
    let datapoint = line.split(",").map(x => x.trim())

    if (line.startsWith("DATE") || line === "") continue;

    let tr = document.createElement("tr");
    datapoint.map(x => {
        let td = document.createElement("td");
        td.innerText = x;
        return td;
    }).forEach(x => tr.appendChild(x));

    eurirsTable.children[0].appendChild(tr);
}


let euriborToShow = skipEvery(euriborRaw.split("\n"), decimationRate);
index = 0;
for (var i = 0; i < euriborToShow.length; i++) {
    let line = euriborToShow[i];
    let datapoint = line.split(",").map(x => x.trim())

    if (line.startsWith("DATE") || line === "") continue;

    data["euribor"]["labels"][index] = datapoint[0];
    data["euribor"]["1m"][index] = datapoint[1];
    data["euribor"]["3m"][index] = datapoint[2];
    data["euribor"]["6m"][index] = datapoint[3];
    data["euribor"]["12m"][index] = datapoint[4];

    index++;
}

let euriborTable = document.getElementById("table-euribor");
let euriborLines = euriborRaw.split("\n");
for (var i = 0; i < euriborLines.length; i++) {
    let line = euriborLines[i];
    let datapoint = line.split(",").map(x => x.trim())

    if (line.startsWith("DATE") || line === "") continue;

    let tr = document.createElement("tr");
    datapoint.map(x => {
        let td = document.createElement("td");
        td.innerText = x;
        return td;
    }).forEach(x => tr.appendChild(x));

    euriborTable.children[0].appendChild(tr);
}

document.getElementById("last-updated").innerText = lastUpdated || 2022;

/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////

var index = "eurirs";
var chart;

function toEurirs() {
    index = "eurirs";
    refresh();
}

function toEuribor() {
    index = "euribor";
    refresh();
}

function refresh() {
    if (chart) chart.destroy();
    document.getElementById('btn-euribor').classList.remove("active");
    document.getElementById('btn-eurirs').classList.remove("active");
    document.getElementById(`btn-${index}`).classList.add("active");

    document.getElementById('details-euribor').classList.add("hidden");
    document.getElementById('details-eurirs').classList.add("hidden");
    document.getElementById(`details-${index}`).classList.remove("hidden");

    var ctx = document.getElementById('chart');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data[index]["labels"],
          datasets: Object
              .keys(data[index])
              .filter(x => x != "labels")
              .map(x => {return {label: x, data: data[index][x]}})
              .map(x => {return {label: x.label, data: x.data}})
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 0.2
              } 
            }
          }
        }
      });
}

refresh();