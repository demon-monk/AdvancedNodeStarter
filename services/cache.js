const mongoose = require('mongoose')
const originExec = mongoose.Query.prototype.exec

mongoose.Query.prototype.exec = function () {
    console.log('to run a query')
    const redisKey = {...this.getQuery(), ...{collection: this.mongooseCollection.name}}
    console.log(redisKey)
    return originExec.apply(this, arguments)
}