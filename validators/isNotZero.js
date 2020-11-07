var AbstractValidator  = require('./abstractValidator.js');

class IsNotZeroValidator extends AbstractValidator {
    constructor() {
        super();
        this.deafaultMessage = 'cannot be zero.';
    }
    
    validate(value) {
        if (value == 0) {
            return this.getErrorMessage();
        }        
        return '';
    }
}

module.exports = IsNotZeroValidator;
