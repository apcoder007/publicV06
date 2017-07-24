var publicApp = angular.module('publicApp', ['ngMessages', 'ngMaterial', 'ngRoute', 'ngAnimate','infinite-scroll','Providers', 'rzModule','materialCalendar', 'ngStorage', 'ngCookies']);

// ////////////////////  Run Methods /////////////////////////////

// publicApp.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
//     $rootScope.$on('$routeChangeStart', function (event) {

//         if (!Auth.isLoggedIn()) {
//             console.log('DENY');
//             event.preventDefault();
//             $location.path('/login');
//         }
//         else {
//             console.log('ALLOW');
//             $location.path('/home');
//         }
//     });
// }]);







publicApp.config(['$routeProvider', '$locationProvider', '$ariaProvider', '$mdThemingProvider', '$httpProvider', '$sceProvider',
  function($routeProvider, $locationProvider, $ariaProvider, $mdThemingProvider, $httpProvider, $sceProvider) {
    $ariaProvider.config({
      tabindex: false
    });
    $locationProvider.html5Mode({
  enabled: false,
  requireBase: false
}).hashPrefix('!');
    $httpProvider.defaults.headers.common['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content');
    $mdThemingProvider.theme('default')
      .primaryPalette('grey');
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/aboutus', {
        templateUrl: 'views/aboutus.html'
      })
      .when('/endorsements',{
        templateUrl: 'views/endorsement.html'
      })
      .when('/packages/:typeview', {
        templateUrl: 'packages/pakagesbycategory.html',
        controller: 'PackagesCtrl'
      })
      //abhay url for rooms
      .when('/locations', {
        templateUrl: 'locations/geomap.html',
        controller: 'MapCtrl'
      })
      //
      .when('/packagescat/:section',{
        templateUrl: 'packages/pakagesbycategory.html',
        controller: 'packagescatCtrl'
      })
      .when('/packagestyle/:styles',{
        templateUrl: 'packages/packagebystyle.html',
        controller: 'packagestyleCtrl'
      })
      .when('/package/:topic/:name', {
        templateUrl: 'packages/package.html',
        controller: 'PackageCtrl'
      })
      .when('/product/:itemid', {
        templateUrl: 'items/item.html',
        controller: 'ItemCtrl'
      })
      .when('/products',{
        templateUrl:'views/itemlist.html',
        controller: 'ItemlistCtrl'
      })
      .when('/order/checkout', {
        templateUrl: 'order/checkout.html',
        controller: 'CheckoutCtrl'
      })
      .when('/project/checkout',{
        templateUrl: 'projects/checkout.html',
        controller: 'ProjectcheckoutCtrl'
      })
      .when('/panorama/view',{
        templateUrl: 'panorama/view.html',
        controller: 'PanoramaCtrl'
      })
      .when('/order/details',{
        templateUrl: 'order/mydetails.html',
        controller: 'CheckoutCtrl'
      })
      .when('/order/codcheckout', {
        templateUrl: 'order/codcheckout.html',
        controller: 'CheckoutCtrl'
      })
      .when('/order/:id/recieved', {
        templateUrl: 'order/thanks.html',
        controller: 'ThanksCtrl'
      })
      .when('/project/order/:id/recieved',{
        templateUrl: 'projects/thanks.html',
        controller: 'ProjectthanksCtrl'
      })
      .when('/order/thanks', {
        templateUrl: 'order/thanks.html',
        controller: 'ThanksCtrl'
      })
      .when('/order/cart',{
        templateUrl: 'order/cart.html'
      })
      .when('/order/wishlist',{
        templateUrl: 'order/wishlist.html'
      })
      .when('/contacts', {
        templateUrl: 'contact/contacts.html'
      })
      .when('/user/logout',{
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/user/change/password',{
        templateUrl: 'user/cngpassword.html',
        controller: 'HomeCtrl'
      })
      .when('/user/set/password',{
        templateUrl: 'user/setpassword.html',
        controller: 'HomeCtrl'
      })
      .when('/login/account-recovery',{
        templateUrl: 'header/recovery.html',
        controller: 'RecoveryCtrl'
      })
      .when('/order-history', {
        templateUrl: 'user/orders.html'
      })
      .when('/projects/home', {
        templateUrl: 'projects/homecalendar.html',
        controller: 'ProjectCtrl'
      })
      .when('/projects/:id/accounts', {
        templateUrl: 'projects/accounts.html',
        controller: 'ProaccountsCtrl'
      })
      .when('/projects/address', {
        templateUrl: 'projects/address.html',
        controller: 'ProaddressCtrl'

      })
      .otherwise({
        redirectTo: '/'
      });
}]);



// publicApp.run(function ($browser) {
//   $browser.baseHref = function () { return "/" };
// });



 