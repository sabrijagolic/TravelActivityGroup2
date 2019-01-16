// Can also be used with $(document).ready()
var hotelId = 0;
var userId = 0;

$(window).on('load', function() {
    getUserIdByUsername(function (data) {
        userId = data;
        getAllReservations(getAllReservationsCallback);
    });



});

function createHotelSlider(hotels){
    console.log(hotels);
    hotels.forEach(function (hotel) {
        $('#example tbody').append(`
        <tr class="previous" id="`+ hotel.id +`" onclick="selectRow(` + hotel.id +`)">
        <td><img width="200px" src="` + hotel.picture + `"></td>
        <td>` + hotel.name  +`</td>
        <td>` + hotel.address +`</td> 
        <td>` + hotel.rating + `(`+ returnStars(hotel.rating) +`)</td>       
    </tr>
        `);});

    $('#example').DataTable({
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [ 0,2 ] },
        ],
        "order": [[ 3, "desc" ]]

    });
}

function SubmitReservation(){
    console.log($('#arrivalDate').val());
    var arrivalDate = $('#arrivalDate').val();
    var leaveDate = $('#leaveDate').val();
    if (hotelId===0 || arrivalDate==="" || leaveDate==="" ){
        alert("Please select hotel and dates form the table first.")}
    else{

        var reservation = {
            users: {
                id: userId
            },
            hotel: {
                id: hotelId
            },
            arrivalDate: arrivalDate,
            leavingDate:leaveDate
        }
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/reservation',
            contentType: "application/json",
            data: JSON.stringify(reservation),
            success: function (msg) {
                alert("success");
                getAllReservations(getAllReservationsCallback);
            },
            error: function (request, status, error) {
                alert(error);
            }
        });
    }
    //location.reload();


}
function returnStars(counter){
    var string="";
    for (var i=0; i<counter;i++){
        string+= '<span class="glyphicon glyphicon-star"></span>';
    }
    return string;

}
function selectRow(id) {
    $('#' + hotelId).toggleClass('book');
    $('#' + id).toggleClass('book');
    hotelId = id;
    console.log(hotelId);

}
function checkForReservation(reservations) {
    console.log(reservations);
var counter = 0;
    if (reservations.length === 0){
        $('#example').DataTable().clear();
        $('#example').DataTable().destroy();
        $('.overlay').hide();
        $('#cancelReservation').hide();
        $('#map').hide();
        $('#tableDiv').show();
        $('#datePicker').show();
        hotelId=0;
        getAllHotels(createHotelSlider);
    } else {
    reservations.forEach(function (reservation) {

        if (reservation.users.id === userId){
            $('#example').DataTable().clear();
            $('#example').DataTable().destroy();
            $('#tableDiv').hide();
            $('#datePicker').hide();
            $('#map').show();
            $('.overlay').show();
            $('#cancelReservation').show();
            counter++;
            displayMap(reservation);



        } else {
            if (counter==0) {
                $('#example').DataTable().clear();
                $('#example').DataTable().destroy();
            $('.overlay').hide();
            $('#cancelReservation').hide();
            $('#map').hide();
            $('#tableDiv').show();
            $('#datePicker').show();
            getAllHotels(createHotelSlider);
            counter++;
            }
        }
    })}
}
function DeleteReservation() {
    deleteReservation(function () {
        checkForReservation([]);

    });



}

function displayMap(reservation){
    mapboxgl.accessToken = 'pk.eyJ1IjoidGVhbXJha2V0YSIsImEiOiJjampwZ205dTQwM2w4M2txcnBmbTFmaDZiIn0.DoPdOhOPKWmUmYXsHrg6dg';


// San Francisco
    var origin = [reservation.users.longitude,reservation.users.latitude];

// Washington DC
    var destination = [ reservation.hotel.longitude, reservation.hotel.latitude];

// A simple line from origin to destination.
    var route = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    origin,
                    destination
                ]
            }
        }]
    };

// A single point that animates along the route.
// Coordinates are initially set to origin.
    var point = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": origin
            }
        }]
    };

// Calculate the distance in kilometers between route start/end point.
    var lineDistance = turf.lineDistance(route.features[0], 'kilometers');

    var zoom = 2;
    if (lineDistance<1000){
        zoom = 5;
    }
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [reservation.users.longitude, reservation.users.latitude],
        zoom: zoom
    });

    var arc = [];

// Number of steps to use in the arc and animation, more steps means
// a smoother arc and animation, but too many steps will result in a
// low frame rate
    var steps = 500;

// Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < lineDistance; i += lineDistance / steps) {
        var segment = turf.along(route.features[0], i, 'kilometers');
        arc.push(segment.geometry.coordinates);
    }

// Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = arc;

// Used to increment the value of the point measurement against the route.
    var counter = 0;

    map.on('load', function () {
        // Add a source and layer displaying a point which will be animated in a circle.
        map.addSource('route', {
            "type": "geojson",
            "data": route
        });

        map.addSource('point', {
            "type": "geojson",
            "data": point
        });

        map.addLayer({
            "id": "route",
            "source": "route",
            "type": "line",
            "paint": {
                "line-width": 2,
                "line-color": "#007cbf"
            }
        });

        map.addLayer({
            "id": "point",
            "source": "point",
            "type": "symbol",
            "layout": {
                "icon-image": "airport-15",
                "icon-rotate": ["get", "bearing"],
                "icon-rotation-alignment": "map",
                "icon-allow-overlap": true
            }
        });

        function animate() {
            // Update point geometry to a new position based on counter denoting
            // the index to access the arc.
            point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[counter];

            // Calculate the bearing to ensure the icon is rotated to match the route arc
            // The bearing is calculate between the current point and the next point, except
            // at the end of the arc use the previous point and the current point
            point.features[0].properties.bearing = turf.bearing(
                turf.point(route.features[0].geometry.coordinates[counter >= steps ? counter - 1 : counter]),
                turf.point(route.features[0].geometry.coordinates[counter >= steps ? counter : counter + 1])
            );

            // Update the source with this new data.
            map.getSource('point').setData(point);

            // Request the next frame of animation so long the end has not been reached.
            if (counter < steps) {
                requestAnimationFrame(animate);
            }

            counter = counter + 1;
        }

        document.getElementById('replay').addEventListener('click', function() {
            // Set the coordinates of the original point back to origin
            point.features[0].geometry.coordinates = origin;

            // Update the source layer
            map.getSource('point').setData(point);

            // Reset the counter
            counter = 0;

            // Restart the animation.
            animate(counter);
        });

        // Start the animation.
        animate(counter);
    });
}
var getAllReservationsCallback = function (data) {
    checkForReservation(data);
}
