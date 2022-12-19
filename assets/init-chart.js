function skipEvery(array, n) {
    var out = []
    var index = 0;
    for(var i = 0; i < array.length; i+=n) {
        out[index++] = array[i];
    }
    return out;
}

let decimationRate = 30;

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

let eurirsLines = skipEvery(eurirsRaw.split("\n"), decimationRate);
var index = 0;
for(var i = 0; i < eurirsLines.length; i++) {
    let line = eurirsLines[i];
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

let euriborLines = skipEvery(euriborRaw.split("\n"), decimationRate);
index = 0;
for(var i = 0; i < euriborLines.length; i++) {
    let line = euriborLines[i];
    let datapoint = line.split(",").map(x => x.trim())

    if (line.startsWith("DATE") || line === "") continue;

    data["euribor"]["labels"][index] = datapoint[0];
    data["euribor"]["1m"][index] = datapoint[1];
    data["euribor"]["3m"][index] = datapoint[2];
    data["euribor"]["6m"][index] = datapoint[3];
    data["euribor"]["12m"][index] = datapoint[4];

    index++;
}

var index = "eurirs";
var chart;

function toEurirs() {
    index = "eurirs";
    refreshChart();
}

function toEuribor() {
    index = "euribor";
    refreshChart();
}

function refreshChart() {
    if (chart) chart.destroy();

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
              beginAtZero: true
            }
          }
        }
      });
}

refreshChart();