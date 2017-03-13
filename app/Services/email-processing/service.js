'use strict';

function EmailProcessingService($q) {
    this._getQ = function () { return $q; };
};

EmailProcessingService.prototype.GetEmails = function (googleApi, nextPageToken, itemsPerPage) {
    var self = this;
    var deferred = self._getQ().defer();
    var result = new GetEmailsResponseModel();

    function getHeader(headers, index) {
        var header = '';
        $.each(headers, function () {
            if (this.name === index) {
                header = this.value;
            }
        });
        return header;
    };

    function getBody(message) {
        var encodedBody = '';
        if (typeof message.parts === 'undefined') {
            encodedBody = message.body.data;
        }
        else {
            encodedBody = getHTMLPart(message.parts);
        }
        encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
        return decodeURIComponent(escape(window.atob(encodedBody)));
    };

    function getHTMLPart(arr) {
        for (var x = 0; x <= arr.length; x++) {
            if (!arr[x]){
                continue;
            }
            if (typeof arr[x].parts === 'undefined') {
                if (arr[x].mimeType === 'text/html') {
                    return arr[x].body.data;
                }
            }
            else {
                return getHTMLPart(arr[x].parts);
            }
        }
        return '';
    };

    function getEmailsCallback(response) {
        var promises = [];

        result.setNextPageToken(response.nextPageToken);

        for (var i = 0; i < response.messages.length; i++) {
            var messageRequest = googleApi.client.gmail.users.messages.get({
                'userId': 'me',
                'id': response.messages[i].id
            });

            promises.push(messageRequest);

            messageRequest.execute(function (message) {
                var subject = getHeader(message.payload.headers, "Subject");
                var date = getHeader(message.payload.headers, "Date");
                var body = getBody(message.payload);
                var snippet = message.snippet;

                result.addEmail(new EmailModel(subject, body, date, snippet));
            });
        }

        self._getQ().all(promises).then(function () {
            deferred.resolve(result);
        });
    };

    var request = googleApi.client.gmail.users.messages.list({
        userId: 'me',
        labelIds: 'INBOX',
        maxResults: itemsPerPage || 20,
        pageToken: nextPageToken
    });

    request.execute(getEmailsCallback);
    return deferred.promise;
};

angular.module("inboxApp.emailService").service('EmailProcessingService', ["$q", EmailProcessingService]);