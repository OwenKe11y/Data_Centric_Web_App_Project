
var bodyParser = require('body-parser');
var mysql = require('promise-mysql');



var pool

mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'geography'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error)
    })

var getCountries = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from country')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    
    })
}

var getCities = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from city')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    
    })
}

var addCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'INSERT INTO country VALUES (?, ?, ?)',
            values: [co_code, co_name, co_details]
        }
        
        pool.query(myQuery)
            .then((result) => {
                console.log(myQuery)
                resolve(result)
            })
           .catch((error)=>{
            console.log(myQuery)
               reject(error)
           })
           
    })
}

var deleteCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'DELETE from country WHERE co_code = ?',
            values: [co_code]
        }
        
        pool.query(myQuery)
            .then((result) => {
                console.log(myQuery)
                resolve(result)
            })
           .catch((error)=>{
            console.log(myQuery)
               reject(error)
           })
           
    })
}


var updateCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
       
        var myQuery = {
            sql: 'UPDATE country SET co_name = ?, co_details= ? WHERE co_code = ?',
            values: [co_name, co_details, co_code]
        }

        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
           .catch((error)=>{
               reject(error)
           })
           
    })
}

var getCountriesDetails = function (co_code) {
    return new Promise((resolve, reject) => {
        var my = {
            sql: 'SELECT * FROM country WHERE co_code = ?',
            values: [co_code]
        }
        pool.query(my)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    
    })
}


var getCitiesDetails = function (cty_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'SELECT ci.*, co.co_name FROM city ci inner join country co on co.co_code = ci.co_code WHERE cty_code = ?',
            values: [cty_code]
        }
        pool.query(myQuery)
            .then((result) => {
                console.log(result)
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    
    })
}

module.exports = { getCountries, getCities, addCountry, deleteCountry, updateCountry, getCountriesDetails, getCitiesDetails }


