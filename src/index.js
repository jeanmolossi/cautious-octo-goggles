const http = require('http')
const { createServer } = require('./application')
// const { testRoute, tick } = require('./helpers')
/**
 * Server Listener 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 * @returns {void}
 */
// var serverListener = (request, response) => {
//     const endAt = tick();
//     const register = testRoute(request.url);
    
//     const { match: isPing } = register('/ping')
//     if (isPing && request.method === "GET") {
//         const body = JSON.stringify({ message: `Pong!` })
        
//         response.writeHead(200,
//             {
//                 'Content-Type': 'application/json',
//                 'Content-Length': Buffer.byteLength(body),
//                 'Time-spent': endAt()
//             },
//         )
//         return response.end(body)
//     }
    
//     const {
//         match: transaction,
//         params: { id }
//     } = register('/transaction/:id')
    
//     if (transaction && request.method === "POST") {
//         const body = JSON.stringify({ message: `${request.method}` })
        
//         response.writeHead(200,
//             {
//                 'Content-Type': 'application/json',
//                 'Content-Length': Buffer.byteLength(body),
//                 'Time-spent': endAt()
//             },
//         )
//         return response.end(body)
//     }
    
//     if (transaction && request.method === "DELETE") {
//         const body = JSON.stringify({ message: `Deleting transaction with id ${id}` })
        
//         response.writeHead(200,
//             {
//                 'Content-Type': 'application/json',
//                 'Content-Length': Buffer.byteLength(body),
//                 'Time-spent': endAt()
//             },
//         )
//         return response.end(body)
//     }
    
//     response.writeHead(404, { 'Content-Type': 'application/problem+json' })
//     return response.end()
// }

// const server = http.createServer(serverListener)

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