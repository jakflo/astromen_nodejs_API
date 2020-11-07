var AbstractValidator  = require('./abstractValidator.js');
var DateTools = require('../utils/dateTools.js');

class CzDateValidator extends AbstractValidator {
    constructor() {
        super();
        this.deafaultMessage = 'is not a valid date.';
    }
    
    validate(value) {
        var dateTools = new DateTools();
        if (!dateTools.checkCzDate(value)) {
            return this.getErrorMessage();
        }
        return '';
    }
}

module.exports = CzDateValidator;
