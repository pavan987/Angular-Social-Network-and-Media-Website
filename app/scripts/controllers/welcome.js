'use strict';

/**
 * @ngdoc function
 * @name istarVrWebSiteApp.controller:HomepageCtrl
 * @description
 * # HomepageCtrl
 * Controller of the istarVrWebSiteApp
 */
angular.module('istarVrWebSiteApp')
  .controller('WelcomeCtrl',  function (OauthBearerService,$cookies,$location,$scope) {

    if(!$cookies.getObject('access_token')){
      $location.path('/login')
    }

    var getparams = $location.search();
    $scope.profilePicture = 'http://localhost:8086/images/'+getparams.username

    $scope.addFriend = function()
    {
      var postParams = {
        username: getparams.username,
        my_username: $cookies.getObject('username')
      }

      OauthBearerService.postData('/friendrequest', postParams, function(data,err){
        if(err) {
        }
        else if(data.status === 'success'){
          $scope.buttonvalue='request sent'
        }

      })
    }

    $scope.removeFriend = function()
    {
      var postParams = {
        username: getparams.username,
      }

      OauthBearerService.postData('/friends/'+ $cookies.getObject('username'), postParams, function(data,err){
        if(err) {
        }
        else if(data.status === 'success'){
          $scope.buttonvalue='add friend'
        }

      })
    }





    if(getparams.username) {

      if(getparams.username === $cookies.getObject('username')){
        $location.path('/profile');
      }

      OauthBearerService.getData('/users/' + getparams.username, function (data, err) {

        if (err) {
        }
        else if(data == null)
        {
          $location.path('/profile');
        }
        else {

          OauthBearerService.getData('/friendrequest/' + getparams.username, function (data, err) {


            data.list.forEach(function (user) {

              if (user.username === $cookies.getObject('username')) {
                $scope.buttonvalue = 'request sent';
                return;
              }

            });

          });


          if ($scope.buttonvalue != 'request sent') {
            OauthBearerService.getData('/friends/' + getparams.username, function (data, err) {

              data.list.forEach(function (user) {

                if (user.username === $cookies.getObject('username')) {
                  $scope.buttonvalue = 'already friend';
                  return;
                }

              });


            });
          }

          if ($scope.buttonvalue != 'request sent' && $scope.buttonvalue != 'already friend') {
            $scope.buttonvalue = 'add friend';
          }

          $scope.username = data.username;
          $scope.fullname = data.firstname + " " + data.lastname;
          $scope.firstname = data.firstname;
          $scope.lastname = data.lastname;
          $scope.email = data.email;
          $scope.phone = data.phone;
          $scope.birthday = data.birthday;
          $scope.occupation = data.occupation;
          $scope.country = data.country;
          $scope.area = data.area;
          $scope.work = data.work;
          $scope.introduction = data.introduction;

        }
      });







    }


    else{
      $location.path('/profile');
    }






    //
    // };

    // fetching oauth access_token and storing in cookie (both operations done by service)
    //console.log($cookies.getObject("oauth2"));
  });
