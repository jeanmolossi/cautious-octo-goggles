const { getRawBody } = require('./body-parser')
const { testRoute, restore } = require('./helpers')

function Route(method, path, handler) {
    this.method = method
    this.path = path
    this.handler = handler
}

Route.prototype.handle = function handle(request, response, next) {
    var fn = this.handler
    
    if (fn.length > 3) {
        return next();
    }
    
    try {
        fn(request, response, next)
    } catch (error) {
        next(error)
    }
}

function Router() {
    this.methods = {};
    this.stack = []
}

Router.prototype.route = function (method, path, handler) {
    this.methods[method] = true;
    this.stack.push(new Route(method, path, handler))
}

Router.prototype.use = function use(fn) {
    this.route("GET", ".*", fn)
    this.route("POST", ".*", fn)
    this.route("DELETE", ".*", fn)
    return this
}

Router.prototype.init = function (app) {
    return function defineProto(request, response, next) {
        request.res = response;
        response.req = request;
        request.next = next;
        
        Object.setPrototypeOf(request, app.request)
        Object.setPrototypeOf(response, app.response)
        
        next()
    }
}

/**
 * Router handle
 * @param {http.IncomingMessage} request the request
 * @param {http.ServerResponse} response the server response
 */
Router.prototype.handle = function handle(request, response, out) {
    var self = this;
    
    var params = {}
    var stack = self.stack
    var done = restore(out, request)
    var index = 0;
    
    request.next = next
    
    const register = testRoute(request.url)
    
    next();
    
    async function next(err) {
        if (err) {
            setImmediate(done, err)
            return;
        }
            
        var match;
        var handle;
        var route;
        
        if (index >= stack.length) {
            setImmediate(done, null)
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
            handle.handle(request, response, next)
        } catch (err) {
            next(err)
        }
    }
    
}

module.exports = { Router }