'use strict';

function HeaderController() {
    this.$onInit = function () {
    };
};

angular.module("inboxApp.header").component("headerComponent",{
    bindings:{
    },
    templateUrl:"components/header/template.html",
    controller:HeaderController
});