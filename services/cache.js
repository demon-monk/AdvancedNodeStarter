const mongoose = require('mongoose')
const originExec = mongoose.Query.prototype.exec

mongoose.Query.prototype.exec = function () {
    console.log('to run a query')
    return originExec.apply(this, arguments)
}