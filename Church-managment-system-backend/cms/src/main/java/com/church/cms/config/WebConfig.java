package com.church.cms.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
// WebMvcConfigurer →  interface from Spring to modify MVC ( CORS, formatters, interceptors, etc)
public class WebConfig implements WebMvcConfigurer { 

    @Override
    public void addCorsMappings( CorsRegistry registry) {
        registry.addMapping("/**") // allow CORS for all paths
                .allowedOrigins("http://localhost:5173") // allow this origin (frontend) to access the backend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // allow these HTTP methods
                .allowedHeaders("*") // allow all headers
                .allowCredentials(false); // allow credentials (cookies, authorization headers)
    }
    
}
