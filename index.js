//imports for the database
var express = require('express');
var mySQLDAO = require('./mySQLDAO');
const mongoDAO = require('./mongoDAO');

//error validator 
const { body, validationResult, check } = require('express-validator');

//body parser import
var bodyParser = require('body-parser');

//app initialisation
var app = express();

//accessing body parser
app.use(bodyParser.urlencoded({ extended: false }))

//EJS file reader
app.set('view engine', 'ejs');

//Home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
})

//Countries Displayed (SQL)
app.get('/countries', (req, res) => {
    mySQLDAO.getCountries()
        .then((result) => {

            res.render('showCountries', { countries: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//Cities Displayed (SQL)
app.get('/cities', (req, res) => {
    mySQLDAO.getCities()
        .then((result) => {

            res.render('showCities', { cities: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//HeadsofState displayed (Mongo)
app.get('/headsOfState', (req, res) => {
    mongoDAO.getHeadsOfState()
        .then((documents) => {

            res.render('headsOfState', {documents: documents})
        })
        .catch((error) => {
            res.send(error)
        })
})

//Get request for AddCountry
app.get('/addCountry', (req, res) => {

    res.render("addCountry", {errors:undefined,
        co_code: "",
        co_name: "",
        co_details: ""})

})


//Post request for Add Country
app.post('/addCountry', 
[check('code').isLength({ min: 2 }).withMessage("Country Code must be 3 characters"),
check('name').isLength({ min: 2 }).withMessage("Country Name must be at least 3 characters"),
// error handling 

],
    (req, res) => {
        var errors = validationResult(req)//defining validator
        //Fail
        if (!errors.isEmpty()) {
            res.render("addCountry", {
                errors:errors.errors,
                co_code: req.body.code,
                co_name: req.body.name,
                co_details: req.body.details
            })
        }

        //Success
        else {
            console.log(req.body)
            //addCountry Function variable pass in
            mySQLDAO.addCountry(req.body.code, req.body.name, req.body.details)
            res.send("<h1>Country " + req.body.code + " has been added</h1> <a href='/countries'>Home</a>")


        }
    })



//Deletes an item from AddCountry
app.get('/deleteCountry/:country', (req, res) => {
    mySQLDAO.deleteCountry(req.params.country)
        .then((result) => {
            res.send("<h1> Country " + req.params.country + " has been deleted</h1><a href='/countries'>Home</a>")
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
        })

})

//Post method to update the country in addCountry
app.post('/updateCountry', 
[check('code').isLength({ min: 2 }).withMessage("Country Code must be 3 characters"),
check('name').isLength({ min: 2 }).withMessage("Country Name must be at least 3 characters"),
//error handling
],
  (req, res) => {
    var errors = validationResult(req)//defining validator
    
    //Fail
    if (!errors.isEmpty()) {
        res.render("updateCountry", {
            errors:errors.errors,
            co_code: req.body.code,
            co_name: req.body.name,
            co_details: req.body.details
        })
    }

    //Success
    else {
        console.log(req.body)
        //updateCountry Function variable pass in
        mySQLDAO.updateCountry(req.body.code, req.body.name, req.body.details)
        res.send("<h1>Country " + req.body.code + " has been Updated</h1> <a href='/countries'>Home</a>")


    }
})

//Get method to update the country
app.get('/updateCountry/:country', (req, res) => {
    mySQLDAO.getCountriesDetails(req.params.country)
        .then((result) => {

            res.render("updateCountry", {errors:undefined,
                //result[] is used because it takes the first object in the returned array in getCountryDetails()
                co_code: result[0].co_code,
                co_name: result[0].co_name,
                co_details: result[0].co_details
            })
        })
        .catch((error) => {
            console.log(error)
            res.send(error)

        })
})


//Get method to update the country
app.get('/allDetailsCities/:city', (req, res) => {
    mySQLDAO.getCitiesDetails(req.params.city, req.params.country)
        .then((result) => {

            res.render("allDetailsCities", {
                //result[] is used because it takes the first object in the returned array in getCitiesDetails()
                cty_code: result[0].cty_code,
                cty_name: result[0].cty_name,
                population: result[0].population,
                is_Coastal: result[0].isCoastal,
                areaKM: result[0].areaKM,
                co_code: result[0].co_code,
                co_name: result[0].co_name
            })
        })
        .catch((error) => {
            console.log(error)
            res.send(error)

        })
})

//Get request for AddCountry
app.get('/addHeadOfState', (req, res) => {
    
    res.render("addHeadOfState", {errors:undefined,
        _id: "",
        headOfState: "",
    })
       
})

app.post('/addHeadOfState', 
[check('_id').isLength({ min: 2 }).withMessage("Country Code must be 3 characters"),
check('headOfState').isLength({ min: 3 }).withMessage("Head Of State must be at least 3 characters"),
//error handling
],
  (req, res) => {
    var errors = validationResult(req)//defining validator
    
    //Fail
    if (!errors.isEmpty()) {
        res.render("addHeadOfState", {
            errors:errors.errors,
            _id: req.body._id,
            headOfState: req.body.headOfState
        })
    }

    //Success
    else {
        console.log(req.body)
        //updateCountry Function variable pass in
        mongoDAO.addHeadOfState(req.body._id, req.body.headOfState)
        res.send("<h1>Head Of State " + req.body.headOfState + " has been Added</h1> <a href='/headsOfState'>Home</a>")


    }
})

//listening on port 3000
app.listen(3000, () => {
    console.log("Listening on port 3000")
})
