function skipEvery(array, n) {
    var out = []
    var index = 0;
    for (var i = 0; i < array.length; i+=n) {
        out[index++] = array[i];
    }
    return out;
}

let data = {
    "eurirs": {
        "fields": ["labels", "10y", "15y", "20y", "25y", "30y"],

        "years": {},

        "labels": [],
        "10y": [],
        "15y": [],
        "20y": [],
        "25y": [],
        "30y": []
    },
    "euribor": {
        "fields": ["labels", "1m", "3m", "6m", "12m"],

        "years": {},
        
        "labels": [],
        "1m": [],
        "3m": [],
        "6m": [],
        "12m": []
    }
}

{
    let eurirsToShow = eurirsRaw.split("\n");
    var index = 0;
    for (var i = 0; i < eurirsToShow.length; i++) {
        let line = eurirsToShow[i];
        let datapoint = line.split(",").map(x => x.trim())
        let year = datapoint[0].split("/")[0];

        if (line.startsWith("DATE") || line === "") continue;

        data["eurirs"]["labels"][index] = datapoint[0];
        data["eurirs"]["10y"][index] = datapoint[1];
        data["eurirs"]["15y"][index] = datapoint[2];
        data["eurirs"]["20y"][index] = datapoint[3];
        data["eurirs"]["25y"][index] = datapoint[4];
        data["eurirs"]["30y"][index] = datapoint[5];

        if (!data["eurirs"]["years"][year]) {
            data["eurirs"]["years"][year] = []
        }
        data["eurirs"]["years"][year].push(index);

        index++;
    }

    let euriborToShow = euriborRaw.split("\n");
    index = 0;
    for (var i = 0; i < euriborToShow.length; i++) {
        let line = euriborToShow[i];
        let datapoint = line.split(",").map(x => x.trim())
        let year = datapoint[0].split("/")[0];

        if (line.startsWith("DATE") || line === "") continue;

        data["euribor"]["labels"][index] = datapoint[0];
        data["euribor"]["1m"][index] = datapoint[1];
        data["euribor"]["3m"][index] = datapoint[2];
        data["euribor"]["6m"][index] = datapoint[3];
        data["euribor"]["12m"][index] = datapoint[4];

        if (!data["euribor"]["years"][year]) {
            data["euribor"]["years"][year] = []
        }
        data["euribor"]["years"][year].push(index);

        index++;
    }
    
    document.querySelector("#details-eurirs select").innerHTML = '';
    var first = true;
    for(year in data["eurirs"]["years"]) {
        let option = document.createElement("option");
        if (first) option.selected = 'selected';
        option.setAttribute("value", year);
        option.innerText = year;
        document.querySelector("#details-eurirs select").appendChild(option)
        first = false;
    }
    document.querySelector("#details-euribor select").innerHTML = '';
    first = true;
    for(year in data["euribor"]["years"]) {
        let option = document.createElement("option");
        if (first) option.selected = 'selected';
        option.setAttribute("value", year);
        option.innerText = year;
        document.querySelector("#details-euribor select").appendChild(option)
        first = false;
    }

    document.getElementById("last-updated").innerText = lastUpdated || 2023;
}


/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////

var index = "eurirs";
var year = "2022";
var chart;

function toEurirs() {
    index = "eurirs";
    refresh();
}

function toEuribor() {
    index = "euribor";
    refresh();
}

function changeYear() {
    let table = document.getElementById(`table-${index}`).children[0];
    let headerRow = table.firstElementChild;
    table.innerHTML = '';
    table.appendChild(headerRow);
    year = document.querySelector(`#details-${index} select`).value

    let hitsIndices = data[index]["years"][year];
    for (var i = 0; i < hitsIndices.length; i++) {
        let hitIndex = hitsIndices[i];
        let fields = data[index]["fields"];

        let tr = document.createElement("tr");
        fields.map(x => {
            let td = document.createElement("td");
            td.innerText = data[index][x][hitIndex];
            return td;
        }).forEach(x => tr.appendChild(x));

        table.appendChild(tr);
    }
}

function refresh() {
    let decimationRate = 27;

    if (chart) {chart.destroy(); chart = null;}
    document.getElementById('btn-euribor').classList.remove("active");
    document.getElementById('btn-eurirs').classList.remove("active");
    document.getElementById(`btn-${index}`).classList.add("active");

    document.getElementById('details-euribor').classList.add("hidden");
    document.getElementById('details-eurirs').classList.add("hidden");
    document.getElementById(`details-${index}`).classList.remove("hidden");

    let toShow = data[index];
    chart = new Chart(document.getElementById('chart'), {
        type: 'line',
        data: {
          labels: skipEvery(toShow["labels"], decimationRate),
          datasets: toShow["fields"]
              .filter(x => x != "labels")
              .map(x => {return {label: x, data: skipEvery(toShow[x], decimationRate)}})
              .map(x => {return {label: x.label, data: x.data}})
        },
        options: {
          animation: false,
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
      changeYear();
}

refresh();