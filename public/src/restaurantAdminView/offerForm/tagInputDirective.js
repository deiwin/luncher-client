(function() {
  'use strict';
  var module = angular.module('tagInputDirective', [
    'ngResource',
  ]);

  var SHOW_MORE_LIMIT = 5;

  module.directive('tagInput', ['$resource', 'filterFilter',
    function($resource, filterFilter) {
      return {
        require: 'ngModel',
        scope: {
          tags: '=ngModel',
        },
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function($scope, $element, $attrs) {
          var ctrl = this;
          var availableTagList = $resource('api/v1/tags', {}, {
            'queryCached': {
              method: 'GET',
              isArray: true,
              cache: true,
            }
          }).queryCached();

          ctrl.showMore = false;
          var getFilteredTagList = function() {
            return filterFilter(availableTagList, ctrl.filter);
          };
          ctrl.getAvailableTagList = function() {
            return R.unless(
              R.always(ctrl.showMore),
              R.take(SHOW_MORE_LIMIT)
            )(getFilteredTagList());
          };
          ctrl.availableTagListIsLimited = function() {
            return getFilteredTagList().length > SHOW_MORE_LIMIT;
          };

          ctrl.isSelected = function(availableTag) {
            return R.ifElse(
              R.isNil,
              R.always(false),
              R.any(R.propEq('name', availableTag.name))
            )(ctrl.tags);
          };

        },
        restrict: 'E',
        templateUrl: 'src/restaurantAdminView/offerForm/tagInput.html'
      };
    }
  ]);
})();