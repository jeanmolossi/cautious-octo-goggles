const http = require('http')
const EventEmitter = require('events').EventEmitter
const { Router } = require('./router')
const { mixin } = require('./helpers')
const response = require('./response')

var application = {}

application.get = function (path, handler) {
    this._router.route('GET', path, handler)
}

application.post = function (path, handler) {
    this._router.route('POST', path, handler)
}

application.delete = function (path, handler) {
    this._router.route('DELETE', path, handler)
}

/**
 * error handler
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 * @returns {callback}
 */
function errHandler(request, response) {
    return function (err) {
        if (err) {
            error = err.message
            stack = err.stack;
            code = err.code || err.statusCode || 500
            
            console.error(stack)
            
            return response
                .writeHead(code)
                .end(JSON.stringify({ error }, null, 4))
        }
        
        request.resume()
    }
}

application.handle = function handle(request, response, callback) {
    var router = this._router
    var done = callback || errHandler(request, response)
    
    if (!router) {
        done();
        return;
    }
    
    router.handle(request, response, done)
}

application.init = function () {
    var router = this._router;
    
    if (!router) {
        this._router = new Router()
    }
    
    this._router.use(this._router.init(this))
}

application.listen = function () {
    const server = http.createServer(this)
    return server.listen.apply(server, arguments)
}

/**
 * Create Server
 * @returns {typeof application}
 */
function createServer() {
    var app = function(request, response, next) {
        app.handle(request, response, next);
    }
    
    mixin(app, EventEmitter.prototype)
    mixin(app, application)
    
    app.request = Object.create(http.IncomingMessage.prototype, {
        app: { configurable: true, writable: true, enumerable: true, value: app }
    })
    
    app.response = Object.create(response, {
        app: { configurable: true, writable: true, enumerable: true, value: app }
    })
    
    app.init()
    return app
}

module.exports = {
    application,
    createServer
}