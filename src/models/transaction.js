const { randomUUID } = require('crypto')
const { mixin } = require('../server/helpers')

function HttpError() {
    var err = new Error(arguments[0])
    
    mixin(this, err)
    
    this.code = arguments[1]
    
    return this
}

function isTypeValid(type) {
    return type === 'income' || type === 'outcome'
}

function validateValue(value) {
    if (!Number.isInteger(+value)) {
        throw new HttpError('value must be an integer', 400)
    }
    
    if (!Number.isSafeInteger(+value)) {
        throw new HttpError('value must be an safe integer', 400)
    }
    
    if (Number.isNaN(+value)) {
        throw new HttpError('value must be a number', 400)
    }
    
    return true;
}

function Transaction({ id = randomUUID(), note, type = 'outcome', value }) {
    if (!isTypeValid(type)) {
        throw new HttpError('validation error: type must be income or outcome', 400)
    }
    
    validateValue(value)
    
    this.id = id;
    this.note = note;
    this.type = type;
    this.value = +value;
    this.created_at = new Date().toISOString();
}

module.exports = { Transaction }