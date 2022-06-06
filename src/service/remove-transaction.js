const { db } = require("../fake-db")

module.exports = function removeTransaction(transactionId) {
    db.connect()
    
    return db.delete({ id: transactionId })
}