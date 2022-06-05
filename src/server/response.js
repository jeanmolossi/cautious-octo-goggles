const http = require('http')

var response = Object.create(http.ServerResponse.prototype)

response.status = function status(code) {
    this.statusCode = code
    return this
}

response.json = function json(body) {
    const buffBody = !!body
        ? Buffer.from(JSON.stringify(body, null, 2))
        : Buffer.from([])
    
    this
        .writeHead(this.statusCode, {
            'Content-Type': 'application/json',
            'Content-Length': buffBody.byteLength
        })
        .end(buffBody.toString())
        
    return this
}

module.exports = response
