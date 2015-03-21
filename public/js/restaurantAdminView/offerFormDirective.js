(function() {
  'use strict';
  var module = angular.module('offerFormDirective', [
    'ngTagsInput',
    'fileReaderService',
    'ngResource',
  ]);

  module.config(['tagsInputConfigProvider',
    function(tagsInputConfigProvider) {
      tagsInputConfigProvider.setDefaults('tagsInput', {
        placeholder: '',
      });
    }
  ]);

  module.directive('offerForm', ['$resource', 'filterFilter',
    function($resource, filterFilter) {
      return {
        scope: {
          offerToEdit: '=edit',
          submitFunction: '&onSubmit',
          cancelFunction: '&onCancel',
        },
        controller: function($scope, $element, $attrs, $transclude) {
          var isEdit = !!$scope.offerToEdit;
          $scope.allTags = $resource('api/v1/tags', {}, {
            'queryCached': {
              method: 'GET',
              isArray: true,
              cache: true,
            }
          }).queryCached();
          $scope.getFilteredTags = function($query) {
            return filterFilter($scope.allTags, $query);
          };
          (function prefillWith(offer) {
            if (offer) {
              $scope.title = offer.title;
              $scope.ingredients = offer.ingredients;
              $scope.tags = offer.tags;
              $scope.price = offer.price;
              $scope.date = new Date(offer.from_time);
              $scope.date.setHours(0, 0, 0, 0);
              $scope.fromTime = new Date(offer.from_time);
              $scope.fromTime.setFullYear(1970);
              $scope.fromTime.setMonth(0);
              $scope.fromTime.setDate(1);
              $scope.toTime = new Date(offer.to_time);
              $scope.toTime.setFullYear(1970);
              $scope.toTime.setMonth(0);
              $scope.toTime.setDate(1);
              $scope.image = offer.image; // XXX this needs attention prolly
            }
          })($scope.offerToEdit);
          $scope.idPrefix = (function() {
            if (isEdit)
              return 'edit-offer-' + $scope.offerToEdit._id + '-';
            else
              return 'new-offer-';
          })();
          $scope.today = (function() {
            var now = new Date();
            // this is basically when the clock in UTC will show what it shows here now
            var currentTimeInUTC = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
            // because the toISOString method uses UTC but we want the date in the current timezone
            return currentTimeInUTC.toISOString().split('T')[0];
          })();
          $scope.isReadyForError = function() {
            for (var i = 0; i < arguments.length; i++) {
              var input = arguments[i];
              if (input.$dirty && input.$touched && input.$invalid)
                return true;
            }
            return false;
          };
          $scope.submitOffer = function() {
            var offer = {
              title: $scope.title,
              ingredients: $scope.ingredients.map(function(ingredient) {
                return ingredient.text;
              }),
              tags: $scope.tags.map(function(tag) {
                return tag.name;
              }),
              price: $scope.price,
              // both getTime()s return the time with added timezone offset, so one offset has to be subtracted
              from_time: new Date($scope.date.getTime() + $scope.fromTime.getTime() - $scope.fromTime.getTimezoneOffset() * 60 * 1000),
              to_time: new Date($scope.date.getTime() + $scope.toTime.getTime() - $scope.toTime.getTimezoneOffset() * 60 * 1000),
              image: $scope.image,
            };
            if (isEdit) {
              var offerCopy = angular.copy($scope.offerToEdit);
              angular.extend(offerCopy, offer);
              $scope.submitFunction({
                $currentOffer: $scope.offerToEdit,
                $offer: offerCopy,
              });
            } else {
              $scope.submitFunction({
                $offer: offer,
              });
            }
          };
        },
        restrict: 'E',
        templateUrl: 'partials/offerForm.html'
      };
    }
  ]);

  module.directive('imageWithPreview', ['fileReader',
    function(fileReader) {
      var isAnAllowedImage = function(file) {
        return ['image/png', 'image/jpeg'].indexOf(file.type) > -1;
      };
      return {
        restrict: 'A',
        scope: {
          previewImageSrc: '=',
        },
        require: 'ngModel',
        link: function($scope, element, attrs, ngModel) {
          ngModel.$validators.image = function(modelValue, viewValue) {
            return viewValue && isAnAllowedImage(viewValue);
          };
          ngModel.$viewChangeListeners.push(function() {
            if (ngModel.$viewValue && !ngModel.$error.image) {
              fileReader.readAsDataUrl(ngModel.$viewValue, $scope).then(function(result) {
                $scope.previewImageSrc = result;
              });
            } else {
              $scope.previewImageSrc = '';
            }
          });
          element.bind('change', function(event) {
            var file = (event.srcElement || event.target).files[0];
            // the following link recommends making a copy of the object, but as the value will only be changed
            // from the view, we don't have to worry about making a copy
            // https://docs.angularjs.org/api/ng/type/ngModel.NgModelController#$setViewValue
            ngModel.$setViewValue(file, 'change');
          });
        }
      };
    }
  ]);
})();
