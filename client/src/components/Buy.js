import React, {Component} from "react"
import axios from "axios"
import {Redirect} from "react-router-dom"

import {SANDBOX_CLIENT_ID, SERVER_HOST, PRODUCTION_CLIENT_ID} from "../config/global_constants"

import PaypalButton from 'react-paypal-express-checkout'
import PayPalMessage from "./PayPalMessage"

export default class Buy extends Component 
{
    constructor(props)
    {
        super(props)

        this.state = {redirectToPayPalMessage:false,
                      payPalMessageType:null,
                      payPalPaymentID:null,}
    }
    
    onSuccess = paymentData =>
    {      
        let formData = new FormData()

        let now = Date.now()

        this.props.productID.map( (prod, index) => {
            axios.post(`${SERVER_HOST}/sales/${paymentData.paymentID}/${prod}/${this.props.price}/${paymentData.address.recipient_name}/${this.props.productName[index]}/${now}`, formData, {headers:{"authorization":localStorage.token, "Content-type": "multipart/form-data"}})
            .then(res => 
            {                   
                this.setState({payPalMessageType:PayPalMessage.messageType.SUCCESS, 
                            payPalPaymentID:paymentData.paymentID, 
                            redirectToPayPalMessage:true}) 
            })
            .catch(errorData =>
            {
                console.log("PayPal payment unsuccessful error:", errorData)            
                this.setState({payPalMessageType:PayPalMessage.messageType.ERROR, 
                            redirectToPayPalMessage:true}) 
            })
        })

        axios.put(`${SERVER_HOST}/Users/clearCart`, formData, {headers:{"authorization":localStorage.token, "Content-type": "multipart/form-data"}})
            .then(res => 
            {                   
                this.setState({payPalMessageType:PayPalMessage.messageType.SUCCESS, 
                            payPalPaymentID:paymentData.paymentID, 
                            redirectToPayPalMessage:true}) 
            })
            .catch(errorData =>
            {
                console.log("PayPal payment unsuccessful error:", errorData)            
                this.setState({payPalMessageType:PayPalMessage.messageType.ERROR, 
                            redirectToPayPalMessage:true}) 
            })
    }
    
    
    onError = errorData => 
    {
        console.log("PayPal error:", errorData)
        this.setState({payPalMessageType:PayPalMessage.messageType.ERROR, 
                       redirectToPayPalMessage:true})         
    }
    
    
    onCancel = cancelData => 
    {
        // The user pressed the Paypal checkout popup window cancel button or closed the Paypal checkout popup window
        console.log("Payment cancelled by user:", cancelData)
        this.setState({payPalMessageType:PayPalMessage.messageType.CANCEL, 
                       redirectToPayPalMessage:true})       
    }
    
    
    render() 
    {            
        const environment = "sandbox"  // must be either "sandbox" or "production"
        
        const client_id = {sandbox:SANDBOX_CLIENT_ID,
                         production: PRODUCTION_CLIENT_ID}

        const redirect = `/PayPalMessage/${this.state.payPalMessageType}/${this.state.payPalPaymentID}`
                
        return (
            <div>
                {this.state.redirectToPayPalMessage ? <Redirect to= {redirect}/> : null}  
                        
                <PaypalButton 
                    env = {environment}
                    client = {client_id}
                
                    currency = "EUR"
                    total = {this.props.price}
                    onSuccess = {this.onSuccess}
                    onError = {this.onError}               
                    onCancel = {this.onCancel}                   
            
                    style={{size: "small", width:"100px", color: "blue"}}
                />
            </div>
        )
    }
}