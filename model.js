var DateTools = require('./utils/dateTools');

class Model 
{
    #dobo;
    
    constructor(dbWrap) 
    {
        this.#dobo = dbWrap;
    }
    
    async getAll() 
    {
        var rows = await this.#dobo.queryAll("SELECT * FROM astro_tab");
        var k;
        var dateTools = new DateTools();
        for (k in rows) {
            rows[k].DOB = dateTools.dateObjToCz(rows[k].DOB);
        }
        await this.#dobo.close();
        return rows;
    }
    
    async isExists(params, closeConnection = true)
    {
        var dateTools = new DateTools();
        var sql = "select count(*) as n from astro_tab where f_name=? and l_name=? and DOB=?";
        var sqlParms = [params.fname, params.lname, dateTools.czDateToEn(params.dob)];
        if (params.id !== undefined && params.id !== '') {
            sql += " and id!=?";
            sqlParms.push(params.id);
        }
        var row = await this.#dobo.queryValue(sql, sqlParms, 'n');
        if (closeConnection) {
            await this.#dobo.close();
        }
        return row > 0;
    }
    
    async addNew(params)
    {
        var dateTools = new DateTools();
        var exists = await this.isExists(params, false);
        if (exists) {
            this.#dobo.close();
            throw 'allready exists';
        }

        await this.#dobo.queryAll("insert into astro_tab(f_name, l_name, DOB, skill) values(?, ?, ?, ?)", [
            params.fname,
            params.lname,
            dateTools.czDateToEn(params.dob),
            params.skill
        ]);

        var id = await this.#dobo.getLastInsertID();
        await this.#dobo.close();
        if (isNaN(id)) {
            throw 'insertion failed';
        }
        
        return id;
    }
    
    async modify(params)
    {
        var dateTools = new DateTools();
        var nameExists = await this.isExists(params, false);
        if (nameExists) {
            this.#dobo.close();
            throw 'allready exists';
        }

        var idExists = await this.#dobo.queryValue(
                "select count(*) as n from astro_tab where id=?",
                [params.id],
                'n'
        );
        if (idExists === 0) {
            this.#dobo.close();
            throw 'id not found';
        }

        await this.#dobo.queryAll("update astro_tab set f_name=?, l_name=?, DOB=?, skill=? where id=?", [
            params.fname,
            params.lname,
            dateTools.czDateToEn(params.dob),
            params.skill,
            params.id
        ]);

        await this.#dobo.close();
    }
    
    async del(params)
    {
        var idExists = await this.#dobo.queryValue(
            "select count(*) as n from astro_tab where id=?",
            [params.id],
            'n'
        );
        if (idExists === 0) {
            this.#dobo.close();
            throw 'id not found';
        }

        await this.#dobo.queryAll("delete from astro_tab where id=?", [params.id]);
        await this.#dobo.close();
    }
}

module.exports = Model;
