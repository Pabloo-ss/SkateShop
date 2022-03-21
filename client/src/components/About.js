import React, {Component} from "react"

import WebHeader from "./WebHeader"

export default class about extends Component 
{
    render() 
    {   
        return (           
            
            <div className="web-container">

                <WebHeader />
                
                <div className="content-container">
                    <h1>About Page</h1>
                </div>
            </div> 
        )
    }
}