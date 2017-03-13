'use strict';

function EmailsListController($scope, GoogleOauthService, EmailProcessingService) {
    var self = this;
    this.$onInit = function () {
        self._getScope = function () { return $scope; };
        self._getGoogleOauthService = function () { return GoogleOauthService;};
        self._getEmailService = function () { return EmailProcessingService; };
        self._getPredefinedEmailGroupNames = function () { return ["Today", "Yesterday", "This Week", "All"]; };
        self._nextPageToken;
        self.viewModel = new EmailsListViewModel();
        self._init();
    };
};

EmailsListController.DefaultPageSize = 40;

EmailsListController.prototype.getEmailsNextPage = function () {
    var self = this;
    if (self._getGoogleOauthService().isSignedIn()) {
        self._getEmails(this._nextPageToken);
    }
};

EmailsListController.prototype._init = function () {
    var self = this;
    self._initEmailsGroupsCollection(self._getPredefinedEmailGroupNames());
    self._subscribe();
};

EmailsListController.prototype._subscribe = function () {
    var self = this;
    self._getGoogleOauthService().onLoginAttemptEnd(self._getScope(), function (event, data) {
        self._onAuthServiceLoginAttemptEndHandler(event, data, self)
    });
};

EmailsListController.prototype._onAuthServiceLoginAttemptEndHandler = function (event, data, self) {
    self._getScope().$apply(function () {
        if (self._getGoogleOauthService().isSignedIn()) {
            self._getEmails();
        } else {

            self.viewModel.isLoading = false;
            self.viewModel.clearAllEmails();//_clearLoadedEmailsList();
        }
    });
};

EmailsListController.prototype._getEmails = function (nextPageToken) {
    var self = this;
    //if (self.isLoading) {
    if (self.viewModel.isLoading) {
        return;
    }

    //self.isLoading = true;
    self.viewModel.isLoading = true;

    function emailsReceivedCallback(getEmailsResponse) {
        self._handleEmailsResponse(getEmailsResponse);
    }

    function emailsReceivingFailedCallback(reason) {
        console.log('Failed: ' + reason);
    }

    function afterEmailsProcessed() {
        // self.isLoading = false;
        self.viewModel.isLoading = false;
    }

    var promise = self._getEmailService()
        .GetEmails(self._getGoogleOauthService().googleApi, nextPageToken, EmailsListController.DefaultPageSize);

    promise.then(emailsReceivedCallback, emailsReceivingFailedCallback)
        .then(afterEmailsProcessed);
};

EmailsListController.prototype._handleEmailsResponse = function (getEmailsResponse) {
    var self = this;
    self._nextPageToken = getEmailsResponse.getNextPageToken();
    getEmailsResponse.sortDesc();

    function groupEmails(emailList) {
        for (var i = 0; i < emailList.length; i++) {

            for (var j = 0; j < self.viewModel.emailGroups.length; j++) {

                var group = self.viewModel.emailGroups[j];
                var isValid = group.validate(new Date(emailList[i].receivedDateTimeISOString).toISOString());
                if (isValid) {
                    group.emails.push(emailList[i]);
                }
            }
        }
    };

    function convertDate(emailList) {
        for (var i = 0; i < emailList.length; i++) {
            emailList[i].receivedDateTimeISOString = new moment(emailList[i].receivedDateTimeISOString).format('LLL');
        }
    };

    convertDate(getEmailsResponse.emails);
    groupEmails(getEmailsResponse.emails);

};

EmailsListController.prototype._initEmailsGroupsCollection = function (groupNames) {
    var group;
    var validateFunction;
    var groupName;
    var self = this;
    for (var i = 0; i < groupNames.length; i++) {
        switch (i) {
            case 0: //today
                groupName = groupNames[i];
                validateFunction = function (receivedDateTimeUtc) {
                    return moment().diff(receivedDateTimeUtc, 'days') === 0;
                };
                group = new EmailsGroupViewModel(groupName, validateFunction);
                self.viewModel.addEmailsGroup(group);

                break;
            case 1: //yesterday
                groupName = groupNames[i];
                validateFunction = function (receivedDateTimeUtc) {
                    return moment().diff(receivedDateTimeUtc, 'days') === 1;
                };
                group = new EmailsGroupViewModel(groupName, validateFunction);
                self.viewModel.addEmailsGroup(group);

                break;
            case 2: //this week
                groupName = groupNames[i];
                validateFunction = function (receivedDateTimeUtc) {
                    return moment().diff(receivedDateTimeUtc, 'days') < 8 && moment().diff(receivedDateTimeUtc, 'days') > 1;
                };
                group = new EmailsGroupViewModel(groupName, validateFunction);
                self.viewModel.addEmailsGroup(group);

                break;
            case 3: //all other
                groupName = groupNames[i];
                validateFunction = function (receivedDateTimeUtc) {
                  return true;
                };
                group = new EmailsGroupViewModel(groupName, validateFunction);
                self.viewModel.addEmailsGroup(group);

                break;
            default:
                break;
        }
    }
};

function EmailsGroupViewModel(groupName, validate) {
    this.groupName = groupName;
    this.validate = function (email) {
        if (typeof (validate) == 'function') {
            return validate(email);
        }
        else {
            throw new Error("validate should be a function that return bool true if email should be belongs to current emails group")
        }
    };
    this.emails = [];
};
EmailsGroupViewModel.prototype.clearEmails = function () {
    var self = this;
    self.emails.splice(0, self.emails.length);
};

'use strict';

function EmailsListViewModel(isLoading, emailsGroupViewModels) {
    this.isLoading = isLoading || false;
    this.emailGroups = emailsGroupViewModels || [];
};

EmailsListViewModel.prototype.addEmailsGroup = function (emailsGroupViewModel) {
    var self = this;
    if (!emailsGroupViewModel.groupName) {
        throw new Error("Emails group name is mandatory");
    }
    var isGroupExist = self._isGroupExistAlready(emailsGroupViewModel.groupName);
    if (isGroupExist) {
        throw new Error("Emails group " + emailsGroupViewModel.groupName + " already exist");
    }
    self.emailGroups.push(emailsGroupViewModel);
};

EmailsListViewModel.prototype.removeEmailsGroup = function (groupName) {
    var self = this;
    var isGroupExist = self._isGroupExistAlready(groupName);
    if (isGroupExist) {
        var indexOfGroup = self._getGroupIndex(groupName);

        var group = self.emailGroups[indexOfGroup];
        group.clearEmails();

        self.emailGroups.splice(indexOfGroup, 1);
    }
};

EmailsListViewModel.prototype.clearAllEmails = function () {
    var self = this;
    for (var i = 0; i < self.emailGroups.length; i++) {
        var group = self.emailGroups[i];
        group.clearEmails();
    }
};

EmailsListViewModel.prototype._isGroupExistAlready = function (groupName) {
    var self = this;
    var indexOfGroup = self._getGroupIndex(groupName);
    return indexOfGroup >= 0;
};

EmailsListViewModel.prototype._getGroupIndex = function (groupName) {
    var self = this;
    var existingGroupNames = self.emailGroups.map(function (group) {
        return group.groupName;
    });
    var indexOfGroup = existingGroupNames.indexOf(groupName);
    return indexOfGroup;
};

angular.module('inboxApp.emailList').component("emailsList", {
    bindings: {
        viewModel: "<"
    },
    templateUrl: "components/emailsList/template.html",
    controller: ["$scope", "GoogleOauthService", "EmailProcessingService", EmailsListController]
});