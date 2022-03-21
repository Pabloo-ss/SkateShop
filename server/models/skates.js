const mongoose = require(`mongoose`)


const types = "Deck,Trucks,Wheels".split(",")

let skatePhotosSchema = new mongoose.Schema(
     {
        filename:{type:String, required: true}
     })

let skateSchema = new mongoose.Schema(
   {
        type: {type: String, enum:types, required: true},
        size: {type: Number, required: true},
        brand: {type: String, required: true},
        price: {type: Number, validate: function(){return this.price > 0}, required: true},
        photos: [skatePhotosSchema]
   },
   {
        collection: `Skates`
   })

module.exports = mongoose.model(`Skates`, skateSchema)