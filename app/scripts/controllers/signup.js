'use strict';

/**
 * @ngdoc function
 * @name istarVrWebSiteApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the istarVrWebSiteApp
 */
angular.module('istarVrWebSiteApp')
  .controller('SignupCtrl', function ($http, $httpParamSerializer, $scope, $location) {

    $scope.onSignup = function() {

      if ($scope.username && $scope.email && $scope.password && $scope.confirmPassword && $scope.firstname && $scope.lastname
      && $scope.terms)  {

        if ($scope.password === $scope.confirmPassword) {
          var postParams = {
            email: $scope.email,
            username: $scope.username,
            password: $scope.password,
            firstname: $scope.firstname,
            lastname: $scope.lastname
          }

          var req = {
            method: "POST",
            url: "http://localhost:8086/api/0.1/users/create",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
            },
            data: $httpParamSerializer(postParams)
          }

          $http.defaults.useXDomain = true;
          delete $http.defaults.headers.common['X-Requested-With'];

          $http(req).then(function (data) {
            if(data.data.status === "success"){
              $location.path('/login');
            }
            else {
              alert(data.data.message);
            }

          }, function (error) {

            console.log(error);
          });

        }
        else{
          alert("Password and Confirm Password Mismatch");
        }

      }
      else{
        alert("Please enter all the fields");
      }

    }
  });
