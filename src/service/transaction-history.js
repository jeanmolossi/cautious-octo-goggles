const { db } = require("../fake-db")

module.exports = function transactionHistory() {
    db.connect()
    
    /** @type {Array<Transaction>} */
    const transactions = db.find()
    const rows = transactions.length
    
    const { income, outcome, balance } = transactions.reduce(
        (acc, transaction, i) => {
            if (transaction.type === 'income') {
                acc.income += transaction.value
                acc.balance += transaction.value
            } else {
                acc.outcome += transaction.value
                acc.balance -= transaction.value
            }
            
            return acc
        },
        { income: 0, outcome: 0, balance: 0 }
    )
    
    const data = transactions.map(transaction => {
        return {
            ...transaction,
            value: transaction.value.toBrl()
        }
    })
    
    return {
        data,
        metadata: {
            rows,
            income: income.toBrl(),
            outcome: outcome.toBrl(),
            balance: balance.toBrl(),
        }
    }
}

/**
 * @typedef Transaction
 * @property {string} id
 * @property {string} note
 * @property {'income' | 'outcome'} type
 * @property {number} value
 * @property {string} created_at
 */