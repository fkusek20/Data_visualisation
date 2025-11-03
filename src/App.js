import './App.css';
import { useState, useEffect } from 'react';
import { fetchCSV } from "./utils/helper";
import ScatterplotContainer from "./components/scatterplot/ScatterplotContainer";
import VisContainer from "./templates/d3react/VisContainer";

function App() {
    console.log("App component function call...");
    const [data, setData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    // log svako rerenderiranje (nije nužno, ali pomaže za debug)
    useEffect(() => {
        console.log("App useEffect (called each time App re-renders)");
    });

    // učitaj CSV jednom na mount
    useEffect(() => {
        console.log("App did mount");
        fetchCSV("data/Housing.csv", (response) => {
            console.log("initial setData() ...");
            setData(response.data);
        });
        return () => {
            console.log("App did unmount");
        };
    }, []);

    // centralizirani update selekcije (koriste obje vizualizacije)
    const updateSelectedItems = (items) => {
        const cleaned = (items || []).map((item) => ({
            ...item,
            selected: true,
        }));
        setSelectedItems(cleaned);
    };

    const scatterplotControllerMethods = {
        updateSelectedItems,
    };

    const visControllerMethods = {
        updateSelectedItems,
    };

    return (
        <div className="App">
            <div id="MultiviewContainer" className="row">
                <ScatterplotContainer
                    scatterplotData={data}
                    xAttribute={"area"}
                    yAttribute={"price"}
                    selectedItems={selectedItems}
                    scatterplotControllerMethods={scatterplotControllerMethods}
                />
                <VisContainer
                    visData={data}
                    selectedItems={selectedItems}
                    visControllerMethods={visControllerMethods}
                />
            </div>
        </div>
    );
}

export default App;
