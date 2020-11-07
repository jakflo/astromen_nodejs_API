class DateTools {
    checkCzDate(value) {
        try {
            return this.checkParsedDate(this.parseCzDate(value));
        }
        catch(err) {
            return false;
        }        
    }
    
    checkEnDate(value) {
        try {
            return this.checkParsedDate(this.parseEnDate(value));
        }
        catch(err) {
            return false;
        }        
    }
    
    parseCzDate(value) {
        var dateArr = value.split('.');
        if (dateArr.length !== 3) {
            throw 'not valid date';
        }
        var k;
        for (k in dateArr) {
            if (isNaN(dateArr[k])) {
                throw 'not valid date';
            }
        }
        var dd = parseInt(dateArr[0]);
        var mm  = parseInt(dateArr[1]) - 1;
        var yyyy = parseInt(dateArr[2]);
        return {
            day: dd, 
            mounth: mm, 
            year: yyyy,
            obj: new Date(yyyy, mm, dd)
        };
    }
    
    parseEnDate(value) {
        if (value.indexOf('T') !== -1) {
            var valueTmp = value.split('T');
            value = valueTmp[0];
        }
        var dateArr = value.split('-');
        if (dateArr.length !== 3) {
            throw 'not valid date';
        }
        var k;
        for (k in dateArr) {
            if (isNaN(dateArr[k])) {
                throw 'not valid date';
            }
        }
        var dd = parseInt(dateArr[2]);
        var mm  = parseInt(dateArr[1]) - 1;
        var yyyy = parseInt(dateArr[0]);
        return {
            day: dd, 
            mounth: mm, 
            year: yyyy,
            obj: new Date(yyyy, mm, dd)
        };
    }
    
    czDateToEn(value) {
        if (!this.checkCzDate(value)) {
            throw 'not valid date';
        }
        var parsed = this.parseCzDate(value);
        return parsed.year + '-' + (parsed.mounth + 1) + '-' + parsed.day;
    }
    
    enDateToCz(value) {
        if (!this.checkEnDate(value)) {
            throw 'not valid date';
        }
        var parsed = this.parseEnDate(value);
        return parsed.day + '.' + (parsed.mounth + 1) + '.' + parsed.year;
    }
    
    dateObjToCz(dateObj) {
        return dateObj.getDate() + '.' + (dateObj.getMonth() + 1) + '.' + dateObj.getFullYear();
    }
    
    checkParsedDate(parsedDate) {
        if (parsedDate.obj.getFullYear() !== parsedDate.year 
                || parsedDate.obj.getMonth() !== parsedDate.mounth
                || parsedDate.obj.getDate() !== parsedDate.day) {
            return false;
        }
        return true;
    }
    
}

module.exports = DateTools;
