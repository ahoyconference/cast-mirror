'use strict';


angular.module('castApp', [
  'castApp.services',
  'castApp.controllers',
  'ui.router',
  'ui.bootstrap',
  'localytics.directives'
])

.run(
  [ '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ui-sref-active="active }"> will set the <li> // to active whenever
    // 'contacts.list' or one of its decendents is active.
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
/*      $('input[type="checkbox"].large').checkbox({
        buttonStyle: 'btn-link btn-large',
        checkedClass: 'icon-check',
        uncheckedClass: 'icon-check-empty'
      }); */
    }
  ]
)
.config(
  [ '$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state("callee", {
          url: '/callee',
          templateUrl: 'tpl/callee.html',
          controller: 'CalleeCtrl'
        })
        .state("caller", {
          url: '/caller',
          templateUrl: 'tpl/caller.html',
          controller: 'CallerCtrl'
        })

      $urlRouterProvider
	.otherwise('/callee');

    }
  ]
);
