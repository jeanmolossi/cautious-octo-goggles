const { transactionController } = require('./controller/transaction')
const { createServer } = require('./server')

const server = createServer()
server.get('/ping', (_, res) => {
    return res.json({ message: 'Pong!' })
})

server.post('/transaction', transactionController.create)
server.delete('/transaction/:id', transactionController.remove)
server.get('/transactions', transactionController.history)
const PORT = process.env.PORT || 8080

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))