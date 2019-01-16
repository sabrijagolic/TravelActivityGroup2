package travelactivitytracker2.demo.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import travelactivitytracker2.demo.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository <Users, Long>{
    @Query("SELECT id FROM Users WHERE username=:username")
    Long findIdByUsername(@Param("username")String username);
}
