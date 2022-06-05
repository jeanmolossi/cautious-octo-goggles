var db = {}

db.connect = function() {
    this.base = []
}

db.find = function({ where }) {
    if (!where) {
        return this.base
    }
    
    const key = Object.keys(where)?.[0]
    const value = Object.values(where)?.[0]
    
    return this.base.find((item) => item[key] === value)
}

db.insert = function(item) {
    this.base.push(item)
}

db.delete = function ({ where }) {
    if (!where) {
        return this.base = []
    }
    
    const key = Object.keys(where)?.[0]
    const value = Object.values(where)?.[0]
    
    let deleted = false;
    this.base = this.base.filter(item => {
        if (item[key] === value) {
            deleted = true;
        }
        
        return item[key] !== value
    })
    
    return deleted
}

module.exports = { db }