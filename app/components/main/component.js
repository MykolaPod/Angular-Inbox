'use strict';
angular.module('inboxApp.main').component('main',{
    bindings:{
    },
    template:'<ng-outlet></ng-outlet>',
    $routeConfig: [
        {path: '/inbox/',name: 'Inbox', component: 'inbox',useAsDefault: true},
    ]
});