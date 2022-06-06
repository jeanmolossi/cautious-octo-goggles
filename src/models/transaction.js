const { randomUUID } = require('crypto')
const HttpError = require('../errors/http-error')

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
    
    return;
}

function Transaction({ id = randomUUID(), note, type = 'outcome', value }) {
    if (!isTypeValid(type)) {
        throw new HttpError('validation error: type must be income or outcome', 400)
    }
    
    validateValue(value)
    
    if (!note || note.trim().length === 0) {
        throw new HttpError('required field: note field must have a value', 400)
    }
    
    this.id = id;
    this.note = note.trim();
    this.type = type;
    this.value = +value;
    this.created_at = new Date().toISOString();
}

module.exports = { Transaction }