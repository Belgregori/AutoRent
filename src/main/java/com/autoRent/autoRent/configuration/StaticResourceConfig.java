package com.autoRent.autoRent.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/imagenes/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/imagenes/");

        // Sirve imágenes semilla desde el classpath (empaquetadas en el JAR)
        registry.addResourceHandler("/imagenes/seeder/**")
                .addResourceLocations("classpath:/static/seeder/");
    }
}
