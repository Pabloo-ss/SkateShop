import React, {Component} from "react"
import axios from "axios"

import SkateModal from "./SkateModal"

import {SERVER_HOST} from "../config/global_constants"

export default class SkateHolder extends Component 
{

    constructor(props) 
    {
        super(props)

        
        this.state = { 
            id: this.props.skate._id,
            photo: this.props.skate.photo,
            size: this.props.skate.size,
            brand: this.props.skate.brand,
            price: this.props.skate.price,
            type: this.props.skate.type,
            picture: '',
            mounted: false,
            modal: false
        }
    }

    clickOn = e => {
        this.showModal()
    }

    showModal(){
        this.setState({modal: !this.state.modal})
    }

    componentDidMount() 
    {
        
        axios.get(`${SERVER_HOST}/DisplayAllSkates/photo/${this.props.skate.photos[0].filename}`)
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
        })
    }
    
    
    render() 
    {
        let productInfo = ''
        productInfo = `${this.state.brand} ${this.state.size}" ${this.state.type}`
        let productPrice = `${this.state.price}€`
        return (
            <div className="skate" onClick={this.clickOn}>
                <div className="productName">
                    {productInfo}
                </div>
                <div className="skatePhoto">
                    {this.state.mounted ? <img id={this.state.picture} src={`data:;base64,${this.state.picture}`} alt=""/> : null}
                </div>
                <div className="productPrice">
                    {productPrice}
                </div>
                {this.state.modal ? <SkateModal 
                                        skate = {this.props.skate}
                                        closeModal = {this.showModal.bind(this)}
                                      /> : null}   
                
            </div>        
        )
    }
}