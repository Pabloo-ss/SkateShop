import React, {Component} from "react"
import SkateHolder from "./skateHolder.js"


export default class SkateGrid extends Component 
{
    constructor(props) 
    {
        super(props)
        
        this.state = {
            products:[this.props.skates],
        }
    }

    render() 
    {   
        return ( 
            <div className="skates-grid">
                {this.props.skates.map((skate) => <SkateHolder key={skate._id} skate={skate}/>)}
            </div>
        )
    }
}