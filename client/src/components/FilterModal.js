import React, {Component} from "react"

import {Redirect} from 'react-router-dom'




export default class FilterModal extends Component{

    constructor(props) 
    {
        super(props)

        this.state = {
                    brand: '',
                    size: 8,
                    price: 50,
                    redirect : false  }
    }


    onPriceInput = () =>{
        let slider = document.getElementById("priceRange");
        let output = document.getElementById("outputPriceSlider");
        output.innerHTML = slider.value;
        this.setState({price: slider.value})
    }

    onSizeInput = () =>{
        let slider = document.getElementById("sizeRange");
        let output = document.getElementById("outputSizeSlider");
        output.innerHTML = slider.value;
        this.setState({size: slider.value})
    }

    handleChange = e =>{
        this.setState({brand: e.target.value})
    }

    onClick = e =>{
        if(e.target.name === 'apply')
            this.props.changeFilters(this.state.brand, this.state.size, this.state.price)
        else
            this.setState({redirect: true})
    }

    render(){
        return(
            <div id="modal"> 
            {this.state.redirect? <Redirect to="/Home"/>: null}
                <div id="modalContent">
                    <div className="modal-body">
                        <div id="info">
                            <div id="title">
                                <h1>Filters</h1>
                            </div>
                            <div id="exit" onClick={this.props.closeModal}>
                                <img src= {require("../images/exit.png")} alt="/"/>
                            </div>
                        </div>
                        <div id="productInfo">
                            <div id="brandContainer">
                                <h4>Brand:</h4>
                                <input id="filterInput" type="text" name="brand" onChange={this.handleChange}/>
                            </div>
                            <div id="slideContainer">
                                <h4>Price max: <span id="outputPriceSlider"> 50</span></h4>
                                <input type="range" min="1" max="150" value="50" className="slider" id="priceRange" onChange={this.onPriceInput}/>
                            </div>
                            <div id="slideContainer">
                                <h4>Size: <span id="outputSizeSlider"> 8</span></h4>
                                <input type="range" min="6" max="9.5" value="8" className="slider" id="sizeRange" step={0.25} onChange={this.onSizeInput}/>
                            </div>
                        </div>
                        <div id="buttons">
                            <button name="apply" className="green-button" onClick={this.onClick}>Apply</button>
                            <button name="clear" className="red-button" onClick={this.onClick}>Clear</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}