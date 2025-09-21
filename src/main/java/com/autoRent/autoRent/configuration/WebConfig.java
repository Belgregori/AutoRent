package com.autoRent.autoRent.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.autoRent.autoRent.Security.PermissionFilter;
import com.autoRent.autoRent.service.PermissionService;
import com.autoRent.autoRent.repository.UsuarioRepository;
import java.util.Arrays;


@Configuration
public class WebConfig {


    @Autowired
    private PermissionService permissionService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CustomAccessDeniedHandler customAccessDeniedHandler) throws Exception {
        http

                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth


                        .requestMatchers(HttpMethod.GET, "/api/resenas/**").permitAll()
                        .requestMatchers("/api/resenas/**").authenticated()
                        .requestMatchers("/api/reservas/**").authenticated()
                        // Endpoints públicos
                        .requestMatchers("/usuarios/register", "/usuarios/login").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/imagenes/**").permitAll()
                        .requestMatchers("/api/productos/random").permitAll()
                        .requestMatchers("/send-email").permitAll()

                        // 🔥 Permitir públicamente los GET de productos, categorías y características
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/caracteristicas/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/usuarios/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/usuarios/**").authenticated()

                        .requestMatchers("/api/favoritos/**").permitAll()


                        .requestMatchers(HttpMethod.GET, "/admin", "/admin/**").hasAnyAuthority("ADMIN","ADMIN1","ADMIN2")


                        .requestMatchers("/api/admin/**").hasAnyAuthority("ADMIN","ADMIN1","ADMIN2")


                                .requestMatchers("/api/productos/**", "/api/categorias/**", "/api/caracteristicas/**").authenticated()


                                .anyRequest().authenticated()
                )

                .exceptionHandling(exception -> exception
                        .accessDeniedHandler(customAccessDeniedHandler)
                )
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(new PermissionFilter(permissionService, usuarioRepository), JwtRequestFilter.class);


        return http.build();
    }


    @Bean
    public HttpFirewall allowUrlEncodedHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedPercent(true); // permite %0A, %0D
        firewall.setAllowUrlEncodedSlash(true);   // permite /
        return firewall;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176"
        ));
        configuration.setAllowedMethods(Arrays.asList(
                "GET","POST","PUT","DELETE","PATCH","OPTIONS"
        ));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jacksonCustomizer() {
        return builder -> {
            builder.modules(new JavaTimeModule());
            builder.featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        };
    }

}
