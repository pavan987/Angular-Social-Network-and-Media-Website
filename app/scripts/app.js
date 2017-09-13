'use strict';

/**
 * @ngdoc overview
 * @name istarVrWebSiteApp
 * @description
 * # istarVrWebSiteApp
 *
 * Main module of the application.
 */
angular
  .module('istarVrWebSiteApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngFileUpload',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/homeBeforeLogin.html',
        controller: 'HomebeforeloginCtrl'
      })
      .when('/upload', {
        templateUrl: 'views/upload.html',
        controller: 'UploadCtrl'
      })
      .when('/home', {
        templateUrl: 'views/homepage.html',
        controller: 'HomepageCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/profile/editProfile', {
        templateUrl: 'views/editprofile.html',
        controller: 'ProfileCtrl'
      })
      .when('/myroute', {
        templateUrl: 'views/myroute.html',
        controller: 'MyrouteCtrl'
      })
      .when('/surbhi', {
        templateUrl: 'views/surbhi.html',
        controller: 'SurbhiCtrl',
        controllerAs: 'surbhi'
      })
      .when('/player360Video', {
        templateUrl: 'views/player360Video.html',
        controller: 'Player360VideoCtrl',
        controllerAs: 'Player360VideoCtrl'
      })
      .when('/player3DModel', {
        templateUrl: 'views/player3DModel.html',
        controller: 'Player360ModelCtrl',
        controllerAs: 'Player360ModelCtrl'
      })
      .when('/welcome', {
        templateUrl: 'views/welcome.html',
        controller: 'WelcomeCtrl',
        controllerAs: 'welcome'
      })
      .when('/friend', {
        templateUrl: 'views/friend.html',
        controller: 'FriendCtrl',
        controllerAs: 'friend'
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl',
        controllerAs: 'logout'
      })
      .when('/video', {
        templateUrl: 'views/video.html',
        controller: 'VideoCtrl',
      })
      .when('/videos', {
        templateUrl: 'views/videos.html',
        controller: 'VideosCtrl',
        controllerAs: 'videos'
      })
      .otherwise({
        redirectTo: '/'
      })
  });
