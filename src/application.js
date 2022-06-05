const EventEmitter = require('events').EventEmitter
const http = require('http')
const { getRawBody } = require('./body-parser')
const { testRoute, mixin, restore } = require('./helpers')

function Route(method, path, handler) {
    this.method = method
    this.path = path
    this.handler = handler
}

function Router() {
    this.methods = {};
    this.stack = []
}

Router.prototype.route = function (method, path, handler) {
    this.methods[method] = true;
    this.stack.push(new Route(method, path, handler))
}

/**
 * Request parses
 * @param {http.IncomingMessage} request the request
 * @returns {boolean} Returns if parse is ok
 */
Router.prototype.parseRequest = function parseRequest(request) {
    var statusCode = 204
    
    if (!request.headers['accept'] || request.headers.accept !== 'application/json') {
        statusCode = 406 // No ac
    }
    
    if (!request.headers['content-type'] || request.headers['content-type'] !== 'application/json') {
        statusCode = 415
    }    
    if (statusCode === 204) {
        return true
    }
    
    request.statusCode = statusCode
    return false
}

/**
 * Router handle
 * @param {http.IncomingMessage} request the request
 * @param {http.ServerResponse} response the server response
 */
Router.prototype.handle = function handle(request, response, out) {
    var self = this;
    const register = testRoute(request.url)
    
    var params = {}
    var stack = self.stack
    var done = restore(out, request)
    
    request.next = next
    
    if(!this.parseRequest(request)) {
        try {
            throw new Error('request fails')
        }catch(err) {
            next(err)
        }
    }
    
    next();
    
    async function next(err) {
        if (err) {
            setImmediate(done, err)
            return;
        }
            
        var match;
        var index = 0;
        var handle;
        var route;
        
        if (index >= stack.length) {
            done()
            return;
        }
        
        while(match !== true && index < stack.length) {
            handle = stack[index++];
            
            const result = register(handle.path)
            match = result.match
            params = result.params
            route = handle.path
            
            if (typeof match !== 'boolean') {
                continue;
            }
            
            if (match !== true) {
                continue;
            }
            
            if (!route) {
                continue;
            }
            
            var method = request.method
            var has_method = self.methods[method];
            
            if (!has_method) {
                match = false
                continue;
            }
            
            if (method !== handle.method) {
                match = false
                continue;
            }
        }
        
        if (route) {
            request.route = route
            request.params = params
        }
        
        if (!match) {
            return response.writeHead(404).end()
        }
        
        /** @type {Buffer} */
        const rawBody = await getRawBody(request)
        
        if (rawBody.byteLength > 0) {
            try {
                const jsonBody = JSON.parse(rawBody)
                request.body = jsonBody
            } catch(err) {
                next(err)
            }
        }
        
        try {
            handle.handler(request, response, next)
        } catch (err) {
            next(err)
        }
    }
    
}

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
    
    mixin(app, EventEmitter.prototype)
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