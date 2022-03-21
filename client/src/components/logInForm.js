import React, {Component} from "react"

import {Redirect, Link} from 'react-router-dom'

import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"

import {ACCESS_LEVEL_GUEST} from "../config/global_constants"
import WebHeader from "./WebHeader"

export default class logInForm extends Component 
{

    constructor(props) 
    {
        super(props)

        this.state = {
            email: '',
            password: '',
            redirect:false,
            logInError: false,
            errorMessage: ''
        }

    }

    validateEmail() {
        //this is from internet
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(this.state.email).toLowerCase());
    }
    
    validatePassword() {
        //we can make these more complex using ifs.
        if(this.state.password){
                return true
            }else{
                return false
            }
    }

    validation(){
        //creamos un objeto 
        return {
            email: this.validateEmail(),
            password: this.validatePassword()
        }

    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    logInUser = e => {  
        localStorage.name = "GUEST"
        localStorage.accessLevel = ACCESS_LEVEL_GUEST 
        axios.post(`${SERVER_HOST}/Users/login/${this.state.email}/${this.state.password}`)
        .then(res => 
        {    
            localStorage.name = res.data.name
            localStorage.accessLevel = res.data.accessLevel
            localStorage.token = res.data.token
            
            this.setState({redirect:true})
        }).catch((error)=>
        {
            console.log("error:", error.response.data)
            localStorage.name = "GUEST"
            localStorage.accessLevel = ACCESS_LEVEL_GUEST
            this.setState({logInError: true, errorMessage: error.response.data})
        })
    }

    cancelUser = e => {

        this.setState({redirect: !this.state.redirect})
    }

    render() 
    {   

        const formInputsState = this.validation()
        const inputsAreAllValid = Object.keys(formInputsState).every(index => formInputsState[index]) 

        return (      
            
            <div className="web-container">

                <WebHeader/>

                <div className="form-container">
                    {this.state.redirect ? <Redirect to="/DisplayAllSkates"/> : null}
                    <h2> Users Log In </h2>
                    {this.state.logInError ? <div className="errorDiv">{this.state.errorMessage}</div> : null}
                    <input id="email" type="text" name="email" placeholder="Email" onChange={this.handleChange}/><br/>
                    <input id="password" type="password" name="password" placeholder="Password" onChange={this.handleChange}/><br/>
                    <input type="button" className="green-button" value="Log In" disabled = {!inputsAreAllValid} onClick={this.logInUser}/>
                    <Link className="red-button" to="/DisplayAllSkates"> Cancel </Link>
                </div>
            </div> 
        )
    }
}