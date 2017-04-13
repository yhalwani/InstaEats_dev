angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.recents', {
    url: '/page2',
    views: {
      'tab1': {
        templateUrl: 'templates/recents.html',
        controller: 'recentsCtrl'
      }
    }
  })

  .state('tabsController.nearMe', {
    url: '/page3',
    views: {
      'tab2': {
        templateUrl: 'templates/nearMe.html',
        controller: 'nearMeCtrl'
      }
    }
  })

  .state('tabsController.favorites', {
    url: '/page4',
    views: {
      'tab3': {
        templateUrl: 'templates/favorites.html',
        controller: 'favoritesCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('signup', {
    url: '/page5',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('login', {
    url: '/page7',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

$urlRouterProvider.otherwise('')

  

});