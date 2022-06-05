module.exports = {
    /**
     * testRoute
     * @param {string} url is the request url
     * @returns {registerRoute}
     */
    testRoute: function testRoute (url) {
        return (route) => {
            /** @type {string[]} */
            const parts = route.replace(/^\/{1}/, '').split('/')
            
            /** @type {RegExp} matchRoute */
            let matchRoute = "";
            /** @type {object} params found in the url */
            let params = {};
        
            parts.forEach((part) => {
                if (!part.startsWith(':')) {
                    matchRoute += `/${part}`
                } else {
                    const paramName = part.replace(':', '')
                    matchRoute += `(/(?<${paramName}>[\\w-]*))?`
                    Object.assign(params, { [paramName]: null })
                }
            })
            
            const result = url.match(matchRoute)
            
            return {
                match: result?.at(0) === url,
                params: result?.groups || params
            }
        }
    },
    
    /**
     * tick is an function with register started at time
     * and returns an callback to calc time spent in milliseconds
     * @returns {timeSpentCallback} calc time spent until start in milliseconds
     */
    tick() {
        const startedAt = Date.now();
        
        return () => `${Date.now() - startedAt}ms`;
    },
    
    /**
     * mixin merge the source descriptors properties on destin
     * @param {object} dest the descriptors destin
     * @param {object} src the descritors source
     * @returns {object} dest
     */
    mixin: function mixin(dest, src) {
        var hasOwnProperty = Object.prototype.hasOwnProperty
        Object.getOwnPropertyNames(src).forEach(function eachOwnProperty(name) {
            if (hasOwnProperty.call(dest, name)) {
                return;
            }
            
            const descriptor = Object.getOwnPropertyDescriptor(src, name)
            Object.defineProperty(dest, name, descriptor)
        })
        return dest
    },
    
    restore: function restore(fn, obj) {
        var props = new Array(arguments.length - 2);
        var vals = new Array(arguments.length - 2);
        
        for (let i = 0; i < props.length; i++) {
            props[i] = arguments[i+2]
            vals[i] = obj[props[i]];
        }
        
        return function () {
            for(var i = 0; i < props.length; i++) {
                obj[props[i]] = vals[i]
            }
            
            return fn.apply(this, arguments)
        }
    }
}

/**
 * @typedef matchObjectWithParams
 * @property {boolean} match returns if the current url matches with this route
 * @property {object} params this is the route params
 */

/**
 * @callback registerRoute
 * @param {string} route the route to be tested
 * @returns {matchObjectWithParams}
 */

/**
 * @callback timeSpentCallback calc time spent until start in milliseconds
 * @returns {string}
 */