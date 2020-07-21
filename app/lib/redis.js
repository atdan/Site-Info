const redis = require('redis');
const util = require('util');
const apiResponse = require('../helpers/apiResponse')
// Configure Redis for caching
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

// const client = redis.createClient(process.env.REDISCLOUD_URL)
client.hget = util.promisify(client.hget)
client.on("error", function (error) {
    console.log("Redis Error: ", error)
    return {
        error: true,
        message: "Redis Error",
        details: error
    }
})
function clearHash(hashKey){
    console.log('Cleaning hash')
    try {
        console.log('Hashkey: ', this.hashKey)
        client.del(JSON.stringify(hashKey), function (error, response) {
            // console.log(client.del("BusinessCardPrices"))
            console.log(JSON.stringify(response))
            console.log(JSON.stringify(error))
            if (response == 1){
                console.log(response)
                console.log('cleaned cached')
                // console.log(client.del("BusinessCardPrices"))
                console.log('Deleted successfully')
            }else {
                console.log('Cannot delete')
                console.log(error)
            }
        })


    }catch (e) {
        console.log('failed to clear cache')
        console.log(e)
    }

}

module.exports = {
    client
}
