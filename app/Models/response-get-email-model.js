'use strict';

function GetEmailsResponseModel(nextPageToken, emails) {
    this.nextPageToken = nextPageToken;
    this.emails = emails;
    this.emailsCount = function () { return this.emails.length; };
};

GetEmailsResponseModel.prototype.addEmail = function (email) {
    var self = this;
    if (!self.emails) {
        self.emails = [];
    }
    self.emails.push(email);
};

GetEmailsResponseModel.prototype.setNextPageToken = function (nextPageToken) {
    var self = this;
    self.nextPageToken = nextPageToken;
};

GetEmailsResponseModel.prototype.getNextPageToken = function () {
    var self = this;
    return self.nextPageToken;
};

GetEmailsResponseModel.prototype.sort = function (order) {
    var self = this;
    if (!order || typeof (order) !== "string") {
        throw new Error("order should be string 'asc' or 'desc'");
    }
    switch (order.toLowerCase()) {
        case 'asc':
            self.emails.sort(function (a, b) {
                return a.compareTo(b);
            });
            break;
        case 'desc':
        default:
            self.emails.sort(function (a, b) {
                return b.compareTo(a);
            });
            break;
    }
};

GetEmailsResponseModel.prototype.sortDesc = function () {
    var self = this;
    self.sort('desc');
};

