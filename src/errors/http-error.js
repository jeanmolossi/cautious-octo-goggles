const { mixin } = require('../server/helpers')

module.exports = function HttpError() {
    var err = new Error(arguments[0])
    
    mixin(this, err)
    
    this.code = arguments[1]
    
    return this
}