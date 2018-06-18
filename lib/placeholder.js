'use strict'

class Placeholder {

    constructor (format, args) {
        this.format = format;
        this.args = args;
    }

    output () {
        return {
            format: this.format,
            args: this.args
        };
    }

}

module.exports = Placeholder;