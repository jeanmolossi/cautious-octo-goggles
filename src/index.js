const http = require('http')

/**
 * Server Listener 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 * @returns {void}
 */
var serverListener = (request, response) => {    
    response.writeHead(200, { 'Content-Type': 'application/json' })
    return response.end(JSON.stringify({ message: 'Hello World' }))
}

const server = http.createServer(serverListener)

const PORT = process.env.PORT || 8080

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))