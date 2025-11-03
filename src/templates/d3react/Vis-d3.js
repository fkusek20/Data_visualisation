import * as d3 from 'd3'
import { getDefaultFontSize } from '../../utils/helper';

/**
 * Druga vizualizacija:
 * 1D strip-plot po broju soba (bedrooms).
 * Svaka kuća = točka:
 *  - x: bedrooms (band skala)
 *  - y: random jitter (da se ne preklapaju)
 * Selekcija:
 *  - click na točku → jedna kuća
 *  - 1D brush po x osi → više kuća
 */
class VisD3 {
    margin = {top: 100, right: 5, bottom: 50, left: 100};
    size;
    height;
    width;
    matSvg;
    defaultOpacity = 0.3;
    circleRadius = 4;

    constructor(el){
        this.el = el;
        this.currentData = [];
        this.currentControllerMethods = null;
    };

    create = function (config) {
        this.size = {width: config.size.width, height: config.size.height};

        this.width = this.size.width - this.margin.left - this.margin.right;
        this.height = this.size.height - this.margin.top - this.margin.bottom;

        this.matSvg = d3.select(this.el).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("class","matSvgG")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        // skale
        this.xScale = d3.scaleBand()
            .range([0, this.width])
            .padding(0.2);

        this.yScale = d3.scaleLinear()
            .range([this.height, 0])
            .domain([0, 1]); // jitter

        // osi
        this.matSvg.append("g")
            .attr("class","xAxisG")
            .attr("transform","translate(0,"+this.height+")");

        // brush grupa
        this.brushG = this.matSvg.append("g")
            .attr("class","brush");
    }

    updateAxis(data){
        const bedrooms = Array.from(new Set(data.map(d => +d.bedrooms))).sort((a,b)=>a-b);
        this.xScale.domain(bedrooms);

        this.matSvg.select(".xAxisG")
            .transition().duration(400)
            .call(d3.axisBottom(this.xScale));
    }

    changeBorderAndOpacity(selection, selected){
        selection
            .style("opacity", selected ? 1 : this.defaultOpacity);

        selection.select(".visCircle")
            .attr("stroke-width", selected ? 2 : 0);
    }

    updateMarkers(selection){
        selection
            .transition().duration(400)
            .attr("transform", d => {
                const x = this.xScale(+d.bedrooms) + this.xScale.bandwidth()/2;
                const y = this.yScale(Math.random());
                return `translate(${x},${y})`;
            });

        this.changeBorderAndOpacity(selection, false);
    }

    highlightSelectedItems(selectedItems){
        const selectedSet = new Set((selectedItems || []).map(d => d.index));
        this.matSvg.selectAll(".itemG")
            .each((d,i,nodes) => {
                const sel = d3.select(nodes[i]);
                const isSelected = selectedSet.has(d.index);
                this.changeBorderAndOpacity(sel, isSelected);
            });
    }

    installBrush(){
        const that = this;

        const brush = d3.brushX()
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

                const [x0, x1] = sel;

                const brushed = that.currentData.filter(d => {
                    const xCenter = that.xScale(+d.bedrooms) + that.xScale.bandwidth()/2;
                    return x0 <= xCenter && xCenter <= x1;
                });

                ctrl.handleOnBrush(brushed);
            });

        this.brushG.call(brush);
    }

    renderVis = function (visData, controllerMethods){
        this.currentData = visData;
        this.currentControllerMethods = controllerMethods;

        this.updateAxis(visData);

        this.matSvg.selectAll(".itemG")
            .data(visData,(itemData)=>itemData.index)
            .join(
                enter=>{
                    const itemG = enter.append("g")
                        .attr("class","itemG")
                        .style("opacity", this.defaultOpacity)
                        .on("click", (event,itemData)=>{
                            controllerMethods.handleOnClick(itemData);
                        });

                    itemG.append("circle")
                        .attr("class","visCircle")
                        .attr("r", this.circleRadius)
                        .attr("stroke","red");

                    this.updateMarkers(itemG);
                },
                update=>{
                    this.updateMarkers(update);
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
export default VisD3;
