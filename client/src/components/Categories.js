import React, {Component} from "react"

import {Redirect} from 'react-router-dom'

import WebHeader from "./WebHeader"

export default class Categories extends Component 
{
    constructor(props) 
    {
        super(props)

        this.state = {
            redirectSkates:false,
            redirectEjes: false,
            redirectRuedas: false
        }

    }

    search = e => {

        switch(e.target.name){
            case 'skates':
                this.setState({redirectSkates: !this.state.redirectSkates})
                break
            case 'ejes':
                this.setState({redirectEjes: !this.state.redirectEjes})
                break
            case 'ruedas':
                this.setState({redirectRuedas: !this.state.redirectRuedas})
                break
            default:
                break;
        }
            
        
        
    }

    render() 
    {   
        return (           
            
            <div className="web-container">

                <WebHeader />
                
                <div className="category-container">
                    {this.state.redirectSkates ? <Redirect to={{ pathname: '/displayAllSkates', state: { id: 'Deck' } }}/> : null}
                    {this.state.redirectEjes ? <Redirect to={{ pathname: '/displayAllSkates', state: { id: 'Trucks' } }}/> : null}
                    {this.state.redirectRuedas ? <Redirect to={{ pathname: '/displayAllSkates', state: { id: 'Wheels' } }}/> : null}
                    {/* La cuestion aqui es sacar 3 imagenes, una de ejes, otra de skates y otra de ruedas, cada una llevaria a la zona de los productos de estos, es decir la pagina inicial pero con una consulta poniendo tipo=tipo, y el boton de home volvera todo a la normalidad */}
                    <ul>
                        <li>
                            <span>
                                <img className="iconoCat" src={require("../images/deckCat.png")} alt=""/> 
                                <input className="botonCat" type="Button" defaultValue="Decks" name="skates" onClick={this.search} />
                            </span>
                        </li>
                        <li>
                            <span>
                                <img className="iconoCat" src={require("../images/truckCat.png")} alt=""/> 
                                <input className="botonCat" type="Button" defaultValue="Trucks" name="ejes" onClick={this.search} />
                            </span>
                        </li>
                        <li>
                            <span>
                                <img className="iconoCat" src={require("../images/wheelsCat.png")} alt=""/> 
                                <input className="botonCat" type="Button" defaultValue="Wheels" name="ruedas" onClick={this.search} /> 
                            </span>
                        </li>
                    </ul>
                    
                </div>
            </div> 
        )
    }
}