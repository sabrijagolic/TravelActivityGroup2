package travelactivitytracker2.demo.Repository;

import travelactivitytracker2.demo.Model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;



@Repository
public interface HotelRepository extends JpaRepository <Hotel, Long> {
    public List<Hotel> findAll();



}
