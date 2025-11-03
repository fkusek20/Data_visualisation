import * as d3 from 'd3'
// import { getDefaultFontSize } from '../../utils/helper';

class ScatterplotD3 {
    margin = {top: 100, right: 10, bottom: 50, left: 100};
    size;
    height;
    width;
    matSvg;
    defaultOpacity = 0.3;
    transitionDuration = 1000;
    circleRadius = 3;
    xScale;
    yScale;

    constructor(el){
        this.el = el;
        this.currentData = [];
        this.currentXAttr = null;
        this.currentYAttr = null;
        this.currentControllerMethods = null;
    };

    create = function (config) {
        this.size = {width: config.size.width, height: config.size.height};

        this.width = this.size.width - this.margin.left - this.margin.right;
        this.height = this.size.height - this.margin.top - this.margin.bottom ;
        console.log("create SVG width=" + (this.width + this.margin.left + this.margin.right ) + " height=" + (this.height+ this.margin.top + this.margin.bottom));

        this.matSvg = d3.select(this.el).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("class","matSvgG")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.xScale = d3.scaleLinear().range([0,this.width]);
        this.yScale = d3.scaleLinear().range([this.height,0]);

        this.matSvg.append("g")
            .attr("class","xAxisG")
            .attr("transform","translate(0,"+this.height+")");

        this.matSvg.append("g")
            .attr("class","yAxisG");

        this.brushG = this.matSvg.append("g")
            .attr("class","brush");
    }

    changeBorderAndOpacity(selection, selected){
        selection
            .style("opacity", selected ? 1 : this.defaultOpacity);

        selection.select(".markerCircle")
            .attr("stroke-width", selected ? 2 : 0);
    }

    updateMarkers(selection,xAttribute,yAttribute){
        selection
            .transition().duration(this.transitionDuration)
            .attr("transform", (item)=>{
                const xPos = this.xScale(+item[xAttribute]);
                const yPos = this.yScale(+item[yAttribute]);
                return "translate("+xPos+","+yPos+")";
            });

        this.changeBorderAndOpacity(selection,false);
    }

    highlightSelectedItems(selectedItems){
        const selectedSet = new Set((selectedItems || []).map(d => d.index));
        this.matSvg.selectAll(".markerG")
            .each((d,i,nodes) => {
                const sel = d3.select(nodes[i]);
                const isSelected = selectedSet.has(d.index);
                this.changeBorderAndOpacity(sel, isSelected);
            });
    }

    updateAxis = function(visData,xAttribute,yAttribute){
        const xVals = visData.map((item)=> +item[xAttribute]);
        const yVals = visData.map((item)=> +item[yAttribute]);

        const minXAxis = d3.min(xVals);
        const maxXAxis = d3.max(xVals);
        const minYAxis = d3.min(yVals);
        const maxYAxis = d3.max(yVals);

        this.xScale.domain([minXAxis,maxXAxis]);
        this.yScale.domain([minYAxis,maxYAxis]);

        this.matSvg.select(".xAxisG")
            .transition().duration(500)
            .call(d3.axisBottom(this.xScale));

        this.matSvg.select(".yAxisG")
            .transition().duration(500)
            .call(d3.axisLeft(this.yScale));
    }

    installBrush(){
        const that = this;

        const brush = d3.brush()
            .extent([[0,0], [this.width, this.height]])
            .on("brush end", function(event){
                if (!that.currentData || that.currentData.length === 0) return;
                const ctrl = that.currentControllerMethods;
                if (!ctrl || !ctrl.handleOnBrush) return;

                const sel = event.selection;
                if (!sel){
                    ctrl.handleOnBrush([]);
                    return;
                }

                const [[x0,y0],[x1,y1]] = sel;

                const brushedItems = that.currentData.filter(d => {
                    const x = that.xScale(+d[that.currentXAttr]);
                    const y = that.yScale(+d[that.currentYAttr]);
                    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
                });

                ctrl.handleOnBrush(brushedItems);
            });

        this.brushG.call(brush);
    }

    renderScatterplot = function (visData, xAttribute, yAttribute, controllerMethods){
        console.log("render scatterplot with a new data list ...");

        // FILTRIRAJ LOŠE REDOVE (bez broja na osi x/y)
        const filteredData = visData.filter(d =>
            Number.isFinite(+d[xAttribute]) && Number.isFinite(+d[yAttribute])
        );

        this.currentData = filteredData;
        this.currentXAttr = xAttribute;
        this.currentYAttr = yAttribute;
        this.currentControllerMethods = controllerMethods;

        this.updateAxis(filteredData, xAttribute, yAttribute);

        this.matSvg.selectAll(".markerG")
            .data(filteredData,(itemData)=>itemData.index)
            .join(
                enter=>{
                    const itemG = enter.append("g")
                        .attr("class","markerG")
                        .style("opacity",this.defaultOpacity)
                        .on("click", (event,itemData)=>{
                            controllerMethods.handleOnClick(itemData);
                        });

                    itemG.append("circle")
                        .attr("class","markerCircle")
                        .attr("r",this.circleRadius)
                        .attr("stroke","red");

                    this.updateMarkers(itemG,xAttribute,yAttribute);
                },
                update=>{
                    this.updateMarkers(update,xAttribute,yAttribute);
                },
                exit =>{
                    exit.remove();
                }
            );

        this.installBrush();
    }

    clear = function(){
        d3.select(this.el).selectAll("*").remove();
    }
}
export default ScatterplotD3;
