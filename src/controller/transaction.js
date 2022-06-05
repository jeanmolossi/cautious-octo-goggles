const http = require('http')
const { Transaction } = require('../models/transaction')

var transactionController = {}

/**
 * create transaction controller
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
transactionController.create = function create(request, response) {    
    const transaction = new Transaction(request.body)
    
    return response.status(201).json(transaction)
}

transactionController.remove = function remove(request, response) {
    const { params } = request
    
    if (!params.id) {
        return response
            .writeHead(400, { 'Content-Type': 'application/json' })
            .end(JSON.stringify({ error: 'id is not set' }))
    }
    
    return response
        .writeHead(204, { 'Content-Length': 0 })
        .end()
}

module.exports = { transactionController }