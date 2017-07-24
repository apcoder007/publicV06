publicApp.service("Data", function($http){
  this.state = function(id){

    var sendData = {
        'id':id
    }

    return $http({
      method: 'GET',
      data:sendData,
      url: ''
    })
  }

this.paymentCheckout = function(billing){
  return $http({
    method: 'POST',
    url: 'project/payment/checkout',
    data:{billing}
  })
}

  this.projectImage = function(id){
    return $http({
      method: 'GET',
      url: 'http://web.cafe-indica-163107.appspot.com/api/getprojectdisplaypic/'+id
    })
  }
  this.logout = function(){
    return $http({
      method: 'GET',
      url: '/#!/user/logout'
    })
  }
  this.order = function(id){
    return $http({
      method: 'GET',
      url: 'order/'+id
    })
  }

  this.projectpaymet = function(id){
    return $http({
      method: 'GET',
      url: 'payment/'+id
    })
  }
  this.projectacnt = function(id){
    return $http({
      method: 'GET',
      url: 'http://web.cafe-indica-163107.appspot.com/api/projectpayments/'+id
    })
  }
  this.projectuser = function(value){
    var sendData = {
      'id':value
    }
    return $http({
        method: 'POST',
        url: 'http://web.cafe-indica-163107.appspot.com/api/project/userdata',
        data:sendData
      })
  }

  this.projectpayment = function(payment){
    return $http({
      method: 'POST',
      url:'project/paymentdata',
      data:{payment}
    })
  }

  this.projectDetail = function(id){
    var sendData = {
      'id':id
    }
    return $http({
        method: 'POST',
        data: sendData,
        url: 'http://web.cafe-indica-163107.appspot.com/api/getpublic/projects/'
      })
    }
 this.addItem = function(Item, id, pack_items){
   return $http({
     method: 'POST',
     url: 'addItem',
     data: {Item, id, pack_items}
   })
 }
 this.removeItem = function(id, pack_items){
   return $http({
     method: 'POST',
     url: 'removeItem',
     data: {id, pack_items}
   })
 }
this.similarItem = function(id){
    return $http({
      method: 'GET',
      url: 'similarItem/'+id
    })
  }

  this.packages = function(route){
    return $http({
      method: 'GET',
      url: 'http://web.cafe-indica-163107.appspot.com/api/getpackageurl/',
      data:{route}
    })
  }

  this.packages1 = function(route){
    return $http({
      method: 'GET',
      url: 'http://web.cafe-indica-163107.appspot.com/api/getproductbytype/'+route,
      data:{route}
    })
  }

  this.catopackages = function(section){
    return $http({
      method: 'GET',
      url: 'http://web.cafe-indica-163107.appspot.com/api/getproductbysection/'+section
    })
  }
  this.stylepackages = function(style){
    return $http({
      method: 'GET',
      url: 'http://web.cafe-indica-163107.appspot.com/api/getproductbystyle/'+style
    })
  }

this.getsupersections = function(){
    return $http({
      method: 'GET',
      url: 'http://web.cafe-indica-163107.appspot.com/api/getall/sections/categories/'
    })
  }

  this.package = function(url){
    var sendData = {
      'url':url
    }
    return $http({
      method: 'POST',
      url: 'http://web.cafe-indica-163107.appspot.com/api/package',
      data:sendData
    })
  }
  this.item= function(id){
    return $http({
      method: 'GET',
      url: 'itemdetail/'+id
    })
  }
  this.items = function(query){
    var sendData={
      'params':query
    }
    return $http({
      method: 'POST',
      url: 'http://web.cafe-indica-163107.appspot.com/api/getcategoryItem/',
      data: sendData
    })
  }

  this.searchItem=function(limits,sort,section){
    return $http({
      method: 'GET',
      url: 'searchItem',
      params:{
      "limit[]":limits,
      "sorts":sort,
      "sections":section
    }
    })
  }

  this.categories = function(){
    return $http({
      method: 'GET',
      url: 'data/categories'
    })
  }
  this.how = function(){
    return $http({
      method: 'GET',
      url: 'data/how.json'
    })
  }

  this.successstory = function(){
    return $http({
      method: 'GET',
      url: 'data/success.json'
    })
  }



});

publicApp.service('Cart', function($http){
  this.toggleItem = function(item){
    return $http({
      method: 'POST',
      url: 'cart/toggle/item',
      data: item
    })
  }

  this.togglePackageItem = function(item){
    return $http({
      method: 'POST',
      url: 'cart/toggle/modpackageitem',
      data: item
    })
  }

  this.applyCoupon = function(code){
    return $http({
      method: 'POST',
      url: 'cart/Applycoupon',
      data: {'code' : code }
    })
  }

  this.descCount = function(item){
    return $http({
      method: 'POST',
      url: 'cart/desccount/item',
      data: item
    })
  }

  this.increCount = function(item){
    return $http({
      method: 'POST',
      url: 'cart/increcount/item',
      data: item
    })
  }

  this.togglePackage = function(package){
    return $http({
      method: 'POST',
      url: 'cart/toggle/package',
      data: package
    })
  }
});

publicApp.service('Post', function($http){
  this.callbackRequest = function(data){
    return $http({
      method: 'POST',
      url: 'request/callback',
      data: data
    })
  }

  this.designerRequest = function(data){
    return $http({
      method: 'POST',
      url: 'request/designer',
      data: data
    })
  }

  this.packageRequest = function(data){
    return $http({
      method: 'POST',
      url: 'request/package',
      data: data
    })
  }

  this.projecttimelinecomment = function(id , comment, comment_by){

    var sendData = {
      'id':id,
      'comment':comment,
      'comment_by':comment_by
    }
    return $http({
      method: 'POST',
      url: 'http://web.cafe-indica-163107.appspot.com/api/postcomments/',
      data: sendData
    })
  }

  this.itemRequest = function(data){
    return $http({
      method: 'POST',
      url: 'request/item',
      data: data
    })
  }

  this.orderCart =  function(data){
    return $http({
      method: 'POST',
      url: 'order/place',
      data: data
    })
  }
 this.confirmCod = function(data){
   return $http({
     method: 'POST',
     url: 'order/cod',
     data: data
   })
 }

});



// ///////////////////////////////// Dataservice for login logout session  //////////////////////////////

// publicApp.service('dataservice',function($http){
//       return {
//           getAvengers: getAvengers,
//           doLogoutProcess: doLogoutProcess
//       };

//       function getAvengers() {
//           return $http.get('/api/rest/check/status/')
//               .then(function(response){
//                 return response;
//               })
//               .catch(function(error){
//                  console.log('XHR Failed for getAvengers.' + error);
//               });
//       }

//       function doLogoutProcess(){

//         return $http.post('/api/logout/session/')
//               .then(function(response){
//                 return response;
//               })
//               .catch(function(error){
//                 console.log('XHR Failed for getAvengers.' + error);
//               });

//       }
//   })


////////////////////////////// Auth Service /////////////////////////////////////

publicApp.factory('Auth', function(){
var user;

return{
    setUser : function(aUser){
        user = aUser;
    },
    isLoggedIn : function(){
        return(user)? user : false;
    }
  }
})















publicApp.service('dataservice', function($http, $rootScope, $cookies){

  return{
    doLoginProcess: doLoginProcess,
    doLogoutProcess: doLogoutProcess,
    SetCredentials: SetCredentials,
    clearCredentials: clearCredentials,
    checkSession: checkSession
  };

  function doLoginProcess(username, password){
    var sendData = {
      'username':username,
      'password':password
    }

    return $http({
      method:'POST',
      data:sendData,
      url:''
    }).then(loginSuccess).catch(loginFailed);

    function loginSuccess(response){
      return response;
    }

    function loginFailed(error){
      console.log('XHR Failed for getAvengers.'+error);
    }
  }

  function doLogoutProcess(){
    return $http.Post('')
      .then(getLogoutComplete)
      .catch(getLogoutFailed)

      function getLogoutComplete(response){
        return response;
      }

      function getLogoutFailed(error){
        console.log('XHR Failed for getAvengers.'+error)
      }
  }


  function SetCredentials(username, password, userid){

    //var authdata  = Base64.encode(username+':'+password);
    var authdata  = Base64.encode(username+':'+password+':'+userid);
    $rootScope.globals = {
      currentUser:{
        username:username,
        authdata:authdata,
        userid:userid
      }
    };

    // set default auth header for http requests
    $http.defaults.headers.common['Authorization'] = 'Basic' + authdata;

    //store user details in globals cookie that keeps user logged in for 1 week (or ntil they logout)
    var cookieExp = new Date();
    cookieExp.setDate(cookieExp.getDate()+7);
    $cookies.putObject('globals', $rootScope.globals, {expires: cookieExp});

  }

  function checkSession(){
     $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentSession) {
          return true;
        
        }else{
          return false;
        }

  }

  function clearCredentials(){
    $rootScope.globals = {};
    $cookies.remove('globals');
    $http.defaults.headers.common.Authorization = 'Basic';
  }


});






var Base64 = {
 
        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
 
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };