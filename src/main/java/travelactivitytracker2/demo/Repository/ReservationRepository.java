package travelactivitytracker2.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import travelactivitytracker2.demo.Model.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query(value = "SELECT reservation.id FROM reservation INNER JOIN users ON users.id = reservation.user_id  WHERE users.username=:username", nativeQuery = true)
    Long findReservationIdByUsername(@Param("username")String username);
}
