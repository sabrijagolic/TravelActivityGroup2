package travelactivitytracker2.demo.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/admin").setViewName("AdminPanel");
        registry.addViewController("/login").setViewName("LoginPanel");
        registry.addViewController("/user").setViewName("webPanel");
        registry.addViewController("/dashboard").setViewName("Dashboard");
    }
}
