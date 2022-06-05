/**
 * restore the called arguments
 * @returns {any} called arguments
 */
function restoreArgs() {
    var args = new Array(arguments.length)        
    
    for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i]
    }
    
    return args
}

module.exports = {
    /**
     * getRawBody
     * @param {http.IncommingMessage} request the server request
     * @returns {Promise<Buffer>}
     */
    getRawBody: async function getRawBody(request) {
        return new Promise((resolve) => {
            var buffer = []
            var complete = false;
            
            function done() {
                var args = restoreArgs.apply(this, arguments)
                
                complete = true;
                
                cleanup()
                
                if (args[0] !== null) {
                    resolve(args[0]);
                } else {
                    resolve(args[1]);
                }
            }
            
            function onData(chunk) {
                if (complete) return;
                
                buffer.push(chunk)
            }
            
            function onEnd(err) {
                if (complete) return;
                if (err) return done(err);
                
                var raw = Buffer.concat(buffer)
                done(null, raw)
            }
            
            function cleanup() {
                buffer = null
                
                request.removeListener('data', onData)
                request.removeListener('error', onEnd)
                request.removeListener('end', onEnd)
            }
            
            request.on('data', onData)
            request.on('error', onEnd)
            request.on('end', onEnd)
        })
    },
    
    restoreArgs
}