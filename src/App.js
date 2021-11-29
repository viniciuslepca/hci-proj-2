import './App.css';
import {Navbar, Nav} from 'react-bootstrap';
import Papa from 'papaparse';
import React from "react";

function App() {
    return (
        <div className="App">
            <AppNav/>
            <div style={{margin: 20}}>
                <div style={{textAlign: "center"}}>
                    <Introduction/>
                    <WorldDataVis/>
                </div>
                <References/>
            </div>
        </div>
    );
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
        this.state = {
            data: []
        }
        this.getData()
    }

    getData = () => {
        const dataUrl = "/FoodLoss/_w_3afac92c/session/051b790071ac109e65dc118a665828eb/download/Data.csv?w=3afac92c";
        Papa.parse(dataUrl, {
            header: true,
            download: true,
            complete: results => this.setState({data: results.data})
        })
    }

    render() {
        console.log(this.state.data);
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
