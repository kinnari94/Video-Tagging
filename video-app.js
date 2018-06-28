var videoApp = angular.module("videoApp", ['ngRoute']);

videoApp.config(function($routeProvider, $locationProvider, $sceProvider) {

     $sceProvider.enabled(false);
    $locationProvider.hashPrefix('');
    $routeProvider
    .when('/main', {
        templateUrl : 'views/main.html'
    })
    .when('/login', {
        templateUrl : 'views/login.html'
    })
    .when('/users', {
        templateUrl : 'views/users.html',
        controller : "parisCtrl"
    })
    .when('/play_video', {
        templateUrl : 'views/play_video.html',
        controller : "VideoController"
    })
    .when('/jobs', {
        templateUrl : 'views/jobs.html',
        controller : "londonCtrl"
    });
});

videoApp.controller("londonCtrl", function ($scope,$http) {
  
   $http.get("http://localhost/channels-video-tagging/server_v2.php")
   .then(function (response) {$scope.names = response.data.records;});
});


videoApp.controller("parisCtrl", function ($scope) {
    $scope.msg = "I love Paris";
});

videoApp.controller('VideoController', ['$scope', '$window', '$interval', '$http', function($scope, $window, $interval, $http) {
    $scope.videoDisplay = document.getElementById("VideoElement");
    //$scope.videoSource = $window.videoSource;
    //$scope.titleDisplay = $window.titleDisplay;
    //$scope.videoDescription = $window.videoDescription;
    $scope.videoPlaying = false;
    $scope.currentTime;
    $scope.totalTime;
    $scope.scrubTop = -1000;
    $scope.scrubLeft = -1000;
    $scope.vidHeightCenter = -1000;
    $scope.vidWidthCenter = -1000;
    $scope.isDragging = false;
    $scope.showOptions = false;
    $scope.playlist;
    $scope.urlSelect = null;
   
   $scope.selectedRow = null;  // initialize our variable to null
   $scope.setClickedRow = function(index,link,title,description,code){  //function that sets the value of selectedRow to current index
    $scope.selectedRow = index;
    $scope.urlSelect = link;
    $scope.autofillCode = code;
    //$scope.urlSelect = link +'?version=3&start=7';
    $scope.titleDisplay = title;
    $scope.videoDescription = description;
  }
     
   $http.get("http://localhost/channels-video-tagging/videos.php")
   .then(function (response) {$scope.video_list = response.data.records;});
   
    
    $scope.videoSelected = function(i) {
    $scope.titleDisplay = $scope.playlist[i].title;
    $scope.videoDescription = $scope.playlist[i].description;
    $scope.videoSource = $scope.playlist[i].path;
    $scope.videoDisplay.load($scope.videoSource);
    $scope.videoPlaying = false;
    $('#playBtn').children("span").toggleClass("glyphicon-play", true);
    $('#playBtn').children("span").toggleClass("glyphicon-pause", false);
    $scope.showOptions = false;
}
 $scope.btnName = "ADD";  
 $scope.insertData = function(){  
           if($scope.vcode == null)  
           {  
                alert("Video code is required");  
           }  
           else if($scope.vtags == null)  
           {  
                alert("Tags cannot be empty");  
           }  
           else  
           {  
                $http.post(  
                     "http://localhost/channels-video-tagging/upsert_tags.php",  
                     {'video_code':$scope.vcode, 'video_tags':$scope.vtags,
                     'video_in':$scope.din,'video_out':$scope.dout,
                     'video_details':$scope.det,'btnName':$scope.btnName,'clip_id':$scope.clipId}  
                ).then(function(response){  
                     alert(data);  
                     $scope.vcode = null;  
                     $scope.vtags = null;
                     $scope.din = null;
                     $scope.dout = null;
                     $scope.det = null;
                     $scope.clipId = null;
                     $scope.btnName = "ADD";  
                     $scope.displayData();  
                });  
           }  
      }  

      $scope.displayData = function(){  
           $http.get("http://localhost/channels-video-tagging/view_tags.php")  
           .then(function(response){  
                $scope.v_tags = response.data.records; 
           });  
      }  
      $scope.updateData = function(details,vin, vout,code,tags,clipId){  
                     $scope.vcode = code;  
                     $scope.vtags = tags;
                     $scope.din = vin;
                     $scope.dout = vout;
                     $scope.det = details;
                     $scope.clipId = clipId;
                     $scope.btnName = "Update"; 
      }  
    
}]);





