/**
 * Created by xinzheli on 4/24/17.
 */
'use strict';
angular.module('istarVrWebSiteApp')
  .controller('Player360ModelCtrl', function ($scope, $location, $http) {
    let backendURL = "http://localhost:8086/api/0.1/get_temp_credentials";
    let bucket = $location.search().bucketName;
    let key = $location.search().key;


    let temCredential;

    // check if oauth cookie is set and if it hasn't expired
    if ($cookies.getObject("access_token") !== undefined) {
      if ($cookies.getObject("expires_in") <= ((new Date().getTime()) - 1000)) {
        OauthService.fetchRefreshToken();
        console.log("Requesting for oauth token IF");
      }
    } else {
      $window.location.href = "/#!/login";
      console.log("Requesting for oauth token else");
    }


    let requestTempS3Creds = function(cookieType) {
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
        cookieType === "private" ? $cookies.putObject('temp-s3-creds-expires-in', data.Credentials.Expiration) : $cookies.putObject('temp-s3-creds-public-expires-in', data.Credentials.Expiration);
      }, function (error) {
        console.log(error);
      });
    };


    if(bucket == 'istarvr') {
      if ($cookies.getObject("temp-s3-creds") !== undefined || $cookies.getObject("temp-s3-creds-expires-in") <= ((new Date().getTime()) - 1000)) {
        requestTempS3Creds("private");
        temCredential = $cookies.getObject("temp-s3-creds-expires-in");
      }
    } else {
      if ($cookies.getObject("temp-s3-creds-public") !== undefined || $cookies.getObject("temp-s3-creds-public-expires-in") <= ((new Date().getTime()) - 1000)) {
        requestTempS3Creds("public");
        temCredential = $cookies.getObject("temp-s3-creds-public-expires-in");
      }
    }



    let aws = AWS;
    aws.config.credentials = new aws.Credentials(temCredential.Credentials.AccessKeyId, temCredential.Credentials.SecretAccessKey,
      temCredential.Credentials.SessionToken);
    aws.config.update({
      signatureVersion: 'v4'
    });


    let s3 = new aws.S3({region : "us-west-1"});
    let preSignedURl = s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Expires: 60 * 3600,
      Key: key
    });





    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    let container, stats, controls;
    let camera, scene, renderer, light;

    let clock = new THREE.Clock();

    let mixers = [];

    init();

    function init() {

      container = document.createElement( 'div' );
      document.body.appendChild( container );

      camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );

      scene = new THREE.Scene();

      // grid
      let gridHelper = new THREE.GridHelper( 28, 28, 0x303030, 0x303030 );
      gridHelper.position.set( 0, - 0.04, 0 );
      scene.add( gridHelper );

      // stats
      stats = new Stats();
      container.appendChild( stats.dom );

      // model
      let manager = new THREE.LoadingManager();
      manager.onProgress = function( item, loaded, total ) {

        console.log( item, loaded, total );

      };

      let onProgress = function( xhr ) {

        if ( xhr.lengthComputable ) {

          let percentComplete = xhr.loaded / xhr.total * 100;
          console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

        }

      };

      let onError = function( xhr ) {

        console.error( xhr );

      };

      //AWS
      let aws = AWS;
      aws.config.credentials = new aws.Credentials(temCredential.Credentials.AccessKeyId, temCredential.Credentials.SecretAccessKey,
        temCredential.Credentials.SessionToken);
      aws.config.update({
        signatureVersion: 'v4'
      });
      //

      //
      let s3 = new aws.S3({region : "us-west-1"});
      let url = s3.getSignedUrl('getObject', {
        Bucket: bucket,
        Expires: 60 * 3600,
        Key: key
      });

      // Load

      // console.log(url);

      let loader = new THREE.FBXLoader( manager );
      loader.load( preSignedURl, function( object ) {
        scene.add( object );
      }, onProgress, onError );


      // loader.load( '../../images/xsi_man_skinning.fbx', function( object ) {
      //   scene.add( object );
      // }, onProgress, onError );

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.setClearColor( 0xffffff );
      container.appendChild( renderer.domElement );

      // controls, camera
      controls = new THREE.OrbitControls( camera, renderer.domElement );
      controls.target.set( 0, 12, 0 );
      camera.position.set( 2, 18, 28 );
      controls.update();

      window.addEventListener( 'resize', onWindowResize, false );

      light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
      light.position.set(0, 1, 0);
      scene.add(light);

      light = new THREE.DirectionalLight(0xffffff, 1.0);
      light.position.set(0, 1, 0);
      scene.add(light);

      animate();

    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    //

    function animate() {
      requestAnimationFrame( animate );
      if ( mixers.length > 0 ) {
        for ( let i = 0; i < mixers.length; i ++ ) {
          mixers[ i ].update( clock.getDelta() );
        }
      }
      stats.update();
      render();
    }

    function render() {
      renderer.render( scene, camera );
    }
  });
