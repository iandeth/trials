'use strict'

###*
 # @ngdoc function
 # @name angularjsApp.controller:MainCtrl
 # @description
 # # MainCtrl
 # Controller of the angularjsApp
###
angular.module 'angularjsApp'
  .controller 'MainCtrl', ($scope) ->
    $scope.awesomeThings = [
      'HTML5 Boilerplate'
      'AngularJS'
      'Karma'
    ]
