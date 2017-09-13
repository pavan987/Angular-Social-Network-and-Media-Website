'use strict';

/**
 * @ngdoc service
 * @name istarVrWebSiteApp.OauthService
 * @description
 * # OauthService
 * Service in the istarVrWebSiteApp.
 */
angular.module('istarVrWebSiteApp')
  .service('navBar', function ($http, $httpParamSerializer, $cookies, $resource) {

   this.beforeLogin = false;
   this.afterLogin = true;


  })
