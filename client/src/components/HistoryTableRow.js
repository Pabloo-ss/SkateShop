import React, {Component} from "react"

export default class HisotryTableRow extends Component 
{     
    render() 
    {
        const hoy = new Date(this.props.transaction.date);
        let date = hoy.toUTCString()
        return (
            <tr>
                <td>{this.props.transaction.productName}</td>
                <td>{date}</td>
                <td>{this.props.transaction.price}€</td>    
                <td>{this.props.transaction._id}</td>
            </tr>
        )
    }
}