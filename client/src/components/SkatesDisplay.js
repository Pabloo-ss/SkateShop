import React, {Component} from "react"

import axios from "axios"

import {Link} from "react-router-dom"

import { ACCESS_LEVEL_NORMAL_USER, SERVER_HOST} from "../config/global_constants"

import WebHeader from "./WebHeader"
import SkateGrid from "./skateGrid"
import FilterModal from "./FilterModal"



export default class SkateDisplay extends Component 
{
    constructor(props) 
    {
        super(props)
        
        this.state = {
            products:[],//Aqui se cargarian las ids de los productos
            mounted: false,
            filterModal: false,
            redirectAddForm: false
        }
    }


    componentDidMount() 
    { 
        if(typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.id !== 'undefined' ){

            //aqui se hace un get con categoria=lo que viene del redirect

            //un get normal y corriente
            axios.get(`${SERVER_HOST}/DisplayAllSkates/${this.props.location.state.id}`)
            .then(res => 
            {
                if(res.data)
                    {
                        this.setState({products: res.data}) 
                        this.setState({mounted: true})
                    }
                    else
                    {
                        console.log("Records not found")
                    }
            })

        }else{
            //un get normal y corriente
            axios.get(`${SERVER_HOST}/DisplayAllSkates`)
            .then(res => 
            {
                if(res.data)
                    {
                        this.setState({products: res.data}) 
                        this.setState({mounted: true})  
                    }
                    else
                    {
                        console.log("Records not found")
                    }
            }) 
        }      
    }

    changeFilters(brand, size, price){
        let category = ''
        typeof this.props.location.state === 'undefined'? category = 'none' : category = this.props.location.state.id
        if(category === '') category = 'none'
        
        if(brand === '') brand = 'none'
        
        axios.get(`${SERVER_HOST}/DisplayAllSkates/filters/${category}/${brand}/${size}/${price}`)
        .then(res => 
        {
            console.log(1, res.data)
            if(res.data)
                {
                    this.setState({products: res.data}) 
                }
                else
                {
                    console.log("Records not found")
                }
        })
    }

    clickOn = e => {
        this.showFilterModal()
    }

    showFilterModal(){
        this.setState({filterModal: !this.state.filterModal})
    }
   
 
    render() 
    {   
        return (           
            <div className="web-container">
                <WebHeader/>
                <div className="content-container">
                    <div className="grid-container">
                        <h1>Products</h1>
                        
                            <div className="buttons-container">
                                <button className="filter-button" onClick={this.clickOn}>Filters</button>
                                {localStorage.accessLevel > ACCESS_LEVEL_NORMAL_USER ? 
                                <Link className="blue-button" to="/addForm"> Add Product </Link> : null}
                            </div>
                        {this.state.mounted ? <SkateGrid skates={this.state.products}/> : null}
                        
                    </div>     
                </div>
                {this.state.filterModal ? <FilterModal 
                                        category = {this.props.location.id}
                                        closeModal = {this.showFilterModal.bind(this)}
                                        changeFilters = {this.changeFilters.bind(this)}
                                      /> : null}
            </div> 
            

        )
    }
}