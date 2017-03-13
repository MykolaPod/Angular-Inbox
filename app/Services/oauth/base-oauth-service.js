'use strict';

function OauthService() {
    this.metaTagForClientIdId = 'google-signin-client_id';
    this.metaTagForClientIdValueAttributename = "content";
    this.clientId = '698091853931-binc9o7s27p2h3d223aj82mqq7pifuin.apps.googleusercontent.com';
    document.getElementById(this.metaTagForClientIdId).setAttribute(this.metaTagForClientIdValueAttributename, this.clientId);
};
