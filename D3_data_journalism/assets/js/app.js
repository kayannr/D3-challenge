// ****************************************************************
//  D3 - DATA JOURNALISM
// ****************************************************************

// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {
    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }

    // Set svg dimensions 
    var svgWidth = 960;
    var svgHeight = 500;
    var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100   };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // ****************************************************************
    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    // ****************************************************************
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    // ****************************************************************
    // Append an SVG group
    // ****************************************************************
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // ****************************************************************
    // Initial Params
    // ****************************************************************
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare"; 

    // ****************************************************************
    // function used for updating x-scale var upon click on axis label
    // ****************************************************************
    function xScale(data, chosenXAxis) {
        // Create Scale Functions for the Chart (chosenXAxis)
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
            d3.max(data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
        return xLinearScale;
    };

    // ****************************************************************
    // Function for Updating yScale Upon Click on Axis Label
    // ****************************************************************
    function yScale(data, chosenYAxis) {
        // Create Scale Functions for the Chart (chosenYAxis)
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
            d3.max(data, d => d[chosenYAxis]) * 1.2
            ])
            .range([height, 0]);
        return yLinearScale;
    };

    // ****************************************************************
    // function used for updating xAxis var upon click on axis label
    // ****************************************************************
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
        xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
        return xAxis;
    }; 

    // ****************************************************************
    // function used for updating yAxis var upon click on axis label
    // ****************************************************************
    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
        yAxis.transition()
        .duration(1000)
        .call(leftAxis);
        return yAxis;
    }; 

    // ****************************************************************
    // function used for updating circles group with a transition to
    // new circles
    // ****************************************************************
    function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

        circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
        return circlesGroup;
    }; 

    // ****************************************************************
    // Function for updating text group with a transition to new text
    // ****************************************************************
    function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
        textGroup.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]))
            .attr("text-anchor", "middle");
        return textGroup;
    }

    // ****************************************************************
    // function used for updating circles group with new tooltip
    // ****************************************************************
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
        var xLabel;
        var yLabel;
    
        // X-axis
        if (chosenXAxis === "poverty") {
            xLabel = "Poverty (%): ";     
        }
        else if (chosenXAxis === "age") {
            xLabel = "Age (Median): " ;
        }
        else {
            xLabel = "Household Income (Median): ";
        }

        // Y-axis
        if (chosenYAxis === "obesity") {
            yLabel = "Obese (%): ";     
        }
        else if (chosenYAxis === "healthcare") {
            yLabel = "Lacks Healthcare (%): ";
        }
        else {
            yLabel = "Smokes (%): ";
        }

        // Initialize Tool Tip
        var toolTip = d3.tip()
        .attr("class", "tooltip d3-tip")
        .offset([0, 0])  //change offset
        .html(function(d) {
            return (`<strong>${d.state}</strong><br>${xLabel} ${d[chosenXAxis]} <br>${yLabel} ${d[chosenYAxis]}`);
        });
    
        // Create Circles Tooltip
        circlesGroup.call(toolTip);
        // Create Event Listeners to Display and Hide the Circles Tooltip
        circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
        })
            // onmouseout event
            .on("mouseout", function(data, index) {
            toolTip.hide(data);
            });

        // Create Text Tooltip in the Chart
        textGroup.call(toolTip);
        // Create Event Listeners to Display and Hide the Text Tooltip
        textGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
        })
        // onmouseout Event
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });

        return circlesGroup;
    }; 

    // ****************************************************************
    // Import Data
    // ****************************************************************
    var dataFile = "assets/data/data.csv"

    // ****************************************************************
    // Retrieve data from the CSV file and execute everything below
    // ****************************************************************
    d3.csv(dataFile).then(function(data, err){
        if (err) throw err;

        // parse data
        data.forEach(function(d) {
            d.poverty = +d.poverty;
            d.age = +d.age;
            d.income = +d.income;
            d.healthcare = +d.healthcare;
            d.obesity = +d.obesity;
            d.smokes = +d.smokes;
        });

        // Create xLinearScale & yLinearScale Functions for the Chart
        var xLinearScale = xScale(data, chosenXAxis);
        var yLinearScale = yScale(data, chosenYAxis);

        // Create Initial Axis Functions for the Chart
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append xAxis to the Chart
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // Append yAxis to the Chart
        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        // Create & Append Initial Circles
        var circlesGroup = chartGroup.selectAll(".circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("class", "circle")
        .attr("r", 17)
        .attr("fill", "Purple")
        .attr("opacity", ".60");

        // Append Text to Circles
        var textGroup = chartGroup.selectAll(".stateText")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]*.95))
            .text(d => (d.abbr))
            .attr("fill", "white")
            .attr("class", "stateText")
            .attr("font-size", "11px")
            .attr("text-anchor", "middle");

        // ***********************************
        // Create group for two x-axis labels
        // ***********************************
        var XLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);
        
        // Append 3 x-axis Labels
        var PovertyLabel = XLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // Value to Grab for Event Listener
        .classed("active", true)
        .text("Poverty (%)");

        var AgeLabel = XLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // Value to Grab for Event Listener
        .classed("inactive", true)
        .text("Age (Median)");

        var IncomeLabel = XLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // Value to Grab for Event Listener
        .classed("inactive", true)
        .text("Household Income (Median)");

        // ***********************************
        // Create Group for 3 y-axis Labels
        // ***********************************
        var YLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(-25, ${height / 2})`);
        // Append yAxis
        var HealthCareLabel = YLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", 0)
        .attr("value", "healthcare")
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed("active", true)
        .text("Lacks Healthcare (%)");

        var SmokesLabel = YLabelsGroup.append("text") 
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", 0)
        .attr("value", "smokes")
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Smokes (%)");

        var ObesityLabel = YLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -70)
        .attr("x", 0)
        .attr("value", "obesity")
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Obese (%)");

        // updateToolTip function
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

         // xAxis Labels Event Listener
        XLabelsGroup.selectAll("text")
            .on("click", function() {
            // Get Value of Selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                // Replaces chosenXAxis with Value
                chosenXAxis = value;
                // Updates xScale for New Data
                xLinearScale = xScale(data, chosenXAxis);
                // Updates xAxis with Transition
                xAxis = renderXAxes(xLinearScale, xAxis);
                // Updates Circles with New Values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // Updates Text with New Values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
                // Updates Tooltips with New Information
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
                // Changes Classes to Change Bold Text
                if (chosenXAxis === "poverty") {
                PovertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                AgeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                IncomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                PovertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                AgeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                IncomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else {
                PovertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                AgeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                IncomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }
            }
        });
        // yAxis Labels Event Listener
        YLabelsGroup.selectAll("text")
            .on("click", function() {
            // Get Value of Selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {
                // Replaces chosenYAxis with Value
                chosenYAxis = value;
                // Updates yScale for New Data
                yLinearScale = yScale(data, chosenYAxis);
                // Updates yAxis with Transition
                yAxis = renderYAxes(yLinearScale, yAxis);
                // Updates Circles with New Values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // Updates Text with New Values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
                // Updates Tooltips with New Information
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
                // Changes Classes to Change Bold Text
                if (chosenYAxis === "healthcare") {
                HealthCareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ObesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                SmokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenYAxis === "obesity") {
                HealthCareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ObesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                IncomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else {
                HealthCareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ObesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                SmokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }
            }
        });

    })
    .catch(function(error) {
        console.log(error);
    });
};
// When Browser Loads, call makeResponsive() 
makeResponsive();

// When Browser Window is Resized, call makeResponsive()
d3.select(window).on("resize", makeResponsive);
