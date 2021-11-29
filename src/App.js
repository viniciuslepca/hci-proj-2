import './App.css';
import React, {useState} from 'react';
import {Navbar, Nav, Form} from 'react-bootstrap';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import {Scatter} from 'react-chartjs-2';

let foodWasteData = require("./food_waste.json");
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: foodWasteData,
            countries: []
        }
    }

    getCountries = () => {
        let countries = this.state.countries;
        this.state.data.map(item => countries.includes(item.country) ? null : countries.push(item.country));
        countries.sort()
        this.setState({countries: countries})
    }

    componentDidMount() {
        this.getCountries();
    }

    render() {
        return (
            <div className="App">
                <AppNav/>
                <div style={{margin: 20}}>
                    <div style={{textAlign: "center"}}>
                        <Introduction/>
                        <WorldDataVis data={this.state.data} countries={this.state.countries}/>
                    </div>
                    <References/>
                </div>
            </div>
        );
    }
}

function AppNav() {
    return <Navbar sticky="top" bg="light" variant="light" style={{paddingLeft: 20}}>
        <Navbar.Brand href="/">Food Waste in the World</Navbar.Brand>
        <Nav className="me-auto">
            <Nav.Link href="#introduction">Introduction</Nav.Link>
            <Nav.Link href="#analysis1">Analysis 1</Nav.Link>
            <Nav.Link href="#analysis2">Analysis 2</Nav.Link>
            <Nav.Link href="#analysis3">Analysis 3</Nav.Link>
        </Nav>
    </Navbar>
}

function Introduction() {
    return <div id="introduction">
        <h1>Food Waste in the World</h1>
        <h5 style={{fontWeight: "normal"}}>Team members: Emma Guo, Kaitlynn Pineda, Vinicius Lepca</h5>
        <p>Introduction text</p>
    </div>
}

class WorldDataVis extends React.Component {
    constructor(props) {
        super(props);
        const earliestYear = 2000;
        const defaultBeginYear = 2000;
        const endYear = 2021
        this.state = {
            earliestYear: earliestYear,
            defaultBeginYear: defaultBeginYear,
            beginYear: defaultBeginYear,
            endYear: endYear,
            plotData: {datasets: []},
            selectedCountry: null
        }
    }

    getRandomRgb = () => {
        const num = Math.round(0xffffff * Math.random());
        const r = num >> 16;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }

    generateData = (earliest, latest, countries) => {
        // Format the data
        let formatted = {};
        this.props.data.forEach(item => {
            const country = item.country;
            const year = item.year;
            const loss = item.loss_percentage;
            // const commodity = item.commodity;

            // Filter by countries
            if (countries == null || countries.includes(country)) {
                // Filter by years
                if (year >= earliest && year <= latest) {
                    if (formatted.hasOwnProperty(country)) {
                        formatted[country].data.push({x: year, y: loss})
                    } else {
                        formatted[country] = {
                            label: country,
                            data: [{x: year, y: loss}],
                            backgroundColor: this.getRandomRgb()
                        }
                    }
                }
            }
        })

        const data = {
            datasets: Object.values(formatted)
        }

        // Update the state
        this.setState({plotData: data})
    }

    componentDidMount() {
        this.generateData(this.state.beginYear, this.state.endYear, this.state.selectedCountry);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.beginYear !== this.state.beginYear) {
            this.generateData(this.state.beginYear, this.state.endYear, this.state.selectedCountry);
        }
    }

    render() {
        console.log("Data:", this.props.data);
        console.log("Countries:", this.props.countries);
        console.log("Plot data", this.state.plotData);

        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };
        return (
            <div>
                <YearRangeSlider
                    earliest={this.state.earliestYear}
                    latest={this.state.endYear - 1}
                    defaultValue={this.state.defaultBeginYear}
                    value={this.state.beginYear}
                    setValue={value => this.setState({beginYear: value})}
                />
                <Scatter option={options} data={this.state.plotData}/>
            </div>
        );
    }
}

function YearRangeSlider(props) {
    const [displayValue, setDisplayValue] = useState(props.value);

    return (
        <>
            <Form.Label>Year Range: {displayValue} - 2021</Form.Label><br/>
            Select start of range:
            <Form.Range min={props.earliest} max={props.latest} defaultValue={props.defaultValue}
                        onChange={e => setDisplayValue(e.target.value)}
                        onMouseUp={e => props.setValue(e.target.value)}
            />
        </>
    )
}

function References() {
    return <div id="references">
        <h5>References</h5>
        <ul>
            <li>Test</li>
        </ul>
    </div>
}

export default App;
