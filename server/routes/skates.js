const router = require(`express`).Router()
const skatesModel = require(`../models/skates`)
const jwt = require('jsonwebtoken')
const fs = require('fs');
var createError = require('http-errors')

const multer  = require('multer')
var upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})

const checkUserLogged = (req, res, next) =>
{
    jwt.verify(req.headers.authorization, process.env.JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) => 
    {
        if (err) 
        { 
            return next(createError(400, "User is not logged in."))
        }
        else 
        {
            req.decodedToken = decodedToken
            return next()
        }
    })
}


const checkIfAdmin = (req, res, next) =>
{
    if(req.decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN)
    {    
        return next()
    }
    else
    {
        return next(createError(400, "User must be an administrator."))
    }
}

const findById = (req, res, next) =>{
    skatesModel.findById(req.params.id, (error, data) => 
    {
        if(error){
            return next(createError(400, `Product not found`))
        }
        else{
            res.json(data)
        }
    })
}

const addProduct = (req, res, next) =>{
    let productDetails = new Object()
    productDetails.type = req.body.type
    productDetails.size = req.body.size
    productDetails.brand = req.body.brand
    productDetails.price = req.body.price
    productDetails.photos = []

    req.files.map((file, index) =>
    {
        productDetails.photos[index] = {filename:`${file.filename}`}
    })
    
    skatesModel.create(productDetails, (error, data) =>
    {
        if(error){
            return next(createError(400, `Error on creation.`))
        }else{
            res.json(data)
        }
        
    })
}

const deleteProduct = (req, res, next) =>{
    let pathArray = __dirname.split('\\')
    let path = pathArray.splice(-0, pathArray.length - 1).join('\\')

    skatesModel.findByIdAndRemove(req.params.id, (error, data) => 
    {
        if(error){
            return next(createError(400, `Error on delete.`))
        }else{
            fs.unlink(`${path}\\uploads\\${data.photos[0].filename}`, (err) => {
                if(err)
                    return next(createError(400, `Error on image deleting.`))
                else
                    res.json(data)
            })
        }
    })
}


const updateProduct = (req, res, next) =>{
    skatesModel.findByIdAndUpdate(req.params.id, {$set: req.body}, (error, data) => 
    {
        if(error){
            return next(createError(400, `Error on update.`))
        }else{
            res.json(data)
        }
    })
}

const checkFilterParams = (req, res, next) =>{
    req.filters = -1
    let num = 0

    if(req.params.category !== 'none') num += 1
    if(req.params.brand !== 'none') num +=2

    switch(num){
        case 0: req.filters = 0 
            break
        case 1: req.filters = 1
            break
        case 2: req.filters = 2
            break
        case 3: req.filters = 3
            break
    }

    return next()
}

const filter = (req, res, next) =>{
    console.log(req.params)
    switch(req.filters){
        case 0:
            skatesModel.find({$and : [
                    {price: {$lte: req.params.price}},
                    {size: req.params.size}]}, (error, data) =>
                {
                if(error)
                    return next(createError(400, `Error on filters.,${error}`))
                else
                    res.json(data)
                })
            break
        case 1:
            skatesModel.find({$and : [
                {type: req.params.category},
                {price: {$lte: req.params.price}},
                {size: req.params.size}]}, (error, data) =>
            {
            if(error)
                return next(createError(400, `Error on filters.`))
            else
                res.json(data)
            })
            break
        case 2:
            skatesModel.find({$and : [
                {brand: req.params.brand},
                {price: {$lte: req.params.price}},
                {size: req.params.size}]}, (error, data) =>
            {
            if(error)
                return next(createError(400, `Error on filters.`))
            else
                res.json(data)
            })
            break   
        case 3:
            skatesModel.find({$and : [
                {type: req.params.category},
                {brand: req.params.brand},
                {price: {$lte: req.params.price}},
                {size: req.params.size}]}
            , (error, data) =>
            {
            if(error)
                return next(createError(400, `Error on filters.`))
            else
                res.json(data)
            })
            break  
    }
    
}

router.get('/DisplayAllSkates', (req, res) => 
{
    skatesModel.find({}, (error, data) =>
    {
        if(error){
            return createError(400, `Error on get.`)
        }else{
            res.json(data)
        }
    })
})

router.get('/DisplayAllSkates/:category', (req, res) => 
{
    skatesModel.find({type: req.params.category}, (error, data) =>
    {
        if(error){
            return createError(400, `Error on getting categories.`)
        }else{
            res.json(data)
        }
    })
})

/* router.get('/DisplayAllSkates/filters/:category/:brand/:size/:price', (req, res) =>{
    console.log(req.params)


    skatesModel.find({$and :[
        {type: req.params.category},
        {size: req.params.size}
    ]}, (error, data) =>
    {
        if(error){
            return next(createError(400, `Error on filters.`))
        }else{
            res.json(data)
        }
    })
}) */


router.get(`/DisplayAllSkates/get/:id`, checkUserLogged, findById)

//Return a photo
router.get(`/DisplayAllSkates/photo/:filename`, (req, res) => 
{   
    fs.readFile(`${process.env.UPLOADED_FILES_FOLDER}/${req.params.filename}`, 'base64', (err, fileData) => 
        {        
        if(fileData)
        {  
            res.json({image:fileData})                           
        }   
        else
        {
            res.json({image:null})
        }
    })             
})

router.get('/DisplayAllSkates/filters/:category/:brand/:size/:price', checkFilterParams, filter) 

router.post('/DisplayAllSkates', upload.array("productPhotos", parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED)), checkUserLogged, checkIfAdmin, addProduct)

router.delete('/DisplayAllSkates/:id', checkUserLogged, checkIfAdmin, deleteProduct)

router.put(`/DisplayAllSkates/:id`, checkUserLogged, checkIfAdmin, updateProduct)

module.exports = router