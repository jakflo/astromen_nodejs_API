class ValidatorsMulti {
    constructor() {
        this.validatorsArr = [];
        this.namesArr = [];
        this.errors = [];
    }
    
    addValidatorsObj(name, validatorsObj) {
        this.validatorsArr[name] = validatorsObj;
        this.namesArr.push(name);
        return this;
    }
    
    validate(valueArr) {
        var valueName;
        var passed = true;
        for (valueName in this.validatorsArr) {
            let value = valueArr[valueName];            
            let err = this.validatorsArr[valueName].validate(value);
            if (err !== '') {
                this.errors.push({
                    name: valueName, 
                    error: err
                });
                passed = false;
            }
        }
        return passed;
    }
}

module.exports = ValidatorsMulti;
