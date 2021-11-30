import './App.css';
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

import React, {useState} from 'react';
import {Form, Nav, Navbar, Dropdown} from 'react-bootstrap';
import {Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip,} from 'chart.js';
import {Scatter} from 'react-chartjs-2';
import {Helmet} from "react-helmet";
import ReactWordcloud from 'react-wordcloud';

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
        // console.log("colors", colors)
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
                        <WorldMap/>
                        <p style={{textAlign: "left"}}>Below, you can see a word cloud that represents how commonly each type of food is wasted (percentage)</p>
                        <FoodWasteWordCloud data={this.state.data}/>
                        <Divider/>
                        <FoodLossText/>
                        <WorldDataVis data={this.state.data} countries={this.state.countries} colors={this.state.colors}/>
                        <Divider/>
                        <USFoodWaste/>
                        <USDataVis data={this.state.data.filter(item => item.country === "United States of America")} getRandomRgb={this.getRandomRgb}/>
                        <Divider/>
                        <Solutions/>
                    </div>
                    <References/>
                </div>
            </div>
        );
    }
}

function FoodWasteWordCloud(props) {
    let grouped = {}

    props.data.forEach(item => {
        const commodity = item.commodity;
        if (grouped.hasOwnProperty(commodity)) {
            grouped[commodity].push(item.loss_percentage)
        } else {
            grouped[commodity] = [item.loss_percentage]
        }
    })

    let words = [];
    for (const [key, arr] of Object.entries(grouped)) {
        words.push({
            text: key,
            value: (arr.reduce((a, b) => a + b) / arr.length).toFixed(2)
        })
    }
    console.log(words)

    return <div style={{ height: 600, width: "100%" }}>
        <ReactWordcloud words={words}/>
    </div>
}

function WorldMap() {
    return (
        <>
            <div className="flourish-embed flourish-map" data-src="visualisation/7979215">
                <Helmet>
                    <script src="https://public.flourish.studio/resources/embed.js"></script>
                </Helmet>
            </div>
        </>
    )
}

function FoodLossText() {
    return <div style={{textAlign: "left"}}>
        <h5>How the COVID-19 pandemic influenced food waste</h5>
        <p>
            Before Covid-19, households were pinpointed as the largest source of food waste. However, the increased time at home because of the quarantine improved the consumer’s cooking practices and food management skills,
            which led to an efficient food production at the consumer level that may somehow reduce food waste. Even though the pandemic has created massive disruptions in the food system and severe food shortages and people have better food management skills,
            the problem of food waste still exists because food cannot reach the consumers end.
            At the start of the pandemic, there were reports of farmers in the US and the UK dumping millions of liters of milk daily due to disrupted supply routes.
        </p>
        <h5>Food Loss and Waste</h5>
        <p>
            Global food waste is estimated at 1.3 billion tons per year, as FAO mentioned. Fresh fruits and vegetables lead global food waste at 45% of the global food production, with food waste from residential homes one of the largest rates.
            The USDA estimates that food loss in the United States comprised 31% of the food supply at the retail and consumer levels, with an estimated retail value of $162 billion in 2020. The European Union’s total food waste was estimated at 88 million tons in 2012, with 62 million tons coming from the wholesale and retail and household levels.
            Households contributed the most to the total European Union’s food waste at about 53%, while processing added about 19%.
        </p>
        <p>
            Below, we can see a plot of food loss around the world, with data since the year 2000. You can click on the labels to include or exclude a country from the representation, as well as use the range selector to choose
            the starting year.
        </p>
    </div>
}

function AppNav() {
    return <Navbar sticky="top" bg="light" variant="light" style={{paddingLeft: 20}}>
        <Navbar.Brand href="/">Food Waste in the World</Navbar.Brand>
        <Nav className="me-auto">
            <Nav.Link href="#introduction">Introduction</Nav.Link>
            <Nav.Link href="#world-data">World Data</Nav.Link>
            <Nav.Link href="#us-data">US Data</Nav.Link>
            <Nav.Link href="#solutions">Solutions</Nav.Link>
        </Nav>
    </Navbar>
}

function Introduction() {
    return <div id="introduction" style={{textAlign: "left"}}>
        <div style={{height: 150, textAlign: "center", backgroundImage: `url("https://www.fix.com/assets/content/15725/understanding-food-waste-open-graph.png")`}}>
            <div style={{padding: 30}}>
                <h1>Food Waste in the World</h1>
                <h5 style={{fontWeight: "normal"}}>Team members: Emma Guo, Kaitlynn Pineda, Vinicius Lepca</h5>
            </div>
        </div>
        <h5>Introduction</h5>
        <p>Food waste is a far-reaching problem with enormous environmental, ethical and financial costs globally. According to the Food and Agriculture Organization (FAO) of the United Nations, an estimated 1.3 billion tonnes of food is wasted across the world each year, which is one third of all food produced for human consumption. The majority of food wasted each year is estimated to come from households.
            Land is a limited and valuable source of Earth, but 28% of the world’s agricultural area that is used to produce food is eventually lost or wasted each year. The amount of food wasted or lost is enough to feed 815 million, which is four times the number of hungry people in the world.
        </p>
        <p>
            Below, you can see a map of the world, where darker colors indicate a higher percentage of food waste. Data for the year 2018.
        </p>
    </div>
}

function USFoodWaste() {
    return (
        <div style={{textAlign: "left"}}>
            <h5>Food Waste in the US</h5>
            <p>
                Even though previous studies showed that consumer food waste was solely a problem in developed countries, where the process of production, storage and transportation has particular wastage issues in the developing world. However, recent studies indicate that household food waste per capita is similar across high-income and upper middle-income countries, for example, the United States.
                <br/>
                <i>How much food do Americans waste?</i><br/>
                While the world wastes about 1.4 billion tons of food every year, the United States discards more food than any other country in the world, which is nearly 40 million tons every year. More than 80% of Americans discard perfectly good food because they misunderstand expiration labels.
            </p>
            <p>
                Below, you can see a plot about food waste in the United States. You can click on the labels to include or exclude a commodity from the representation, as well as use dropdown to focus on a specific one.
            </p>
        </div>
    )
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
            <div id="world-data">
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

class USDataVis extends React.Component {
    constructor(props) {
        super(props);
        let commodities = [];
        props.data.forEach(item => {
            if (!commodities.includes(item.commodity)) {
                commodities.push(item.commodity)
            }
        })

        this.state = {
            plotData: {datasets: []},
            commodities: commodities,
            selectedCommodity: null
        }
    }

    generateData = () => {
        let formatted = {}
        this.props.data.forEach(item => {
            const country = item.country;
            const year = item.year
            const loss = item.loss_percentage;
            const commodity = item.commodity;

            // Filter by commodity
            if (this.state.selectedCommodity == null || this.state.selectedCommodity === commodity) {
                if (formatted.hasOwnProperty(commodity)) {
                    formatted[commodity].data.push({x: year, y: loss, country: country, commodity: commodity})
                } else {
                    formatted[commodity] = {
                        label: commodity,
                        data: [{x: year, y: loss, country: country, commodity: commodity}],
                        backgroundColor: this.props.getRandomRgb()
                    }
                }
            }

            // console.log(formatted)
            const sortedDatasets = Object.values(formatted).sort((i1, i2) => i1.label.localeCompare(i2.label))
            const data = {
                datasets: sortedDatasets
            }

            // console.log(data);
            this.setState({plotData: data})
        })
    }

    componentDidMount() {
        this.generateData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedCommodity !== this.state.selectedCommodity) {
            this.generateData();
        }
    }

    render() {
        // console.log(this.state.data);
        // console.log(this.state.commodities);
        // console.log(this.state.selectedCommodity);
        // console.log(this.state.plotData);
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
                            const index = context.dataIndex;
                            const item = context.dataset.data[index];
                            const commodity = item.commodity;
                            const year = item.x;
                            const loss = item.y;
                            return "Commodity: " + commodity + "; Year: " + year + "; Percentage Loss: " + loss;
                        }
                    }
                }
            }
        };
        console.log(this.state.plotData.datasets)
        return <>
            <USDropdown commodities={this.state.commodities} selectedCommodity={this.state.selectedCommodity} selectCommodity={(c) => this.setState({selectedCommodity: c})}/>
            <Scatter options={options} data={this.state.plotData}/>
        </>
    }
}

function USDropdown(props) {
    return <div id="us-data">
        Selected Commodity: {props.selectedCommodity == null ? "All" : props.selectedCommodity}
        <Dropdown>
            <Dropdown.Toggle variant="outline-primary" id="us-dropdown">
                Select Commodity
            </Dropdown.Toggle>

            <Dropdown.Menu variant="dark">
                <Dropdown.Item onClick={() => props.selectCommodity(null)}>All</Dropdown.Item>
                <Dropdown.Divider />
                {props.commodities.map(c => <Dropdown.Item key={c} onClick={() => props.selectCommodity(c)}>{c}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    </div>
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

function Solutions() {
    return <div id="solutions" style={{textAlign: "left"}}>
        <h5>Potential Solutions</h5>
        <p>
            If we don’t do something about it, food loss and waste is predicted to grow. The challenge isn’t to produce less food, but to waste less during the process. There’s many things that can be done at the consumer and household level. FAO suggests a range of way to waste less food:<br/>
            <b>Understand food labelling:</b> There’s a big difference between “best before” and “use-by” dates. Sometimes food is still safe to eat after the “best before” date, whereas it’s the “use-by” date that tells you when it is no longer safe to eat. Check food labels for unhealthy ingredients such as trans fats and preservatives and avoid foods with added sugar or salt.<br/>
            <b>Support Local Food Producers:</b> By buying local produce, you support family farmers and small businesses in your community. You also help fight pollution by reducing delivery distances for trucks and other vehicles.<br/>
            <b>Pick "Ugly" Fruit and Veggies:</b> Don’t judge food by its appearance! Oddly-shaped or bruised fruits and vegetables are often thrown away because they don’t meet arbitrary cosmetic standards. Don’t worry - they taste the same! Use mature fruit for smoothies, juices and desserts.<br/>
        </p>
    </div>
}

function Divider() {
    return <div className="divider"/>
}

function References() {
    return <div id="references">
        <h5>References</h5>
        <ul>
            <li><a href="https://www.worldhunger.org/world-hunger-and-poverty-facts-and-statistics/">https://www.worldhunger.org/world-hunger-and-poverty-facts-and-statistics/</a></li>
            <li><a href="https://www.fao.org/">https://www.fao.org/</a></li>
            <li><a href="https://www.cast-science.org/publication/economic-impacts-of-covid-19-on-food-and-agricultural-markets/">https://www.cast-science.org/publication/economic-impacts-of-covid-19-on-food-and-agricultural-markets/</a></li>
            <li><a href="https://www.ers.usda.gov/data-products/food-availability-per-capita-data-system/food-loss/"> https://www.ers.usda.gov/data-products/food-availability-per-capita-data-system/food-loss/</a></li>
        </ul>
    </div>
}

export default App;
