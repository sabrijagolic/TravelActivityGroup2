package travelactivitytracker2.demo.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import travelactivitytracker2.demo.Model.Reservation;
import travelactivitytracker2.demo.Model.Users;
import travelactivitytracker2.demo.Repository.ReservationRepository;
import travelactivitytracker2.demo.Repository.UsersRepository;

import javax.ws.rs.core.MediaType;
import java.net.URI;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping(value="api/reservation",produces = MediaType.APPLICATION_JSON)
public class ReservationController {
    private ReservationRepository reservationRepository;
    private UsersRepository usersRepository;

    @Autowired
    public void setProductService( ReservationRepository reservationRepository, UsersRepository usersRepository){
        this.reservationRepository=reservationRepository;
        this.usersRepository=usersRepository;
    }

    @GetMapping(value = "",produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<List<Reservation>> getAll(){
        List<Reservation> reservationsList = reservationRepository.findAll();
        return ResponseEntity.ok().body(reservationsList);
    }
    @GetMapping(value = "/{id}",produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id){
        Reservation reservation = reservationRepository.findById(id).get();
        return ResponseEntity.ok().body(reservation);
    }


    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<Reservation> create(@RequestBody Reservation reservation, Principal principal){
        /*Long userId = usersRepository.findIdByUsername(principal.getName());
        Users user = usersRepository.findById(userId).get();
        reservation.setUsers(user);*/
        Reservation saved = reservationRepository.save(reservation);
        URI uri = URI.create("Http://locsalhost:8080/api/reservation" + saved.getId());
        return ResponseEntity.created(uri).body(saved);
    }
    @DeleteMapping (value = "", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity deleteById(Principal principal){
        reservationRepository.deleteById(reservationRepository.findReservationIdByUsername(principal.getName()));
        return ResponseEntity.noContent().build();
    }
}
