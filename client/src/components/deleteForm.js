import React, {Component} from "react"
import {Redirect} from "react-router-dom"

import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"

export default class deleteForm extends Component 
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
        axios.delete(`${SERVER_HOST}/DisplayAllSkates/${this.props.match.params.id}`, {headers:{"authorization":localStorage.token}})
        .then(res => 
        {
            if(res.data)
            {          
                this.setState({redirect: true})
                console.log("Record deleted")
            }else{
                console.log("Record not deleted")
            }
        }).catch(error =>{
            console.log("err:" + error.response.data)
        })                    
    }

    render() 
    {   
        return (           
            <div>
                {this.state.redirect ? <Redirect to="/DisplayAllSkates"/> : null}
            </div> 
        )
    }
}