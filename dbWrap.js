class DbWrap 
{
    #connectionClosedByError = false;
    #connectionClosedByCommand = false;
    #config;
    #lastError;
        
    constructor(config){        
        this.#config = config;        
        this.#connect();
    }
    
    #connect() 
    {
        var mysql = require('mysql');
        this.connection = mysql.createConnection(this.#config);
        this.#connectionClosedByError = false;
        this.#connectionClosedByCommand = false;
    }
    
    queryAll(sql, args)
    {
        return new Promise((resolve, reject)=> {
            if (this.#connectionClosedByError){
                return reject({
                    message: 'db allready closed by previous error', 
                    lastError: this.lastError
                });                
            }
            if (this.#connectionClosedByCommand) {
                this.#connect();
            }
            this.connection.query(sql, args, (err, rows )=> {
                if (err ){
                    this.#connectionClosedByError = true;
                    this.#lastError = err;
                    this.close();
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }
    
    async queryRow(sql, args)
    {
        var rows = await this.queryAll(sql, args);
        if (rows.length > 0) {
            row = rows[0];
        } else {
            row = [];
        }
        return row;
    }
    
    async queryColumn(sql, args, ColumnName)
    {
        var rows = await this.queryAll(sql, args);
        var result = [];
        var k;
        if (rows.length > 0) {
            for (k in rows) {
                if (rows[k][ColumnName] === undefined) {
                    return reject({message: 'unknown column name'});
                }
                result.push(rows[k][ColumnName]);
            }
        }
        return result;
    }
    
    async queryValue(sql, args, columnName)
    {
        var rows = await this.queryColumn(sql, args, columnName);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    }
    
    async getLastInsertID() 
    {
        return await this.queryValue('SELECT LAST_INSERT_ID() as id', [], 'id');
    }
    
    close()
    {
        this.#connectionClosedByCommand = true;
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