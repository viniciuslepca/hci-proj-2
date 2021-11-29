import './App.css';
import {Navbar, Nav} from 'react-bootstrap';
import React from "react";

let foodWasteData = require("./food_waste.json");

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
    render() {
        console.log("Data:", this.props.data);
        console.log("Countries:", this.props.countries);
        return (
            <div>
                Test
            </div>
        );
    }
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
