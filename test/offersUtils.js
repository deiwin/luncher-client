var offerUtils = (function (){
  'use strict';
  return {
    getMockOffers: function (){
      return [
      {'id': '1',
      'location': 'Asian Chef',
      'title': 'Sweet & Sour Chicken',
      'description': 'Kanafilee aedviljadega rikkalikus magushapus kastmes.',
      'price': 3.4,
      'tags': ['lind']},
      {'id': '2',
      'location': 'Another Place',
      'title': 'Sweet & Sour Pork',
      'description': 'Seafilee aedviljadega rikkalikus magushapus kastmes.',
      'price': 3.5,
      'tags': ['siga']},
      {'id': '3',
      'location': 'Asian Chef',
      'title': 'Sweet & Sour Beef',
      'description': 'Veisefilee aedviljadega rikkalikus magushapus kastmes.',
      'price': 3.6,
      'tags': ['loom']}
      ];
    },
    matchers: {
      toContainId: function (expected){
        var actual = this.actual;
        var notText = this.isNot ? ' not' : '';

        this.message = function(){
          return 'Expected ' + actual + notText + ' to contain id ' + expected;
        };

        return actual.some(function (elem){
          return elem.id === expected;
        });
      }
    }
  };
})();
