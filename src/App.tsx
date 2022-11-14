import { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import * as d3 from "d3";

function App() {
    const [count, setCount] = useState(0);
    const chartRef = useRef<HTMLDivElement | null>(null);
    const data = Array.from(
        { length: 4 },
        (_, i) => i + 1 + Math.floor(Math.random() * 20)
    );
    const width = 420;

    useEffect(() => {
        function chart() {
            const x = d3
                .scaleLinear()
                .domain([0, d3.max(data)!])
                .range([0, width]);

            const y = d3
                .scaleBand()
                .domain(d3.range(data.length).map(String))
                .range([0, 20 * data.length]);

            const svg = d3
                .create("svg")
                .attr("width", width)
                .attr("height", y.range()[1])
                .attr("text-anchor", "end");

            const bar = svg
                .selectAll("g")
                .data(data)
                .join("g")
                .attr("transform", (d, i) => `translate(0, ${y(String(i))})`);

            bar.append("rect")
                .attr("fill", "steelblue")
                .attr("width", x)
                .attr("height", y.bandwidth() - 1);

            bar.append("text")
                .attr("fill", "white")
                .attr("x", (d) => x(d) - 3)
                .attr("y", (y.bandwidth() - 1) / 2)
                .text((d) => d);

            return svg.node();
        }

        if (chartRef.current) chartRef.current.append(chart()!);
    }, []);

    return (
        <div className="App">
            <h1>D3 chart</h1>
            <div className="chartContainer" ref={chartRef}></div>
        </div>
    );
}

export default App;
