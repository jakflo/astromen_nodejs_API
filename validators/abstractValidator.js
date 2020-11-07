class AbstractValidator {
    constructor() {
        this.valueName = '';
        this.customMessageUsed = false;
    }    
    
    getErrorMessage() {
        if (this.customMessageUsed) {
            return this.deafaultMessage; 
        }
        if (this.valueName === '') {
            var valueName = 'Value';
        }
        else {
            var valueName = this.valueName;
        }
        return valueName + ' ' + this.deafaultMessage;
    }
    
    setCustomMessage(message) {
        this.deafaultMessage = message;
        this.customMessageUsed = true;
        return this;
    }
}

module.exports = AbstractValidator;
