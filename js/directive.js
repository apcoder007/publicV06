publicApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
// Prevent Right click on project page
publicApp.directive('preventRightClick', [

            function() {
                return {
                    restrict: 'A',
                    link: function($scope, $ele) {
                        $ele.bind("contextmenu", function(e) {
                            e.preventDefault();
                        });
                    }
                };
            }
        ]);



// Size of image of package to tag
publicApp.directive('sizeofwindow', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return { 'h': w.height(), 'w': w.width() };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
      scope.windowWidth = newValue.w;
      if (scope.windowWidth <=600 ){
        scope.noofitem =  1 ;
        scope.shippingIsSameAsBilling = true ;
      }
      else if (scope.windowWidth <650 && scope.windowWidth > 600  ){
              scope.noofitem =  1 ;
              scope.shippingIsSameAsBilling = false ;
            }
       else if (scope.windowWidth <950 && scope.windowWidth >= 650 ) {
           scope.noofitem =  2 ;
           scope.shippingIsSameAsBilling = false ;
       }
       else {
         scope.noofitem =  3 ;
         scope.shippingIsSameAsBilling = false ;
       }

            scope.style = function () {
                return {
                    'height': (newValue.h - 100) + 'px',
                    'width': (newValue.w - 100) + 'px'
                };
            };

        }, true);

        w.bind('sizeofwindow', function () {
            scope.$apply();
        });
    }
})



publicApp.directive('uploadfile', function () {
    return {
      restrict: 'A',
      link: function(scope, element) {

        element.bind('click', function(e) {
            angular.element(e.target).siblings('#upload').trigger('click');
        });
      }
    };
});

publicApp.directive('itemOnDemand', function($window){
  return function(scope, elm, attr){
    angular.element($window).bind('scroll', function(){
      // console.log(angular.element(elm.parent()[0]));
      // console.log(elm.getBoundingClientRect());
    });
  }
});

publicApp.directive('changeHeaderOnScroll', function($window){
  return function(scope, elem, attr){
    angular.element($window).bind('scroll', function(){
      var small_header = false;
      if(this.pageYOffset >500){
        small_header = true;
      }
      else{
        small_header = false;
      }
      scope.$apply(function(){
        scope.$parent.show_small_header = small_header;
      })
    });
  }
});

publicApp.directive('animateOnChange', function($animate,$timeout) {
  return function(scope, elem, attr) {
      scope.$watch(attr.animateOnChange, function(nv,ov) {
        if (nv!=ov) {
          var c = 'change';
          $animate.addClass(elem,c).then(function() {
            $timeout(function() {$animate.removeClass(elem,c)});
          });
        }
      })
  }
});


// background-image loader hide on image load

publicApp.directive('imageonload',function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

        element.bind('load', function() {
            element.parent()[0].style="background-image:none";
        });
      }
    };

});


publicApp.directive('heightofdiv',function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.ready(function () {
        var height,
            width;
            height  = element[0].offsetHeight;
            width  = element[0].offsetWidth;

          })
      }

    };

});

publicApp.directive('imageonloads',function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

        element.bind('resize', function() {
          var width = $(this).width(),
            height = $(this).height();

        var div = element.parent();

        // scope.positions.divleft = scope.current_image.item[0].xcoord * width ;
        // scope.positions.divtop = scope.current_image.item[0].ycoord * height ;
        // console.log(scope.positions.divleft);
        // // console.log(scope.positions.divtop);
        //     element.parent()[0].style="background-image:none";
        });
      }

    };

});


publicApp.directive('resize', function ($window) {
    return function (scope, element, attr) {

        var w = angular.element($window);
        scope.$watch(function () {
            return {
                'h': element.height(),
                'w': element.width()
            };
        }, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;
            scope.resizeWithOffset = function (offsetH) {
                scope.$eval(attr.notifier);
                return {
                    'height': (newValue.h - offsetH) + 'px'
                    //,'width': (newValue.w - 100) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
});


publicApp.directive('embedSrc', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var current = element;
      scope.$watch(attrs.embedSrc, function () {
        var clone = element
                      .clone()
                      .attr('src', attrs.embedSrc);
        current.replaceWith(clone);
        current = clone;
      });
    }
  };
})

publicApp.directive("dynamic-pro-src", function($timeout){
  return {
    link: function(scope, element, attrs) {
      var img, loadImage;
      img = null;
      loadImagepro = function() {
        img = new Image();
        img.src = attrs.dynamicSrc;
        img.onload = function() {
          if(element[0].style == "opacity: 0"){
            element[0].style = "opacity: 1";
            element[0].src = attrs.dynamicSrc;
          }
          else{
            element[0].style = "opacity: 0";
            $timeout(function(){
              element[0].style = "opacity: 1";
              element[0].src = attrs.dynamicSrc;
            }, 300)
          }
        };
      };
scope.$watch((function() {
        return attrs.dynamicSrc;
      }), function(newVal, oldVal) {
        if (oldVal !== newVal) {
          loadImagepro();
        }
      });
    }
  };
});

// Dynamic Src

publicApp.directive("dynamicSrc", function($timeout) {
    return {
      link: function(scope, element, attrs) {
        var img, loadImage;
        img = null;

        loadImage = function() {
          // element[0].style = "opacity: 0";
          img = new Image();
          // element[0].src="/images/default.gif";
          img.src = attrs.dynamicSrc;

          img.onload = function() {
            if(element[0].style == "opacity: 0"){
              element[0].style = "opacity: 1";
              element[0].src = attrs.dynamicSrc;
            }
            else{
              element[0].style = "opacity: 0";
              $timeout(function(){
                element[0].style = "opacity: 1";
                element[0].src = attrs.dynamicSrc;
              }, 300)
            }

          };
        };

        scope.$watch((function() {
          return attrs.dynamicSrc;
        }), function(newVal, oldVal) {
          if (oldVal !== newVal) {
            loadImage();
          }
        });
      }
    };
  });
