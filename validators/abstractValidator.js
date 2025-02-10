class AbstractValidator {
    _customMessageUsed = false;
    
    constructor() {
        this.valueName = '';
    }    
    
    getErrorMessage() {
        if (this._customMessageUsed) {
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
        this._customMessageUsed = true;
        return this;
    }
}

module.exports = AbstractValidator;
