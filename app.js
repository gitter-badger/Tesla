(function () {

    // module - application
    angular.module('tesla', [])

        // create the factory - service
        .factory('TeslaService', ['$http', function ($http) {

            // declare data
            var d = {
                trips: [],
                trip: [],
                loading: false
            };

            // add service methods
            d.controllermethods = {
                servercall: function (arguments) {
                    angular.copy(true, d.loading);
                    //d.loading = true;
                    console.debug('in servercall');
                    // server returns data of type 'key'...
                    $http({
                        method: 'GET',
                        url: '/server.php',
                        params: arguments
                    }).success(function (data) {
                        angular.copy(data.data, d[data.key]);
                        d.loading = false;
                    }).error(function (data) {
                        alert('error in call server ' + arguments.action);
                        d.loading = false;
                    });
                }
            };

            //return service
            return d;
        }])

        // Create the controller
        .controller('TeslaController', ['$scope', 'TeslaService', '$interval', function ($scope, TeslaService, $interval) {

            // link sercice to controller
            this.trips = TeslaService.trips;
            this.trip = TeslaService.trip;
            this.methods = TeslaService.controllermethods;
            this.loading = TeslaService.loading;

            // initialize controller data
            this.view = 'list';
            this.activetrip = 0;
            this.activewaypoint = 0;
            this.status = [
                {
                    id: 0,
                    description: 'onderweg naar'
                },
                {
                    id: 1,
                    description: 'aangekomen in'
                },
                {
                    id: 2,
                    description: 'aan het laden in'
                },
                {
                    id: 3,
                    description: 'klaar om te vertrekken in'
                }
            ];

            // add controller methods
            this.changeview = function (v, id) {
                console.debug('changing view to ' + v + ' for id ' + id);
                this.view = v;
                this.activetrip = id;

                switch (v) {
                    case "list": // we want to see all trips...
                        TeslaService.controllermethods.servercall({action: "gettrips"});
                        break;

                    case "view": // we want to see 1 trip...
                        TeslaService.controllermethods.servercall({action: "gettrip", tripid: id});
                        break;

                    default:
                    // Nothing special to do here...
                }
            };


            // initialize view
            //call gettrips to initialise the data...
            this.changeview('list', 0);

        }]);

})();