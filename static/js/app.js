function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + sample;
  d3.json(url).then(function (response) {
    console.log(response);
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata")
      .selectAll("div").remove();
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.select("#sample-metadata")
      .selectAll("div")
      .data(Object.entries(response))
      .enter()
      .append("div")
      .text(function (metadata) {
        return metadata[0] + ': ' + metadata[1];
      });
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/"+ sample;
  d3.json(url).then(function(response){
    console.log(response);
    // change dictionary of list to list of dictionary 
    var data = [];
    for (var i = 0; i < response.otu_ids.length; i++){
      var dic = {
        otu_id: response.otu_ids[i],
        otu_lable: response.otu_labels[i],
        sample_value: response.sample_values[i]
      };
      data.push(dic);
    }
    // use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).
    Topdata = data.sort(function(firstNum, secondNum){
      return secondNum.sample_value - firstNum.sample_value;
    }).slice(0,10);
    console.log(Topdata);

    // @TODO: Build a Pie Chart
    var pieData = [{
      values: Topdata.map(row => row.sample_value),
      labels: Topdata.map(row => row.otu_id),
      type: 'pie'
    }];
    console.log(pieData);
    var pieLayout = {
      height: 700,
      width: 900,
      title: "Top 10 Sample Values",
    };

    var PIE = document.getElementById("pie");

    Plotly.newPlot(PIE, pieData, pieLayout);

    // @TODO: Build a Bubble Chart using the sample data
    var bubbleData = {
      x: data.map(row => row.otu_id),
      y: data.map(row => row.sample_value),
      text: data.map(row => row.otu_lable),
      mode: 'markers',
      marker: {
        size: data.map(row => row.sample_value),
        color: data.map(row => row.otu_id)
      }
    };
    console.log(bubbleData);

    var bubbleLayout = {
      height: 700,
      width: 1400,
      title: "Sample's Bubble Cart",
    };
    var BUBBLE = document.getElementById("bubble");

    Plotly.newPlot(BUBBLE, [bubbleData], bubbleLayout);
 
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
