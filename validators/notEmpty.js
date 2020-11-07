var AbstractValidator  = require('./abstractValidator.js');

class NotEmpty extends AbstractValidator {
    constructor() {
        super();
        this.deafaultMessage = 'cannot be empty.';
    }
    
    validate(value) {
        if (value == '' || value === undefined) {
            return this.getErrorMessage();
        }
        return '';
    }    
}

module.exports = NotEmpty;
