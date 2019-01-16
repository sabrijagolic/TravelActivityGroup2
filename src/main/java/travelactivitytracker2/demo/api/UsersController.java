package travelactivitytracker2.demo.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import travelactivitytracker2.demo.Model.Users;
import travelactivitytracker2.demo.Repository.UsersRepository;

import javax.ws.rs.core.MediaType;
import java.net.URI;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping(value="api/users",produces = MediaType.APPLICATION_JSON)
public class UsersController {
    private UsersRepository usersRepository;

    @Autowired
    public void setProductService( UsersRepository usersRepository){
        this.usersRepository=usersRepository;
    }



    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<Users> create(@RequestBody Users users){

        Users saved = usersRepository.save(users);
        URI uri = URI.create("Http://locsalhost:8080/api/users" + saved.getId());
        return ResponseEntity.created(uri).body(saved);
    }
    @GetMapping(value = "",produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<List<Users>> getAll(){
        List<Users> usersList = usersRepository.findAll();
        return ResponseEntity.ok().body(usersList);
    }
    @GetMapping(value = "/id",produces = MediaType.APPLICATION_JSON)
    public ResponseEntity<Long> getUserIdByUsername(Principal principal){
        Long userId = usersRepository.findIdByUsername(principal.getName());
        return ResponseEntity.ok().body(userId);
    }
}
