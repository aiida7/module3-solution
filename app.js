(function() {
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

        console.log("NarrowItDownController initialized");

        narrowCtrl.getMatchedMenuItems = function() {
            console.log("Search term:", narrowCtrl.searchTerm);
            if (narrowCtrl.searchTerm.trim() === "") {
                narrowCtrl.found = [];
                return;
            }

            MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
            .then(function(result) {
                narrowCtrl.found = result;
                console.log("Matched items:", result);
            })
            .catch(function(error) {
                console.error("Error occurred while fetching items:", error);
            });
        };

        narrowCtrl.removeItem = function(index) {
            narrowCtrl.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;

        service.getMatchedMenuItems = function(searchTerm) {
            console.log("Fetching menu items for search term:", searchTerm);
            return $http({
                method: "GET",
                url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
            }).then(function(result) {
                var foundItems = [];
                var menuItems = result.data ? result.data.menu_items : [];

                if (!menuItems) {
                    console.error("Menu items data is undefined");
                    return foundItems; // return empty array if menu_items is undefined
                }

                console.log("Menu items from server:", menuItems);

                for (var i = 0; i < menuItems.length; i++) {
                    var description = menuItems[i].description;
                    if (description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                        foundItems.push(menuItems[i]);
                    }
                }

                return foundItems;
            }).catch(function(error) {
                console.error("Error occurred while fetching data from server:", error);
                return []; // return empty array on error
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
        console.log("FoundItemsDirectiveController initialized");
    }

})();
