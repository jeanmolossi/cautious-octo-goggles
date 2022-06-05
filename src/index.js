const { createServer } = require('./server')

const server = createServer()
server.get('/ping', (req, res) => {
    return res.end(JSON.stringify({ message: 'Pong!' }))
})

server.post('/transaction', (req, res) => {
    return res.end(JSON.stringify(req.body || null))
})

server.delete('/transaction/:id', (req, res) => {
    return res.end(JSON.stringify({...req.params, 'what': 'happened'}))
})

server.get('/transactions', (req, res) => {
    return res.end(JSON.stringify({ transactions: 'ok' }))
})

const PORT = process.env.PORT || 8080

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))