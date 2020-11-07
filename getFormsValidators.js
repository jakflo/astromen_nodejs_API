var Validators = require('./validators/validators.js');
var ValidatorsMulti = require('./validators/validatorsMulti.js');
var NotEmptyValidator = require('./validators/notEmpty.js');
var MaxLenValidator = require('./validators/maxLen.js');
var IsPositiveIntValidator = require('./validators/isPositiveInt.js');
var CzDateValidator = require('./validators/czDate.js');

class GetFormsValidators {
    getIsExists(validatorsMulti = new ValidatorsMulti()) {
        var notEmpty = new NotEmptyValidator();
        var max20Validators = new Validators().addValidator(notEmpty).addValidator(new MaxLenValidator(20));
        var czDateValidator = new Validators().addValidator(notEmpty).addValidator(new CzDateValidator());
        validatorsMulti
                .addValidatorsObj('fname', max20Validators)
                .addValidatorsObj('lname', max20Validators)
                .addValidatorsObj('dob', czDateValidator)
        ;
        return validatorsMulti;        
    }
    
    getNew(validatorsMulti = new ValidatorsMulti()) {
        var notEmpty = new NotEmptyValidator();
        var max60Validators = new Validators().addValidator(notEmpty).addValidator(new MaxLenValidator(60));
        this.getIsExists(validatorsMulti);
        validatorsMulti.addValidatorsObj('skill', max60Validators);
        return validatorsMulti;        
    }
    
    getEdit(validatorsMulti = new ValidatorsMulti()) {
        this.getId(validatorsMulti);
        this.getNew(validatorsMulti);
        return validatorsMulti;
    }
    
    getId(validatorsMulti = new ValidatorsMulti()) {
        var notEmpty = new NotEmptyValidator();
        var isPositiveInt = new IsPositiveIntValidator();
        var idValidators = new Validators().addValidator(notEmpty).addValidator(isPositiveInt);
        validatorsMulti.addValidatorsObj('id', idValidators);
        return validatorsMulti;
    }
}

module.exports = GetFormsValidators;
