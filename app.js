(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var narrowCtrl = this;
        narrowCtrl.searchTerm = "";
        narrowCtrl.found = [];

        narrowCtrl.narrowItDown = function () {
            if (narrowCtrl.searchTerm === "") {
                narrowCtrl.found = [];
                return;
            }

            MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
            .then(function (items) {
                narrowCtrl.found = items;
            });
        };

        narrowCtrl.removeItem = function (index) {
            narrowCtrl.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
            }).then(function (response) {
                var foundItems = [];
                var menuItems = response.data;

                for (var category in menuItems) {
                    if (menuItems.hasOwnProperty(category)) {
                        var items = menuItems[category].menu_items;
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                                foundItems.push(items[i]);
                            }
                        }
                    }
                }

                return foundItems;
            });
        };
    }

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                items: '<',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'list',
            bindToController: true
        };

        return ddo;
    }

    function FoundItemsDirectiveController() {
        var list = this;

        list.isEmpty = function () {
            return list.items.length === 0;
        };
    }
})();