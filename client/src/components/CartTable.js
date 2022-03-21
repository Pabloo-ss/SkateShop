import React, {Component} from "react"

import CartTableRow from "./CartTableRow"
import Buy from './Buy.js'

import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"

export default class CartTable extends Component 
{
    constructor(props) 
    {
        super(props)

        this.state = {
            product:  [],
            mounted: false
        }

    }

    componentDidMount()
    {
        this.props.products.cart.map(element => {
            axios.get(`${SERVER_HOST}/DisplayAllSkates/get/${element}`, {headers:{"authorization":localStorage.token}})
            .then(res => 
            {
                if(res.data)
                    {
                        this.setState({
                            product: [...this.state.product, res.data]
                          }) 
                        this.setState({mounted: true})
                    }
                    else
                    {
                        console.log("Records not found")
                    }
            }).catch(error =>{
                console.log("err:" + error.response.data)
            })
            return null
        })
    }

    render() 
    {
        let productsID = []
        let precioTotalCarrito = 0
        let datosProductos = []
        let productInfo = ''
        
        this.state.product.map(product => {
            productsID.push(product._id)
            precioTotalCarrito += product.price
            productInfo = `${product.brand} ${product.size}" ${product.type}`
            
            datosProductos.push(productInfo)
            return null
        })
        return (
            <table>
                <thead>
                    <tr>
                    <   th></th>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                  
                <tbody>
                    { this.state.product.map(element => <CartTableRow key={element._id} product={element}/>) } 
                    <tr id="totalCartPrice">
                    <td> { <Buy productID={productsID} productName={datosProductos} price={precioTotalCarrito} /> } </td>
                        <td>Total</td>
                        <td> {precioTotalCarrito}€</td>
                    </tr>
                </tbody>
            </table>      
        )
    }
}