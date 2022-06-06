const { db } = require('../fake-db');

module.exports = function createTransaction(transaction) {
    db.connect()
    
    db.insert(transaction)
    
    return transaction
}