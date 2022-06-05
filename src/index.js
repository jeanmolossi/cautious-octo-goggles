const { transactionController } = require('./controller/transaction')
const { createServer } = require('./server')

const server = createServer()
server.get('/ping', (req, res) => {
    return res.status(200).json({ message: 'Pong!' })
})

server.post('/transaction', transactionController.create)
server.delete('/transaction/:id', transactionController.remove)
server.get('/transactions', (req, res) => {
    return res.end(JSON.stringify({ transactions: 'ok' }))
})
const PORT = process.env.PORT || 8080

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))