'use strict';
angular.module('inboxApp.main', ['ngComponentRouter','inboxApp.inbox'])
    .config(['$locationProvider', function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }])
    .value('$routerRootComponent', 'main');
