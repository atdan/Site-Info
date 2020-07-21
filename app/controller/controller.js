const apiResponse = require("../helpers/apiResponse")
const {client} = require('../lib/redis')
const { getMetadata , metadataRuleSets} = require('page-metadata-parser');
const domino = require('domino');
const fetch = require("node-fetch");
const URL = require('url')

exports.getInfo = [
    async (req, res) => {
        let url = req.query.url;

        console.log("Type of URL: ", typeof (url))
        if (!url){
            return apiResponse.incompleteParametersError(res, "Url is missing")
        }
        const key = url
        const cacheValue = await client.hget("Web", key);
        if (cacheValue){
            console.log("Got data from cache")
            const doc = JSON.parse(cacheValue);
            return apiResponse.successResponseWithData(res, "Gotten data", doc)
        }

        console.log("URL: ", url)

        try {
            if (url.startsWith("http://") || url.startsWith("https://")){

                console.log("Type 2", typeof (url))
                const response = await fetch(url);
                const html = await response.text();
                const doc = domino.createWindow(html).document;
                const title = getMetadata(doc, url, {title: metadataRuleSets.title});
                const description = getMetadata(doc, url, {description: metadataRuleSets.description})
                const image = getMetadata(doc, url, {image: metadataRuleSets.image})
                const data = {
                    title: title.title,
                    description: description.description,
                    image: image.image
                }
                client.hset("Web", key, JSON.stringify(data))

                console.log("Not from cache")
                return apiResponse.successResponseWithData(res, "Gotten data", data)
            }else {
                // const urlParse = URL.parse("https://" +url)
                // console.log("Type of URL before parse: ",typeof (url))
                console.log("URL 2 ", url)


                url = `https://${url}`

                const response = await fetch(url);

                const html = await response.text();

                const doc = domino.createWindow(html).document;
                const title =  getMetadata(doc, url, {title: metadataRuleSets.title});
                const description = getMetadata(doc, url, {description: metadataRuleSets.description});
                const image = getMetadata(doc, url, {image: metadataRuleSets.image});
                const data = {
                    title: title.title,
                    description: description.description,
                    image: image.image
                }
                client.hset("Web", key, JSON.stringify(data))
                console.log("Not from cache")
                return apiResponse.successResponseWithData(res, "Gotten data", data)

                // return apiResponse.ErrorResponse(res, "Please parse a valid URL starting with http:// or https://")
            }

        }catch (e) {
            console.log("Error: ", e)
            return apiResponse.ErrorResponse(res, e)
        }



    }
]
