'use strict';

function AuthenticationController($scope, GoogleOauthService) {
    var self = this;
    this.$onInit = function () {
        self._getScope =  function(){ return $scope; };
        self._getGoogleSignInButtonId = function(){ return "singInButton"; };
        self._getGoogleOauthService = function(){ return GoogleOauthService; };
        self.viewModel = new AuthenticationViewModel();
        self.signOut = AuthenticationController.prototype.signOut;
        self._render();
    };
};

AuthenticationController.prototype.signOut = function () {
    var self = this;

    function onSignOutSuccess() {
        self._getScope().$apply(function () {
            self.viewModel.isSignedIn = false;
        });
    };

    function onSignOutFailed() {
        console.log('User is not signed out. Some problem occurred');
    };

    self._getGoogleOauthService().signOut(onSignOutSuccess, onSignOutFailed);
};

AuthenticationController.prototype._render = function () {
    var self = this;

    var onLoginSuccess = function () {
        self._getScope().$apply(function () {

            self.viewModel.isSignedIn = self._getGoogleOauthService().isSignedIn();
            var promise = self._getGoogleOauthService().getUserDataAsync();

            function onUserDataReceivedSuccess(userProfileData) {
                self.viewModel.userName = userProfileData.displayName;
                self.viewModel.userProfileImageUrl = userProfileData.image.url;
                self.viewModel.profileUrl = userProfileData.url;
            };

            promise.then(onUserDataReceivedSuccess);
        });
    };
    var onLoginFailed = function (error) {
        self._getScope().$apply(function () {
            self.viewModel.isSignedIn = self._getGoogleOauthService().isSignedIn();
            console.log(error.reason);
        });
    };

    self._getGoogleOauthService().renderButton(self._getGoogleSignInButtonId(), onLoginSuccess, onLoginFailed);
};

function AuthenticationViewModel (isSignedIn, userName, userProfileImageUrl, profileUrl){
    this.isSignedIn = isSignedIn||false;
    this.userName = userName;
    this.userProfileImageUrl = userProfileImageUrl;
    this.profileUrl = profileUrl;
};

angular.module("inboxApp.header.loginButton").component("googleLogin", {
    bindings: {
        viewModel:"<",
        signOut: "&"
    },
    templateUrl: "components/loginButton/template.html",
    controller: ["$scope", "GoogleOauthService", AuthenticationController]
});