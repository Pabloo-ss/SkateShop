import React, {Component} from "react"
import {Redirect} from "react-router-dom"

import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"

import {ACCESS_LEVEL_GUEST} from "../config/global_constants"

export default class resetDB extends Component 
{
    constructor(props) 
    {
        super(props)
        
        this.state = {
            redirect: false
        }
    }
    
   
    componentDidMount() 
    { 

        axios.post(`${SERVER_HOST}/Users/resetUsers`)
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
                    console.log("DataBase Cleared")
                    localStorage.clear()   
    
                    localStorage.name = "GUEST"
                    localStorage.accessLevel = ACCESS_LEVEL_GUEST

                    this.setState({redirect: true})
                }
            }
            else
            {
                console.log("Logout failed")
            }
        })                     
    }

    render() 
    {   
        return (           
            <div className="form-container">
                {this.state.redirect ? <Redirect to="/DisplayAllSkates"/> : null}
            </div> 
        )
    }
}