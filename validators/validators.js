class Validators {
    constructor(valueName = '') {
        this.valueName = valueName;
        this.validators = [];
    }
    
    setValueName(valueName) {
        this.valueName = valueName;
        var k;
        for (k in this.validators) {
            this.validators[k].valueName = valueName;
        }
//        $.each(this.validators, function(k, v) {
//            v.valueName = valueName;
//        });
        return this;
    }
    
    addValidator(validatorObj) {
        if (this.valueName !== '') {
            validatorObj.valueName = this.valueName;
        }
        this.validators.push(validatorObj);
        return this;
    }
    
    validate(value) {
        var k;
        if (typeof value === 'string') {
            value = value.trim();
        }
        for (k in this.validators) {
            let validator = this.validators[k];
            let error = validator.validate(value);
            if (error !== '') {
                return error;
            }
        }
        return '';
    }
}

module.exports = Validators;
