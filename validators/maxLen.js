var AbstractValidator  = require('./abstractValidator.js');

class MaxLenValidator extends AbstractValidator {
    constructor(maxLength) {
        super();
        this.deafaultMessage = 'cannot be longer than ' + maxLength + ' characters.';
        this.maxLength = maxLength;
    }
    
    validate(value) {
        if (value.length > this.maxLength) {
            return this.getErrorMessage();
        }
        return '';
    }    
}

module.exports = MaxLenValidator;
