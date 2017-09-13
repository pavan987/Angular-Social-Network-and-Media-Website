'use strict';

/**
 * @ngdoc function
 * @name istarVrWebSiteApp.controller:EditprofileCtrl
 * @description
 * # EditprofileCtrl
 * Controller of the istarVrWebSiteApp
 */



angular.module('istarVrWebSiteApp')
  .controller('EditprofileCtrl',  function ( OauthBearerService, $http, $scope, $cookies, $location, $route) {


    if(!$cookies.getObject('access_token')){
      $location.path('/login')
    }
    $scope.profilePicture = 'http://localhost:8086/images/'+$cookies.getObject('username')
    $scope.uploadFile = function(files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("file", files[0]);
      fd.append("username", $cookies.getObject('username'));


      var req = {
        method: "POST",
        url: "http://localhost:8086/api/0.1/upload",
        headers: {'Content-Type': undefined , "Authorization": "Bearer " + $cookies.getObject("access_token")},
        transformRequest: angular.identity,
        data: fd
      };
      $http.defaults.useXDomain = true;
      delete $http.defaults.headers.common['X-Requested-With'];

      $http(req).then(function(data){

        $route.reload();

      }, function(error){
        console.log(error);
      });



    }



    $scope.submitForm = function(){

      if ($scope.firstname && $scope.lastname && $scope.email  )  {

        if ($scope.password === $scope.confirmpassword) {
          var postParams = {
            email: $scope.email,
            firstname: $scope.firstname,
            lastname: $scope.lastname,
            password: $scope.password,
          phone: $scope.phone ,
          birthday: $scope.birthday,
          occupation : $scope.occupation ,
          country : $scope.country ,
          area: $scope.area ,
          project: $scope.project,
          introduction: $scope.introduction,
            category: $scope.category,
            accountType: $scope.accountType
          }

          OauthBearerService.postData('/users/'+$cookies.getObject('username'), postParams, function (data, err) {
            if (!err){

              $location.path('/profile')
            }
            else{
                $location.path('/login')

            }
          })
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
