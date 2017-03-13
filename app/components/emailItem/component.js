'use strict';
function EmailItemController() {
    var self = this;
    this.$onInit = function () {
        self.viewModel = new EmailListItemViewModel(true,self.emaildata.email);
    };
};

EmailItemController.prototype.toggleExpandItem = function () {
    var self = this;
    self.viewModel.isShortView = !self.viewModel.isShortView;
};


function EmailListItemViewModel(isShortView, email) {
    this.isShortView = isShortView || true;
    this.email = email instanceof (EmailModel)? email:new EmailModel(email.subject,email.body,new Date(email.receivedDateTimeISOString),email.snippet);
};

angular.module("inboxApp.emailList.emailListItem").component("emailItem",{
    bindings:{
        emaildata:'<'
    },
    require: {
        listCtrl: '^emailsList'
    },
    templateUrl:"components/emailItem/template.html",
    controller:[EmailItemController]
});