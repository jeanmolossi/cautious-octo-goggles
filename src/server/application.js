const http = require('http')
const { Router } = require('./router')
const { mixin } = require('./helpers')

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

application.handle = function handle(request, response, callback) {
    this._router.handle(request, response, callback)
}

application.init = function () {
    var router = this._router;
    
    if (!router) {
        this._router = new Router()
    }
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
    
    mixin(app, application)
    
    Object.create(http.IncomingMessage, {
        app: { configurable: true, writable: true, enumerable: true, value: this }
    })
    
    Object.create(http.ServerResponse, {
        app: { configurable: true, writable: true, enumerable: true, value: this }
    })
    
    app.init()
    return app
}

module.exports = {
    application,
    createServer
}