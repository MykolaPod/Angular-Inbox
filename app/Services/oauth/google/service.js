'use strict';

function GoogleOauthService($window, $rootScope, $q) {
    OauthService.call(this);
    this._getQ = function () { return $q; };
    this._getRootScope = function () { return $rootScope; };
    this._getWindowService = function () { return $window; };
    this._getGoogleScopes = function () { return ['https://www.googleapis.com/auth/gmail.readonly', 'profile', 'email']; };
    this.googleApi;
    this._render();
};
GoogleOauthService.prototype = Object.create(OauthService.prototype);

GoogleOauthService.prototype.renderButton = function (elementId, whenLoginSuccess, whenLoginFailed) {
    var self = this;

    function initApi() {
        self.googleApi.auth2.init();
        self.googleApi.signin2.render(elementId, {
            'scope': self._getGoogleScopes().join(' '),
            'width': 240,
            'height': 50,
            'immediate': true,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': function () {
                whenLoginSuccess();
                self._fireOnLoginAttemptEnd();
            },
            'onfailure': function (error) {
                whenLoginFailed(error);
                self._fireOnLoginAttemptEnd();
            }
        });
    };

    function whenScriptLoaded() {
        if (!self.isSignedIn()) {
            initApi();
        }
    };

    function whenScriptsNotLoaded(error) {

    };

    var getGoogleScriptPromise = self._getGoogleScriptsLoadingPromise();
    getGoogleScriptPromise.then(whenScriptLoaded, whenScriptsNotLoaded);
};

GoogleOauthService.prototype.getUserDataAsync = function () {
    var self = this;
    var deferred = self._getQ().defer();
    if (self.isSignedIn()) {
        var request = gapi.client.plus.people.get({
            'userId': 'me'
        });
        request.execute(function (profileData) {
            deferred.resolve(profileData);
        });
    } else {
        deferred.reject();
    }
    return deferred.promise;
};

GoogleOauthService.prototype.isSignedIn = function () {
    var self = this;
    var isSignedIn = false;
    try {
        isSignedIn = self.googleApi.auth2.getAuthInstance().isSignedIn.get()
    }
    finally {
        return isSignedIn;
    }
};

GoogleOauthService.prototype._render = function () {
    var self = this;
    document.getElementById(self.metaTagForClientIdId).setAttribute(self.metaTagForClientIdValueAttributename, self.clientId);
};

GoogleOauthService.prototype.signOut = function (whenSuccess, whenFailed) {
    var self = this;
    var auth2 = self.googleApi.auth2.getAuthInstance();

    function onSignOutSuccess(){
        self._fireOnLoginAttemptEnd();
        whenSuccess();
    };
    function onSignOutFailed(error){
        self._fireOnLoginAttemptEnd();
        whenFailed(error);
    };

    auth2.signOut().then(onSignOutSuccess, onSignOutFailed);
};

GoogleOauthService.prototype.onLoginAttemptEnd = function (scope, callback) {
    var self = this;
    var handler = self._getRootScope().$on('google-oauth-service-on-login-attempt-end', callback);
    scope.$on('$destroy', handler);
};

GoogleOauthService.prototype._fireOnLoginAttemptEnd = function (data) {
    var self = this;
    self._getRootScope().$emit('google-oauth-service-on-login-attempt-end', data);
};

GoogleOauthService.prototype._getGoogleScriptsLoadingPromise = function () {
    var self = this;
    var deferred = self._getQ().defer();

    function loadScriptFromUrl(url) {
        var script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
    };

    self._getWindowService().platformScriptLoaded = function () {
        self.googleApi = gapi;
        self.googleApi.load('auth2', function () {
            loadScriptFromUrl('https://apis.google.com/js/client.js?onload=clientScriptLoaded');
        });
    };

    self._getWindowService().clientScriptLoaded = function () {
        self.googleApi.client.load('gmail', 'v1', function () {
            gapi.client.load('plus', 'v1', function () {
                deferred.resolve();
            });
        });
    };

    loadScriptFromUrl('https://apis.google.com/js/platform.js?onload=platformScriptLoaded');

    return deferred.promise;
};



angular.module("inboxApp.googleOauthService").service('GoogleOauthService', ["$window", "$rootScope", "$q", GoogleOauthService]);