package com.autoRent.autoRent.repository;


import com.autoRent.autoRent.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {







}
