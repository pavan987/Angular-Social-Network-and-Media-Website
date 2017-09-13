'use strict';

/**
 * @ngdoc service
 * @name istarVrWebSiteApp.OauthService
 * @description
 * # OauthService
 * Service in the istarVrWebSiteApp.
 */
angular.module('istarVrWebSiteApp')
  .service('OauthBearerService', function ($http, $httpParamSerializer, $cookies, $resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // ---------------------------- on log-out, the cookies have to be removed --------------------------------


    this.getData = function(url, callback) {


      // requesting for access token, this block of code should appear after login/signup flow
      // hardcoding the username and password for now


      var req = {
        method: "GET",
        url: "http://localhost:8086/api/0.1"+ url,
        headers: {
          "Authorization": "Bearer " + $cookies.getObject("access_token"),

        },

      };

      $http.defaults.useXDomain = true;
      delete $http.defaults.headers.common['X-Requested-With'];

      $http(req).then(function(data){
        callback(data.data);

      }, function(error){
        console.log(error);
        callback(error, "err");

        return "error";
      });

    }


    this.postData = function(url,postParams,callback) {


      // requesting for access token, this block of code should appear after login/signup flow
      // hardcoding the username and password for now



      var req = {
        method: "POST",
        url: "http://localhost:8086/api/0.1" + url,
        headers: {
          "Authorization": "Bearer " + $cookies.getObject("access_token"),
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",

        },

        data: $httpParamSerializer(postParams)
      };
      $http.defaults.useXDomain = true;
      delete $http.defaults.headers.common['X-Requested-With'];

      $http(req).then(function(data){

      callback(data.data);



      }, function(error){
        callback(error, "err");
        console.log(error);
        return "error";
      });

    }

  });
