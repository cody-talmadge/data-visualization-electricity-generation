//This controls which category each fuel type fits in
let categories = {  "Nuclear": "Nuclear",
                    "Petroleum Liquids": "Non-Renewable",
                    "Coal": "Non-Renewable",
                    "Natural Gas": "Non-Renewable",
                    "Hydroelectric": "Renewable",
                    "Wind": "Renewable",
                    "Solar": "Renewable"
                };

//The listing of all fuel types
let fuelTypeList = ["Solar", "Wind", "Hydroelectric", "Natural Gas", "Coal", "Petroleum Liquids", "Nuclear"];

//Controls the color fo each fuel type's bar
let fillColors = {  "Nuclear": "#C195C7",
                    "Petroleum Liquids": "#AE604B",
                    "Coal": "#AEA8A7",
                    "Natural Gas": "#D5CFCE",
                    "Hydroelectric": "#90C0BE",
                    "Wind": "#9AC694",
                    "Solar": "#FAE57D"
                };

//This is the parameter which controls which slide is currently being displayed
let currentSlide = 0;

//Controls which fuel types display on each slide
let slideDisplay = [
                    //Slide 0 - Just display the totals
                    {"Nuclear" : "None", "Non-Renewable" : "None", "Renewable" : "None"},
                    //Slide 1 - Display nuclear with totals
                    {"Nuclear" : "block", "Non-Renewable" : "None", "Renewable" : "None"},
                    //Slide 2 - Display non-renewables with totals
                    {"Nuclear" : "None", "Non-Renewable" : "block", "Renewable" : "None"},
                    //Slide 3 - Display renewables with totals
                    {"Nuclear" : "None", "Non-Renewable" : "None", "Renewable" : "block"},
                    //Slide 4 - Display everything
                    {"Nuclear" : "block", "Non-Renewable" : "block", "Renewable" : "block"},                    
];

//Annotations for the Total slide
const slide0Annotations = [{
    note: {
        title: "Total 2001 Generation",
        label: "389,838 GWH/month",
        wrap: 180,
        align: "middle"
    },
    connector: { end: "dot" },
    x: 80, y: 125, dy: 110, dx: 150
    },{
    note: {
        title: "Total 2021 Generation",
        label: "434,885 GWH/month, a 12% increase",
        wrap: 250,
        align: "middle"
    },
    connector: { end: "dot" },
    x: 815, y: 85, dy: 150, dx: -150
    },].map(function(d){ d.color = "#E8336D"; return d});
const makeAnnotationsSlide0 = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(slide0Annotations);

//Annotations for the Nuclear slide
const slide1Annotations = [{
    note: {
        title: "Nuclear Generation",
        label: "did not significantly increase from 2001 to 2021",
        wrap: 200,
        align: "middle"
    },
    connector: { end: "dot" },
    x: 815, y: 403, dy: -100, dx: -150
    }].map(function(d){ d.color = "#E8336D"; return d});
const makeAnnotationsSlide1 = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(slide1Annotations);

//Annotations for the Non-Renewable slide
const slide2Annotations = [{
    note: {
        title: "In 2021 Coal Generation",
        label: "was more than 3x natural gas generation",
        wrap: 300,
        align: "middle"
    },
    connector: { end: "dot" },
    x: 80, y: 201, dy: 220, dx: 175
    },{
    note: {
        title: "In 2021 Natural Gas Generation",
        label: "was more than 2x coal generation",
        wrap: 250,
        align: "middle"
    },
    connector: { end: "dot" },
    x: 815, y: 315, dy: 106, dx: -150
    },].map(function(d){ d.color = "#E8336D"; return d});
const makeAnnotationsSlide2 = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(slide2Annotations);

//Annotations for the Renewable slide
const slide3Annotations = [{
        note: {
            title: "Solar Generation",
            label: "became measurable US-wide in 2014",
            wrap: 150,
            align: "middle"
        },
        connector: { end: "dot" },
        x: 530, y: 95, dy: 100, dx: 0
        },{
        note: {
            title: "2001 Wind Generation",
            label: "595 GWH/month",
            wrap: 200,
            align: "middle"
        },
        connector: { end: "dot" },
        x: 80, y: 125, dy: 180, dx: 100
        },{
        note: {
            title: "2021 Wind Generation",
            label: "35,398 GWH/month, an increase of over 50x",
            wrap: 200,
            align: "middle"
        },
        connector: { end: "dot" },
        x: 817, y: 100, dy: 200, dx: -100
        },{
        note: {
            title: "Hydroelectric Generation",
            label: "was relatively consistent from 2001 to 2021",
            wrap: 200,
            align: "middle"
        },
        connector: { end: "dot" },
        x: 448, y: 118, dy: 270, dx: 0
        }].map(function(d){ d.color = "#E8336D"; return d});
const makeAnnotationsSlide3 = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(slide3Annotations);

//Annotations for the everything slide
const slide4Annotations = [{
        note: {
            title: "Non-Renewable Generation",
            label: "decreased from 72% to 62% of total generation",
            wrap: 250,
            align: "middle"
        },
        connector: { end: "dot" },
        x: 817, y: 155, dy: 150, dx: -200
        },{
        note: {
            title: "Renewable Generation",
            label: "increased from 6% to 18% of total generation",
            wrap: 200,
            align: "middle"
        },
        connector: { end: "dot" },
        x: 817, y: 83, dy: 80, dx: -200
        }].map(function(d){ d.color = "#E8336D"; return d});
const makeAnnotationsSlide4 = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(slide4Annotations);

//Variables to set up the display
let backgroundBarFillColor = "white";
let chartHeight = 400;
let margin = 80;
let chartWidth = 800;
let barWidth = 30;
let offSets = [];
let displayDetails = false;

//Controls the text that appears at the bottom.  This varies by slide
let slideText = [
    "Let's take a look at how the trends in electricity generation have changed in the United States from 2001 to 2021.  You might be surprised to learn that while the population of the United States increased by 16% over these years (from 285 million to 332 million), total electricity generation only increased by 12% as the United States became more energy efficient on a per person basis.  But just looking at the total electricity generation doesn't tell the full story - in the upcoming slides we'll look at how generation changed for each of the following types: nuclear, non-renewable, and renewable.  In each slide you can hover over the chart to see exact generation numbers for that year, and you can change slides by clicking on Next/Previous at the top, or by clicking on a specific slide number.  Let's get started!",
    "We'll start by looking at nuclear generation.  Although nuclear generation remains a noticeable part of the United States' electricity generation mix, nuclear generation did not signficantly change over this 20-year period.",
    "Next, we'll look at non-renewable generation.  Although petroleum liquids, like oil, represent an important part of the United States' energy consumption, they're primarily consumed for transportation and make up a shrinking (and now nearly insignificant) portion of the United States' electricity generation.  Additionally, while coal used to be the number one source of United States electricity generation, with more than triple the generation of the second source (natural gas), that trend has switched with natural gas now the primary electricity generation source - more than doubling coal!",
    "When we look at renewable generation, we see some interesting trends.  Hydroelectric generation has remained a consistent, yet small, portion of the energy generation mix.  The real renewable growth has come from both solar, which first became measurable US-wide in 2014, and wind which had an increase in generation of 50x from 2001 to 2021.",
    "Putting the pieces together show us the full story of changes in the United States' generation.  From 2001 to 2021, non-renewable electricity sources decreased as a percentage of total generation from 72% to 62%, while renewable electricity sources increased from 6% to 18%.  Forecasts suggest this trend will continue, with renewable electricity growing in the US primarily driven by increases in solar and wind generation."
];

//Set up the charts (after the page is loaded)
async function init() {
    let data = await d3.csv("electricity_generation.csv");
    let genTypes = Object.keys(data[0]);

    //This is used to set the y scale
    let maxTotal = Math.max(...data.map((arr) => parseInt(arr.Total)))

    let xScale = d3.scaleLinear()
        .domain([2001, 2020])
        .range([0, 700]);

    let yScale = d3.scaleLinear()
        .domain([0, maxTotal])
        .range([chartHeight, 0]);
    

    //Add axes and axes labels
    d3.select("svg").append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")")
        .call(d3.axisLeft(yScale));
    d3.select("svg").append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -150)
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .text("Average Monthly Generation (GWH)");

    d3.select("svg").append("g")
        .attr("transform", "translate(" + margin + "," + (margin + chartHeight) +  ")")
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
    d3.select("svg").append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", chartWidth / 2 + 50)
        .attr("y", chartHeight + 120)
        .text("Year");
    
    //Add legend - modified from https://d3-graph-gallery.com/graph/custom_legend.html
    d3.select("svg").selectAll("legend-dots")
        .data(fuelTypeList)
        .enter()
        .append("circle")
          .attr("cx", chartWidth + 50)
          .attr("cy", (d, i) => 98 + i*30) // 98 is where the first dot appears. 30 is the distance between dots
          .attr("r", 10)
          .style("fill", (d) => fillColors[d])
          .style("stroke", "black")
          .style("stroke-width", 1.5)
      d3.select("svg").selectAll("legend-names")
        .data(fuelTypeList)
        .enter()
        .append("text")
          .attr("x", chartWidth + 70)
          .attr("y", (d, i) => 100 + i*30) // 100 is where the first dot appears. 30 is the distance between dots
          .style("fill", "black")
          .style("font-family", "sans-serif")
          .style("font-size", "20px")
          .text((d) => d)
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")

    //Used to modify the tooltip based on where/over what the user is hovering
    let tooltip = document.getElementById("tooltip"); 
        
    //Add line for total to chart
    d3.select(".chart")
        .append("path")
        .datum(data)
        .classed("Total", true)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("d", d3.area()
            .x((d) => xScale(d.Year) + margin)
            .y0((d) => chartHeight + margin)
            .y1((d) => yScale(d.Total) + margin))
        .on("mouseover", (d) => tooltip.style.visibility = "visible")
        .on("mousemove", function(d){
            let hoverYear = Math.round(xScale.invert(d.offsetX - margin));
            let hoverValue = parseInt(data[parseInt(hoverYear) - 2001]["Total"]);
            tooltip.innerHTML = `Total Generation<br>Year: ${hoverYear}<br>GWH: ${hoverValue.toLocaleString('en-us')}`;
            tooltip.style.top = (d.pageY-10)+"px";
            return tooltip.style.left = (d.pageX+10)+"px";})
        .on("mouseout", () => tooltip.style.visibility = "hidden");

    //Create offsets array.  Each fuel type will be added to the offsets
    //array as we loop through fuel types.  This is used to create a stacked
    //bar chart for the fuel types
    offsets = new Array(data.length).fill(0)

    //Add lines for each fuel type to chart
    for (let fuelType of Object.keys(fillColors)) {
        d3.select(".chart")
            .append("path")
            .datum(data)
            .classed(fuelType, true)
            .classed(categories[fuelType], true)
            .attr("fill", fillColors[fuelType])
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("d", d3.area()
                .x((d) => xScale(d.Year) + margin)
                .y0((d, i) => yScale(offsets[i]) + margin)
                .y1((d, i) => yScale(parseInt(d[fuelType]) + offsets[i]) + margin))
            .on("mouseover", (d) => tooltip.style.visibility = "visible")
            .on("mousemove", function(d){
                let hoverYear = Math.round(xScale.invert(d.offsetX - margin));
                let hoverValue = parseInt(data[parseInt(hoverYear) - 2001][fuelType]);
                tooltip.innerHTML = `${fuelType} Generation<br>Year: ${hoverYear}<br>GWH: ${hoverValue.toLocaleString('en-us')}`;
                tooltip.style.top = (d.pageY-10)+"px";
                return tooltip.style.left = (d.pageX+10)+"px";})
            .on("mouseout", () => tooltip.style.visibility = "hidden");

        for (let i = 0; i < offsets.length; i++) {
            offsets[i] += parseInt(data[i][fuelType]);
        }
    };

    //Add all of the annotations to the page (we will hide the irrelevant ones later)
    d3.select("svg").append("g").attr("class", "annotation-slide annotation-slide-0")
        .call(makeAnnotationsSlide0);
    d3.select("svg").append("g").attr("class", "annotation-slide annotation-slide-1")
        .call(makeAnnotationsSlide1);
    d3.select("svg").append("g").attr("class", "annotation-slide annotation-slide-2")
        .call(makeAnnotationsSlide2);
    d3.select("svg").append("g").attr("class", "annotation-slide annotation-slide-3")
        .call(makeAnnotationsSlide3);
    d3.select("svg").append("g").attr("class", "annotation-slide annotation-slide-4")
        .call(makeAnnotationsSlide4);

    //Defauly to slide 0
    changeDisplay(0);
}

function increaseSlide() {
    if (currentSlide < (slideDisplay.length - 1)) {
        changeDisplay(currentSlide + 1);
    }
}

function decreaseSlide() {
    if (currentSlide > 0) {
        changeDisplay(currentSlide - 1);
    }
}

//Change to a different slide.  Triggered when the user clicks on "Next",
//"Previous", or one of the slide numbers
function changeDisplay(newSlide) {

    //Change which slide is the current slide to the new slide
    document.getElementsByClassName("current-slide")[0].classList.remove("current-slide");
    currentSlide = newSlide;
    document.getElementsByClassName("slide-" + currentSlide)[0].classList.add("current-slide");
    slideChange = slideDisplay[currentSlide];

    //Update the slide text for the current slide
    document.getElementById("slide-text").innerHTML = slideText[currentSlide];

    //Hide all annotations
    for (let element of document.getElementsByClassName("annotation-slide")) {
        element.style.visibility = "hidden";
    }
    //Show the annotations for the current slide
    for (let element of document.getElementsByClassName("annotation-slide-" + currentSlide)) {
        element.style.visibility = "visible";
    }

    //Hides/displays the correct fuel types depending on the chart
    for (let category of Object.keys(slideChange)) {
        for (let el of document.getElementsByClassName(category)) {
            el.style.display = slideChange[category];
        }
    }
}

//Once the page is loaded, load the charts
Document.onload = init();

//Code cleanup
//Additional info for submission