const firebase = require('firebase');

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
    dataRef.update(value).then(() => {
        
    });
}

module.exports = DB;