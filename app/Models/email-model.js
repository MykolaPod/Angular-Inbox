'use strict';

function EmailModel(subject, body, receivedDateTimeUtc,snippet) {
    this.subject = subject;
    this.body = body;
    this.receivedDateTimeISOString = new Date(receivedDateTimeUtc).toISOString();
    this.snippet = snippet;
};

EmailModel.prototype.compareTo  = function(that){
    if ( !that || !that.receivedDateTimeISOString || typeof (that.receivedDateTimeISOString) !== "string" ){
        throw new Error ("type of receivedDateTimeISOString should be string in ISO format");
    }
    return new Date(this.receivedDateTimeISOString) - new Date(that.receivedDateTimeISOString);
};

