class DbWrap {
    constructor(config){        
        this.config = config;        
        this.connect();
        this.lastError;
    }
    connect() {
        var mysql = require('mysql');
        this.connection = mysql.createConnection(this.config);
        this.connectionClosedByError = false;
        this.connectionClosedByCommand = false;
    }
    
    queryAll(sql, args){
        return new Promise((resolve, reject)=> {
            if (this.onnectionClosedByError){
                return reject({
                    message: 'db allready closed by previous error', 
                    lastError: this.lastError
                });                
            }
            if (this.connectionClosedByCommand) {
                this.connect();
            }
            this.connection.query(sql, args, (err, rows )=> {
                if (err ){
                    this.connectionClosedByError = true;
                    this.lastError = err;
                    this.close();
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }
    
    queryRow(sql, args) {
        return new Promise((resolve, reject) => {
            this.queryAll(sql, args)
                .then((rows) => {
                    if (rows.length > 0) {
                        rows = rows[0];
                    }
                    else {
                        rows = [];
                    }
                    resolve(rows);
                })
                .catch((err) => {
                    return reject(err);
                });                
        });        
    }
    
    queryColumn(sql, args, ColumnName) {
        return new Promise((resolve, reject) => {
            this.queryAll(sql, args)
                .then((rows) => {
                    var result = []; var k;
                    if (rows.length > 0) {
                        for (k in rows) {
                            if (rows[k][ColumnName] === undefined) {
                                return reject({message: 'unknown column name'});
                            }
                            result.push(rows[k][ColumnName]);
                        }
                    }            
                    resolve(result);
                })
                .catch((err) => {
                    return reject(err);
                });                
        });        
    }
    
    queryValue(sql, args, ColumnName) {
        return new Promise((resolve, reject) => {
            this.queryColumn(sql, args, ColumnName)
                .then((rows) => {
                    if (rows.length > 0) {
                        resolve(rows[0]);
                    }                
                })
                .catch((err) => {
                    return reject(err);
                });
        });        
    }
    
    getLastInsertID() {
        return new Promise((resolve, reject) => {
            this.queryValue('SELECT LAST_INSERT_ID() as id', [], 'id')
                .then((rows) => {                
                    resolve(rows);
                })
                .catch((err) => {
                    return reject(err);
                });                
        }); 
    }
    
    close(){
        this.connectionClosedByCommand = true;
        return new Promise((resolve, reject )=> {
            this.connection.end(err => {
                if (err )
                    return reject(err );
                resolve();
            } );
        } );
    }
}

module.exports = DbWrap;