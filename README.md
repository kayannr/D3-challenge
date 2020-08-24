# Data Journalism and D3
 https://kayannr.github.io/D3-challenge/D3_data_journalism/index.html
 
 
 ![Newsroom](https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif)
 
 
## Background

Utilizing information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System, create charts, graphs and interactive visualizations to help understand findings. The data set included is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml). The data set includes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

## Features 
* Interactive Plot 
Inludes more demographics and more risk factors. Additional labels in the scatter plot with click events so that the users can decide which data to display. The transitions for the  circles' locations are animated as well as the range of the axes. 

![4-scatter](D3_data_journalism/assets/images/7-animated-scatter.gif)

* D3-tip
While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. Enter tooltips: developers can implement these in their D3 graphics to reveal a specific element's data when the user hovers their cursor over the element. Tooltips are added to the circles and display each tooltip with the data that the user has selected. Use the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged). 


 ![4-scatter](D3_data_journalism/assets/images/8-tooltip.gif)
