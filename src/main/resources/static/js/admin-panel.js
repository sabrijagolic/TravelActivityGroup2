$(window).load(function() {

    getAllHotels(getAllHotelsCallback);
    getAllUsers(getAllUsersCallback);
});
var hotelId=0;
var hotels = [];
function editHotel(id) {
    hotelId=id;
    var hotel = hotels.find(function (hotel){
        return hotel.id === id
    });
    $('#inputName').val(hotel.name);
    $('#inputRating').val(hotel.rating);
    $('#inputLatitude').val(hotel.latitude);
    $('#inputLongitude').val(hotel.longitude);
    $('#inputAddress').val(hotel.address);
    $('#inputPicture').val(hotel.picture);
}
function processHotels(hotels) {
    $('#tableHotels tbody').html("");
    hotels.forEach(function (hotel, index) {

        $('#tableHotels tbody').append(`
        <tr>
        <td scope="row">` + (index+1) + `</td>
        <td>` + hotel.id + `</td>
        <td>` + hotel.name +`</td>
        <td>` + hotel.rating + `</td>
        <td>` + hotel.latitude + `</td>
        <td>` + hotel.longitude + `</td>
        <td>` + hotel.address + `</td>
        <td><img width="200px" src=" ` + hotel.picture +`"></td>
        <td><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#addHotel" onclick="editHotel( ` + hotel.id + `)" ><span class="glyphicon glyphicon-pencil"></span></button></p></td>
        <td><p data-placement="top" data-toggle="tooltip" title="Delete"><button class="btn btn-danger btn-xs" data-title="Delete" onclick=" deleteHotel(` + hotel.id + `,getAllHotelsCallback )" ><span class="glyphicon glyphicon-trash"></span></button></p></td>
    </tr>
        `);
    });

}
function processUsers(users) {
    users.forEach(function (user, index) {
        $('#tableUsers tbody').append(`
        <tr>
        <td scope="row">` + (index+1) +`</td>
        <td>` + user.id + `</td>
        <td>` + user.username + `</td>
        <td>` + user.password + `</td>
        <td>` + user.role + `</td>
        <td>` + user.latitude + `</td>
        <td>` + user.longitude + `</td>        
        <td><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit" ><span class="glyphicon glyphicon-pencil"></span></button></p></td>
        <td><p data-placement="top" data-toggle="tooltip" title="Delete"><button class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#delete" ><span class="glyphicon glyphicon-trash"></span></button></p></td>
    </tr>
        `);


    })

}

function saveHotel(){
    var name = $('#inputName').val();
    var rating = $('#inputRating').val();
    var latitude = $('#inputLatitude').val();
    var longitude = $('#inputLongitude').val();
    var address = $('#inputAddress').val();
    var picture = $('#inputPicture').val();
    console.log(latitude);
    if(name === '' || rating === '' || latitude === '' || longitude ==='' || address ==='' || picture ===''){
        alert("Please fill out each field first")
    } else {

    console.log(name, rating, latitude, longitude, address, picture);
    var hotel = {
        name: name,
        rating: rating,
        latitude: latitude,
        longitude: longitude,
        address : address,
        picture : picture
    }
    if (hotelId!=0) putHotel(hotel, getAllHotelsCallback, hotelId);
    else createHotel(hotel, getAllHotelsCallback);
    hotelId=0;
    $('#addHotel').modal('hide');
    }
}
function clearForm(){
    $('#inputName').val("");
    $('#inputRating').val("");
    $('#inputLatitude').val("");
    $('#inputLongitude').val("");
    $('#inputAddress').val("");
    $('#inputPicture').val("");

}

var getAllHotelsCallback = function(data) {
    hotels = data;
    processHotels(data);
}
var getAllUsersCallback = function (data) {
    processUsers(data);
}