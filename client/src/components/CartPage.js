import React, {Component} from "react"

import CartTable from './CartTable.js'

import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"
import WebHeader from "./WebHeader"

export default class CartPage extends Component 
{

    constructor(props) 
    {
        super(props)

        this.state = {
            products: null,
            mounted: false,
            showError: true
        }

    }

    componentDidMount()
    {
        axios.get(`${SERVER_HOST}/Users/shopCart`, {headers:{"authorization":localStorage.token}})
        .then(res => 
        {
            if(res.data)
                {
                    if(res.data[0].cart.length === 0){
                        this.setState({showError: true, products: res.data, mounted: true})
                    }else{
                        this.setState({showError: false,  products: res.data, mounted: true})
                    }
                }
                else
                {
                    console.log("Records not found")
                }
        }).catch(error =>{
            console.log("err:" + error.response.data)
        })
    }

    render() 
    {   
        return (       
            <div className="web-container">
                <WebHeader/>
                <div className="content-container">
                    <h2> {localStorage.name}'s cart page.</h2> <br/>

                    {this.state.showError ? 
                    <div className="errorDiv">No cart found for this user.</div>
                    : 
                    <div className="history-table">
                        {this.state.products.map((product) => <CartTable products={product} key={product}/>)}
                    </div>} 
                </div>
            </div>
        )
    }
}