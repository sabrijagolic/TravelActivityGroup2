package travelactivitytracker2.demo.Configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import travelactivitytracker2.demo.Controller.SimpleAuthenticationSuccessHandler;

import java.util.ArrayList;


@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    public SimpleAuthenticationSuccessHandler successHandler;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/", "/login", "/api/*", "/api/*/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .loginPage("/login")
                .successHandler(successHandler)
                .permitAll()
                .and()
                .logout()
                .permitAll();
    }


    @Bean
    @Override
    public UserDetailsService userDetailsService() {
        ArrayList<UserDetails> users = new ArrayList<UserDetails>();
        UserDetails user =
                User.withDefaultPasswordEncoder()
                        .username("username")
                        .password("password")
                        .roles("USER")
                        .build();
        users.add(user);
        user =
                User.withDefaultPasswordEncoder()
                        .username("admin")
                        .password("password")
                        .roles("ADMIN")
                        .build();
        users.add(user);
        user =
                User.withDefaultPasswordEncoder()
                        .username("supervisor")
                        .password("password")
                        .roles("SUPERVISOR")
                        .build();
        users.add(user);

        return new InMemoryUserDetailsManager(users);
    }
}