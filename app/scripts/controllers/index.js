'use strict';

/**
 * @ngdoc function
 * @name istarVrWebSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the istarVrWebSiteApp
 */
angular.module('istarVrWebSiteApp')
  .controller('IndexCtrl', function (navBar,$scope) {

    $scope.beforeLogin = navBar.beforeLogin;
    $scope.afterLogin = navBar.afterLogin;


  });
