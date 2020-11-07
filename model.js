var DateTools = require('./utils/dateTools');

class Model {
    constructor(dbWrap) {
        this.dobo = dbWrap;
    }
    
    getAll() {
        return new Promise((resolve, reject) => {
            var result;
            this.dobo.queryAll("SELECT * FROM astro_tab")
                .then((rows) => {
                    result = rows;
                    var k;
                    var dateTools = new DateTools();
                    for (k in result) {
                        result[k].DOB = dateTools.dateObjToCz(result[k].DOB);
                    }        
                    return this.dobo.close();        
                })
                .then(() => {
                    resolve(result);                        
                })
                .catch((err) => {
                    return reject(err);                        
                });
            });
    }
    
    isExists(params, closeConnection = true) {
        return new Promise((resolve, reject) => {
            var dateTools = new DateTools();
            var sql = "select count(*) as n from astro_tab where f_name=? and l_name=? and DOB=?";
            var sqlParms = [params.fname, params.lname, dateTools.czDateToEn(params.dob)];
            if (params.id !== undefined && params.id !== '') {
                sql += " and id!=?";
                sqlParms.push(params.id);
            }
            this.dobo.queryValue(sql, sqlParms, 'n')
                    .then((row) => {
                        if (closeConnection) {
                            this.dobo.close();
                        }
                        resolve(row > 0);
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
    }
    
    addNew(params) {
        return new Promise((resolve, reject) => {
            var dateTools = new DateTools();
            this.isExists(params, false)
                .then((exists) => {
                    if (exists) {
                        this.dobo.close();
                        throw 'allready exists';  
                    }
                })
                .then(() => {
                    return this.dobo.queryAll("insert into astro_tab(f_name, l_name, DOB, skill) values(?, ?, ?, ?)", [
                            params.fname,
                            params.lname,
                            dateTools.czDateToEn(params.dob),
                            params.skill
                    ]);
                })
                .then(() => {
                    return this.dobo.getLastInsertID();
                })
                .then((id) => {
                    this.dobo.close();
                    if (isNaN(id)) {
                        throw 'insertion failed';
                    }
                    resolve(id);                    
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }
    
    modify(params) {
        return new Promise((resolve, reject) => {
            var dateTools = new DateTools();
            this.isExists(params, false)
                .then((exists) => {
                    if (exists) {
                        this.dobo.close();
                        throw 'allready exists';   
                    }
                })
                .then(() => {
                    return this.dobo.queryValue(
                        "select count(*) as n from astro_tab where id=?", 
                        [params.id], 
                        'n'
                    );
                })
                .then((n) => {
                    if (n === 0) {
                        this.dobo.close();
                        throw 'id not found';                       
                    }
                    else {
                        return this.dobo.queryAll("update astro_tab set f_name=?, l_name=?, DOB=?, skill=? where id=?", [
                            params.fname,
                            params.lname,
                            dateTools.czDateToEn(params.dob),
                            params.skill, 
                            params.id
                        ]);
                    }
                })
                .then(() => {
                    this.dobo.close();
                    resolve();            
                })                        
                .catch((err) => {
                    return reject(err);
                });
        });
    }
    
    del(params) {
        return new Promise((resolve, reject) => {
            this.dobo.queryValue(
                        "select count(*) as n from astro_tab where id=?", 
                        [params.id], 
                        'n'
                    )
                .then((n) => {
                    if (n === 0) {
                        this.dobo.close();
                        throw 'id not found';
                    }
                })
                .then(() => {
                    return this.dobo.queryAll("delete from astro_tab where id=?", [params.id]);
                })
                .then(() => {
                    return this.dobo.close();                    
                })
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }
}

module.exports = Model;
