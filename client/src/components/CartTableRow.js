import React, {Component} from "react"

import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"

export default class CartTableRow extends Component 
{     
    constructor(props) 
    {
        super(props)

        this.state = {
            mounted: false,
            picture: ''
        }

    }

    componentDidMount()
    {
        axios.get(`${SERVER_HOST}/DisplayAllSkates/photo/${this.props.product.photos[0].filename}`)
        .then(res => 
        {
            if(res.data)
            {            
                if (res.data.errorMessage)
                {
                    console.log(res.data.errorMessage)    
                }
                else
                {                
                    this.setState({picture: res.data.image})
                    this.setState({mounted: true})
                }   
            }
            else
            {
                console.log("Record not found")
            }
        }).catch(error =>{
            console.log("err:" + error.response.data)
        })
    }

    render() 
    {
        let productInfo = ''

        if(this.props.product.type === 'Wheels'){
            productInfo = `${this.props.product.brand} ${this.props.product.size}mm ${this.props.product.type}`
        }else{
            productInfo = `${this.props.product.brand} ${this.props.product.size}" ${this.props.product.type}`
        }
        return (
            <tr>
                <td className="photosRow"> {this.state.mounted ? 
                    <div className="productPhotos">
                        <img id={this.state.picture} src={`data:;base64,${this.state.picture}`} alt=""/> 
                    </div>: null}</td>
                <td>{productInfo}</td>
                <td>{this.props.product.price}€</td>    
            </tr>
        )
    }
}