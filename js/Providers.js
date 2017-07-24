var Providers = angular.module("Providers", []);


Providers.service("User", function($http){
    this.changepass = function(datap){
      return $http({
        method: 'POST',
        url: 'user/changepass',
        data: {datap}
      });
    }

    this.userinfo = function(formdata){
      return $http({
        method: 'POST',
        url: 'user/userinfo',
        data: $.param(formdata),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    }

    this.companyinfo = function(formdata){
      return $http({
        method: 'POST',
        url: 'user/companyinfo',
        data: $.param(formdata),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    }

    this.logout = function(){
      return $http({
        method: 'GET',
        url: 'user/logout'
      });
    }

    this.loggedIn = function(){
      return $http({
        method: 'GET',
        url: 'user/logged_in',
      })
    }

    this.login = function(user, pass){
      
      var sendData = {
        'user':user,
        'pass':pass
      };
      console.log(sendData);
      return $http({
          method: 'POST',
          url: 'http://web.cafe-indica-163107.appspot.com/api/getpublic/login/',
          data: sendData
      });
    }

    this.setpass = function(datas){
      return $http({
        method: 'POST',
        url: 'user/setpass',  //Registration URL
        data: {datas}
      });
    }
    this.register1 = function(name, email, pass){
      var sendData = {
          'name':name,
          'email':email,
          'pass':pass
      }
      return $http({
            method: 'POST',
            url: 'http://web.cafe-indica-163107.appspot.com/api/public/register/',  //Registration URL
            data: sendData
            //headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
    }


    this.verify = function(formdata){
      return $http({
          method: 'POST',
          url: 'user/verify',  //Registration URL
          data: $.param(formdata),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
    };
    this.userRecovery = function(email){
      return $http({
        method: 'POST',
        url: 'user/recovery',
        data: {email}
      });
    };
    this.recoverysubmit = function(data){
      return $http({
        method: 'POST',
        url: 'user/recovery/submit',
        data: {data}
      });
    };

    this.get = function(attributes){
      return $http({
        method: 'GET',
        url: 'user/info',
        params: attributes
      });
    };
});



function checkUserLoginStatus(dataservice) {
      return dataservice.getAvengers();
  }

function checkUserLogout(dataservice){
    return dataservice.doLogoutProcess();
}