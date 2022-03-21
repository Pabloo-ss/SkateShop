const router = require(`express`).Router()
const usersModel = require(`../models/users`)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')


//Middleware
const checkUserExists = (req, res, next) =>
{
    usersModel.findOne({email:req.params.email}, (error, data) => 
    {
        if(error){
            return next(createError(400), `User doesn't exists.`)
        }

        req.data = data            
        return next()        
    })    
}

const checkUserNotExists = (req, res, next) =>
{
    usersModel.findOne({email:req.params.email}, (err, data) => 
    {
        if(data){
            if(err){
                return next(err)
            }
            return next(createError(400, "User already exists."))
        }
    }) 
    
    return next()
}

const checkLogIn = (req, res, next) =>
{    
    bcrypt.compare(req.params.password, req.data.password, (err, result) =>
    {     
        if(err){
            return next(err)
        }
        if(!result)
        {  
            return next(createError(400, "Error. Email or password are incorrect. Please try again."))

        }        
        
        return next()        
    })
}

const logInUser = (req, res, next) => 
{
    const token = jwt.sign({email:req.data.email, accessLevel:req.data.accessLevel}, process.env.JWT_PRIVATE_KEY, {algorithm:'HS256', expiresIn:process.env.JWT_EXPIRY})     
           
    res.json({name: req.data.name, accessLevel:req.data.accessLevel, token:token})
}

const createUser = (req, res, next) => 
{
    bcrypt.hash(req.params.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  
    {
        if(err)
        {
            return next(err)
        }
        usersModel.create({name:req.params.name,email:req.params.email,password:hash, accessLevel: process.env.ACCESS_LEVEL_NORMAL_USER}, (err, data) => 
        {
            if(err)
            {
                return next(err)
            }
            req.data = data
            return next()
        })
    })
}

const eliminateCollection = (req, res, next) =>
{
    usersModel.deleteMany({}, (error, data) =>{
        if(error){
            return next(error)
        }
        if(data){
            return next()
        }
    })
}

const createAdmin = (req, res, next) => {
    bcrypt.hash(process.env.ADMIN_PASSWORD.toString(), parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  
    {
        if(err){
            return next(err)
        }
        usersModel.create({name:"Administrator", email:"admin@admin.com", password:hash, accessLevel:parseInt(process.env.ACCESS_LEVEL_ADMIN)}, (error, createData) => 
        {
            if(error){
                return next(error)
            }
            if(createData)
            {
                res.json(createData)
            }else{
                return next(createError(500, "Error recreating the database."))
            }
        })
    })
}

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

const addToUserCart = (req, res, next) => 
{
    usersModel.findOneAndUpdate({email: req.decodedToken.email}, {$push: {"cart": req.params.productID}}, (error, data) => 
    {
        if(error){
            return next(createError(400, `Error adding to cart.`))
        }else{
            res.json(data)
        }
    })
}

const getCartProducts = (req, res, next) => 
{
    usersModel.find({email: req.decodedToken.email}, {cart: 1, _id: 0}, (error, data) => {
        if(error){
            return next(createError(400, `Error on getting items from the cart.`))
        }else{
            res.json(data)
        }
    })
}

const clearCart = (req, res, next) => {
    usersModel.findOneAndUpdate({email: req.decodedToken.email}, {$set: {"cart": []}}, (error, data) => 
    {
        if(error){
            return next(createError(400, `Error adding to cart.`))
        }else{
            res.json(data)
        }
    })
}


router.post(`/Users/register/:name/:email/:password`, checkUserNotExists, createUser, logInUser)

router.post(`/Users/login/:email/:password`, checkUserExists, checkLogIn, logInUser) 

router.post(`/Users/resetUsers`, eliminateCollection, createAdmin)

router.post(`/Users/logout`, (req,res) => {       
    res.json({})
})

router.get('/Users', (req, res) => 
{
    usersModel.find({}, (error, data) =>
    {
        if(!error){
            res.json(data)
        }
    })
})

router.put('/Users/addToCart/:productID', checkUserLogged, addToUserCart)

router.get('/Users/shopCart', checkUserLogged, getCartProducts)

router.put('/Users/clearCart', checkUserLogged, clearCart)
module.exports = router