const http = require('http')
const { Transaction } = require('../models/transaction')
const createTransaction = require('../service/create-transaction')
const removeTransaction = require('../service/remove-transaction')
const transactionHistory = require('../service/transaction-history')

var transactionController = {}

/**
 * create transaction controller
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
transactionController.create = function create(request, response) {    
    const transaction = new Transaction(request.body)    
    const savedTransaction = createTransaction(transaction)
    
    return response.status(201).json(savedTransaction)
}

transactionController.remove = function remove(request, response) {
    const { params } = request
    
    if (!params.id) {
        return response
            .status(400)
            .json({ error: 'id is not set' })
    }
    
    const deleted = removeTransaction(params.id)
    if (deleted)
        return response.status(204).json()
    
    return response.status(404).json({ error: 'transaction not found' })
}

transactionController.history = function history(request, response) {
    const transactions = transactionHistory()
    
    if (transactions.metadata.rows === 0) {
        return response.status(204).json()
    }
    
    return response.json(transactions)
}

module.exports = { transactionController }