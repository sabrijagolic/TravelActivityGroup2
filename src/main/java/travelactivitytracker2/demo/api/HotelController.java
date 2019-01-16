package travelactivitytracker2.demo.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import travelactivitytracker2.demo.Model.Hotel;
import travelactivitytracker2.demo.Model.Users;
import travelactivitytracker2.demo.Repository.HotelRepository;
import travelactivitytracker2.demo.Repository.UsersRepository;

import javax.ws.rs.core.MediaType;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value="api/hotel",produces = MediaType.APPLICATION_JSON)
public class HotelController {
    private HotelRepository hotelRepository;

    @Autowired
    public void setProductService( HotelRepository hotelRepository){
        this.hotelRepository=hotelRepository;
    }



    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<Hotel> create(@RequestBody Hotel hotel){

        Hotel saved = hotelRepository.save(hotel);
        URI uri = URI.create("Http://locsalhost:8080/api/hotel" + saved.getId());
        return ResponseEntity.created(uri).body(saved);
    }
    @GetMapping(value = "",produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<List<Hotel>> getAll(){
        List<Hotel> hotelList = hotelRepository.findAll();
        return ResponseEntity.ok().body(hotelList);
    }
    @GetMapping(value = "/{id}",produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<Hotel> getById(@PathVariable Long id){
        Hotel hotel = hotelRepository.findById(id).get();
        return ResponseEntity.ok().body(hotel);
    }
    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<Hotel>  updateHotel(@RequestBody Hotel hotel,@PathVariable Long id){


        Hotel hoteldB = hotelRepository.findById(id).get();
        if (hoteldB == null) {
            return ResponseEntity.notFound().build();
        }
        hoteldB.setName(hotel.getName());
        hoteldB.setRating(hotel.getRating());
        hoteldB.setLatitude(hotel.getLatitude());
        hoteldB.setLongitude(hotel.getLongitude());
        hoteldB.setAddress(hotel.getAddress());
        hoteldB.setPicture(hotel.getPicture());

        hotelRepository.save(hoteldB);

        return ResponseEntity.ok().body(hoteldB);
    }
    @DeleteMapping (value = "/{id}", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity deleteById(@PathVariable Long id){
        hotelRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
