function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// bar1. Create the buildCharts function.
function buildCharts(sample) {
  // bar2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    console.log(data);

    // bar3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // bar4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);

    // gauge1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var filteredMetadata = metadata.filter(sampleObj => sampleObj.id == sample);

    //  bar5. Create a variable that holds the first sample in the array.
    var resultSample = filteredSamples[0];

    // gauge2. Create a variable that holds the first sample in the metadata array.
    var resultMetadata = filteredMetadata[0];

    // bar6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = resultSample.otu_ids;
    var otuLabels = resultSample.otu_labels;
    var sampleValues = resultSample.sample_values;

    // gauge3. Create a variable that holds the washing frequency.
    var washingFreq = parseFloat(resultMetadata.wfreq);

    // bar7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIDs.slice(0,10).map(id => "OTU " + id).reverse();
    
    var textotuLabels = otuLabels.slice(0,10).reverse();

    // bar8. Create the trace for the bar chart. 
    var barData = [
      {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: textotuLabels,
      type: "bar",
      orientation: "h"
    }];

    // bar9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    
    // bar10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // bubble1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIDs,
          colorscale: 'Jet'
        }
      }
   
    ];

    // bubble2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      },
      hovermode: "closest"
    };

    // bubble3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // gauge4. Create the trace for the gauge chart.
    
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: washingFreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week</br>" },
        gauge: {
          axis: { range: [null,10], tickcolor: "black" },
          bar: { color: "black" },
          steps: [
            { range: [0,2], color: "rebeccapurple" },
            { range: [2,4], color: "royalblue" },
            { range: [4,6], color: "cyan" },
            { range: [6,8], color: "gold" },
            { range: [8,10], color: "tomato" }
          ]
        }
      }
    ]
    
    // gauge5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: {
        t: 0,
        b: 0
      },      
    };

    // gauge6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}