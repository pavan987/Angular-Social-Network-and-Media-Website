'use strict';

/**
 * @ngdoc function
 * @name istarVrWebSiteApp.controller:FriendCtrl
 * @description
 * # FriendCtrl
 * Controller of the istarVrWebSiteApp
 */
angular.module('istarVrWebSiteApp')
  .controller('FriendCtrl', function (OauthBearerService, $scope, $cookies, $location) {

    if(!$cookies.getObject('access_token')){
      $location.path('/login')
    }
    $scope.imageurl = 'http://localhost:8086/images'

    var init = function() {
      OauthBearerService.getData("/friendrequest/" + $cookies.getObject('username'), function (data,err) {
        if(err) $location.path('/login');
        $scope.requests = data.list;
      })

      OauthBearerService.getData("/friends/" + $cookies.getObject('username'), function (data, err) {
        if(err) $location.path('/login');
        $scope.friends = data.list;
      })
    }
    init();

    $scope.acceptRequest = function(username){

      var postParams = {

        username: username,
        status: "accept"

      }
      OauthBearerService.postData("/friendrequest/status/"+ $cookies.getObject('username'), postParams, function (data){
        console.log(data);
        init()


      })

    }

    $scope.ignoreRequest = function(username){

      var postParams = {

        username: username,
        status: "ignore"

      }
      OauthBearerService.postData("/friendrequest/status/"+ $cookies.getObject('username'), postParams, function (data){
        console.log(data);
        init()

      })

    }



    $scope.searchFriends = function(){
      if($scope.searchData){
        OauthBearerService.getData("/search/"+ $scope.searchData, function (data) {
          $scope.results = data;
        })

      }

    }


  });
