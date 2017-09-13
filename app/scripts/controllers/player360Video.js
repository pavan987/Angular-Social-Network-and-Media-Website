/**
 * Created by xinzheli on 4/24/17.
 */
'use strict';
angular.module('istarVrWebSiteApp')
  .controller('Player360VideoCtrl', function ($scope, $location, OauthService, $http,$httpParamSerializer, $cookies, $window, $sce) {
    let backendURL = "http://localhost:8086/api/0.1/get_temp_credentials";
    let bucket = $location.search().bucketName;
    let key = $location.search().key;
    let aws = AWS;
    let s3;
    let preSignedURl;

    let temCredential;

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


    let requestTempS3Creds = function(cookieType, callback) {
      let postParams = {
        username: $cookies.getObject("username"),
        bucket_type: cookieType
      };

      let req = {
        method: "POST",
        url: backendURL,
        headers: {
          "Authorization": 'Bearer ' + $cookies.getObject("access_token"),
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
        data: $httpParamSerializer(postParams)
      };

      $http(req).then(function (data) {
        cookieType === "private" ? $cookies.putObject('temp-s3-creds', data) : $cookies.putObject('temp-s3-creds-public', data);
        callback()
      }, function (error) {
        callback(error)
        console.log(error);
      });
    };


    if(bucket == 'istarvr') {
      if ($cookies.getObject("temp-s3-creds") == undefined || (Date.parse($cookies.getObject('temp-s3-creds').data.Credentials.Expiration)  - 5000) <= (new Date().getTime())) {
        requestTempS3Creds("private",function(err){
          if(!err) {
            temCredential = $cookies.getObject("temp-s3-creds");
            aws.config.credentials = new aws.Credentials(temCredential.data.Credentials.AccessKeyId, temCredential.data.Credentials.SecretAccessKey,
              temCredential.data.Credentials.SessionToken);
            aws.config.update({
              signatureVersion: 'v4'
            });


            s3 = new aws.S3({region: "us-west-2"});
            preSignedURl = s3.getSignedUrl('getObject', {
              Bucket: bucket,
              Expires: 60 * 3600,
              Key: key
            });
          }

        });
      }
      else{
        temCredential = $cookies.getObject("temp-s3-creds");
        aws.config.credentials = new aws.Credentials(temCredential.data.Credentials.AccessKeyId, temCredential.data.Credentials.SecretAccessKey,
          temCredential.data.Credentials.SessionToken);
        aws.config.update({
          signatureVersion: 'v4'
        });


        s3 = new aws.S3({region : "us-west-2"});
        preSignedURl = s3.getSignedUrl('getObject', {
          Bucket: bucket,
          Expires: 60 * 3600,
          Key: key
        });

      }
    } else {
      if ($cookies.getObject("temp-s3-creds-public") == undefined || (Date.parse($cookies.getObject('temp-s3-creds-public').data.Credentials.Expiration)  - 5000) <= (new Date().getTime())) {
        requestTempS3Creds("public",function(err){
          if(!err) {
            temCredential = $cookies.getObject("temp-s3-creds-public");
            aws.config.credentials = new aws.Credentials(temCredential.data.Credentials.AccessKeyId, temCredential.data.Credentials.SecretAccessKey,
              temCredential.data.Credentials.SessionToken);
            aws.config.update({
              signatureVersion: 'v4'
            });


            s3 = new aws.S3({region: "us-west-2"});
            preSignedURl = s3.getSignedUrl('getObject', {
              Bucket: bucket,
              Expires: 60 * 3600,
              Key: key
            });
          }

        });
      }
      else{
        temCredential = $cookies.getObject("temp-s3-creds-public");
        aws.config.credentials = new aws.Credentials(temCredential.data.Credentials.AccessKeyId, temCredential.data.Credentials.SecretAccessKey,
          temCredential.data.Credentials.SessionToken);
        aws.config.update({
          signatureVersion: 'v4'
        });


        s3 = new aws.S3({region: "us-west-2"});
        preSignedURl = s3.getSignedUrl('getObject', {
          Bucket: bucket,
          Expires: 60 * 3600,
          Key: key
        });


      }
    }

    $scope.clickButton = function() {

      let player = jwplayer('player').setup({
        hlshtml: true,
        playlist: [{
          title: 'Caminandes VR',
          mediaid: 'AgqYcfAT',
          stereomode: 'monoscopic',
          file: preSignedURl
        }]
      });
    }
    //monoscopic ,stereoscopicLeftRight,stereoscopicTopBottom

    // Google VRview
    //
    // let vrView;
    // let muted = false;
    // let volumn = 0.3;
    // let windowWidth = $( window ).width();
    // let onVrViewLoad = function () {
    //   let aws = AWS;
    //   aws.config.credentials = new aws.Credentials('ASIAI7PC2RYEZYVIIJKA', 'anBiyPyeaAHH5q+gL9r6BVBCW6RdM2uBuFHPO4C6',
    //     'FQoDYXdzEOX//////////wEaDIVpEgXx+kkC7VNOJSL+A4DhYen7nlQ8YbY5KZa8HHMlU7yJkJkj7NZOT86QVSEW/LWcPmSLGS9tOFG+513oqsjBR0iGlTTsdn4xFtWlAy2Cpz/6TlO8fIt7t+hbZQM59+Xo9W8Q543yAbaEQNHhNCFAZ7orjRa+Q8Nj9qQQdFJuROJpEAP7kZq/FVnbT3CYs6kGMJiUzrGJtKOyJdabPc2hQzdfj7C8GF3oaK0UtiuEXTNWUGScuAb0OJKwuBeH9wjD8+Uo5mYyUJFs3oMnMPkBlJeCP2MvEXnWFxjiGlecW5H01VFGJq+hgCrpTDObpLj5kOxYVwj3sQHraK0a32Gwk/ymHVkCBMtRONxKxi0ccwL7wYRnNN+n09eAmcM1caQASqZD11s9Q+iTIqKnmtSKbx7hnMgPeHZPRNP+YRhgoUxL54BghcvEVqWxcFcc46FiTjGbFcolSrJPmLVvhC4L/H6a2x5z49eo1fvqofXQ/AmBTMs7vbZpdoeLW4M9U9RTYuOjLTYHfwlnKFwePgXgciB7hg+jngOiwfJxvK/ov5Wti5OHNimUw8iO2zargsl68nPAyHy4uEdCC6zDCxZYc1nY+wFzPluCFAjwaCIazf6ovN2Tk7VPy22+kkXQj60zKz0iVgjiDHxaoscUY6XRsuWe/lbG3i+g3iZBalsWHmZmrID4/mXh8r11ZSjimvvHBQ==');
    //   aws.config.update({
    //     signatureVersion: 'v4'
    //   });
    //
    //
    //   let s3 = new aws.S3({region : "us-west-1"});
    //   let url = s3.getSignedUrl('getObject', {
    //     Bucket: 'publicistarvrxinzhelitest',
    //     Expires: 60 * 3600,
    //     Key: 'leo/Roller Coaster 3D 360.mp4'
    //   });
    //   // let url = s3.getSignedUrl('getObject', {
    //   //   Bucket: $location.search().url,
    //   //   Expires: 60 * 3600,
    //   //   Key: $location.search().key
    //   // });
    //
    //   // console.log(typeof url);
    //   console.log(url);
    //
    //
    //   vrView = new VRView.Player('#vrview', {
    //     // video: 'https://s3-us-west-1.amazonaws.com/publicistarvrxinzhelitest/leo/Roller+Coaster+3D+360.mp4',
    //     // video: 'https://publicistarvrxinzhelitest.s3-us-west-1.amazonaws.com/leo/Roller%20Coaster%203D%20360.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAJZFOW27UPQMNZH7A%2F20170424%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20170424T203305Z&X-Amz-Expires=216000&X-Amz-Security-Token=FQoDYXdzEN7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDONx2dszovQ4rlFENCL%2BAzfy2jeA0V%2FSBKYkRpx6TJ1W33w1Z1EeuZQTEVC4BJLss71wdwKusgxBUMlKPoC6eLf5O3IxMvXcBGMPZ8Ckl477kXx0CSFNXpBqKhvj0QCM7PK7cn7FNQH8NF9PEGMeySEMGq8hHtZo%2FqvXiEhtcoFCfAeffrywtxoEGh0F8RYnpzvFIQX4ls0bbTEYkRAAkRyoyf%2BKrt3B43gfEvRh9XfGRAh8RoMhNs4%2BpLWDFjjqnPHfbDshSeyKio%2F6NbQVGsbrLx4A%2BB7ifPE9KY%2BKs2UgrlvBG%2FOH%2FtmCTKRxvMsnP%2FUmONDniK35gbgFZAH2T%2F1QDKfrvqWwm565aRf%2F7xLhw4SdZbA7ZV%2FB77uSsjfuDXNaoRKBtAuLtnYyzZ2CxPQi6df0YmCrEhqaeNmc8WJyQwMRBnSVCKskqmkGTlyra3rnyVVAABhhlnBC%2B3FDP7V%2F4MNw%2BTa%2BVYM7b1aPJ4q25qjhIbMtOpQpRGaEAbOFFNBqUru%2FDpaggzZo75vXXcw%2FiPuxqAjgFb3w55QMSjOkcB3my2BsOFIWvRmhDSDCQD7RqHV1VZQbnv9s6Xt4myZlsxraL%2FBiJjV5leWuqNT0V080O0SJiIWdpQgiWPuoiey%2BYTVdYmrMHj4JZVnr1IuT1XfWsyjD7ZqMZ2m4yEgoYAusBmUUIkuy1ezXIyjOwfnHBQ%3D%3D&X-Amz-Signature=8e9f70a2335620985c5206d8745648c2c440bd8f1277cc54bd8ad4c71661d9bd&X-Amz-SignedHeaders=host',
    //     video: 'https://s3-us-west-1.amazonaws.com/nodetestlixzleo/Roller+Coaster+3D+360.mp4',
    //     // video: $location.search().url,
    //     width: (windowWidth * 0.8).toString(),
    //     height: (windowWidth * 0.4).toString(),
    //     is_stereo: true
    //   });
    //
    //   vrView.setVolume(0.3)
    // };
    //
    // onVrViewLoad();
    //
    // $scope.playVideo = function () {
    //   vrView.play();
    // };
    //
    // $scope.pauseVideo = function () {
    //   vrView.pause()
    // };
    //
    // $scope.muteVideo = function () {
    //   if (!muted) {
    //     vrView.setVolume(0);
    //     muted = true
    //   } else {
    //     vrView.setVolume(volumn);
    //     muted = false
    //   }
    // };
    //
    // let rangeSlider = function(){
    //   let slider = $('.range-slider'),
    //     range = $('.range-slider__range'),
    //     value = $('.range-slider__value');
    //
    //   slider.each(function(){
    //
    //     value.each(function(){
    //       let value = $(this).prev().attr('value');
    //       $(this).html(value);
    //     });
    //
    //     range.on('input', function(){
    //       volumn = this.value/100
    //       vrView.setVolume(volumn);
    //       $(this).next(value).html(this.value);
    //     });
    //   });
    // };
    //
    // rangeSlider();
  });
