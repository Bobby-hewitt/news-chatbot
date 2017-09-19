const firebase = require('firebase');


// Object oriented database functions
var DB = function(options){
    this.database = firebase.database();
    this.fbId = options.fbId;
}

DB.prototype.getData = function(key){
    const self = this;
    return new Promise((resolve, reject) => {
        const dataRef = self.database.ref( self.fbId + "/" + key);
        dataRef.once('value', (snapshot) => {
            resolve(snapshot.val());
        });
    });
}

DB.prototype.setData = function(key, value){
    const dataRef = this.database.ref( this.fbId + "/" + key);
    dataRef.set(value).then(() => {
        
    });
}

module.exports = DB;