
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/reservation',
        success: function (data) {
            getAllReservations(data);
        } ,
        error: function (request, status, error) {
            alert(error);

        }

    });





});
function startMap(reservationList){
    mapboxgl.accessToken = 'pk.eyJ1IjoidGVhbXJha2V0YSIsImEiOiJjampwZ205dTQwM2w4M2txcnBmbTFmaDZiIn0.DoPdOhOPKWmUmYXsHrg6dg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [17.6791,43.9159],
        zoom: 2
    });






    var originXArray =[];
    var originYArray =[];
    var destinationXArray =[];
    var destinationYArray = [];

    for (var i = 0; i<reservationList.length;i++){
        console.log(reservationList[i]);
        originXArray.push(reservationList[i].users.longitude);
        originYArray.push(reservationList[i].users.latitude);
        destinationXArray.push(reservationList[i].hotel.longitude);
        destinationYArray.push(reservationList[i].hotel.latitude);
    }


    var routeArray = [];
    var route = {};

    for (var i=0; i <destinationXArray.length; i++){
        route = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [originXArray[i], originYArray[i]],
                        [destinationXArray[i], destinationYArray[i]]
                    ]
                }
            }]
        }

        routeArray.push(route);
    }

    var pointArray = [];
    var point = {};
    for (var i=0; i <originXArray.length; i++){
        var point = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [originXArray[i], originYArray[i]]
                }
            }]
        };
        pointArray.push(point);
    }


    var lineDistanceArray = [];
    var lineDistancee = {};
    for (var i = 0; i <destinationXArray.length;i++){
        lineDistancee = turf.lineDistance(routeArray[i].features[0], 'kilometers');
        lineDistanceArray.push(lineDistancee);
    }


    var arcArray = [];
    var arc = [];
    var steps = 100;
    var segmentt;

    for (var i= 0; i<destinationXArray.length;i++){
        for (var j = 0; j<lineDistanceArray[i]; j+= lineDistanceArray[i]/steps){


            segmentt = turf.along(routeArray[i].features[0], j , 'kilometers');
            arc.push(segmentt.geometry.coordinates);
        }
        arcArray.push(arc);
        segmentt=[];
        arc=[];
    }
    for (var i = 0; i <routeArray.length; i++) {
        routeArray[i].features[0].geometry.coordinates = arcArray[i];
    }

// Used to increment the value of the point measurement against the route.
    var counter = 0;
    map.on('load', function () {
        // Add a source and layer displaying a point which will be animated in a circle.
        for (var i = 0; i<routeArray.length; i++){
            map.addSource('route'+ i, {
                "type": "geojson",
                "data": routeArray[i]
            });
        }

        for (var i = 0; i<routeArray.length; i++){
            map.addSource('point'+ i, {
                "type": "geojson",
                "data": pointArray[i]
            });
        }
        for (var i = 0; i<routeArray.length; i++){
            map.addLayer({
                "id": "route" + i,
                "source": "route" + i,
                "type": "line",
                "paint": {
                    "line-width": 2,
                    "line-color": "#7fffd4"
                }
            });
        }


        for (var i = 0; i<pointArray.length; i++){
            map.addLayer({
                "id": "point" + i,
                "source": "point" + i,
                "type": "symbol",
                "layout": {
                    "icon-image": "airport-15",
                    "icon-rotate": ["get", "bearing"],
                    "icon-rotation-alignment": "map",
                    "icon-allow-overlap": true
                }
            });
        }


        function animate() {
            for (var i = 0; i<routeArray.length; i++){
                pointArray[i].features[0].geometry.coordinates = routeArray[i].features[0].geometry.coordinates[counter];

            }

            for (var i = 0; i<routeArray.length; i++){
                pointArray[i].features[0].properties.bearing = turf.bearing(
                    turf.point(routeArray[i].features[0].geometry.coordinates[counter >= steps ? counter - 1 : counter]),
                    turf.point(routeArray[i].features[0].geometry.coordinates[counter >= steps ? counter : counter + 1])
                );
            }


            for (var i=0; i < pointArray.length;i++){
                map.getSource('point'+i).setData(pointArray[i]);
            }

            if (counter < steps) {
                requestAnimationFrame(animate);
            }

            counter = counter + 1;
        }

        document.getElementById('replay').addEventListener('click', function() {
            // Set the coordinates of the original point back to origin
            for (var i=0; i<pointArray; i++){
                pointArray[i].features[0].geometry.coordinates = [originXArray[i],originYArray[i]];
            }
            for (var i=0; i<pointArray; i++){
                map.getSource('point'+i).setData(pointArray[i]);
            }

            // Update the source layer


            // Reset the counter
            counter = 0;

            // Restart the animation.
            animate(counter);
        });

        // Start the animation.
        animate(counter);
    });

}
function getAllReservations(data) {
    var reservationList = [];
    for (var i =0; i<data.length;i++){
        reservationList.push(data[i]);
    }
    startMap(reservationList);
}