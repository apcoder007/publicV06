publicApp.run(['$rootScope', '$location', '$cookies', '$http', function($rootScope, $location, $cookies, $http){

  $rootScope.globals = $cookies.getObject('globals') || {};
  if($rootScope.globals.currentUser){
    $http.defaults.headers.common['Authorization'] = 'Basic' + $rootScope.globals.currentUser.authdata;
    $rootScope.is_logged_in = true;
    $rootScope.show_controls = true;
  }else{
    $rootScope.is_logged_in = true;
    $rootScope.show_controls = true;
  }  

  

}]);

function checkUserLoginStatus(dataservice){
	return dataservice.getAvengers();
}

function checkUserLogout(dataservice){
	return dataservice.doLogoutProcess();
}