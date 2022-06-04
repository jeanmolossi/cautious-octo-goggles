const http = require('http')

/**
 * Server Listener 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 * @returns {void}
 */
var serverListener = (request, response) => {    
    if (request.url === '/ping' && request.method === "GET") {
        const body = JSON.stringify({ message: `Pong!` })
        
        response.writeHead(200,
            {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            },
        )
        return response.end(body)
    }
    
    response.writeHead(404, { 'Content-Type': 'application/problem+json' })
    return response.end()
}

const server = http.createServer(serverListener)

const PORT = process.env.PORT || 8080

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))