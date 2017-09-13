'use strict';

/**
 * @ngdoc function
 * @name istarVrWebSiteApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the istarVrWebSiteApp
 */
//

angular.module('istarVrWebSiteApp')
  .controller('UploadCtrl', function ($scope, $http, Upload, $cookies, $httpParamSerializer, OauthService, $window, $location) {

    var tagArray = ['Film', 'Concerts','Sports','Travel', 'Fashion', 'Education', 'Show'];
    var categoryArray = ['Avatars', 'Clothes', 'Accessories', 'Live 360 Videos', '360 Videos', 'VR videos'];
    var filmCategory = ['Documentary', 'Romance', 'Adventure', 'Horror', 'Animation', 'Comedy'];

    // check if oauth cookie is set and if it hasn't expired
    if ($cookies.getObject("access_token") !== undefined) {
      if ( (Date.parse($cookies.getObject("expires_in")) - 5000) <= (new Date().getTime()) ) {
        OauthService.fetchRefreshToken();
        console.log("Requesting for oauth token IF");
      }
    } else {
      $window.location.href = "/#!/login";
      console.log("Requesting for oauth token else");
    }

    // helper function to request temporary S3 cred's from server
    var requestTempS3Creds = function(cookieType) {
      var postParams = {
        username: $cookies.getObject("username"),
        bucket_type: cookieType
      };

      var req = {
        method: "POST",
        url: "http://localhost:8086/api/0.1/get_temp_credentials",
        headers: {
          "Authorization": 'Bearer ' + $cookies.getObject("access_token"),
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
        data: $httpParamSerializer(postParams)
      };

      $http(req).then(function (data) {
        if (cookieType === "private") {
          $cookies.putObject('temp-s3-creds', data);
        } else if (cookieType === "thumbnail") {
          $cookies.putObject('temp-s3-creds-thumbnail', data);
        } else {
          $cookies.putObject('temp-s3-creds-public', data);
        }
        // call function to start uploading to S3
        uploadContentHelper($scope.file);
      }, function (error) {
        console.log(error);
      });
    };

    $scope.lengthOfTextArea = 0;

    $scope.lengthOfFile = function(file) {
      if (file === undefined) {
        $scope.lengthOfTextArea = 0;
      } else {
        $scope.lengthOfTextArea = file.length;
      }
    };

    // helper function to hide/show progress bar
    function hideShowProgessBar(status) {
      // important piece of code - Angular doesent update data when async calls comeback
      // updating data happens only when an external event like a button click is performed
      // hence encapsulating it with $apply() which forces angular to update data
      if (status === "hide") {
        console.log("if called for hiding error");
        $scope.showProgressBar = false;
        $scope.successful = true;
        $scope.disableUploadBtn = false;
        $location.path('/videos')
        // $scope.$apply(function() {

        // });
      } else {
        // $scope.$apply(function() {

        // });
        console.log("else called for showing error");
        $scope.showProgressBar = false;
        $scope.erroredOut = true;
        $scope.disableUploadBtn = false;
      }
    }

    // function to upload met-data to backend
    function uploadMetaToBackend(data, dataFromThubmnail) {
      var postParamsForMeta = {
        name_of_file: $scope.name,
        name_of_uploader: $cookies.getObject("username"),
        price: $scope.price,
        description: $scope.description,
        file_type: $scope.file.type,
        etag: data.ETag,
        bucket: data.Bucket,
        key: data.Key,
        location: data.Location,
        thumbnail_location: dataFromThubmnail.Location,
        tag: tagArray[parseInt($scope.tagOfVideo)] === undefined ? "" : tagArray[parseInt($scope.tagOfVideo)],
        category: categoryArray[parseInt($scope.category)],
        thumbnail_key: dataFromThubmnail.Key,
        film_category : filmCategory[parseInt($scope.tagOfFilm)] === undefined ? "" : filmCategory[parseInt($scope.tagOfFilm)],
        wierd_tag : $scope.wierdTag
      };
      // clearing tag number to prevent duplication
      $scope.tagOfVideo = '';
      var req = {
        method: "POST",
        url: "http://localhost:8086/api/0.1/save_content_meta",
        headers: {
          "Authorization": 'Bearer ' + $cookies.getObject('access_token'),
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
        data: $httpParamSerializer(postParamsForMeta)
      };
      $http(req).then(function(response) {
        if (response.data.status === "success") {
          hideShowProgessBar("hide");
        } else {
          console.log(response);
          hideShowProgessBar("show_error");
        }
      }, function(error) {
        hideShowProgessBar("show_error");
      });
    }

    // function to upload the thumbnail to S3
    function uploadThumbnail(data) {
      var s3 = new AWS.S3({
        apiVersion: "2006-03-01",
        accessKeyId: $cookies.getObject('temp-s3-creds-thumbnail').data.Credentials.AccessKeyId,
        secretAccessKey: $cookies.getObject('temp-s3-creds-thumbnail').data.Credentials.SecretAccessKey,
        sessionToken: $cookies.getObject('temp-s3-creds-thumbnail').data.Credentials.SessionToken,
        region: 'us-west-2'
      });

      var params = {
        Bucket: 'istarvrthumbnails',
        ContentType: $scope.thumbnail.type,
        Key: $scope.thumbnail.name,
        Body: $scope.thumbnail,
        ACL : 'public-read-write'
      };
      s3.upload(params, function(err, thumbnailData) {
        if (err) {
          console.log(err + "thumbnail uploading error");
          $scope.$apply(function() {
            $scope.showProgressBar = false;
            $scope.erroredOut = true;
            $scope.disableUploadBtn = false;
          });
        } else {
          uploadMetaToBackend(data, thumbnailData);
        }
      });
    }

    // helper function for uploading to S3
    function uploadContentHelper(file) {
      $scope.showProgressBar = true;
      $scope.erroredOut = false;
      $scope.successful = false;
      $scope.disableUploadBtn = true;

      var s3 = new AWS.S3({
        apiVersion: "2006-03-01",
        accessKeyId:
          $scope.privacy === "private" ? $cookies.getObject('temp-s3-creds').data.Credentials.AccessKeyId : $cookies.getObject('temp-s3-creds-public').data.Credentials.AccessKeyId,
        secretAccessKey:
          $scope.privacy === "private" ? $cookies.getObject('temp-s3-creds').data.Credentials.SecretAccessKey : $cookies.getObject('temp-s3-creds-public').data.Credentials.SecretAccessKey,
        sessionToken:
          $scope.privacy === "private" ? $cookies.getObject('temp-s3-creds').data.Credentials.SessionToken : $cookies.getObject('temp-s3-creds-public').data.Credentials.SessionToken
      });

      var params = {Bucket: $scope.privacy === "private" ? 'istarvr' : 'publicistarvr', Key: $cookies.getObject("username") + '/'+file.name, ContentType: file.type , Body: file};
      s3.upload(params, function(err, data) {
        if (err) {
          console.log("error in uploading video" + err);
          $scope.$apply(function() {
            $scope.showProgressBar = false;
            $scope.erroredOut = true;
            $scope.disableUploadBtn = false;
          });
        } else {
          uploadThumbnail(data);
        }
      });
    }

    function validateTempS3Cookies(cookieType) {
      //check if temp-s3-creds cookie is already set, if set check for expiry
      if (cookieType === "private") {
        if ($cookies.getObject('temp-s3-creds') !== undefined) {
          if ((Date.parse($cookies.getObject('temp-s3-creds').data.Credentials.Expiration) - 5000) <= (new Date().getTime())) {
            requestTempS3Creds(cookieType);
            console.log("Requesting for S3 token IF");
          } else {
            // call function to start uploading to S3
            uploadContentHelper($scope.file);
          }
        } else {
          requestTempS3Creds(cookieType);
          console.log("Requesting for S3 token else");
        }
      } else {
        if ($cookies.getObject('temp-s3-creds-public') !== undefined) {
          if ((Date.parse($cookies.getObject('temp-s3-creds-public').data.Credentials.Expiration) - 5000) <= (new Date().getTime())) {
            requestTempS3Creds(cookieType);
            console.log("Requesting for S3 token-public IF");
          } else {
            // call function to start uploading to S3
            uploadContentHelper($scope.file);
          }
        } else {
          requestTempS3Creds(cookieType);
          console.log("Requesting for S3 token-public else");
        }
      }

      // checking if the cookie for thumbnail bucket is present
      if ($cookies.getObject('temp-s3-creds-thumbnail') !== undefined) {
        if ((Date.parse($cookies.getObject('temp-s3-creds-thumbnail').data.Credentials.Expiration) - 5000) <= ((new Date().getTime()))) {
            requestTempS3Creds("thumbnail");
            console.log("Requesting for S3 token-thumbnail IF");
          } else {
            // call function to start uploading to S3
            uploadContentHelper($scope.file);
          }
      } else {
        requestTempS3Creds("thumbnail");
        console.log("Requesting for S3 token-thumbnail else");
      }
    }

    $scope.uploadContent = function() {
      if ($scope.file) {
        console.log($scope.privacy);
        // call functions to check if private/public s3-temp-creds cookies are set
        validateTempS3Cookies($scope.privacy);
      } else {
        console.log("Something wrong with the input file");
      }
    };
  });
