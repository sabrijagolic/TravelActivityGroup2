function  getAllHotels(callback) {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/hotel',
        success: function (data) {
            callback(data);

        } ,
        error: function (request, status, error) {
            alert(error);

        }
    })
}
function createHotel(hotel, callback){

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/hotel',
        contentType: "application/json",
        data: JSON.stringify(hotel),
        success: function (msg) {
            getAllHotels(callback);
        },
        error: function (request, status, error) {
            alert(error);
        }
    });
}
function putHotel(hotel, callback, hotelId) {
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:8080/api/hotel/' + hotelId,
        contentType: "application/json",
        data: JSON.stringify(hotel),
        success: function (data) {
            getAllHotels(callback);
        },
        error: function (request, status, error) {
            alert(error);
        }
    })


}
function deleteHotel(id, callback) {
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/api/hotel/' + id,
        success: function (data) {
            getAllHotels(callback);
        },
        error: function (request, status, error) {
            alert(error);
        }
    })

}

function  getAllUsers(callback) {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/users',
        success: function (data) {
            callback(data);
        } ,
        error: function (request, status, error) {
            alert(error);

        }
    })
}
function  getUserIdByUsername(callback) {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/users/id',
        success: function (data) {
            callback(data);
        } ,
        error: function (request, status, error) {
            alert(error);

        }
    })
}
function getAllReservations(callback){
$.ajax({
    type: 'GET',
    url: 'http://localhost:8080/api/reservation',
    success: function (data) {
        callback(data);
    } ,
    error: function (request, status, error) {
        alert(error);

    }

});}
function deleteReservation(callback) {
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/api/reservation',
        success: function (data) {
           callback();
        },
        error: function (request, status, error) {
            alert(error);
        }
    })

}
