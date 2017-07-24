publicApp.controller('UserloginCtrl', ['$scope ', 'Data', '$routeParams', function($scope, Data, $routeParams){



}]);

publicApp.controller('ProjectcheckoutCtrl',['$scope', function($scope){

}]);

publicApp.controller('ProjectthanksCtrl', ['$scope', 'Data', '$routeParams', function($scope, Data, $routeParams){
  $scope.$parent.package_header = false;
  $scope.$parent.is_internal_page = true;
  console.log($routeParams.id);


  Data.projectpaymet($routeParams.id)
    .success(function(response){
      $scope.order = response;

    })
    .error(function(response){
      console.log(response);
    })
}])


publicApp.controller('ThanksCtrl', ['$scope', 'Data', '$routeParams', function($scope, Data, $routeParams){
  $scope.$parent.package_header = false;
  $scope.$parent.is_internal_page = true;

    $scope.$parent.heading = "Confirmation";
    $scope.$parent.step = 3 ;


    $scope.goToshop = function(){
      $location.path('/#/');
    }
  Data.order($routeParams.id)
    .success(function(response){
      $scope.order = response;

    })
    .error(function(response){
      console.log(response);
    })
}])

publicApp.controller('RecoveryCtrl',['$scope','User','$location', '$routeParams', function($scope,User,$location, $routeParams){
  $scope.recovery = {};
  $scope.recovery_step = false ;
  $scope.recoverySubmit = function(){
    console.log($scope.recovery.email);
    User.userRecovery($scope.recovery.email)
        .success(function(response){
          $scope.recovery_step = true;
          console.log('hi');
          console.log(response);
        })
        .error(function(response){
          console.log(response);
        })
      }

    $scope.verificationSubmit = function(){
      User.recoverysubmit($scope.recovery)
        .success(function(response){
            $location.path('/#/');
        })
        .error(function(response){
          console.log(response);
        })

    }
}]);

publicApp.controller('CheckoutCtrl', ['$scope', 'Data','$location', '$routeParams', 'Post','$templateCache', function($scope, Data, $location, $routeParams, Post, $templateCache){
  $scope.$parent.package_header = false;
    $scope.$parent.is_internal_page = true;
    $scope.$parent.heading = "My Details";

      $scope.order = {};

      $scope.order.billing = {};
      $scope.order.shipping = {};
      $scope.errors = {};
      $scope.order.billing_same = false;
      $scope.order.cod = false;
      if ($location.url() == "/order/details") {
        $scope.$parent.heading = "My Details";
          $scope.$parent.step = 1 ;

      } else if ($location.url() == "/order/checkout") {
        $scope.$parent.heading = "My Payment";
          $scope.$parent.step = 2 ;
      }



      $scope.$watch('shippingIsSameAsBilling', function(value) {
        if(value) {
          $scope.order.billing = $scope.order.shipping ;
        } else {
          $scope.order.billing= {};
        }
      });


      if($scope.order.billing_same){

        $scope.order.billing = $scope.order.shipping;
      }

      $scope.cart.codcheckout = function(){

        Post.confirmCod($scope.order)
          .success(function(response){
            $scope.orderid = response.id;
            $location.path('/order/'+$scope.orderid+'/recieved');
          })
          .error(function(err){
              console.log(err);
          });

      }

      $scope.cart.checkout = function(){
        if($scope.order.cod){
          $scope.checkpath = '/order/codcheckout';
        }
        else {
          $scope.checkpath = '/order/checkout';
        }

        Post.orderCart($scope.order)
          .success(function(response){
            $scope.errors.shipping = {};
            $templateCache.removeAll();

            if($location.path() == $scope.checkpath){
              $route.reload();
            }
            $location.path($scope.checkpath);
            $scope.hideCart();
          })
          .error(function(response){
            console.log(response);
            string_to_parse_billing = '{';
            string_to_parse_shipping = '{';
            count_billing = 0;
            count_shipping = 0;
            angular.forEach(response, function(value, key){
              if(key.indexOf('billing') > -1){
                if(count_billing != 0){
                  string_to_parse_billing += ", "
                }
                count_billing++;
                string_to_parse_billing += '"'+key.split('.')[1] +'" : true';
              }
              if(key.indexOf('shipping') > -1){
                if(count_shipping != 0){
                  string_to_parse_shipping += ", "
                }
                count_shipping++;
                string_to_parse_shipping += '"'+key.split('.')[1] +'" : true';
              }
            })
            string_to_parse_billing += '}';
            string_to_parse_shipping += '}';
            $scope.errors.shipping=(JSON.parse(string_to_parse_shipping));
            $scope.errors.billing=(JSON.parse(string_to_parse_billing));
          })
      }
}])

publicApp.controller('HomeCtrl', ['$scope', '$rootScope', 'dataservice','$localStorage', '$interval', 'Data','$timeout','$location' ,'$routeParams', 'User','$window',function($scope, $rootScope, dataservice,$localStorage, $interval,Data, $timeout,$location,$routeParams,User,$window){
  $scope.$parent.is_internal_page = false;
  $scope.$parent.show_small_header = false;
  $scope.$parent.package_header = false;
  $scope.password = {};

  $scope.loginStatus= dataservice.checkSession();
  if($scope.loginStatus){
    console.log($rootScope.globals.currentSession.responseData);
    $scope.syncState($rootScope.globals.currentSession.responseData);

    $scope.loggedin = true;
    $localStorage.login_user_id = $rootScope.globals.currentSession.responseData['user'][0]['id'];

  }
  // $interval($rootScope.$broadcast('changeImage'), 3000);

  if($location.path() == "/user/logout"){
      dataservice.clearCredentials();
  }
  $scope.logOut = function(){
    dataservice.clearCredentials();
  }

  if ($location.path() == "/user/logout") {

    Data.logout()
    .success(function(){
      $scope.$parent.is_logged_in = false;
      $scope.$parent.show_controls = true;
      $location.path('/');
      Data.state($localStorage.login_user_id)
        .success(function(response){

          $scope.syncState(response);

        })
        .error(function(response){
        })
    })
    .error(function(){
    })

  }

  $timeout(function(){
     $interval(function(){
        $scope.$broadcast('changeImage');
     }, 6000);
  });
  // $rootScope.$broadcast('changeImage');
  $scope.Cngpassword = function(form){
    if($scope.password.new != $scope.password.confirmation){
      focus('confirmaation-password');
      console.log("Wrong password");
      return false;
    }
    User.changepass($scope.password)
      .success(function(response){
        console.log(response);
      })

      .error(function(response){
      })
  };
  $scope.Setpassword =  function(form){
    if(form.$invalid){
      focus('login-name');
      return false;
    }
    User.setpass($scope.password)
      .success(function(response){
        console.log(response);
        $location.path('/');
        $window.location.reload();
      })
      .error(function(response){
        console.log(response);
      })
  };

  $scope.gotoItemlist=function(cat){
    $location.path('itemlist');
    // console.log(cat);
  }

}]);

publicApp.controller('BookmarksCtrl', ['$scope', 'bookmarks', function($scope, bookmarks){
  $scope.bookmarks = bookmarks;
}]);




publicApp.controller('BulkOrderCtrl', ['$scope', '$mdDialog', '$http', function($scope, $mdDialog, $http){
  $scope.bulk = {};
  $scope.stage = 0;
  $scope.cancel = function(){
    $mdDialog.cancel();
  }
  $scope.submit = function(ev){
    $scope.errors = {};
    ev.preventDefault();
    var fd = new FormData();
    if($scope.bulk.name){
      fd.append('name', $scope.bulk.name);
    }
    if($scope.bulk.email){
      fd.append('email', $scope.bulk.email);
    }
    if($scope.bulk.mobile){
      fd.append('mobile', $scope.bulk.mobile);
    }
    if($scope.bulk.company){
      fd.append('company', $scope.bulk.company);
    }
    if($scope.bulk.description){
      fd.append('description', $scope.bulk.description);
    }
    if($scope.bulk.file){
      fd.append('file', $scope.bulk.file);
    }
    $http.post('bulk/new', fd,
      { transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      }
    ).success(function(response){
      $scope.stage = 1;
      $scope.bulk = response;
    }).error(function(response){
      $scope.errors = response;
    })

  }
}]);


publicApp.controller('TopLevelCtrl', ['$scope', '$localStorage', '$mdDialog', '$mdMedia', '$location', '$route', '$http', 'Post', '$timeout','Data', 'Cart','User' ,'$templateCache', '$window',
  function($scope, $localStorage, $mdDialog, $mdMedia, $location, $route, $http, Post, $timeout,Data, Cart,User , $templateCache, $window){

  $scope.scrollToTop = function(){
    $('body').animate({scrollTop: 0}, 300);
  }



  $scope.package_header = false;
  $scope.login_window = false;
  $scope.is_logged_in = false;
  $scope.show_pro_image = false;
  $scope.bookmark = {};
  $scope.bookmark.package_ids = [];
  $scope.bookmark.item_ids = [];
  $scope.bookmark.packages = [];
  $scope.bookmark.items = [];
  $scope.modpackage = {};
  $scope.cart = {};
  $scope.cart.items = [];
  $scope.cart.item_ids = [];
  $scope.cart.packages = [];
  $scope.cart.package_ids = [];
  $scope.bookmarks_active = false;
  $scope.callback_minimized = false;
  $scope.show_overlay = false;
  $scope.backDrop = false;
  $scope.callback = {};
  $scope.callback.active = false;
  $scope.show_lists = false;
  $scope.packagepage = false;
  $scope.enlargeimagev = false;
  $scope.showprodetails = false;


  $scope.user={};
  $scope.user.name='Guest';
  $scope.pass_show= false ;
  $scope.set_pass = false ;
  $scope.verify_show = false ;
  $scope.reg_show = false ;
  $scope.user_permission  = false ;
  $scope.heading = "Shopping Cart"

  $scope.step = 0 ;


  $scope.tooltip = false;


  $scope.$watch('cart', function(newVal, oldVal){  }, true);
  $scope.$watch('order', function(newVal, oldVal){ }, true);

$scope.syncCart = function(response,item,tempcount){
  $scope.idtemp = item.id;
  $scope.cart.total_price = response.cart.total_price;
  $scope.cart.total_itemo = response.cart.total_itemo;
  angular.forEach($scope.cart.items,function(item){

     if(item.id == $scope.idtemp)
     {
       item.count = tempcount;
     }


   })
}


  $scope.syncState = function(response){

    $scope.user = {};
    $scope.project = false;
    $scope.cart.items = [];
    $scope.cart.item_ids = [];
    $scope.cart.packages = [];
    $scope.cart.package_ids = [];
    if(response.user){
      $scope.is_logged_in = true;
      $scope.user = response.user;
    }
    if(response.modpackage){


      $scope.modpackage = response.modpackage;
      if($scope.modpackage){

      }

    }
    if(response.project){
      $scope.project = response.project;
    }
    if(response.cart){
      if(response.cart.items){
        $scope.cart.items_price = response.cart.items_price;
        response.cart.items.forEach(function(item, index){
          $scope.cart.item_ids.push(item.id);
          $scope.cart.items.push(item);
        });
      }
      if(response.cart.packages){
        $scope.cart.packages_price = response.cart.packages_price;
        response.cart.packages.forEach(function(package, index){
          $scope.cart.package_ids.push(package.id);
          $scope.cart.packages.push(package);
        });
      }
      $scope.cart.total_price = response.cart.total_price;
      $scope.cart.total_itemo = response.cart.total_itemo;
    }
    // console.log($scope.cart);
  }

  Data.state($localStorage.login_user_id)
    .success(function(response){
      $scope.syncState(response);
    })
    .error(function(response){
    })


      $scope.$on('$viewContentLoaded', function(event) {
        $window.ga('send', 'pageview', { page: $location.url() });

      });


      $scope.descCount = function(item){
        // console.log(item);
        $scope.idtemp = item.id;
        $scope.tempcount = item.count;

        if (item.count > 1){
          Cart.descCount(item)
            .success(function(response){
              $scope.tempcount = $scope.tempcount - 1;
              $scope.syncCart(response,item,$scope.tempcount);

              })
            .error(function(response){
              console.log(response);
            })
        }
        else if(item.count==1){
          $scope.cart.toggleItem(item);
        }

        //  Cart.descCount()

      }
      $scope.increCount = function(item){
        $scope.idtemp = item.id;
        $scope.tempcount = item.count;
        Cart.increCount(item)
          .success(function(response){
            $scope.tempcount = $scope.tempcount + 1;
            $scope.syncCart(response,item,$scope.tempcount);
          })
          .error(function(response){
            console.log(response);
          })

      }

      $scope.mydetail = function(){

        $location.path('order/details');
      }

      $scope.goToshopping =  function(){
        $location.path('/#/');
      }


  $scope.cart.toggleItem = function(item){
    Cart.toggleItem(item)
      .success(function(response){
        $scope.syncState(response);
      })
      .error(function(response){
        console.log(response);
      })
  }

  $scope.cart.togglePackage = function(package){

    Cart.togglePackage(package)
      .success(function(response){

        $scope.syncState(response);
      })
      .error(function(response){
        console.log(response);
      })
  }

$scope.Applycoupon = function(couponcode){
  console.log(couponcode);
    $scope.code = couponcode;
  Cart.applyCoupon($scope.code)
    .success(function(response){

       $scope.cart.total_price = response;

     })
     .error(function(response){
       console.log(response);
     })

}

$scope.goCart = function(){

  $scope.heading = "Shopping Cart";
  $scope.step = 0 ;
  $scope.package_header = false;
  $location.url('/order/cart');

}

$scope.goTowishlist = function(){
  $scope.package_header = false;
  $location.url('/order/wishlist');
}



  $scope.showBulkOrderForm = function(ev){
    var bulk_button = angular.element('#bulk-orders-btn');
    var body = angular.element(document.body);
    $mdDialog.show({
      templateUrl: 'dialog/bulk-order',
      controller: 'BulkOrderCtrl',
      targetEvent: ev,
      openFrom: bulk_button,
      parent: body
      // disableParentScroll: false
    });
  }

  $scope.showPackage = function(package){
    $scope.clickedPackage = package;
    $location.path('package/'+package.id);
  }

  $scope.showItem = function(item){
    $scope.clickedItem = item;
    $location.path('item/'+item.id);
  }

  $scope.bookmark.package = function(package){
    if($scope.bookmark.package_ids.indexOf(package.id) > -1){
      $scope.bookmark.package_ids.splice($scope.bookmark.package_ids.indexOf(package.id), 1);
      $scope.bookmark.packages.splice($scope.bookmark.packages.indexOf(package), 1);
      $scope.nofbookmark =$scope.nofbookmark -1;
    }
    else{
      $scope.bookmark.packages.push(package);
      $scope.bookmark.package_ids.push(package.id);
      $scope.nofbookmark = $scope.nofbookmark +1 ;
    }
  }
  $scope.bookmark.item = function(item){
    if($scope.bookmark.item_ids.indexOf(item.id) > -1){
      $scope.bookmark.item_ids.splice($scope.bookmark.item_ids.indexOf(item.id), 1);
      $scope.bookmark.items.splice($scope.bookmark.items.indexOf(item), 1);
      $scope.nofbookmark = $scope.nofbookmark -1 ;
    }
    else{
      $scope.bookmark.items.push(item);
      $scope.bookmark.item_ids.push(item.id);
      $scope.nofbookmark = $scope.nofbookmark +1 ;
    }
  }

  $scope.toggleBookmarks = function(){
    if($scope.bookmark.items.length +$scope.bookmark.packages.length != 0){
      $scope.bookmarks_active = !$scope.bookmarks_active;
      $scope.show_overlay = $scope.bookmarks_active;
    }
  }

  $scope.toggleLogin = function(){
    $scope.login_active = !$scope.login_active;
  }

  $scope.hideBookmarks = function(){
    $scope.bookmarks_active = false;
    $scope.show_overlay = $scope.bookmarks_active;
  }

  $scope.toggleCart = function(){
    if($scope.cart.items.length + $scope.cart.packages.length != 0){
      $scope.cart.active = !$scope.cart.active;
      $scope.show_overlay = $scope.cart.active;
    }
  }

  $scope.hideCart = function(){
    $scope.cart.active = false;
    $scope.show_overlay = $scope.cart.active;
  }

  $scope.scrollToNext = function(){
    // console.log(current_section);
    if(current_section == 2){
      var elm = $('#footer');
      $('body').animate({scrollTop: elm.offset().top-110}, 500);
    }
    if(current_section == 1){
      var elm = $('#flow-chart');

      current_section = 2;
      $('body').animate({scrollTop: elm.offset().top-110}, 500);
      return;
    }
  }

  $scope.search={};
  $scope.search.query=""
  $scope.disable=true;
  $scope.visible=true;

  $scope.showSearch = function(){
    // console.log($scope.search.query.length);
    if($scope.search.query.length<2){
       return;
     }
    $scope.disable = false;
    $http({
      method: 'GET',
      url: 'search'
    }).success(function(response){
      // console.log(response);
      $scope.search_results = response;
      $scope.visible=false;
    })

  }
  $scope.hideSearch = function(){
    $scope.disable=true;
  }




  $scope.requestCallback = function(){
    if(!$scope.requestCallbackForm.$valid){
      return;
    }

    Post.callbackRequest($scope.callback)
      .success(function(response){
        $scope.callback.requested = true;
          $scope.callback_minimized = false;

      })
      .error(function(response){
        // console.log('error');
        // console.log(response);
      });
  }

  $scope.requestChat = function(){
    
  }

  $scope.popup = {};
  $scope.request = {};

  $scope.popup.designer = function(){
    $scope.request_dialog = true;
    $scope.requested = false;
    $scope.request.form = 'request/form/designer';
  }

  $scope.popup.item = function(){
    $scope.request_dialog = true;
    $scope.requested = false;
    $scope.request.form = 'request/form/item';
  }

  $scope.popup.package = function(){
    $scope.request_dialog = true;
    $scope.requested = false;
    $scope.request.form = 'request/form/package';
  }

  $scope.popup.login = function(){
    $scope.request_dialog = true;
    $scope.requested = false;
    $scope.request.form = 'request/form/login';
  }

}]);

publicApp.controller("calendarCtrl",function($scope,$filter,$q,$timeout,$log,MaterialCalendarData,Data){

  $scope.selectedDate = [] ;

  var today=new Date();

  $scope.timeline_msg = '';
  $scope.timeline_attachment = '';

  $scope.weekStartsOn=0;
  $scope.dayFormat="d";
  $scope.tooltips=true;
  $scope.disableFutureDates=true;
  $scope.clearDataCacheOnLoad = true;

    $scope.setDirection=function(direction){
      $scope.direction=direction;
      $scope.dayFormat=direction==="vertical"?"EEEE, MMMM d":"d";
    };


    $scope.dayClick=function(date){
      var key=[date.getFullYear(),numFmt(date.getMonth()+1),numFmt(date.getDate())].join("-");
      console.log($scope.$parent.timeline_time);
      $scope.$parent.dataofoneday = $scope.$parent.timeline_time[key]  ;
      $scope.$parent.datekey = key;
      var targetId = "#box"+key;
      console.log(targetId);
      var destination = $(targetId).offset().top - 90;
      console.log(destination);
        $('html, body').animate({scrollTop: destination}, 300);
    };
    $scope.prevMonth=function(data){


      $scope.msg="You clicked (prev) month "+ data.month+", "+ data.year;
    };
    $scope.nextMonth=function(data){

      $scope.msg="You clicked (next) month "+ data.month+", "+ data.year;
    };
    $scope.setContentViaService=function(){
      var today=new Date();
    MaterialCalendarData.setDayContent(today,'<span> hi </span>')
    }

    $scope.dateFormat = function(numb){
    }


    $scope.dateSel.dateSelected = function(){
      $scope.selectedDate =[];

      angular.forEach($scope.$parent.timeline_gby_time, function(value, key){

        var k = new Date(key);
        var monthselect = key.split('-');
        
        $scope.months = monthselect[1];
        console.log($scope.months);


        console.log(k.toISOString());

        $scope.dateformat = key.replace(/-+/g,'/');

        //$scope.selectedDate.push(new Date($scope.dateformat));
        $scope.selectedDate.push(k.toISOString());

      });

    }


    var numFmt=function(num){

      num=num.toString();
      if(num.length<2){
        num="0"+ num;
      }
    return num;
    };

    var loadContentAsync=true;

    $log.info("setDayContent.async",loadContentAsync);

    $scope.$parent.setInitialday= function(){
      $scope.timeline_msg = '';
      $scope.timeline_attachment = '';
      angular.forEach($scope.$parent.timeline_gby_time, function(value, key){
        if (value.message) {
          $scope.timeline_msg = value.message;
        }
    if(value.type == "IMAGE"){
      if(! $scope.timeline_attachment.match("\n <i class='material-icons'>collections</i>")){
          $scope.timeline_attachment += "\n <i class='material-icons'>collections</i>";
      };


    }
    if(value.type == "PANORAMA"){
      if(! $scope.timeline_attachment.match("\n <i class='material-icons'>wallpaper</i>")){
          $scope.timeline_attachment += "\n <i class='material-icons'>wallpaper</i>";
      }

    }
    if(value.type == "PDF"){
      if(! $scope.timeline_attachment.match("\n <i class='material-icons'>picture_as_pdf</i>")){
          $scope.timeline_attachment += "\n <i class='material-icons'>picture_as_pdf</i>";
      }

    }
    if(value.type== "EXCEL" || "WORD_DOC" || "TEXT_FILE" || "OTHER"){
      if(! $scope.timeline_attachment.match("\n <i class='material-icons'>attachment</i>")){
          $scope.timeline_attachment += "\n <i class='material-icons'>attachment</i>";
      }
    }

  });

    var data=("<div  style='font-size:18px'>"   +$scope.timeline_attachment+ "</div>");
    if(loadContentAsync){
      var deferred=$q.defer();
      $timeout(function(){
        deferred.resolve(data);
        });
      return deferred.promise;
    }
    return data;
      };



    $scope.setDayContent=function(date){
        $scope.timeline_msg = '';
        $scope.timeline_attachment = '';
        var key=[date.getFullYear(),numFmt(date.getMonth()+1),numFmt(date.getDate())].join("-");
        if($scope.$parent.timeline_gby_time.hasOwnProperty(key)){
          angular.forEach($scope.$parent.timeline_gby_time[key], function(value, key){
            if (value.message) {
              $scope.timeline_msg = value.message;
            }
        if(value.type == "IMAGE"){
          if(! $scope.timeline_attachment.match("\n <i class='material-icons'>collections</i>")){
              $scope.timeline_attachment += "\n <i class='material-icons'>collections</i>";
          };


        }
        if(value.type == "PANORAMA"){
          if(! $scope.timeline_attachment.match("\n <i class='material-icons'>wallpaper</i>")){
              $scope.timeline_attachment += "\n <i class='material-icons'>wallpaper</i>";
          }

        }
        if(value.type == "PDF"){
          if(! $scope.timeline_attachment.match("\n <i class='material-icons'>picture_as_pdf</i>")){
              $scope.timeline_attachment += "\n <i class='material-icons'>picture_as_pdf</i>";
          }

        }
        if(value.type== "EXCEL" || "WORD_DOC" || "TEXT_FILE" || "OTHER"){
          if(! $scope.timeline_attachment.match("\n <i class='material-icons'>attachment</i>")){
              $scope.timeline_attachment += "\n <i class='material-icons'>attachment</i>";
          }
        }

      });


    }



  var data=("<div  style='font-size:18px'>"   + "</div>");
    if(loadContentAsync){
      var deferred=$q.defer();
      $timeout(function(){
        deferred.resolve(data);
        });
      return deferred.promise;
    }
    return data;
      };
  });

publicApp.controller('ProaccountsCtrl',['$scope', 'Data' ,'$location','$routeParams',function($scope, Data, $location, $routeParams){
  $scope.payments= {};

  Data.projectacnt($routeParams.id)
  .success(function(response){
    console.log(response);
    $scope.payments = response.payments;
    $scope.project_cost = response.project_cost;

  })
  .error(function(response){
    console.log(response);
  })

  $scope.goToaddress = function(pay){
    console.log(pay);

    Data.projectpayment(pay)
    .success(function(response){


    })
    .error(function(response){

    })

    $location.path('/projects/address');
  }

}]);

publicApp.controller('ProaddressCtrl', ['$scope','Data','$location', function($scope, Data, $location){
  $scope.payment = {};

  $scope.goPayments = function(){

  }

  $scope.projectpayment = function(){

    Data.paymentCheckout($scope.payment)
      .success(function(response){

        $location.path('/project/checkout');
      })
      .error(function(response){

        $location.path('projects/accounts');
      })
  }

}]);

publicApp.controller('ProjectCtrl',['$scope' ,'Data','Post', '$sce','$http','$location', '$localStorage', function($scope,  Data, Post, $sce,$http,$location, $localStorage){
  $scope.$parent.package_header = false;
  $scope.progress = 0;
  $scope.$parent.showprodetails = false;
  $scope.pro_paths = 'https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis';
  $scope.timeline = {};
  $scope.comments = {};
  $scope.prostatus = {};
  $scope.paths12 = 'https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis/projectfile/1_1_1472192963vNaD.pdf';
  $sce.RESOURCE_URL = 'https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis';
  $scope.projectkey = '';
  $scope.selectedproj = 1;
  $scope.lengthproj = 0;
  $scope.var ='';
  $scope.dataofoneday = {};
  $scope.datekey = "2016-01-01";
  $scope.projstatusdata = {"Negotiation" : 0 , "Design" : 1 , "Execution" : 2 , "Finished" : 3 , "Closed" : 3};
  $scope.dayFormat = "d";
  $scope.dateSel = {};
  $scope.setInitialday = {};


  var numFmt=function(num){
    num=num.toString();
      if(num.length<2){
        num="0"+ num;
        }
        return num;
      };


  $scope.today = new Date();

  $scope.datekey  =[$scope.today.getFullYear(),numFmt($scope.today.getMonth()+1),numFmt($scope.today.getDate())].join("-");
 // To select a single date, make sure the ngModel is not an array.
 $scope.selectedDate = null;

 // If you want multi-date select, initialize it as an array.
 $scope.selectedDate = [];

 $scope.firstDayOfWeek = 0; // First day of the week, 0 for Sunday, 1 for Monday, etc.
 $scope.setDirection = function(direction) {
   $scope.direction = direction;
   $scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
 };


 $scope.tooltips = true;


 $scope.selectProjects=function(value){

   Data.projectuser(value['id'])
   .success(function(response){

     console.log(response);
     $scope.timeline_gby_time = response.timeline_time;
     $scope.timeline_dby_id = response.timeline_id;
     $scope.timeline_time = response.new_timeline;
     $scope.projectkey = value.code;

     $scope.dateSel.dateSelected();
   })
   .error(function(response){
     console.log(response);
   })


 }


  Data.projectDetail($localStorage.login_user_id)
    .success(function(response){

      
      $scope.timelines = response.timeline;

      $scope.$parent.show_lists = false;
      $scope.prostatus =  response.project_status;

      $scope.user_projects = response.project_user;

      $scope.projid = $scope.user_projects[0]['id'];
      $scope.timeline_gby_time = response.project_timeline_time;
      $scope.timeline_time = response.new_timeline;

      $scope.lengthproj = Object.keys($scope.timelines).length;
      $scope.projectkey = Object.keys($scope.prostatus)[0];

      $scope.selectedproj = $scope.projectkey;
      $scope.progress = $scope.projstatusdata[$scope.prostatus[$scope.selectedproj][0]['status']];
      $scope.comments = response.protimecomment;
      //console.log($scope.comments);
      $scope.dateSel.dateSelected();
      $scope.setInitialday();
    })
    .error(function(response){
      console.log(response);
    })


    $scope.projectDetailsdate = function(details){

      $scope.$parent.showprodetails = true;
      $scope.daywisedetails = details;
    }


    $scope.commentshas = function(id){
      if ($scope.comments[id]) {
              $scope.timecomment =  $scope.comments[id];
              return true;
            }
          }

  $scope.smallimages = function(){
        $scope.$parent.enlargeimagev =  ! $scope.$parent.enlargeimagev;
      }
  $scope.toggleDetails = function(){
    $scope.$parent.showprodetails = ! $scope.$parent.showprodetails;
  }

  $scope.getUrl = function(pdfpath){
    $scope.pdfpath = pdfpath;
     var fileURL = {};
    $scope.currentProjectUrl = "http:/"+$scope.pro_paths+ '/' + $scope.pdfpath;

    $http.post($scope.currentProjectUrl , {responseType:'arraybuffer'})
        .success(function (response) {
          var file = new Blob([response], {type: 'application/pdf'});
          var fileURL = URL.createObjectURL(file);
          $scope.content = $sce.trustAsResourceUrl(fileURL);
          return $scope.content;
        });
      }


$scope.viewPanorama = function(path){

  $scope.$parent.showprodetails = false;
  //panoramaimage = '//s3-us-west-2.amazonaws.com/thisisnotarandomstringinfactnoneis/panorama/'+path;
  panoramaimage = 'https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis/panorama/'+path;
  showPanorama();
}

  $scope.setDate = function(key1){
    $scope.vardate = key1;
    return  $scope.vardate;
  }
   $scope.setKey = function(key){

     $scope.projectkey = key;
     $scope.selectedproj = key;
     $scope.progress = $scope.projstatusdata[$scope.prostatus[$scope.selectedproj][0]['status']];
   }

  $scope.imageenlarge = function(path){
        $scope.$parent.enlargeimagev = true;
        $scope.path = path;
      }

    $scope.projecttimelinecomment = function(Comment,id){
      $scope.id = id ;


      $scope.comment = Comment;
      Post.projecttimelinecomment($scope.id , $scope.comment, $localStorage.login_user_id)
        .success(function(response){
          $scope.timeline.Comment = "";
          Data.projectDetail($localStorage.login_user_id)
            .success(function(response){
              $scope.timelines = response.timeline;
              $scope.progress  = response.status;
              $scope.comments = response.protimecomment;
            })
            .error(function(response){
              console.log(response);
            })
        })
        .error(function(response){
        });
    }

    $scope.goToaccounts =  function(id){
        $location.path('/projects/'+id+'/accounts');
    }

}]);

publicApp.controller('RequestCtrl', ['$scope', '$timeout', 'Post', function($scope, $timeout, Post ){
  $scope.close = function(){
    $scope.$parent.$parent.request_dialog = false;
  }
  $scope.designer = {};
  $scope.request.designer = function(){
    Post.designerRequest($scope.designer)
      .success(function(response){
        $scope.$parent.$parent.requested = true;
        $timeout(function(){
          $scope.close()
        }, 3000);
      })
  }

  $scope.request.item = function(){
    $scope.item.item_id = $scope.itmid;
    Post.itemRequest($scope.item)
      .success(function(response){
        $scope.$parent.$parent.requested = true;
        // console.log(response);
        $timeout(function(){
          $scope.close()
        }, 3000);
      })
  }

  $scope.request.package = function(){
    $scope.package.package_id = $scope.package_id;
    Post.packageRequest($scope.package)
      .success(function(response){
        $scope.$parent.$parent.requested = true;
        $timeout(function(){
          $scope.close()
        }, 3000);
      })
  }
}]);




publicApp.controller('loginCtrl', ['$scope', '$cookies', '$rootScope', 'User', '$document', '$mdToast','$location', '$window', '$localStorage', function($scope, $cookies, $rootScope, User, $document, $mdToast,$location,$window, $localStorage){
 // $scope.$parent.pass_show= true;
  //  $scope.user={}
  $scope.passworderrors =  false;
  $scope.errstate = 10;
  $scope.login_resistration = true;
  $scope.close = function(){
    $scope.$parent.$parent.request_dialog = false;
    $scope.$parent.$parent.set_pass= false ;
    // $scope.$parent.$parent.requested = true;
    $scope.$parent.$parent.pass_show =false;
      $scope.p_login1 = false;
      $scope.p_login2 = false;
      $scope.p_changepass = false;
  }
  // console.log($scope.user);1
  $scope.closeWindow = function(){
    $scope.$parent.login_window = ! $scope.$parent.login_window;
  }

$scope.submitsetPass = function(form){
  var data = {
    'mobile' : $scope.user.mobile,
    'email' : $scope.user.email,
    'password' : $scope.user.password,
    'password_confirmation' : $scope.user.password_confirmation
  }
  if(form.$invalid){
    focus('set-password');
    return false;
  }
  $scope.p_changepass = true;

  User.setpass(data)
    .success(function(response){
      $scope.p_changepass = false;
    })

}



  $scope.submitVerify = function(form){
    if(form.$invalid){
      focus('verification-code');
      return false;
    }
    $scope.p_verify = true;

    User.verify($scope.user)
      .success(function(response){
        if(response.result){
          $scope.p_verify = false;
          $scope.$parent.$parent.form_url = 'form/login2';
          $scope.$parent.$parent.user = response.user;
          // $scope.$parent.$parent.verify_show= false ;


          $mdToast.show(
            $mdToast.simple()
              .textContent(response.msg)
              .parent($document[0].querySelector('.popup-content'))
              .position('center center')
              .hideDelay(2000)

          );
          $scope.$parent.$parent.verify_show= false ;
            $scope.$parent.$parent.pass_show= true;

        }
        else{
          focus('verification-code');
          $scope.p_verify = false;
          $mdToast.show(
            $mdToast.simple()
              .textContent(response.msg)
              .parent($document[0].querySelector('.popup-content'))
              .position('center center')
              .hideDelay(2000)
          );
        }
      })
      .error(function(response){
        console.log(response);
      })
  }

$scope.Resistration = function(Resistrationform){
  var name = $scope.user.name;
  var email = $scope.user.email;
  var password = $scope.user.password;
  var confirmpassword = $scope.user.password_confirmation;

  // alert(name+" "+email+" "+password+" "+confirmpassword);
  $scope.matchpass = false;
  
  if(password != confirmpassword){
    $scope.matchpass = true;

  }else{
    $scope.matchpass = false;
    User.register1(name, email, password)
        .success(function(response){

          $scope.login_resistration = true;
        })
        .error(function(response){
          console.log(response);
        });
  }

}


  $scope.submitRegister = function(form){
    if(form.$invalid){
      focus('register-name');
      return false;
    }
    $scope.p_register = true;
    User.register($scope.user)
      .success(function(response){
        $scope.$parent.$parent.reg_show= false;
        $scope.$parent.$parent.verify_show = true;
        $mdToast.show(
          $mdToast.simple()
            .textContent(response.msg)
            .parent($document[0].querySelector('.popup-content'))
            .position('top right')
            .hideDelay(2000)
        );
        $scope.p_register = false;
        $scope.$parent.$parent.user.password = "";
        $scope.$parent.$parent.user.password_confirmation = "";
      })
      .error(function(response){
        $scope.p_register = false;
        $scope.$parent.$parent.user.password = "";
        $scope.$parent.$parent.user.password_confirmation = "";
        $mdToast.show(
          $mdToast.simple()
            .textContent(response.email)
            .parent($document[0].querySelector('.popup-content'))
            .position('top right')
            .hideDelay(2000)
        );
      })
  }

  // set credentials
  



  $scope.submitLogin2 = function(form){

    $scope.loggedin = false;
    $scope.dataLoading = true;

    if($scope.user.email == null){
      $window.location.reload();
    }

    $scope.p_login2 = false;
    User.login($scope.user.email, $scope.user.password)
      .success(function(response){
        $scope.$parent.login_window = false;

        $rootScope.globals = {
                currentSession: {
                    username: $scope.user.email,
                    responseData: response
                }
            };

        var cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 7);
        $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
 
        
        $scope.syncState(response);
        $scope.loggedin = true;
        $localStorage.login_user_id = response['user'][0]['id'];
        
      })
      .error(function(response){
          console.log("Error in getting login");
          $scope.dataLoading = false;
      })
  }


  $scope.login = function(form){
    if(form.$invalid){
      focus('login1-email');
      return false;
    }
    $scope.p_login1 = true;
    User.get({email: $scope.user.email})
          .success(function(response){
            $scope.p_login1 = false;

            if(response.state == 3){
              $scope.user = response.user;
              $scope.$parent.requested = false;
              $scope.$parent.pass_show= true;
            }
          })
          .error(function(response){
          if(response.state == 1){
              $scope.$parent.set_pass= true ;
              $scope.$parent.requested = false;
            }
            if(response.state == 2){
              $scope.user = response.user;
              $scope.$parent.verify_show= true ;
              $scope.$parent.requested = false;
            }
            if(response.state == 0){
              $scope.$parent.reg_show= true ;
              $scope.$parent.requested = false;
            }
          })
  }
}])


publicApp.controller('NavCtrl', ['$scope', 'Data', '$location', function($scope, Data, $location){
  $scope.categories = [];
  // Data.categories()
  //   .success(function(categories){
  //     $scope.categories = categories;
  //   })

  $scope.scrollTo = function(id){
    // console.log(id);
    var elm = $(id);
    $('body').animate({scrollTop: elm.offset().top-60}, 500);
  }

  $scope.gotoPackages = function(type){
    $location.path('packages/'+type);
  }

  $scope.gotoItemlist=function(cat){
    $location.path('itemlist');
  }

  $scope.showFurnitureSubNav = function(){
    var toShow = $('#furniture-subnav');
    var btn = $('#nav-btns #furniture-btn');
    var subnav_package = $('#package-subnav');
    subnav_package.addClass('hide-active');
    toShow.removeClass('subnav-hide');
    toShow.removeClass('hide-active');
    toShow.addClass('subnav-show');
    toShow.addClass('show-active');
    btn.removeClass('btn-transform-expand');
    btn.addClass('btn-transform-compress');
    $('#nav-btns #package-btn').removeClass('btn-show');
    $('#nav-btns #package-btn').addClass('btn-hide');
    $('#nav-btns #package-btn').removeClass('btn-transform-expand');
    $('#nav-btns #package-btn').removeClass('compressed');
    $('#nav-btns #more-btn').removeClass('btn-show');
    $('#nav-btns #more-btn').addClass('btn-hide');
  }
  $scope.showPackageSubNav = function(){
    var toShow = $('#package-subnav');
    var btn = $('#nav-btns #package-btn');
    var subnav_furniture = $('#furniture-subnav');
    subnav_furniture.addClass('hide-active');
    toShow.removeClass('subnav-hide');
    toShow.removeClass('hide-active');
    toShow.addClass('subnav-show');
    toShow.addClass('show-active');
    btn.removeClass('btn-transform-expand');
    btn.addClass('btn-transform-compress');
    $('#nav-btns #furniture-btn').removeClass('btn-show');
    $('#nav-btns #furniture-btn').addClass('btn-hide');
    $('#nav-btns #furniture-btn').removeClass('btn-transform-expand');
    $('#nav-btns #furniture-btn').removeClass('compressed');
    $('#nav-btns #more-btn').removeClass('btn-show');
    $('#nav-btns #more-btn').addClass('btn-hide');
  }

  $scope.resetDisplay = function(){
    var subnav = $('.subnav');
    if(!subnav.hasClass('show-active')){
      return;
    }
    subnav.removeClass('show-active');
    subnav.removeClass('subnav-show');
    subnav.addClass('subnav-hide');
    var furniture_btn = $('#nav-btns #furniture-btn');
    var package_btn = $('#nav-btns #package-btn');
    if(furniture_btn.hasClass('btn-transform-compress')){
      furniture_btn.removeClass('btn-transform-compress');
      furniture_btn.addClass('btn-transform-expand');
    }
    if(furniture_btn.hasClass('btn-hide')){
      furniture_btn.removeClass('hide-active');
      furniture_btn.removeClass('btn-hide');
      furniture_btn.addClass('btn-show');
    }
    if(package_btn.hasClass('btn-transform-compress')){
      package_btn.removeClass('hide-active');
      package_btn.removeClass('btn-transform-compress');
      package_btn.addClass('btn-transform-expand');
    }
    if(package_btn.hasClass('btn-hide')){
      package_btn.removeClass('btn-hide');
      package_btn.addClass('btn-show');
    }
    $('#nav-btns #more-btn').removeClass('btn-hide');
    $('#nav-btns #more-btn').addClass('btn-show');
  }
  $('#furniture-btn').on('animationend', function(e){
    var evt = e.originalEvent;
    if(evt.animationName == 'btntransformcompress'){
      $(this).addClass('compressed');
    }
    if(evt.animationName == 'collaps'){
      $(this).addClass('hide-active');
    }
  });
  $('#package-btn').on('animationend', function(e){
    var evt = e.originalEvent;
    if(evt.animationName == 'collaps'){
      $(this).addClass('hide-active');
    }
    if(evt.animationName == 'btntransformcompress'){
      $(this).addClass('compressed');
    }
  });

  $('#more-btn').on('animationend', function(e){
    var evt = e.originalEvent;
    if(evt.animationName == 'collaps'){
      $(this).addClass('hide-active');
    }
  });
  $('#package-btn').on('animationstart', function(e){
    var evt = e.originalEvent;
    $(this).removeClass('hide-active');
  });
  $('#more-btn').on('animationstart', function(e){
    var evt = e.originalEvent;
    var evt = e.originalEvent;
    $(this).removeClass('hide-active');
  });
}]);

publicApp.controller('ItemCtrl',['$scope' ,'$routeParams','Data','$location',  'Post', function($scope,$routeParams,Data,$location, Post){
  // console.log($routeParams.itemid);
  $scope.itemq = {};
  $scope.$parent.is_internal_page = true;
  $scope.$parent.itmid=$routeParams.itemid;
  $scope.$parent.show_lists = false;
  //$scope.paths='//s3-us-west-2.amazonaws.com/thisisnotarandomstringinfactnoneis';
  $scope.paths = 'https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis';
  $scope.item=[];
  $scope.specification=['brand','color','code','fragrance','height','length','material','set_content','size','weight','width'];
  var path='itemdetail/'+$scope.itmid;

  Data.item($routeParams.itemid)
    .success(function (response){
      $scope.item= response;

      $scope.itemq.item_id  = $scope.item.id;
      $scope.current_image = $scope.item.images[0];
      $scope.itemimagelength=$scope.item.images.length;
      });

  $scope.setCurrentImage = function(image){
    $scope.current_image = image;
  }

  $scope.previousImage = function(){
    current_image_index = $scope.item.images.indexOf($scope.current_image);
    current_image_index = current_image_index == 0 ? $scope.item.images.length : current_image_index;
    $scope.current_image = $scope.item.images[(current_image_index - 1)%$scope.item.images.length];
  }

  $scope.nextImage = function(){
    current_image_index = $scope.item.images.indexOf($scope.current_image);
    $scope.current_image = $scope.item.images[(current_image_index + 1)%$scope.item.images.length];
  }

  $scope.isinspecification=function(key){
    if( $scope.specification.indexOf(key) > -1){
      if(key=='set_content'){
        $scope.newkey='set content';
      }
      else {
          $scope.newkey=key;
      }
      return true;
    }
  }

  $scope.isinother=function(key){
    if(key=='care'){
      return true;
    }
  }

  $scope.Queryitem = function(){

    Post.itemRequest($scope.itemq)
      .success(function(response){


      })
  }
}]);

publicApp.controller('PanoramaCtrl',[ '$scope','$routeParams', 'Data', '$location', function($scope, $routeParams,Data, $location ,$$anchorScroll ){
  $scope.$parent.package_header = true;
      // console.log('$routeParams');
      // console.log($routeParams.filename);

      
      //panoramaimage = '//s3-us-west-2.amazonaws.com/thisisnotarandomstringinfactnoneis/panorama/'+$routeParams.filename;
      panoramaimage = 'https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis/panorama/'+$routeParams.filename;
      //panoramaimage = 'https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis/panorama/'+$routeParams.filename;
      showPanorama();

}]);

publicApp.controller('PackageCtrl', ['$scope', '$routeParams', 'Data', '$location','$timeout','Post','Cart',function($scope, $routeParams, Data, $location,$timeout, Post, Cart){
  $scope.packageq = {};
  $scope.$parent.packagepage = true;
  $scope.$parent.package_header = true;
  $scope.$parent.is_internal_page = true;
  $scope.$parent.show_lists = false;
  $scope.$parent.package_url = $routeParams.id;
  $scope.package = {};
  $scope.package_images_tag={};
  $scope.package.image= {};
  $scope.ind =  0 ;
  $scope.i = 0;
  $scope.divleft = 0;
  $scope.show_desc = false;
  $scope.totalamount = 0 ;
  //$scope.paths='//s3-us-west-2.amazonaws.com/thisisnotarandomstringinfactnoneis';
  $scope.paths = 'https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis';
  $scope.showremove = false;
  $scope.replace_id = 0;
  $scope.package.fd_funiture_copy = [];
  $scope.package.fd_funiture_selected = {};
  $scope.package.civil_work_selected = {};
  $scope.civil_workshow = false;
  $scope.fd_furnishow = false;

  // console.log($scope.package.fd_funiture_copy);

  Data.package($routeParams)
    .success(function (response){
      if (response.panorama) {
        panorama_image = 'https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis/panorama/'+'1_1467706188bHR5.jpg';
    }

      var jitimages = response.datasets1;
      jitimageslist = [];
      for(i = 0; i<jitimages.length; i++){
        jitimageslist.push(jitimages[i]['file_name']);
        //console.log(jitimages[i]['file_name']);
      }
      $scope.presentImage = jitimageslist[0];
      console.log($scope.presentImage);


      $scope.package_images_tag = response.datasets1;
      $scope.package.package_item = response.datasets4;
      $scope.package.fd_furniture = response.datasets2;
      $scope.package.civil = response.datasets3;
      $scope.package.name = response.datasets4[0]['pack_name'];
      $scope.package.description = response.datasets4[0]['description'];
      //$scope.package.price = response.package_item.price;
      //$scope.package.id = response.package_item.id;
      // console.log($scope.package.package_item);
      // angular.forEach($scope.package.package_item, function(value,key){

      //   $scope.totalamount = parseInt($scope.totalamount) +  parseInt(value.sp1);

      // });

      for(i = 0; i<response.datasets4.length; i++){
        $scope.totalamount = parseInt($scope.totalamount) + parseInt(response.datasets4[i]['sp']);
        console.log(response.datasets4[i]['sp']);
      }




      angular.forEach($scope.package.civil, function(value,key){
        $scope.civil_workshow = true;
        $scope.package.civil_work_selected[value.civil_id] = true;
        $scope.totalamount = parseInt($scope.totalamount) +  parseInt(value.civil_price);

      });

      angular.forEach($scope.package.fd_furniture, function(value,key){
        // $scope.package.fd_funiture_copy.push(value.fxd_id);
        $scope.fd_furnishow = true;
        $scope.package.fd_funiture_selected[value.fxd_id] = true;
        $scope.totalamount = parseInt($scope.totalamount) +  parseInt(value.price);

      });

      angular.forEach($scope.package_images_tag, function(value,key) {
        $scope.package.image[$scope.ind] = {};
        $scope.package.image[$scope.ind].file_name = key;
        $scope.package.image[$scope.ind].item = value;
        $scope.ind = $scope.ind + 1 ;
      });

      console.log($scope.package.image);


      $scope.current_image = $scope.package.image[0];
      $scope.packimagelength= Object.keys($scope.package.image).length;
    });


    $scope.isfixedfurnitureSelected = function(fd_funr){

      if($scope.package.fd_funiture_selected[fd_funr.fxd_id]){
        $scope.totalamount = parseInt($scope.totalamount) + parseInt(fd_funr.price);
      }
      else{
        $scope.totalamount = parseInt($scope.totalamount) -  parseInt(fd_funr.price);
      }

    }

    $scope.iscivilworksSelected = function(civilw){
      if($scope.package.civil_work_selected[civilw.civil_id]){
        $scope.totalamount = parseInt($scope.totalamount) + parseInt(civilw.civil_price);
      }
      else{
        $scope.totalamount = parseInt($scope.totalamount) -  parseInt(civilw.civil_price);
      }
    }

    $scope.addItemtoPackage = function(Item){

      Data.addItem(Item, $scope.id, $scope.package)
        .success(function(response){
          // console.log(response);
          $scope.package.package_item = response.items;

          $scope.totalamount = parseInt($scope.totalamount)  - parseInt($scope.rplItem.sp1) + parseInt(Item.sp1);

          $timeout(function() {
            $scope.replaceItempage = false;
            $scope.$parent.backDrop = false;
          }, 2000);

        })
        .error(function(response){});
      }

    $scope.gotoItem=function(item){
      $location.path('item/'+item.id);
    }

    $scope.setCurrentImage = function(image){
      $scope.presentImage = image;
    }
    $scope.previousImage = function(){
      current_image_index = jitimageslist.indexOf($scope.presentImage);
      current_image_index = current_image_index == 0 ? jitimageslist.length : current_image_index;
      $scope.current_image = jitimageslist[(current_image_index - 1)%jitimageslist.length];
    }
    $scope.nextImage = function(){
      current_image_index = jitimageslist.indexOf($scope.presentImage);
      $scope.current_image = jitimageslist[(current_image_index + 1)%jitimageslist.length];
    }
    $scope.Query = function(){
      $scope.packageq.package_id = $routeParams.id;
      Post.packageRequest($scope.packageq)
        .success(function(response){});
    }

    $scope.closeReplace = function(){
      $scope.replaceItempage = false;
      $scope.$parent.backDrop = false;
    }

    // console.log($scope.package.fd_funiture_copy);

    $scope.replaceItem = function(rplItem){

      $scope.rplItem = rplItem;
      $scope.id = $scope.rplItem.id;
      $scope.replaceItempage = true;
      $scope.$parent.backDrop = true;
      $scope.Items = {};
      Data.similarItem($scope.id)
        .success(function (response){
          $scope.Items = response.requested;
          // console.log($scope.Items);
        })
        .error(function(response){
          console.log('error');
        });
    }

    $scope.removeItem = function(rmItem){
      $scope.item_id = rmItem.id;

    Data.removeItem($scope.item_id , $scope.package)
      .success(function(response){
        $scope.package.package_item = response.items;

        $scope.totalamount = parseInt($scope.totalamount)  - parseInt(rmItem.sp1);
      })
      .error(function(response){
          console.log('error');
      });
    }

    $scope.buyPackage = function(package_item){
      console.log(package_item);
      Cart.togglePackageItem(package_item)
        .success(function(response){
          $scope.syncState(response);
        })
        .error(function(response){
          console.log(response);
        })
    }

}]);

publicApp.controller('ItemlistCtrl',['$scope','$routeParams', '$location', 'Data' ,function($scope, $routeParams, $location, Data){
  $scope.$parent.is_internal_page = true;
  $scope.$parent.package_header = false;
  $scope.$parent.show_lists = false;
  //$scope.paths='//s3-us-west-2.amazonaws.com/thisisnotarandomstringinfactnoneis';
  $scope.paths = 'https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis';
  $scope.items = [];
  $scope.brands = [];

  $scope.price = {};
  $scope.filter = {};
  $scope.filter.brands = [];

  $scope.limit = 18;

  $scope.loadMore = function(){
    $scope.limit = $scope.limit + 18;
  }

  $scope.filter.toggleBrand = function(brand){
    if($scope.filter.brands.indexOf(brand) > -1){
      $scope.filter.brands.splice($scope.filter.brands.indexOf(brand), 1);
    }
    else{
      $scope.filter.brands.push(brand);
    }
  }

  $scope.filterItems = function(item, index, items){
    if(item.sp <= $scope.filter.price.max && item.sp >= $scope.filter.price.min){
      if($scope.filter.brands.length == 0){
        return true;
      }
      if($scope.filter.brands.indexOf(item.brand) > -1){
        return true;
      }
    }
  }

  var query = $routeParams;
  Data.items(query)
    .success(function (response){
      $scope.items = response.datasets;
      angular.forEach($scope.items, function(item, index){
        if(item.id == 16243){
          console.log(item);
        }
        $scope.items[index].mrp = item.mrp ? parseInt(item.mrp) : 0;
        $scope.items[index].sp = item.sp ? parseInt(item.sp) : 0;
        $scope.items[index].images = item.images.split(',');
        if($scope.brands.indexOf(item.brand) < 0){
          $scope.brands.push(item.brand);
        }
      });
      $scope.price.max = Math.max.apply(Math, $scope.items.map(function(item){return item.sp}));
      $scope.price.min = Math.min.apply(Math, $scope.items.map(function(item){return item.sp}));
      $scope.filter.price.max = $scope.price.max;
      $scope.filter.price.min = $scope.price.min;
      $scope.filter.price.options = {floor: $scope.price.min, ceil: $scope.price.max};
    })

    .error(function(response){
      console.log('error');
    });

  $scope.gotoItem=function(item){
    $location.$$search = {};
    $location.path('item/'+item.id);
  }



}]);



publicApp.controller('packagescatCtrl', [ '$scope','$routeParams', 'Data', '$location','$anchorScroll', function($scope, $routeParams,Data, $location ,$$anchorScroll ){
  $scope.$parent.package_header = false;
    $scope.$parent.is_internal_page = true;
    $scope.$parent.show_lists = false;
    //$scope.paths='//s3-us-west-2.amazonaws.com/thisisnotarandomstringinfactnoneis';
    $scope.paths = 'https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis';
    $scope.selectedTab = $routeParams.section;

    Data.catopackages($routeParams.section)
      .success(function (response){
        $scope.packages_cat = response.datasets;
      })
      .error(function(response){
        console.log('error');
      });

      $scope.gotoPackage = function(ids){
        $location.path('package/'+ids);
      }
      $scope.gotoItem=function(itemid){
        $location.path('item/'+itemid);
      }

      $scope.goTosection =  function(section){
        $location.path('packagescat/'+section);
      }
}]);

publicApp.controller('MapCtrl',['$scope', 'Data', '$http', function($scope, Data, $http){
  //$scope.myWelcome = "Abhay Prakash";

  $http({
        method : "GET",
        url : "http://web.cafe-indica-163107.appspot.com/api/getmapdetails/"
    }).then(function mySucces(response) {
        $scope.myWelcome = response.data.datasets;
    }, function myError(response) {
        //$scope.myWelcome = response.statusText;
    });


  $scope.projectShow = function(id){
    
    
    $scope.pro_id = id;
    $scope.pro_image = {};
    $scope.current_pro_image = "";
    Data.projectImage($scope.pro_id)
      .success(function (response){
        $scope.$parent.show_pro_image = true;
        $scope.pro_image = response.datasets;
        $scope.current_pro_image = $scope.pro_image[0]['path'];
      })
      .error(function(response){

      });

  }


  $scope.setCurrentImagepro = function(image){
      $scope.current_pro_image = image.path;
    }
  $scope.previousImagepro = function(){

    }
  $scope.nextImagepro = function(){

    }

  $scope.closeReplace = function(){
      $scope.$parent.show_pro_image = false;
    } 

}]);


publicApp.controller('packagestyleCtrl', [ '$scope','$routeParams', 'Data', '$location','$anchorScroll', function($scope, $routeParams,Data, $location ,$$anchorScroll ){
  $scope.$parent.package_header = false;
    $scope.$parent.is_internal_page = true;
    //$scope.paths='//s3-us-west-2.amazonaws.com/thisisnotarandomstringinfactnoneis';
    $scope.paths = 'https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis';
    $scope.selectedTab = $routeParams.styles;

    Data.stylepackages($routeParams.styles)
      .success(function (response){
        $scope.packages_style = response.datasets;

      })
      .error(function(response){
        console.log('error');
      });

      $scope.gotoPackage = function(ids){
        $location.path('package/'+ids);
      }
      $scope.gotoItem=function(itemid){
        $location.path('item/'+itemid);
      }


      $scope.goTostyle =  function(styles){

        $location.path('packagestyle/'+styles);
      }
}]);



publicApp.controller('PackagesCtrl',[ '$scope','$routeParams', 'Data', '$location','$anchorScroll', function($scope, $routeParams,Data, $location ,$$anchorScroll ){

  $scope.$parent.package_header = false;
  $scope.$parent.is_internal_page = true;
  $scope.packdata=[];
  $scope.shortlist=false;
  $scope.selectedRow = null;
  $scope.packdatachunck=[];
  $scope.packdatachunck[0]=[];
  $scope.shortlistarray=[];
  $scope.currentselectimage=0;
  $scope.temparray=[];
  $scope.selectedTab = $routeParams.typeview;;
  $scope.paths = 'https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis'
  //alert($routeParams.typeview);

//url : "http://web.cafe-indica-163107.appspot.com/api/getsupersections/"
//alert($scope.paths);

  $scope.packimagelength=0;
  if ($routeParams.room) {

    $scope.key = "Rooms";
    $scope.types = $routeParams.room;
    $scope.selectedTab = $scope.types;
  }
  else if ($routeParams.style) {
    $scope.key = "Styles";
    $scope.types = $routeParams.style;
    $scope.selectedTab = $scope.types;

  }
  Data.packages($routeParams)
    .success(function (response){
      //$scope.packages = response.requested;
      //$scope.key = response.title;
      $scope.subheads = response.datasets;
    })
    .error(function(response){
      console.log('error');
    });
  Data.packages1($routeParams.typeview)
    .success(function (response){
      $scope.packages = response.datasets;

    })
    .error(function(response){
      console.log('error');
    });
  $scope.selectedArray = [];
  $scope.selectRow = function (id) {
    if($scope.selectedArray.indexOf(id) == -1) {
      $scope.selectedArray.push(id);
    }
    else {
      $scope.selectedArray.splice($scope.selectedArray.indexOf(id),1);
    }
  };

  $scope.isSelected = function (id) {
    if( $scope.selectedArray.indexOf(id) > -1){
      return true;
    }
    return false;
  };
  $scope.gotoPackage = function(ids){
    $location.path('package/'+ids);
  }
  $scope.gotoItem=function(itemid){
    $location.path('item/'+itemid);
  }
}]);

publicApp.controller('CarouselCtrl', ['$scope', '$interval', function($scope, $interval){
  var isMouseOverCarousel = false;
  $scope.images = [
    {src: 'images/carousel/vintage_new.jpg'},
    {src: 'images/carousel/birthday.jpg'},
    {src: 'images/carousel/1.jpg'},
    {src: 'images/carousel/2.jpg'},
    {src: 'images/carousel/3.jpg'},
    {src: 'images/carousel/4.jpg'}
  ];
  $scope.slideindex = 0;
  $scope.imgclass1 = '';
  $scope.slideindex = 0;
  $scope.mouseEntered = function(){
    isMouseOverCarousel = true;
  }
  $scope.mouseLeft = function(){
    isMouseOverCarousel = false;
  }

  function updateBanner(){
    $('#home-screen-banner').css('top', '');
    $('#home-screen-banner').css('left', '');
    $('#home-screen-banner').css('right', '');
    $('#home-screen-banner').css('bottom', '');
    if($scope.slideindex == 0){
      $('#home-screen-banner').css('top', '15%');
      $('#home-screen-banner').css('left', '25%');
    }
    if($scope.slideindex == 1){
      $('#home-screen-banner').css('top', '50%');
      $('#home-screen-banner').css('left', '5%');
    }
    if($scope.slideindex == 2){
      $('#home-screen-banner').css('top', '5rem');
      $('#home-screen-banner').css('left', '83%');
    }

    $('#home-screen-banner').fadeIn(300);
  }

  $scope.nextImage = function(){
    $scope.slideindex++;
    $scope.slideindex = $scope.slideindex % 6;
    var markup = '<img src="'+$scope.images[$scope.slideindex].src+'" class="slide-left" />';
    var elm = $('.carousel-container img');
    elm.parent().append(markup);
    elm.addClass('dispose-left');
    elm.removeClass('slide-right');
    $('#home-screen-banner').fadeOut(300);
    elm.on('animationend', function(){
      $(this).remove();
      //updateBanner();
    });
  }

  $scope.previousImage = function(){
    $scope.slideindex--;
    $scope.slideindex = $scope.slideindex < 0 ? 5 : $scope.slideindex;
    var markup = '<img src="'+$scope.images[$scope.slideindex].src+'" class="slide-right" />';
    var elm = $('.carousel-container img');
    elm.parent().append(markup);
    elm.addClass('dispose-right');
    elm.removeClass('slide-left');
    $('#home-screen-banner').fadeOut(300);
    elm.on('animationend', function(){
      $(this).remove();
      //updateBanner()
    });
  }

  var autoChange = function(){
    if(!isMouseOverCarousel){
      $scope.nextImage();
    }
  }

  $scope.$on('changeImage', function(){
    autoChange();
  });
}]);


publicApp.controller('SuccestoryCtrl',['$scope','Data', function($scope, Data){
    $scope.stories = [];
    var stories = [];
    $scope.page = 0;
    $scope.start = 0;

    $scope.isCurrent = function(stories){
      if(stories.user_name==$scope.current.name){
        return true;
      }
      return false;
    }
    $scope.nextPage = function(){
      if(($scope.start + $scope.noofitem) < $scope.stories.length){
          $scope.start++;
      }


      if($scope.stories.indexOf($scope.current) < 1){
        $scope.current = $scope.stories[1];
      }
    }
    $scope.prevPage = function(){
      if($scope.start > 0){
      $scope.start--;
    }

      if($scope.stories.indexOf($scope.current) > 1){
        $scope.current = $scope.stories[0];

    }
    }


    Data.successstory()
      .success(function(data){
          stories = data;
          $scope.stories  = stories;
        })

        $scope.setCurrent = function(stories){
          $scope.current = stories;
        }


      }]);

publicApp.controller('FlowCtrl', ['$scope', 'Data', function($scope, Data){
  $scope.steps = [];
  var steps = [];
  $scope.page=0;
  $scope.isCurrent = function(step){
    if(step.name==$scope.current.name){
      return true;
    }
    return false;
  }
  $scope.nextPage = function(){
    $scope.page++;
    if($scope.steps.indexOf($scope.current) < 4){
      $scope.current = $scope.steps[4];
    }
  }
  $scope.prevPage = function(){
    $scope.page--;
    if($scope.steps.indexOf($scope.current) > 4){
      $scope.current = $scope.steps[0];
    }
  }
  Data.how()
    .success(function(data){
      steps = data;
      $scope.steps = steps;
      $scope.current = steps[0];
    })

  $scope.setCurrent = function(step){
    $scope.current = step;
  }
}]);


publicApp.controller('productCtrl', ['$scope', 'Data', function($scope, Data){

  Data.getsupersections()
  .success(function(response){
    $scope.supersections = response.datasets;
  }).error(function(response){
    console.log("Error in getting supersections");
  });

}]);

