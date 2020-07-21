/**
 *  Created by Atuma Daniel on 19/07/2020.
 */
require("dotenv").config();
var express = require("express")
var apiResponse = require("./helpers/apiResponse");
var cors = require('cors')
let apiRouter = require('./routes/router')
let app = express();
//To allow cross-origin requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", apiRouter)


// throw 404 if URL not found
app.all("*", function(req, res) {
    return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
    if(err.name === "UnauthorizedError"){
        return apiResponse.unauthorizedResponse(res, err.message);
    }

});

module.exports = {app}
