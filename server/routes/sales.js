const router = require(`express`).Router()

const salesModel = require(`../models/sales`)
const skatesModel = require(`../models/skates`)

const jwt = require('jsonwebtoken')


const createNewSaleDocument = (req, res, next) => 
{          
    // Use the PayPal details to create a new sale document                
    let saleDetails = new Object()
           
    saleDetails.paypalPaymentID = req.params.paymentID
    saleDetails.productID = req.params.productID
    saleDetails.price = req.params.price
    saleDetails.customerName = req.params.customerName
    saleDetails.productName = req.params.productName
    saleDetails.date = req.params.date

    if(req.decodedToken){
        saleDetails.customerEmail = req.decodedToken.email
    }else{
        saleDetails.customerEmail = 'GUEST'
    }

    let pathArray = __dirname.split('\\')
    let path = pathArray.splice(-0, pathArray.length - 1).join('\\')
        
    skatesModel.findByIdAndRemove(req.params.productID, (error, data) => 
    {
        if(error){
            return next(createError(400, `Error on delete: ${error}`))
        }else{
            fs.unlink(`${path}\\uploads\\${data.photos[0].filename}`, (err) => {
                if(err)
                    return next(createError(400, `Error on image deleting.`))
                else
                    res.json(data)
            })
        }
    })
    
    salesModel.create(saleDetails, (err, data) => 
    {
        if(err)
        {
            return next(err)
        }                        
    })   
    
    return res.json({success: true})
}

const getUserLoggedIn = (req, res, next) => {
    jwt.verify(req.headers.authorization, process.env.JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) => {
        if (err) 
        { 
            req.decodedToken = null
            return next()
        }
        else 
        {
            req.decodedToken = decodedToken
            return next()
        }
    })
}

const getSales = (req, res, next) => {
    salesModel.find({customerEmail: req.decodedToken.email}, (error, data) => 
    {
        if(error){
            return next(createError(400, `User not found`))
        }
        else{
            res.json(data)
        }
    })
}


// Save a record of each Paypal payment
router.post('/sales/:paymentID/:productID/:price/:customerName/:productName/:date', getUserLoggedIn, createNewSaleDocument)

router.get('/sales', getUserLoggedIn, getSales)


module.exports = router