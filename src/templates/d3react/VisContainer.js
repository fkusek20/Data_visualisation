import './Vis.css'
import { useEffect, useRef } from 'react';

import VisD3 from './Vis-d3';

// TODO: import action methods from reducers

function VisContainer({ visData, selectedItems, visControllerMethods }) {

    // every time the component re-render
    useEffect(() => {
        console.log("VisContainer useEffect (called each time matrix re-renders)");
    }); // if no dependencies, useEffect is called at each re-render

    const divContainerRef = useRef(null);
    const visD3Ref = useRef(null);

    const getChartSize = function () {
        // getting size from parent item
        let width;
        let height;
        if (divContainerRef.current !== undefined && divContainerRef.current !== null) {
            width = divContainerRef.current.offsetWidth;
            height = divContainerRef.current.offsetHeight - 4;
        }
        return { width, height };
    };

    // did mount called once the component did mount
    useEffect(() => {
        console.log("VisContainer useEffect [] called once the component did mount");
        const visD3 = new VisD3(divContainerRef.current);
        visD3.create({ size: getChartSize() });
        visD3Ref.current = visD3;
        return () => {
            // did unmount
            console.log("VisContainer useEffect [] return function, called when the component did unmount...");
            const visD3 = visD3Ref.current;
            visD3.clear();
        };
    }, []); // if empty array, useEffect is called after the component did mount

    // did update, called each time dependencies change
    const visDataRef = useRef(visData);
    useEffect(() => {
        console.log("VisContainer useEffect with dependency [visData, visControllerMethods]");

        const visD3 = visD3Ref.current;
        if (!visD3) return;

        // klik na item → jedna selekcija
        const handleOnClick = function (item) {
            visControllerMethods.updateSelectedItems([item]);
        };

        // brush / višestruka selekcija
        const handleOnBrush = function (items) {
            visControllerMethods.updateSelectedItems(items);
        };

        const controllerMethods = {
            handleOnClick,
            handleOnBrush
        };

        // visDataRef je tu da ne renderamo na svaku promjenu reference controllerMethods
        if (visData !== visDataRef.current) {
            visD3.renderVis(visData, controllerMethods);
            visDataRef.current = visData;
        }
    }, [visData, visControllerMethods]);

    // reagiraj na promjene selekcije izvana (npr. iz scatterplota)
    useEffect(() => {
        console.log("VisContainer useEffect with dependency [selectedItems]");
        const visD3 = visD3Ref.current;
        if (!visD3) return;
        visD3.highlightSelectedItems(selectedItems || []);
    }, [selectedItems]);

    return (
        <div ref={divContainerRef} className="visDivContainer col2">
        </div>
    );
}

export default VisContainer;
