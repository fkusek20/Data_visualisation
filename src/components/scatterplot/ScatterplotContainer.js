import './Scatterplot.css'
import {useEffect, useRef} from 'react';
import ScatterplotD3 from './Scatterplot-d3';

// TODO: import action methods from reducers

function ScatterplotContainer({
    scatterplotData,
    xAttribute,
    yAttribute,
    selectedItems,
    scatterplotControllerMethods
}){

    // every time the component re-render
    useEffect(()=>{
        // console.log("ScatterplotContainer useEffect (called each time scatterplot re-renders)");
    }); // if no dependencies, useEffect is called at each re-render

    const divContainerRef = useRef(null);
    const scatterplotD3Ref = useRef(null);

    const getChartSize = function(){
        // getting size from parent item
        let width;
        let height;
        if (divContainerRef.current !== undefined && divContainerRef.current !== null){
            width  = divContainerRef.current.offsetWidth;
            height = divContainerRef.current.offsetHeight - 4;
        }
        return {width, height};
    }

    // did mount called once the component did mount
    useEffect(()=>{
        console.log("ScatterplotContainer useEffect [] called once the component did mount");
        const scatterplotD3 = new ScatterplotD3(divContainerRef.current);
        scatterplotD3.create({size:getChartSize()});
        scatterplotD3Ref.current = scatterplotD3;
        return ()=>{
            // did unmount
            console.log("ScatterplotContainer useEffect [] return function, called when the component did unmount...");
            const scatterplotD3 = scatterplotD3Ref.current;
            scatterplotD3.clear();
        };
    },[]); // if empty array, useEffect is called after the component did mount

    const scatterplotDataRef = useRef(scatterplotData);

    // did update, called each time dependencies change
    useEffect(()=>{
        console.log("ScatterplotContainer useEffect [scatterplotData,xAttribute,yAttribute,scatterplotControllerMethods]");

        const handleOnClick = function(itemData){
            console.log("handleOnClick ...");
            scatterplotControllerMethods.updateSelectedItems([itemData]);
        };

        const handleOnMouseEnter = function(itemData){};
        const handleOnMouseLeave = function(){};

        // NOVO: brush handler – više elemenata odjednom
        const handleOnBrush = function(items){
            console.log("handleOnBrush ...");
            scatterplotControllerMethods.updateSelectedItems(items);
        };

        const controllerMethods = {
            handleOnClick,
            handleOnMouseEnter,
            handleOnMouseLeave,
            handleOnBrush        // <-- VAŽNO
        };

        if (scatterplotDataRef.current !== scatterplotData) {
            console.log("ScatterplotContainer: scatterplotData changed, re-render scatterplot...");
            const scatterplotD3 = scatterplotD3Ref.current;
            scatterplotD3.renderScatterplot(
                scatterplotData,
                xAttribute,
                yAttribute,
                controllerMethods
            );
            scatterplotDataRef.current = scatterplotData;
        }
    },[scatterplotData, xAttribute, yAttribute, scatterplotControllerMethods]);

    // update highlight kad se selection promijeni izvana
    useEffect(()=>{
        console.log("ScatterplotContainer useEffect [selectedItems]");
        const scatterplotD3 = scatterplotD3Ref.current;
        if (!scatterplotD3) return;
        scatterplotD3.highlightSelectedItems(selectedItems);
    },[selectedItems]);

    return(
        <div ref={divContainerRef} className="scatterplotDivContainer col2">
        </div>
    );
}

export default ScatterplotContainer;
