const { db } = require("../fake-db")

module.exports = function transactionHistory() {
    db.connect()
    
    return db.find()
}