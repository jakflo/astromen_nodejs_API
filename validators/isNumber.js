var AbstractValidator  = require('./abstractValidator.js');

class IsNumber extends AbstractValidator {
    constructor() {
        super();
        this.deafaultMessage = 'must be a number.';
    }
    
    validate(value) {
        if (isNaN(value)) {
            return this.getErrorMessage();
        }
        return '';
    }
}

module.exports = IsNumber;
