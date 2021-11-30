import './App.css';
import React, {useState} from 'react';
import {Form, Nav, Navbar} from 'react-bootstrap';
import {Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip,} from 'chart.js';
import {Scatter} from 'react-chartjs-2';

let foodWasteData = require("./food_waste.json");
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: foodWasteData,
            countries: [],
            colors: {}
        }
    }

    getRandomRgb = () => {
        const num = Math.round(0xffffff * Math.random());
        const r = num >> 16;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }

    getCountriesAndColors = () => {
        let countries = this.state.countries;
        this.state.data.map(item => countries.includes(item.country) ? null : countries.push(item.country));
        countries.sort()

        let colors = {}
        countries.forEach(country => colors[country] = this.getRandomRgb());
        console.log("colors", colors)
        this.setState({countries: countries, colors: colors})
    }

    componentDidMount() {
        this.getCountriesAndColors();
    }

    render() {
        return (
            <div className="App">
                <AppNav/>
                <div style={{margin: 20}}>
                    <div style={{textAlign: "center"}}>
                        <Introduction/>
                        <WorldDataVis data={this.state.data} countries={this.state.countries} colors={this.state.colors}/>
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
        <p>Food waste is a far-reaching problem with enormous environmental, ethical and financial costs globally. According to the Food and Agriculture Organization (FAO) of the United Nations, an estimated 1.3 billion tonnes of food is wasted across the world each year, which is one third of all food produced for human consumption. The majority of food wasted each year is estimated to come from households.
            Land is a limited and valuable source of Earth, but 28% of the world’s agricultural area that is used to produce food is eventually lost or wasted each year. The amount of food wasted or lost is enough to feed 815 million, which is four times the number of hungry people in the world.
        </p>
        <p>
            Below, we can see a plot of food loss around the world. You can click on the labels to include or exclude them from the representation, as well as use the range selector to choose
            the starting year.
        </p>
    </div>
}

class WorldDataVis extends React.Component {
    constructor(props) {
        super(props);
        const earliestYear = 2000;
        const defaultBeginYear = 2000;
        const endYear = 2021;
        this.state = {
            earliestYear: earliestYear,
            defaultBeginYear: defaultBeginYear,
            beginYear: defaultBeginYear,
            endYear: endYear,
            plotData: {datasets: []},
            selectedCountry: null
        }
    }

    generateData = (earliest, latest, countries) => {
        // Format the data
        let formatted = {};
        this.props.data.forEach(item => {
            const country = item.country;
            const year = item.year;
            const loss = item.loss_percentage;
            const commodity = item.commodity;

            // Filter by countries
            if (countries == null || countries.includes(country)) {
                // Filter by years
                if (year >= earliest && year <= latest) {
                    if (formatted.hasOwnProperty(country)) {
                        formatted[country].data.push({x: year, y: loss, country: country, commodity: commodity})
                    } else {
                        formatted[country] = {
                            label: country,
                            data: [{x: year, y: loss, country: country, commodity: commodity}],
                            backgroundColor: this.props.colors[country]
                        }
                    }
                }
            }
        })

        const sortedDatasets = Object.values(formatted).sort((i1, i2) => i1.label.localeCompare(i2.label))
        const data = {
            datasets: sortedDatasets
        }

        // Update the state
        this.setState({plotData: data})
    }

    componentDidMount() {
        this.generateData(this.state.beginYear, this.state.endYear, this.state.selectedCountry);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.beginYear !== this.state.beginYear || prevProps.colors !== this.props.colors) {
            this.generateData(this.state.beginYear, this.state.endYear, this.state.selectedCountry);
        }
    }

    render() {
        // console.log("Data:", this.props.data);
        // console.log("Countries:", this.props.countries);
        // console.log("Plot data", this.state.plotData);

        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        text: "Food Loss Percentage",
                        display: true,
                        color: "black"
                    }
                },
                x: {
                    title: {
                        text: "Year",
                        display: true,
                        color: "black"
                    }
                }
            },
            plugins: {
                legend: {
                    maxHeight: 2000
                },
                tooltip: {
                    callbacks: {
                        label: context => {
                            // console.log(context.dataset.data, context.dataset.data[0]);
                            const index = context.dataIndex;
                            const item = context.dataset.data[index];
                            const country = item.country;
                            const commodity = item.commodity;
                            const year = item.x;
                            const loss = item.y;
                            return "Country: " + country + "; Commodity: " + commodity + "; Year: " + year + "; Percentage Loss: " + loss;
                        }
                    }
                }
            }
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
                <Scatter options={options} data={this.state.plotData}/>
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
